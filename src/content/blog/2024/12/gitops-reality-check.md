---
title: "GitOps: When Git Becomes Your Single Point of Failure"
description: "A critical examination of GitOps practices, why treating Git as the source of truth for infrastructure creates new problems, and the hidden costs of git-driven deployments."
pubDate: 2024-12-04
author: 'Olivier Alves'
tags: ["gitops", "kubernetes", "ci-cd", "infrastructure-as-code", "automation", "devops"]
draft: false
---

GitOps promised to revolutionize deployments: declare your desired state in Git, and watch it magically appear in production. Infrastructure as code, version-controlled and auditable. What could go wrong? As it turns out, plenty. Organizations are discovering that GitOps often trades deployment flexibility for rigid processes, operational simplicity for complex tooling, and distributed resilience for a single point of failure named Git.

## The GitOps Promise

The pitch is compelling:
- **Single source of truth**: Everything in Git
- **Declarative infrastructure**: Describe what you want, not how
- **Automatic reconciliation**: Drift detection and correction
- **Audit trail**: Complete history of all changes
- **Rollback capability**: Just revert the commit

In practice, each benefit comes with significant drawbacks.

## The Single Point of Failure

Making Git your source of truth means Git becomes your single point of failure:

### When GitHub Goes Down
- October 2018: Major outage, deployments stopped globally
- March 2020: Service degradation, CI/CD pipelines failed
- November 2021: Authentication issues, teams locked out
- Each time: GitOps-dependent companies couldn't deploy

### The Workarounds That Don't Work
Teams try to mitigate with:
- Git mirrors (sync lag causes split-brain)
- Local Git servers (now you manage Git infrastructure)
- Multiple Git providers (complexity multiplies)
- "Break glass" procedures (usually untested and broken)

## The Declarative Delusion

"Declarative" sounds simple until you realize:

### YAML Sprawl
A simple application deployment becomes:
```yaml
# application.yaml
# configmap.yaml
# secret.yaml
# deployment.yaml
# service.yaml
# ingress.yaml
# networkpolicy.yaml
# poddisruptionbudget.yaml
# horizontalpodautoscaler.yaml
# verticalpodautoscaler.yaml
# servicemonitor.yaml
# prometheusrule.yaml
```

Each file references others. Change one, potentially break all.

### The Templating Nightmare
Pure YAML isn't enough, so teams add:
- Helm (templates generating templates)
- Kustomize (overlays upon overlays)
- Jsonnet (a programming language for YAML)
- Custom scripts (defeating the purpose)

Result: "Declarative" configs that require imperative preprocessing.

## The Reconciliation Loop of Doom

Automatic reconciliation sounds great until:

### The Fighting Controllers
1. GitOps operator updates resource
2. Another controller modifies it
3. GitOps detects "drift"
4. Reverts the change
5. Other controller reapplies
6. Infinite loop of updates

Real example: Cert-manager updating certificate annotations while ArgoCD reverts them. Thousands of API calls per minute.

### The Drift Detection Dilemma
- Too sensitive: Constant noise from legitimate changes
- Not sensitive enough: Real drift goes undetected
- Just right: Doesn't exist

## The Tool Complexity Explosion

GitOps requires a stack of tools:

### ArgoCD: The Popular Choice
- Requires its own HA deployment
- Needs persistent storage
- Consumes significant resources
- Becomes a critical dependency
- UI that everyone bypasses for CLI

### Flux: The "Simpler" Alternative
- Actually more complex to debug
- Multiple controllers to manage
- Cryptic error messages
- Breaking changes between versions
- Documentation assumes deep Kubernetes knowledge

### The Supporting Cast
- Sealed Secrets / SOPS / Vault (for secrets)
- Helm / Kustomize (for templating)
- Git webhooks / polling (for updates)
- RBAC configurations (for security)
- Monitoring stack (to watch GitOps)

## Real-World GitOps Failures

### Case Study 1: The Merge Conflict Outage
**Scenario**: Two teams update the same application
**Result**: 
- Merge conflict in Git
- GitOps stops syncing
- Production drift from desired state
- Manual intervention required
- 4-hour recovery time

### Case Study 2: The Secret Leak
**Scenario**: Developer commits unencrypted secret
**Result**:
- Secret deployed to production
- Git history contains secret forever
- Requires force-push to clean
- GitOps loses sync reference
- Full cluster reconciliation needed

### Case Study 3: The Dependency Hell
**Scenario**: Microservices with inter-dependencies
**Result**:
- Service A depends on Service B
- GitOps deploys alphabetically
- Service A fails until B is ready
- No native dependency management
- Custom workflows needed

## The Human Cost

### Developer Experience Degradation
Before GitOps:
```bash
kubectl apply -f manifest.yaml
# Done in 30 seconds
```

With GitOps:
1. Create branch
2. Edit YAML
3. Commit and push
4. Create pull request
5. Wait for reviews
6. Merge to main
7. Wait for GitOps sync
8. Check if deployment worked
9. Debug if it didn't

Time: 30 minutes to hours

### The Emergency Response Problem
During incidents:
- Need immediate changes
- GitOps requires Git commits
- Git might be slow/down
- Pull request process too slow
- "Break glass" procedures often broken

Teams end up bypassing GitOps during emergencies, defeating its purpose.

## The Hidden Costs

### Performance Overhead
- Constant Git polling/webhooks
- Continuous reconciliation loops
- API server load from comparisons
- Network traffic for Git operations

Measured impact:
- 10-20% more API server load
- 5-10% more etcd operations
- Increased cloud costs
- Slower cluster operations

### Operational Complexity
GitOps adds:
- Git repository management
- Branch protection rules
- Access control in two places
- Sync status monitoring
- Drift alert management
- Tool version upgrades

Each addition increases failure modes.

## When GitOps Actually Works

### The Ideal Scenario
- Experienced team with Git discipline
- Simple, well-structured applications
- Clear deployment boundaries
- Robust CI/CD pipeline
- Time for proper implementation

### What This Means
- 10+ person platform team
- 6-month implementation timeline
- Significant training investment
- Ongoing maintenance burden
- Accept slower deployments

Most organizations don't meet these criteria.

## The Alternatives That Work

### 1. Traditional CI/CD
- Jenkins/GitLab CI/GitHub Actions
- Direct deployment to clusters
- Immediate feedback
- Faster iteration
- Simpler debugging

### 2. Operator Pattern
- Custom operators for complex apps
- Encapsulated business logic
- Kubernetes-native
- No Git dependency
- Better error handling

### 3. Imperative With Audit
- kubectl with admission webhooks
- Audit logs for compliance
- Fast emergency response
- Developer-friendly
- Lower complexity

## Recommendations

### For Organizations Considering GitOps

1. **Question the why**: Are you solving real problems or following trends?
2. **Start very small**: One non-critical app, not entire infrastructure
3. **Measure everything**: Deployment time, failure rate, recovery time
4. **Keep escape hatches**: Maintain ability to bypass GitOps
5. **Train extensively**: Everyone needs to understand the full flow

### For Current GitOps Users

1. **Simplify tooling**: Remove layers of abstraction
2. **Document everything**: Especially emergency procedures
3. **Monitor Git dependencies**: Treat as critical infrastructure
4. **Regular disaster recovery**: Test GitOps failures
5. **Be ready to abandon**: If complexity exceeds benefits

## The Future of GitOps

GitOps needs evolution:
- Better dependency management
- Simpler tooling
- Faster feedback loops
- Emergency deployment modes
- Reduced Git coupling

Until then, it remains a solution that often creates more problems than it solves.

## Conclusion

GitOps represents the infrastructure-as-code dream taken to its logical extreme—and that's not always a good thing. By making Git the source of truth, we've created a brittle system where repository availability determines deployment capability. By enforcing declarative everything, we've made simple tasks complex. By automating reconciliation, we've created new failure modes.

The irony is palpable: in trying to eliminate operational complexity, GitOps often adds more. In pursuing version control for everything, we've made Git a critical runtime dependency. In seeking deployment standardization, we've created rigid processes that break under pressure.

GitOps can work, but only for organizations willing to accept its tradeoffs: slower deployments, increased complexity, and Git as a single point of failure. For many, traditional CI/CD with good practices provides better outcomes with less overhead.

The next time someone proposes GitOps as the solution to your deployment challenges, ask them: "What happens when Git goes down?" Their answer—or lack thereof—will tell you whether they've truly thought through the implications of making Git your operational cornerstone.