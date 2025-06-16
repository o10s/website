---
title: "Kubernetes for AI/ML Workloads: The GPU Scheduling Nightmare"
description: "An honest examination of running AI/ML workloads on Kubernetes, focusing on GPU scheduling challenges, cloud provider limitations, and why many teams are abandoning K8s for AI infrastructure."
pubDate: 2024-12-12
author: 'Olivier Alves'
tags: ["kubernetes", "ai", "machine-learning", "gpu", "cloud-computing", "infrastructure"]
draft: false
---

The promise was compelling: Kubernetes would democratize AI/ML infrastructure, making GPU resources as easy to manage as CPU and memory. Two years into the AI boom, the reality is starkly different. Teams are discovering that Kubernetes' GPU scheduling capabilities are, at best, an afterthought bolted onto an architecture never designed for heterogeneous computing.

## The Fundamental Mismatch

Kubernetes was built for stateless, CPU-bound microservices. AI/ML workloads are stateful, GPU-bound, and require precise resource allocation. This impedance mismatch creates cascading problems that no amount of YAML can solve.

### GPU Scheduling: A House of Cards

The current GPU scheduling model in Kubernetes treats GPUs as simple countable resources. This naive approach ignores:

1. **GPU memory fragmentation**: Unlike CPU, GPU memory can't be overcommitted
2. **NUMA considerations**: GPU-CPU affinity matters for performance
3. **Multi-GPU topology**: Not all GPUs can communicate efficiently
4. **Dynamic allocation**: ML workloads have varying GPU needs during training

## Cloud Provider Failures

### Amazon EKS: Promises vs. Reality

AWS touts EKS as "ML-ready," but the reality is sobering:
- **Node group inflexibility**: GPU node groups can't scale based on actual GPU utilization
- **Cost explosion**: Idle GPUs in underutilized nodes burn thousands per day
- **Instance type lock-in**: Changing GPU types requires cluster gymnastics

### Google GKE: Complexity Masquerading as Features

Google's approach adds layers of abstraction that complicate rather than simplify:
- **GPU time-sharing**: Sounds great until you realize the performance implications
- **Autoscaling delays**: GPU nodes take 5-10 minutes to provision—eternity for burst workloads
- **Quota nightmares**: GPU quotas are separate from CPU quotas, leading to provisioning deadlocks

### Azure AKS: The Forgotten Child

Microsoft's AKS GPU support feels like an afterthought:
- **Driver chaos**: NVIDIA driver management remains manual and error-prone
- **Limited GPU types**: Fewer options compared to bare VMs
- **Network acceleration**: GPU Direct RDMA support is essentially non-existent

## The DevOps Tax

Running ML workloads on Kubernetes imposes a hidden tax on organizations:

### 1. Expertise Burden
Teams need Kubernetes experts AND ML infrastructure experts—a rare and expensive combination.

### 2. Operational Overhead
- Custom operators for GPU allocation
- Prometheus exporters for GPU metrics
- Helm charts that nobody understands
- YAML templates that would make a grown developer cry

### 3. Debugging Nightmare
When a training job fails, is it:
- A Kubernetes scheduling issue?
- A GPU driver problem?
- A container runtime conflict?
- An actual ML code bug?

Good luck figuring it out at 3 AM when your model training deadline looms.

## Real-World Failures

### Case Study 1: The Fintech That Couldn't Scale
A major fintech spent six months building a Kubernetes-based ML platform. Result:
- 3x higher infrastructure costs than anticipated
- 50% GPU utilization despite 100% allocation
- Platform team larger than the ML team
- Eventually migrated to managed services

### Case Study 2: The Startup That Burned Cash
An AI startup went all-in on Kubernetes for "flexibility." Reality:
- $50K/month in idle GPU costs
- 2-week delays implementing GPU sharing
- Lost a major customer due to training delays
- Pivoted to Slurm + bare metal

## The Alternatives Teams Are Choosing

### 1. Managed Services
AWS SageMaker, Google Vertex AI, and Azure ML provide:
- Native GPU scheduling
- Integrated development environments
- Managed infrastructure
- Predictable costs

### 2. Specialized Orchestrators
- **Slurm**: Battle-tested in HPC, actually understands GPUs
- **Ray**: Built for distributed ML from the ground up
- **Kubeflow**: At least tries to address ML-specific needs

### 3. Bare Metal + Simple Tools
Many teams are returning to basics:
- Dedicated GPU servers
- Simple Python scripts for job scheduling
- Direct SSH access for debugging
- 90% less complexity, 90% fewer problems

## The Vendor Hype Machine

Despite these challenges, vendors continue pushing Kubernetes for AI/ML:

- **NVIDIA**: Sells more GPUs if everyone needs redundancy
- **Cloud providers**: Lock-in through managed Kubernetes services
- **Consultancies**: Complexity equals billable hours
- **Tool vendors**: Every problem needs a new product

## Recommendations for the Pragmatic

### 1. Question the Premise
Do you actually need Kubernetes for ML workloads, or are you following the herd?

### 2. Start with Managed Services
Let AWS/Google/Azure handle the infrastructure complexity while you focus on models.

### 3. Measure Real Costs
Include engineering time, not just infrastructure costs. The picture might shock you.

### 4. Consider Hybrid Approaches
Use Kubernetes for serving, traditional HPC tools for training.

## The Future: Admitting Failure?

The Kubernetes community must acknowledge that current GPU support is inadequate for serious ML workloads. Until fundamental architectural changes address heterogeneous computing, teams will continue to struggle, costs will spiral, and simpler alternatives will gain adoption.

## Conclusion

Kubernetes revolutionized container orchestration for web applications. But forcing it to handle AI/ML workloads is like using a hammer to drive screws—it might work, but there are better tools for the job. As the AI boom continues, the industry needs to admit that not every workload belongs on Kubernetes, especially when GPUs worth tens of thousands of dollars sit idle while engineers debug YAML.

The next time someone suggests Kubernetes for your ML infrastructure, ask them to show their GPU utilization metrics. Their silence will speak volumes.