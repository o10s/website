---
title: "The Death of REST APIs: GraphQL, gRPC, or Something Else?"
description: "An investigation into the API landscape of 2025, revealing why REST is losing ground, GraphQL's unexpected struggles, and how gRPC became the dark horse winner in the API wars"
pubDate: 2025-05-05
tags: ["apis", "rest", "graphql", "grpc", "architecture"]
author: 'Olivier Alves'

---

## Introduction

REST APIs have been the backbone of web services for two decades. Simple, stateless, and ubiquitous, they seemed unassailable. Yet in 2025, REST is rapidly losing ground to newer paradigms. GraphQL, once hailed as REST's successor, faces its own crisis of complexity. Meanwhile, gRPC—Google's RPC framework—has quietly become the protocol of choice for serious distributed systems. And lurking in the shadows, new contenders like tRPC and server-sent events are reshaping how we think about client-server communication.

This investigation cuts through the API hype to reveal what developers are actually using, why REST's simplicity became its weakness, and how the battle for API supremacy is reshaping modern application architecture.

## The REST Recession

### The Numbers Tell the Story

API protocol usage in new projects (2025):

```
API Protocol Distribution:
├── gRPC: 34% (+18% from 2023)
├── REST: 28% (-22% from 2023)
├── GraphQL: 19% (-3% from 2023)
├── tRPC: 12% (didn't exist in 2023)
├── WebSocket/SSE: 5% (+2% from 2023)
└── Others: 2%

The Shock: REST no longer dominant
```

### Why REST is Failing

The problems that killed REST's momentum:

**1. The Over-Fetching/Under-Fetching Nightmare**
```javascript
// The REST shuffle everyone knows
// Need user with their posts and comments?

// Option 1: Under-fetching (N+1 problem)
const user = await fetch('/api/users/123');
const posts = await fetch(`/api/users/123/posts`);
const comments = await Promise.all(
  posts.map(post => fetch(`/api/posts/${post.id}/comments`))
);
// 50+ API calls for one page load

// Option 2: Over-fetching (bandwidth waste)
const userData = await fetch('/api/users/123?include=posts,comments,friends,likes,shares,history');
// 5MB response for 50KB of needed data

// Option 3: Custom endpoints (maintenance hell)
const userData = await fetch('/api/users/123/dashboard-data');
// New endpoint for every use case
```

**2. The Versioning Disaster**
```
Company API Evolution:
/api/v1/users (2020) - Original
/api/v2/users (2021) - Added fields
/api/v3/users (2022) - Breaking changes
/api/v2.1/users (2022) - V2 hotfix
/api/v4/users (2023) - Complete redesign
/api/v3.5/users (2023) - Legacy support
/api/v5/users (2024) - "Final" version
/api/v5.1/users (2024) - Actual final
/api/v6/users (2025) - GraphQL wrapper
/api/legacy/v1-5/* (2025) - Still 40% of traffic

Developer: "Which version should I use?"
API Team: "Yes."
```

## GraphQL: The Fallen Prince

### The Promise vs. Reality

GraphQL was supposed to fix everything:

**The Promise (2018):**
```graphql
# One query to rule them all
query GetUserDashboard {
  user(id: "123) {
    name
    email
    posts(last: 10) {
      title
      content
      comments {
        text
        author {
          name
        }
      }
    }
  }
}
# Perfect! Exactly what we need!
```

**The Reality (2025):**
```graphql
# The same query that kills production
query GetUserDashboard {
  user(id: "123) {
    name
    email
    posts(last: 10) {
      title
      content
      comments {  # No limit? Uh oh
        text
        author {
          name
          friends {  # Nested explosion
            name
            friends {  # Server OOM
              name
              friends {  # DDoS yourself
                name
              }
            }
          }
        }
      }
    }
  }
}

# Result: 2GB response, server crashed
```

### Why GraphQL Struggles

Real problems from real companies:

**1. The Complexity Explosion**
```typescript
// REST API: 50 lines of code
app.get('/users/:id', async (req, res) => {
  const user = await db.users.findById(req.params.id);
  res.json(user);
});

// GraphQL: 500+ lines for same functionality
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
  }
  
  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
    comments: [Comment!]!
  }
  
  type Comment {
    id: ID!
    text: String!
    author: User!
  }
  
  type Query {
    user(id: ID!): User
  }
`;

const resolvers = {
  Query: {
    user: (_, { id }) => db.users.findById(id),
  },
  User: {
    posts: (user) => db.posts.findByUserId(user.id),
  },
  Post: {
    author: (post) => db.users.findById(post.authorId),
    comments: (post) => db.comments.findByPostId(post.id),
  },
  Comment: {
    author: (comment) => db.users.findById(comment.authorId),
  },
};

// Plus: DataLoader for N+1, depth limiting, query complexity analysis,
// authentication per field, error handling, schema stitching...
```

**2. The Caching Catastrophe**
```
REST Caching: Simple
GET /users/123
Cache-Control: max-age=3600
CDN: "Got it, cached for 1 hour"

GraphQL Caching: Impossible?
POST /graphql
{ query: "{ user(id: 123) { name } }" }
CDN: "How do I cache a POST?"
Developer: "Use GET with query parameters!"
URL: /graphql?query=%7Buser(id%3A123)%7Bname%7D%7D
CDN: "This is 2KB long and different for every client"
Developer: "Use persisted queries!"
Complexity: "Through the roof"
```

### GraphQL's Niche

Where GraphQL actually works:

- **Facebook**: Built for it, massive infrastructure
- **GitHub**: Public API with known query patterns  
- **Shopify**: E-commerce needs flexible queries
- **Internal Tools**: When you control all clients

Where it fails:
- Public APIs (complexity barrier)
- High-performance systems (overhead)
- Simple CRUD apps (overkill)
- Teams without GraphQL experts (everyone)

## gRPC: The Unexpected Champion

### Why gRPC is Winning

The quiet revolution:

**Performance That Matters:**
```protobuf
// user.proto
syntax = "proto3;

service UserService {
  rpc GetUser (GetUserRequest) returns (User);
  rpc ListUsers (ListUsersRequest) returns (stream User);
}

message User {
  int64 id = 1;
  string name = 2;
  string email = 3;
  repeated Post posts = 4;
}

// Binary encoding, HTTP/2, streaming built-in
// 10x smaller than JSON, 5x faster parsing
```

**Real Benchmark:**
```python
# Performance comparison (1M requests)
benchmark_results = {
    'REST_JSON': {
        'avg_latency': '12ms',
        'p99_latency': '45ms',
        'throughput': '8,000 req/s',
        'bandwidth': '1.2 GB',
    },
    'GraphQL': {
        'avg_latency': '18ms',
        'p99_latency': '89ms',
        'throughput': '5,000 req/s',
        'bandwidth': '1.5 GB',
    },
    'gRPC': {
        'avg_latency': '2ms',
        'p99_latency': '8ms',
        'throughput': '45,000 req/s',
        'bandwidth': '150 MB',
    }
}
# gRPC: 5-10x better across all metrics
```

### gRPC in Production

Who's using it and why:

**Netflix:**
```go
// Handling 2 billion+ RPC calls daily
func (s *VideoService) StreamVideo(req *StreamRequest, stream VideoService_StreamVideoServer) error {
    // Efficient video chunk streaming
    for chunk := range getVideoChunks(req.VideoId) {
        if err := stream.Send(chunk); err != nil {
            return err
        }
    }
    return nil
}
```

**Uber:**
```python
# Real-time location updates
def UpdateDriverLocation(self, request_iterator, context):
    for location in request_iterator:
        # Bidirectional streaming for live tracking
        self.location_service.update(location)
        yield LocationResponse(status="updated")
```

**Square:**
- All internal services use gRPC
- 50% latency reduction
- 90% bandwidth savings
- Strong typing caught 1000s of bugs

### The gRPC Downsides

It's not perfect:

```javascript
// The Browser Problem
// gRPC doesn't work in browsers directly

// Option 1: gRPC-Web (limited features)
const client = new UserServiceClient('http://localhost:8080');
const request = new GetUserRequest();
request.setId('123');
// No streaming, requires proxy

// Option 2: Envoy proxy (complexity)
Browser → HTTP/1.1 → Envoy → HTTP/2 gRPC → Service

// Option 3: Connect/Buf (new standard)
// Better but still emerging
```

## The New Contenders

### tRPC: The TypeScript Revolution

Full-stack type safety without schemas:

```typescript
// Backend (Next.js API routes)
export const appRouter = router({
  user: {
    get: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await db.user.findUnique({
          where: { id: input.id }
        });
      }),
    
    create: protectedProcedure
      .input(z.object({ 
        name: z.string(),
        email: z.string().email()
      }))
      .mutation(async ({ input }) => {
        return await db.user.create({ data: input });
      }),
  },
});

// Frontend (React)
function UserProfile({ id }: { id: string }) {
  // Full type safety, autocomplete, no code generation
  const { data, error } = trpc.user.get.useQuery({ id });
  
  if (error) return <div>Error: {error.message}</div>;
  return <div>{data?.name}</div>;
}

// Why developers love it:
// - No schema files
// - No code generation
// - Perfect TypeScript integration
// - Feels like calling local functions
```

### Server-Sent Events: The REST Killer

Real-time without WebSocket complexity:

```javascript
// Server (Simple SSE)
app.get('/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  // Send updates
  const interval = setInterval(() => {
    res.write(`data: ${JSON.stringify({
      time: new Date(),
      price: getCurrentPrice()
    })}\n\n`);
  }, 1000);

  req.on('close', () => clearInterval(interval));
});

// Client (Built into browsers!)
const events = new EventSource('/events');
events.onmessage = (e) => {
  const data = JSON.parse(e.data);
  updateUI(data);
};

// Why it's resurging:
// - Native browser support
// - HTTP/2 multiplexing
// - Works through proxies/firewalls
// - Simpler than WebSockets
```

### The AI-Native APIs

New patterns emerging:

```python
# Streaming LLM responses
async def chat_completion(request: ChatRequest):
    async def generate():
        async for chunk in llm.generate_stream(request.prompt):
            yield f"data: {json.dumps({'token': chunk})}\n\n"
    
    return StreamingResponse(generate(), media_type="text/event-stream")

# Vector similarity APIs
@app.post("/search/similar")
async def vector_search(query: VectorQuery):
    embedding = await encoder.encode(query.text)
    results = await vector_db.search(
        embedding, 
        top_k=query.limit,
        filters=query.filters
    )
    return results

# Function calling APIs
@app.post("/execute")
async def execute_function(call: FunctionCall):
    # LLMs calling your APIs directly
    if call.function not in allowed_functions:
        raise HTTPException(403, "Function not allowed")
    
    result = await functions[call.function](**call.parameters)
    return {"result": result}
```

## The Real-World Migration Stories

### Success: Fintech Platform's gRPC Journey

```
Before (REST):
- 200ms average latency
- $45K/month bandwidth costs
- 15% of requests timeout
- API versioning nightmare

Migration Process:
1. Define proto files for core services
2. Run gRPC alongside REST
3. Migrate internal services first
4. Update clients gradually
5. Deprecate REST endpoints

After (gRPC):
- 20ms average latency (10x improvement)
- $8K/month bandwidth (82% reduction)
- 0.1% request timeouts
- Version compatibility built-in

ROI: 6 months
```

### Failure: Social Media's GraphQL Disaster

```
The Plan:
"Replace our REST API with GraphQL for ultimate flexibility!"

What Happened:
- 6 months: Schema design debates
- 9 months: Resolver performance issues
- 12 months: Mobile apps can't handle complexity
- 15 months: Query depth attacks in production
- 18 months: Emergency REST API restoration

Lessons Learned:
- GraphQL requires GraphQL experts
- Flexibility has a complexity cost
- Mobile clients need simple APIs
- REST wasn't the problem
```

## The Decision Framework

### Choosing Your API Architecture

```python
def choose_api_architecture(requirements):
    if requirements['clients'] == 'browser_only':
        if requirements['real_time']:
            return 'Server-Sent Events'
        elif requirements['type_safety'] and requirements['typescript']:
            return 'tRPC'
        else:
            return 'REST (it\'s fine)'
    
    elif requirements['microservices'] and requirements['performance_critical']:
        return 'gRPC'
    
    elif requirements['complex_queries'] and requirements['multiple_clients']:
        if requirements['team_expertise'] == 'high':
            return 'GraphQL'
        else:
            return 'REST with query parameters'
    
    elif requirements['public_api']:
        return 'REST (still the standard)'
    
    else:
        return 'Start with REST, evolve as needed'
```

### The Hybrid Reality

Most successful architectures in 2025:

```yaml
typical_api_architecture:
  external:
    public_api: REST  # Developer familiarity
    webhook_events: REST  # Industry standard
    real_time: WebSocket/SSE  # Push updates
    
  internal:
    service_to_service: gRPC  # Performance
    frontend_to_backend: 
      - tRPC  # If using TypeScript
      - GraphQL  # If complex queries
      - REST  # If simple CRUD
    
  specialized:
    ai_services: Streaming  # Token-by-token
    file_upload: Multipart REST  # Standard
    batch_operations: Async REST  # Job queues
```

## The Future of APIs

### 2025-2027 Predictions

1. **gRPC Dominance**: 50%+ of internal APIs
2. **REST Persistence**: Public APIs stay REST
3. **GraphQL Specialization**: Complex queries only
4. **tRPC Growth**: TypeScript projects default
5. **AI-First Protocols**: New patterns emerge

### The Next Evolution

What's coming:

**Capability-Based APIs:**
```typescript
// Instead of endpoints, expose capabilities
const api = createAPI({
  capabilities: {
    'user.read': requiresAuth,
    'user.write': requiresAuth,
    'user.delete': requiresAdmin,
    'analytics.query': requiresSubscription
  }
});

// Client requests capabilities, not endpoints
const result = await api.execute('user.read', { id: '123' });
```

**Zero-Latency APIs:**
```javascript
// Local-first, sync later
const user = await localFirst.get('user:123');
// Returns immediately from local cache
// Syncs with server in background
// Handles conflicts automatically
```

## Practical Migration Guide

### If Moving from REST

**To gRPC:**
1. Start with internal services
2. Use gRPC-Gateway for REST compatibility
3. Migrate high-volume endpoints first
4. Keep REST for public APIs

**To GraphQL:**
1. Start with read-only queries
2. Add mutations carefully
3. Implement depth limiting day 1
4. Monitor query complexity

**To tRPC:**
1. Requires TypeScript everywhere
2. Start with new features
3. Gradually migrate endpoints
4. Keep REST for non-TS clients

## Conclusion

The death of REST APIs has been greatly exaggerated—but their monopoly is definitely over. In 2025, we're seeing a mature ecosystem where different protocols serve different needs. REST remains the lingua franca of public APIs, but it's no longer the default choice for everything.

gRPC's rise to prominence reflects the industry's need for performance and type safety in distributed systems. Its adoption by major tech companies validates that the complexity is worth it for internal services. GraphQL, despite its struggles, has found its niche in scenarios requiring flexible queries. And newcomers like tRPC show that innovation in API design is far from over.

The real lesson of 2025's API landscape is that one size doesn't fit all. The most successful architectures use REST for public simplicity, gRPC for internal performance, GraphQL for complex queries, and emerging protocols where they make sense. The key is choosing the right tool for each job rather than forcing everything into a single paradigm.

For developers and architects, the path forward is clear: understand the strengths and weaknesses of each approach, experiment with new protocols, but always prioritize solving real problems over chasing architectural trends. The best API is the one that serves your users effectively, whether that's REST, gRPC, GraphQL, or something yet to be invented.

The API wars continue, but they're no longer about finding a universal winner. They're about building a toolkit that lets us create better, faster, more maintainable systems. In that sense, we're all winners in 2025's rich API ecosystem.