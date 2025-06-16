---
title: "Managed Kubernetes: Trading Problems for Different Problems"
description: "An analysis of how EKS, GKE, and AKS promise to simplify Kubernetes but create new forms of complexity, vendor lock-in, and unexpected costs."
pubDate: 2024-12-01
author: 'Olivier Alves'
tags: ["kubernetes", "eks", "gke", "aks", "cloud-computing", "vendor-lockin", "managed-services"]
draft: false
---

Managed Kubernetes services promise to eliminate operational complexity. AWS EKS, Google GKE, and Azure AKS will handle the control plane, manage updates, and integrate with cloud services. Just focus on your applications! Two years and a mountain of cloud bills later, organizations discover they've traded Kubernetes complexity for vendor complexity, operational challenges for billing surprises, and control for convenience that isn't.

## The Control Plane Illusion

Managed services abstract the control plane, but complexity doesn't disappear—it transforms:

### What You Don't Manage
- Control plane servers
- etcd backups
- API server configuration
- Certificate rotation
- Control plane scaling

### What You Still Manage
- Worker nodes (and their endless issues)
- Node OS updates and security patches
- Cluster networking and CNI plugins
- Storage drivers and CSI complexities
- Add-ons and their version compatibility
- Everything that actually runs your applications

The "managed" part is smaller than you think.

## EKS: Amazon's Kubernetes Tax

### The Hidden Costs

EKS pricing reveals Amazon's strategy:
- **Control plane**: $0.10/hour ($73/month)
- **Worker nodes**: Standard EC2 pricing
- **Load balancers**: $20+/month each
- **NAT gateways**: $45/month + data transfer
- **EBS volumes**: Storage + IOPS charges
- **Data transfer**: The real killer

A "simple" EKS cluster costs $500-1000/month before running any applications.

### The AWS Lock-in Special

EKS deeply integrates with AWS services:
- IAM roles for service accounts (IRSA)
- AWS Load Balancer Controller
- EBS CSI driver
- VPC CNI plugin
- CloudWatch Container Insights

Each integration makes migration harder. Try moving an IRSA-dependent application to GKE—we'll wait.

### The Upgrade Russian Roulette

EKS version upgrades are adventures:
1. AWS deprecates your version with 60-day notice
2. Upgrade requires updating node groups
3. Add-ons might break
4. In-place upgrades sometimes fail
5. Rollback isn't possible

Real scenario: 1.21 to 1.22 upgrade broke AWS Load Balancer Controller. Production down for 4 hours.

## GKE: Google's Complexity as a Service

### The Autopilot Trap

GKE Autopilot promises "hands-off Kubernetes." Reality:
- 2.5x the cost of standard GKE
- Arbitrary pod resource limits
- No privileged containers
- Limited node access
- Can't run many standard applications

You pay more for less control and flexibility.

### The Network Maze

GKE networking is a labyrinth:
- Cluster IP ranges must be planned perfectly
- Private clusters require Cloud NAT
- Shared VPC requires additional IAM setup
- Alias IPs vs routes confusion
- Node-to-node encryption complexity

One wrong CIDR choice during creation? Delete and recreate the entire cluster.

### The Quota Surprise

GKE hits Google Cloud quotas you didn't know existed:
- In-use IP addresses
- CPU quota per region
- Persistent disk throughput
- Load balancer forwarding rules
- Backend services

Mid-deployment failures because you hit an obscure quota are GKE's specialty.

## AKS: Azure's Forgotten Stepchild

### The Free Control Plane Trick

Azure markets "free" control plane. Hidden costs:
- Log Analytics workspace (required for monitoring)
- Azure Monitor for containers
- Azure Policy add-on
- Application Gateway ingress
- Azure Active Directory integration

The "free" control plane costs more than EKS when you add required services.

### The Update Chaos

AKS updates are uniquely problematic:
- Node image updates separate from Kubernetes version
- Automatic updates that aren't automatic
- Preview features in production
- Breaking changes without notice

Real example: Automatic node image update changed kernel version, broke custom CNI plugin, production down for 8 hours.

### The Integration Desert

Compared to AWS and Google:
- Fewer native integrations
- Community-maintained drivers
- Documentation assumes you're psychic
- Support treats Kubernetes as alien technology

## The Vendor Lock-in Playbook

### Phase 1: The Honeymoon
- "It's just Kubernetes!"
- "You can migrate anytime!"
- "Standard APIs everywhere!"
- Free credits and aggressive pricing

### Phase 2: The Integration Web
- Cloud IAM for authentication
- Managed certificates for ingress
- Cloud storage for persistence
- Monitoring tied to cloud services

### Phase 3: The Realization
- Migration requires rewriting everything
- Cloud-specific annotations everywhere
- Operational procedures assume cloud tools
- Team knowledge is cloud-specific

### Phase 4: The Acceptance
- Migration cost exceeds 5 years of lock-in
- Easier to stay and complain
- Vendor increases prices
- You have no leverage

## Real Costs vs. Promised Savings

### What Vendors Promise
- Reduced operational overhead
- Automatic updates and patches
- Built-in high availability
- Integrated security
- Lower TCO

### What You Actually Get

**Personnel costs remain high:**
- Still need Kubernetes experts
- Now need cloud-specific experts
- Debugging requires both skill sets

**Hidden operational costs:**
- Cloud API rate limits
- Slower debugging (no control plane access)
- Vendor support tickets
- Workarounds for missing features

**Surprise charges:**
- Data egress fees
- Cross-AZ traffic
- Load balancer hours
- NAT gateway processing
- API request charges

## The Migration Nightmare

Organizations trying to migrate between managed services discover:

### Application Changes Required
- Authentication mechanisms differ
- Storage classes incompatible
- Ingress annotations vendor-specific
- Network policies work differently
- Service mesh integrations break

### Operational Procedure Rewrite
- Deployment pipelines
- Monitoring and alerting
- Backup procedures
- Disaster recovery
- Security scanning

### Data Migration Complexity
- Persistent volume migration
- Database connection strings
- Secret management differs
- Certificate handling varies
- State reconstruction needed

Migration projects regularly take 6-12 months and cost millions.

## When Managed Services Make Sense

### Good Fit Scenarios
1. **Small teams** without Kubernetes expertise
2. **Startups** needing to move fast
3. **Single-cloud** committed organizations
4. **Standard workloads** without special requirements
5. **High-growth** companies trading cost for speed

### Poor Fit Scenarios
1. **Multi-cloud** requirements
2. **Cost-sensitive** operations
3. **Special compliance** needs
4. **High-performance** computing
5. **Complex networking** requirements

## The Alternative Path

### Self-Managed on Cloud Infrastructure
- Full control over configuration
- Portable across clouds
- Higher operational burden
- Requires strong expertise
- Can be more cost-effective

### Kubernetes Distributions
- Rancher, OpenShift, Tanzu
- More portable than managed services
- Additional abstraction layer
- Different complexity tradeoffs
- Vendor support available

### Alternative Orchestrators
- HashiCorp Nomad
- Docker Swarm (yes, really)
- Bare metal with systemd
- Sometimes simpler is better

## Recommendations

### Before Choosing Managed Services

1. **Calculate real costs**: Include all add-ons and data transfer
2. **Prototype migrations**: Test moving between providers
3. **Evaluate lock-in**: List all cloud-specific dependencies
4. **Consider alternatives**: Managed isn't the only way
5. **Plan exit strategy**: Before you need it

### If Using Managed Services

1. **Minimize cloud-specific features**: Use vanilla Kubernetes where possible
2. **Abstract integrations**: Wrapper libraries for cloud services
3. **Document everything**: Especially cloud-specific configurations
4. **Regular cost reviews**: Bills grow mysteriously
5. **Keep skills portable**: Don't become cloud-specific

## Conclusion

Managed Kubernetes services are like luxury cars: they promise a smooth ride but come with premium pricing, vendor lock-in, and expensive maintenance. The "management" they provide covers the parts of Kubernetes that were already relatively stable, while leaving you with all the complex bits plus new cloud-specific challenges.

Organizations choose managed services believing they'll simplify operations and reduce costs. They often achieve neither. Instead, they trade operational complexity for vendor complexity, control for convenience, and portability for integration. The monthly bills grow, the lock-in deepens, and the promise of "it's just Kubernetes" becomes a bitter joke.

The tragedy is that managed services could be better. They could prioritize portability, transparency, and actual operational simplicity. Instead, they optimize for vendor lock-in, recurring revenue, and the complexity that keeps enterprises dependent.

Before choosing a managed Kubernetes service, ask yourself: Are you solving problems or just moving them to a different layer? Are you reducing complexity or adding cloud-specific complexity? Are you managing costs or creating future liabilities?

Sometimes the best managed service is the one you manage yourself.