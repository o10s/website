---
title: "CI/CD for Kubernetes: Where Simple Deployments Go to Die"
description: "An examination of how Kubernetes turned straightforward deployments into complex pipelines, why your CI/CD takes 45 minutes, and the hidden costs of 'modern' deployment practices."
pubDate: 2024-11-29
author: 'Olivier Alves'
tags: ["kubernetes", "ci-cd", "devops", "automation", "deployment", "jenkins", "gitlab"]
draft: false
---

Remember when deployment meant copying files to a server? Those were simpler times. Now, deploying a "Hello World" application to Kubernetes requires a CI/CD pipeline that would make NASA jealous. We've transformed the simple act of running software into a Rube Goldberg machine of containers, registries, scanners, validators, and enough YAML to paper the walls of a small office building.

## The Pipeline From Hell

A "basic" Kubernetes CI/CD pipeline in 2024:

### Stage 1: Code Checkout (2 minutes)
```yaml
- git clone (30 seconds)
- git lfs pull (90 seconds for some reason)
- submodule update (nobody knows why we have submodules)
```

### Stage 2: Build (5-10 minutes)
```yaml
- Restore cache (2 minutes)
- Install dependencies (3 minutes)
- Run build (2 minutes)
- Save cache (2 minutes)
- Wonder why cache never helps
```

### Stage 3: Test (10-20 minutes)
```yaml
- Unit tests (5 minutes)
- Integration tests (10 minutes)
- Contract tests (5 minutes)
- Tests that fail randomly (priceless)
```

### Stage 4: Security Theater (15 minutes)
```yaml
- SAST scan (5 minutes)
- Dependency scan (3 minutes)
- Container scan (5 minutes)
- License scan (2 minutes)
- Ignore all "critical" jQuery vulnerabilities
```

### Stage 5: Container Build (5-10 minutes)
```yaml
- Docker build (3 minutes)
- Docker push (2 minutes)
- Retry push because registry timeout (2 minutes)
- Multi-arch builds (5 minutes extra)
- Realize nobody uses ARM anyway
```

### Stage 6: Kubernetes Manifests (10 minutes)
```yaml
- Helm template generation
- Kustomize overlays
- Environment substitution
- YAML validation
- Pray nothing broke
```

### Stage 7: Deployment (5-15 minutes)
```yaml
- kubectl diff (pretend to review)
- kubectl apply
- Wait for rollout
- Health checks
- Smoke tests
- Rollback because health check was wrong
```

**Total time**: 45-90 minutes for a one-line change.

## The Tool Explosion

### The CI Servers
- **Jenkins**: XML configuration hell, plugin roulette
- **GitLab CI**: YAML inception, mysterious runners
- **GitHub Actions**: Vendor lock-in with a smile
- **CircleCI**: Credits that disappear mysteriously
- **TeamCity**: Because someone in management likes JetBrains

Each with unique syntax, different limitations, and incompatible pipeline definitions.

### The CD Tools
- **ArgoCD**: GitOps that fights your CI
- **Flux**: GitOps but different
- **Spinnaker**: Netflix-scale complexity for your 3 microservices
- **Jenkins X**: Jenkins but "cloud native" (still awful)
- **Tekton**: CRDs for everything

### The Supporting Cast
- **Harbor/Nexus/Artifactory**: Container registries
- **SonarQube**: Code quality theater
- **Trivy/Clair/Anchore**: Security scanners
- **OPA/Polaris**: Policy engines
- **Selenium/Cypress**: E2E tests that work locally

## The YAML Industrial Complex

A simple application deployment requires:

### CI Pipeline Definition
```yaml
# .gitlab-ci.yml / Jenkinsfile / .github/workflows/main.yml
stages:
  - build
  - test
  - scan
  - package
  - deploy

variables:
  DOCKER_DRIVER: overlay2
  KUBERNETES_VERSION: 1.28.0
  HELM_VERSION: 3.12.0
  # 50 more variables...
```

### Dockerfile
```dockerfile
FROM node:18-alpine as builder
# 20 lines of build optimization
FROM node:18-alpine
# 20 lines of runtime optimization
# Security hardening that breaks the app
```

### Kubernetes Manifests
```yaml
# deployment.yaml (100 lines)
# service.yaml (30 lines)
# ingress.yaml (50 lines)
# configmap.yaml (40 lines)
# secrets.yaml (20 lines)
# networkpolicy.yaml (60 lines)
# poddisruptionbudget.yaml (20 lines)
```

### Helm Charts
```yaml
# Chart.yaml
# values.yaml (200 lines)
# values-dev.yaml (100 lines)
# values-staging.yaml (100 lines)
# values-prod.yaml (150 lines)
# templates/* (1000+ lines)
```

## Real-World Pipeline Disasters

### Case Study 1: The Docker Rate Limit Apocalypse
**Date**: November 2020
**Problem**: Docker Hub introduced rate limits
**Impact**: 
- Every CI pipeline worldwide started failing
- Frantic registry migrations
- Hardcoded docker.io references everywhere
- Authentication tokens in places they shouldn't be

### Case Study 2: The Certificate Expiration
**Problem**: CI/CD certificate expired on Friday night
**Impact**:
- No deployments for the weekend
- Certificate renewal required Jenkins restart
- Jenkins restart lost all running jobs
- Monday morning chaos

### Case Study 3: The Helm Upgrade Horror
**Scenario**: Upgraded Helm from v2 to v3
**Result**:
- All charts needed migration
- Tiller removal broke permissions
- Rollback impossible
- 3-week migration project
- Some services still on Helm v2

## The Security Theater

Modern CI/CD security requirements:

### Supply Chain Paranoia
- Sign every commit
- Sign every container
- Verify every signature
- SBOM for everything
- Attestations for attestations

### Scanning Everything
```yaml
security-scan:
  - trivy image $IMAGE
  - grype $IMAGE
  - snyk container test $IMAGE
  - twistlock scan $IMAGE
  # All find the same CVEs
  # All are ignored
```

### Policy Enforcement
- No root containers (breaks half the apps)
- No privileged pods (breaks the other half)
- Resource limits required (picked randomly)
- Network policies mandatory (nobody understands them)

## The Performance Problem

### Why Pipelines Are Slow

1. **Container builds rebuild everything**
   - Layer caching doesn't work
   - Multi-stage builds download internet
   - BuildKit bugs cause rebuilds

2. **Tests run sequentially**
   - Parallelization is hard
   - Test dependencies are complex
   - Shared test databases

3. **Security scans scan everything**
   - Full filesystem scans
   - Download vulnerability databases
   - Check every npm package ever

4. **Deployments wait for nothing**
   - Health checks with 5-minute timeouts
   - Rolling updates for single-replica apps
   - Readiness probes that lie

## The Cost Multiplication

### Direct Costs
- **CI/CD runners**: $5,000/month
- **Container registry**: $1,000/month
- **Security scanning**: $3,000/month
- **Artifact storage**: $2,000/month
- **Log storage**: $1,500/month

### Hidden Costs
- **Developer waiting**: 45 minutes × 50 deploys/day × $100/hour
- **Failed deployments**: 20% failure rate × recovery time
- **Pipeline maintenance**: 2 full-time engineers
- **Tool licensing**: Enterprise features always required

## What We've Lost

### Simplicity
```bash
# The old way
scp app.jar server:/opt/app/
ssh server 'systemctl restart app'
# Done in 30 seconds
```

### Debuggability
- Can't SSH to debug
- Logs scattered across systems
- Reproducing CI environment locally impossible
- "Works on my machine" became "works in CI"

### Speed
- Hot reload during development
- Instant deployments
- Quick rollbacks
- Fast feedback loops

## The Sane Alternatives

### For Small Teams
1. **GitHub Actions + kubectl**
   - Simple, integrated, sufficient
   - Direct deployment
   - Skip the middlemen

2. **Buildpacks**
   - Convention over configuration
   - No Dockerfile needed
   - Reasonable defaults

### For Medium Teams
1. **Boring technology**
   - Jenkins with simple pipelines
   - Docker registry
   - Basic security scanning
   - Direct deployments

2. **Monorepo + Bazel**
   - Incremental builds that work
   - Cached test results
   - Reproducible builds

### For Large Teams
Accept the complexity but:
- Dedicated platform team
- Standard golden paths
- Hide complexity from developers
- Measure value, not compliance

## The Path Forward

### What We Need
1. **Simplicity first**: Make easy things easy
2. **Fast feedback**: Sub-5-minute deployments
3. **Local reproducibility**: CI shouldn't be magical
4. **Actual security**: Not scanning theater
5. **Cost awareness**: Pipeline costs visible

### What We Don't Need
1. **More YAML**: We have enough
2. **More tools**: Integration is the problem
3. **More abstractions**: They leak anyway
4. **More scanning**: Fix the actual issues
5. **More process**: Speed matters

## Conclusion

We've transformed deployment from a simple file copy into a complex distributed system that requires its own team to manage. Our CI/CD pipelines have more moving parts than the applications they deploy. We've added layers of security theater that catch theoretical vulnerabilities while missing actual security issues. We've created deployment processes so complex that developers fear releasing code.

The promise was automation and reliability. The reality is 45-minute pipelines that fail for mysterious reasons, security scans that everyone ignores, and deployment processes that require PhD-level debugging skills when they break. We've automated the easy parts while making the hard parts harder.

The tragedy is that simple deployments are still possible. Small teams using basic tools often deploy faster and more reliably than enterprises with million-dollar CI/CD infrastructures. The difference? They optimize for simplicity and speed rather than compliance and complexity.

The next time someone proposes adding another stage to your pipeline, another scanner to your process, or another tool to your stack, ask them: "Will this make deployments faster or slower?" If they start talking about "best practices" instead of deployment speed, you have your answer.

Sometimes the best CI/CD pipeline is the one that barely exists.