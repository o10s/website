---
title: 'Spring Boot in Production: Battle-Tested Practices from the Trenches'
description: 'A comprehensive guide to building Spring Boot applications that survive and thrive in production environments, based on real-world experiences and hard-learned lessons.'
pubDate: 2024-01-20
tags: ['spring-boot', 'java', 'backend', 'best-practices', 'production', 'enterprise-java', 'microservices']
author: 'Olivier Alves'
---

## Introduction: The Production Reality Check

Every Spring Boot tutorial shows you how to build a REST API in 15 minutes. What they don't show you is what happens when that API serves 10 million requests per day, integrates with 15 different services, and wakes you up at 3 AM with OutOfMemoryErrors. This article bridges that gap, sharing battle-tested practices from years of running Spring Boot applications in production environments where downtime is measured in dollars per second.

The difference between a demo application and a production-ready system isn't just about code quality—it's about anticipating failure modes, planning for scale, and building systems that degrade gracefully rather than catastrophically. These practices emerge from real incidents, actual postmortems, and the kind of learning that only comes from supporting applications under fire.

## Part 1: Architectural Foundations

### Project Structure: Beyond the Tutorial

The package structure you choose on day one will haunt or help you for years. Here's what actually works in practice:

```
com.company.service
├── api/
│   ├── v1/
│   │   ├── controller/
│   │   ├── dto/
│   │   └── mapper/
│   └── v2/
├── core/
│   ├── domain/
│   ├── service/
│   └── port/
├── infrastructure/
│   ├── persistence/
│   ├── messaging/
│   └── external/
├── config/
│   ├── security/
│   ├── async/
│   └── cache/
└── common/
    ├── exception/
    ├── validation/
    └── util/
```

**Why This Structure Works:**

1. **API Versioning Built-In**: When v2 inevitably arrives, you won't be refactoring the entire codebase
2. **Hexagonal Architecture**: Core business logic remains independent of infrastructure concerns
3. **Clear Boundaries**: New team members understand where code belongs
4. **Testability**: Infrastructure can be mocked without touching business logic

### Configuration: The Twelve-Factor Reality

#### Environment-Specific Configuration

```yaml
# application.yml (base configuration)
spring:
  application:
    name: ${APP_NAME:payment-service}
  jpa:
    open-in-view: false  # Prevent lazy loading issues
    properties:
      hibernate:
        jdbc:
          batch_size: 25
          order_inserts: true
          order_updates: true

# application-prod.yml
spring:
  datasource:
    hikari:
      maximum-pool-size: ${DB_POOL_SIZE:20}
      minimum-idle: ${DB_MIN_IDLE:10}
      connection-timeout: ${DB_TIMEOUT:30000}
      leak-detection-threshold: ${DB_LEAK_THRESHOLD:60000}
      
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  metrics:
    export:
      prometheus:
        enabled: true
```

**Critical Configuration Lessons:**

1. **Never Hard-Code Prod Values**: Every production value should be externally configurable
2. **Provide Sensible Defaults**: `${ENV_VAR:default}` pattern saves countless deployment issues
3. **Monitor Connection Pools**: Leak detection has saved us from numerous production incidents
4. **Disable Dangerous Features**: `open-in-view` causes N+1 queries that only appear under load

### Database Interactions: Where Theory Meets Reality

#### The Repository Pattern That Actually Scales

```java
@Repository
@Transactional(readOnly = true)
public class OrderRepository {
    
    private final JdbcTemplate jdbcTemplate;
    private final NamedParameterJdbcTemplate namedJdbcTemplate;
    
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public Order saveWithNewTransaction(Order order) {
        // Critical for event sourcing and audit logs
    }
    
    public Optional<Order> findByIdWithLock(Long id) {
        return jdbcTemplate.query(
            "SELECT * FROM orders WHERE id = ? FOR UPDATE NOWAIT",
            new Object[]{id},
            new OrderRowMapper()
        ).stream().findFirst();
    }
    
    public List<Order> findOrdersForBatch(int batchSize) {
        return namedJdbcTemplate.query(
            """
            SELECT * FROM orders 
            WHERE status = :status 
            AND next_retry < :now
            ORDER BY priority DESC, created_at ASC
            LIMIT :limit
            FOR UPDATE SKIP LOCKED
            """,
            Map.of(
                "status", "PENDING",
                "now", Instant.now(),
                "limit", batchSize
            ),
            new OrderRowMapper()
        );
    }
}
```

**Why This Approach:**

1. **Read-Only by Default**: Prevents accidental writes in read operations
2. **Explicit Locking**: `FOR UPDATE NOWAIT` prevents deadlocks
3. **Skip Locked**: Essential for concurrent batch processing
4. **Raw SQL When Needed**: JPA is great until it isn't

## Part 2: Error Handling and Resilience

### Global Exception Handling: Beyond Stack Traces

```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {
    
    private final ErrorMessageSource messageSource;
    private final AlertingService alertingService;
    
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ProblemDetail> handleBusinessException(
            BusinessException ex, 
            HttpServletRequest request) {
        
        var problemDetail = ProblemDetail.forStatusAndDetail(
            ex.getStatus(), 
            messageSource.getMessage(ex.getErrorCode(), ex.getArgs())
        );
        
        problemDetail.setType(URI.create("/errors/" + ex.getErrorCode()));
        problemDetail.setInstance(URI.create(request.getRequestURI()));
        problemDetail.setProperty("errorCode", ex.getErrorCode());
        problemDetail.setProperty("traceId", MDC.get("traceId"));
        
        log.warn("Business exception occurred: {}", ex.getMessage(), ex);
        
        return ResponseEntity.status(ex.getStatus()).body(problemDetail);
    }
    
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ProblemDetail> handleDataIntegrity(
            DataIntegrityViolationException ex) {
        
        // Parse constraint violations for user-friendly messages
        String constraintName = extractConstraintName(ex);
        ErrorCode errorCode = mapConstraintToErrorCode(constraintName);
        
        if (errorCode.isCritical()) {
            alertingService.sendAlert(Alert.critical()
                .withTitle("Data integrity violation")
                .withDetails(ex.getMessage())
                .build());
        }
        
        var problemDetail = createProblemDetail(errorCode);
        return ResponseEntity.status(HttpStatus.CONFLICT).body(problemDetail);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ProblemDetail> handleUnexpected(
            Exception ex, 
            HttpServletRequest request) {
        
        String errorId = UUID.randomUUID().toString();
        
        log.error("Unexpected error [{}]: {}", errorId, ex.getMessage(), ex);
        
        alertingService.sendAlert(Alert.critical()
            .withTitle("Unexpected error in " + request.getRequestURI())
            .withErrorId(errorId)
            .withException(ex)
            .build());
        
        var problemDetail = ProblemDetail.forStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        problemDetail.setDetail("An unexpected error occurred");
        problemDetail.setProperty("errorId", errorId);
        problemDetail.setProperty("support", "Contact support with error ID");
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(problemDetail);
    }
}
```

**Critical Error Handling Insights:**

1. **Use RFC 7807 Problem Details**: Standardized error responses that clients can parse
2. **Differentiate Error Types**: Business errors vs. system errors require different handling
3. **Alert on Critical Errors**: Don't wait for users to report issues
4. **Include Trace IDs**: Essential for debugging distributed systems
5. **User-Friendly Messages**: Map technical constraints to business language

### Circuit Breakers: Failing Fast and Gracefully

```java
@Component
@Slf4j
public class PaymentGatewayClient {
    
    private final RestTemplate restTemplate;
    private final CircuitBreaker circuitBreaker;
    
    public PaymentGatewayClient(RestTemplate restTemplate, 
                               CircuitBreakerFactory factory) {
        this.restTemplate = restTemplate;
        this.circuitBreaker = factory.create("payment-gateway");
        
        // Configure circuit breaker
        circuitBreaker.configureDefault(id -> new Resilience4JConfigBuilder(id)
            .circuitBreakerConfig(CircuitBreakerConfig.custom()
                .slidingWindowSize(100)
                .failureRateThreshold(50)
                .waitDurationInOpenState(Duration.ofSeconds(30))
                .slowCallRateThreshold(80)
                .slowCallDurationThreshold(Duration.ofSeconds(3))
                .build())
            .timeLimiterConfig(TimeLimiterConfig.custom()
                .timeoutDuration(Duration.ofSeconds(5))
                .build())
            .build());
    }
    
    public PaymentResult processPayment(PaymentRequest request) {
        return circuitBreaker.run(
            () -> makePaymentCall(request),
            throwable -> handlePaymentFailure(request, throwable)
        );
    }
    
    private PaymentResult handlePaymentFailure(PaymentRequest request, 
                                             Throwable throwable) {
        log.error("Payment failed for request {}: {}", 
            request.getId(), throwable.getMessage());
        
        // Store for retry
        failedPaymentQueue.add(request);
        
        // Return degraded response
        return PaymentResult.pending(request.getId());
    }
}
```

## Part 3: Performance and Monitoring

### Async Processing: The Right Way

```java
@Configuration
@EnableAsync
public class AsyncConfig implements AsyncConfigurer {
    
    @Override
    public Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        
        // Size based on actual measurements, not guesses
        executor.setCorePoolSize(10);
        executor.setMaxPoolSize(50);
        executor.setQueueCapacity(500);
        executor.setThreadNamePrefix("async-");
        executor.setRejectedExecutionHandler(
            new ThreadPoolExecutor.CallerRunsPolicy()
        );
        
        // Critical: propagate MDC context for tracing
        executor.setTaskDecorator(task -> {
            Map<String, String> contextMap = MDC.getCopyOfContextMap();
            return () -> {
                try {
                    if (contextMap != null) {
                        MDC.setContextMap(contextMap);
                    }
                    task.run();
                } finally {
                    MDC.clear();
                }
            };
        });
        
        executor.initialize();
        return executor;
    }
}
```

### Caching: The Devil in the Details

```java
@Configuration
@EnableCaching
public class CacheConfig {
    
    @Bean
    public CacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        RedisCacheConfiguration config = RedisCacheConfiguration
            .defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(15))
            .disableCachingNullValues()
            .serializeKeysWith(keySerializationPair())
            .serializeValuesWith(valueSerializationPair());
        
        return RedisCacheManager.builder(connectionFactory)
            .cacheDefaults(config)
            .withCacheConfiguration("users", 
                config.entryTtl(Duration.ofHours(1)))
            .withCacheConfiguration("permissions", 
                config.entryTtl(Duration.ofMinutes(5)))
            .transactionAware()
            .build();
    }
    
    @Bean
    public CacheErrorHandler errorHandler() {
        return new CacheErrorHandler() {
            @Override
            public void handleCacheGetError(RuntimeException e, 
                                          Cache cache, 
                                          Object key) {
                log.error("Cache get error for cache: {} key: {}", 
                    cache.getName(), key, e);
                // Don't fail the request due to cache errors
            }
            // ... other methods
        };
    }
}
```

### Metrics That Matter

```java
@Component
public class BusinessMetrics {
    
    private final MeterRegistry registry;
    
    @EventListener
    public void onOrderCreated(OrderCreatedEvent event) {
        registry.counter("orders.created",
            "type", event.getOrderType(),
            "channel", event.getChannel()
        ).increment();
        
        registry.gauge("orders.value",
            Tags.of("currency", event.getCurrency()),
            event.getTotalAmount()
        );
    }
    
    @Scheduled(fixedDelay = 60000)
    public void recordQueueMetrics() {
        // Business metrics that actually indicate health
        registry.gauge("orders.pending.age.minutes",
            orderService.getOldestPendingOrderAgeMinutes()
        );
        
        registry.gauge("payments.failed.last.hour",
            paymentService.getFailedPaymentsLastHour()
        );
    }
}
```

## Part 4: Security in the Real World

### Security Configuration That Scales

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/actuator/health/**").permitAll()
                .requestMatchers("/actuator/**").hasRole("ADMIN")
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/**").authenticated()
            )
            .oauth2ResourceServer(oauth2 -> 
                oauth2.jwt(jwt -> jwt.jwtAuthenticationConverter(
                    jwtAuthenticationConverter())))
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint(problemDetailAuthenticationEntryPoint())
                .accessDeniedHandler(problemDetailAccessDeniedHandler()))
            .build();
    }
    
    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            // Map JWT claims to Spring Security authorities
            Collection<String> roles = jwt.getClaimAsStringList("roles");
            return roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                .collect(Collectors.toList());
        });
        return converter;
    }
}
```

## Part 5: Testing Strategies That Work

### Integration Tests That Don't Lie

```java
@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:tc:postgresql:14:///testdb",
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
class OrderControllerIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    @Sql("/test-data/orders.sql")
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    void shouldHandleConcurrentOrderUpdates() throws Exception {
        // Test actual concurrent behavior
        var executor = Executors.newFixedThreadPool(10);
        var latch = new CountDownLatch(10);
        var successCount = new AtomicInteger();
        
        for (int i = 0; i < 10; i++) {
            executor.submit(() -> {
                try {
                    mockMvc.perform(post("/api/orders/1/process")
                        .contentType(MediaType.APPLICATION_JSON))
                        .andExpect(status().is2xxSuccessful());
                    successCount.incrementAndGet();
                } catch (Exception e) {
                    // Expected for some requests due to optimistic locking
                } finally {
                    latch.countDown();
                }
            });
        }
        
        latch.await();
        assertThat(successCount.get()).isEqualTo(1);
    }
}
```

## Conclusion: The Journey Continues

### Key Takeaways from the Trenches

Building production-ready Spring Boot applications is a journey of continuous learning. Every incident teaches new lessons, every scale milestone reveals new challenges. The practices shared here aren't theoretical—they're battle-tested solutions to real problems that have kept systems running when it mattered most.

**Remember:**
1. **Start with the basics**: A well-structured, properly configured application is easier to debug at 3 AM
2. **Plan for failure**: Every external call will fail, every database will go down, every cache will misbehave
3. **Monitor what matters**: Business metrics often indicate problems before technical metrics
4. **Test realistically**: Unit tests are necessary but not sufficient for production confidence
5. **Keep it simple**: Complex solutions create complex problems

### The Reality Check

These practices won't prevent all production issues—nothing will. But they'll help you build systems that:
- Fail gracefully rather than catastrophically
- Provide clear signals when things go wrong
- Can be debugged by someone who didn't write them
- Scale with your business rather than despite it

### Looking Forward

The Spring Boot ecosystem continues to evolve, and so should our practices. Native compilation with GraalVM, reactive programming models, and cloud-native deployments all bring new challenges and opportunities. The fundamental principle remains constant: build for production from day one, because that's where your code will spend most of its life.

---

*Next up: "CI/CD for Kubernetes: Where Simple Deployments Go to Die" - A reality check on why your 5-minute deployments now take 45 minutes and what to do about it.*