---
title: "Helm: The Package Manager That Packages Problems"
description: "A critical analysis of Helm's fundamental flaws, why templating YAML was always a bad idea, and how Helm creates more deployment problems than it solves."
pubDate: 2024-12-02
author: 'Olivier Alves'
tags: ["helm", "kubernetes", "package-management", "yaml", "deployment", "devops"]
draft: false
---

Helm bills itself as "the package manager for Kubernetes," which is accurate if your definition of package management includes turning simple deployments into templating nightmares, breaking production with invisible changes, and creating a cottage industry of consultants who specialize in fixing Helm disasters. Three major versions later, Helm remains a solution in search of a problem, creating complexity where none should exist.

## The Original Sin: Templating YAML

Helm's fundamental design flaw is treating YAML as a templating target. YAML is a data serialization format, not a programming language. Helm turns it into both, badly.

### The Templating Horror Show

What starts as simple YAML:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
```

Becomes a Helm template:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "myapp.fullname" . }}
  labels:
    {{- include "myapp.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount }}
  {{- if .Values.autoscaling.enabled }}
  {{- fail "Replicas should not be set when autoscaling is enabled" }}
  {{- end }}
  selector:
    matchLabels:
      {{- include "myapp.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      {{- with .Values.podAnnotations }}
      annotations:
        {{- toYaml . | nindent 8 }}
      {{- end }}
```

This isn't more maintainable—it's incomprehensible without executing the template.

### The Debugging Nightmare

When Helm templates fail:
- Error messages reference line numbers in generated YAML
- Template logic is scattered across multiple files
- Values come from multiple sources with precedence rules
- `helm template` output differs from `helm install` results
- Whitespace errors cause silent failures

Real error message:
```
error validating data: ValidationError(Deployment.spec.template.spec.containers[0]): 
missing required field "image"
```

Good luck finding which template, which condition, and which values combination caused this.

## The Values.yaml Disaster

Helm's `values.yaml` promises configuration management but delivers chaos:

### The Override Confusion

Values come from:
1. Chart's default `values.yaml`
2. User-supplied values files
3. `--set` command line arguments
4. `--set-string`, `--set-file`, `--set-json`
5. Parent chart values
6. Subchart values
7. Global values

Precedence rules that nobody remembers. Production breaks because someone used `--set` instead of `--set-string`.

### The Type System That Isn't

```yaml
# values.yaml
replicas: 3
enabled: true
port: "8080"  # String or number? Depends on the template!

# template
replicas: {{ .Values.replicas | int }}  # Hope it's a number
port: {{ .Values.port | quote }}         # Hope it's a string
```

No schema validation. No type checking. Just hope and prayer.

## The Dependency Hell

Helm dependencies create new problems:

### The Version Constraint Chaos

```yaml
dependencies:
  - name: postgresql
    version: "~10.3.0"
    repository: "https://charts.bitnami.com/bitnami"
```

But:
- Bitnami changes charts without notice
- Version constraints don't guarantee compatibility
- Chart repositories disappear (remember stable/?)
- Dependencies have their own dependencies
- Update one, break everything

### The Subchart Nightmare

Parent charts override subchart values:
```yaml
postgresql:
  auth:
    postgresPassword: supersecret
  persistence:
    size: 10Gi
```

But:
- Subchart structure changes between versions
- No warning when overrides become invalid
- Silent failures when values don't apply
- Debugging requires reading subchart source

## Real-World Helm Disasters

### Case Study 1: The Invisible Change

**Scenario**: Routine Helm upgrade
**Command**: `helm upgrade myapp ./chart`
**Result**: Production database wiped
**Cause**: Chart update changed PVC naming scheme
**Lesson**: Helm doesn't protect stateful resources

### Case Study 2: The Template Logic Bomb

**Scenario**: Complex conditional templates
**Template**:
```yaml
{{- if and .Values.persistence.enabled (not .Values.persistence.existingClaim) }}
{{- if not (empty .Values.persistence.storageClass) }}
storageClassName: {{ .Values.persistence.storageClass | quote }}
{{- end }}
{{- end }}
```
**Result**: StorageClass not set in certain conditions
**Impact**: Pods stuck in pending
**Debug time**: 6 hours

### Case Study 3: The Repository Apocalypse

**Scenario**: Stable repository deprecated
**Impact**: 
- Thousands of charts became unavailable
- CI/CD pipelines broke globally
- Frantic migration to different repositories
- Some charts lost forever

## The Three-Way Merge Fiction

Helm 3 promised better upgrades with three-way merge. Reality:

### What Actually Happens

1. Helm compares desired state, live state, and last applied
2. Kubernetes admission controllers modify resources
3. Operators and controllers add their changes
4. Helm gets confused
5. Manual intervention required

### The Rollback That Isn't

```bash
helm rollback myapp 1
```

What you expect: Previous version restored
What happens:
- ConfigMaps/Secrets might rollback
- PVCs definitely won't
- CRDs are ignored
- Some resources deleted
- Others orphaned

## The Security Theater

Helm's security model is fundamentally broken:

### Tiller's Ghost

Helm 2's Tiller was a security nightmare. Helm 3 removed it but:
- Charts still run as privileged users
- No sandboxing of template functions
- `lookup` function can read any cluster resource
- Charts can execute arbitrary template code
- No signing verification by default

### The Supply Chain Risk

- Anyone can publish charts
- No mandatory security scanning
- Popular charts have vulnerabilities
- Updates might introduce backdoors
- No way to audit what changed

## The Alternative Approaches

### 1. Plain YAML + Kustomize

```yaml
# base/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp

# overlays/prod/kustomization.yaml
patchesStrategicMerge:
- deployment-patch.yaml
```

Benefits:
- No templating
- Native Kubernetes feature
- Readable patches
- Git-friendly

### 2. Jsonnet/CUE

Actual programming languages for configuration:
- Type safety
- Real functions
- Proper abstractions
- Testable

### 3. Operators

Domain-specific operators:
- Encode operational knowledge
- Handle upgrades properly
- Manage lifecycle
- No templating needed

### 4. GitOps Tools

ArgoCD/Flux with plain manifests:
- Declarative
- Version controlled
- No client-side complexity
- Better security model

## Why Helm Persists

Despite its flaws, Helm survives because:

### 1. First Mover Advantage
- Early adoption created ecosystem lock-in
- Thousands of existing charts
- Organizational investment
- "Industry standard" momentum

### 2. Vendor Support
- Cloud providers offer Helm charts
- ISVs distribute software via Helm
- Marketplace integrations
- Professional support

### 3. Sunk Cost Fallacy
- Teams invested time learning Helm
- Existing charts represent work
- Migration seems harder than suffering
- "Devil you know" syndrome

## Recommendations

### If You Must Use Helm

1. **Keep templates minimal**: Less logic = fewer bugs
2. **Pin everything**: Exact versions only
3. **Test extensively**: Template output for all value combinations
4. **Avoid dependencies**: Package everything yourself
5. **Document extensively**: Future you needs help

### Better Alternatives

1. **Start with Kustomize**: Simpler, native, sufficient
2. **Consider operators**: For complex applications
3. **Use GitOps**: For deployment management
4. **Write tools**: Sometimes custom is simpler

## The Future Helm Doesn't Want

The Kubernetes ecosystem needs:
- Native package management in Kubernetes
- Strongly typed configuration languages
- Better abstraction mechanisms
- Simplified deployment models

Instead, we get Helm 4 promising more features nobody asked for.

## Conclusion

Helm represents everything wrong with the Kubernetes ecosystem: solving simple problems with complex solutions, creating abstractions that leak, and building tools that require other tools to manage them. It's the enterprise software of the cloud-native world—bloated, complex, and solving yesterday's problems badly.

The tragedy is that Kubernetes deployment could be simple. Instead of templating YAML, we could have better primitives. Instead of client-side complexity, we could have server-side intelligence. Instead of Helm, we could have something that actually works.

But we're stuck with Helm because switching costs are high, alternatives require learning, and the pain is distributed enough that no single team revolt. So we continue templating YAML, debugging template functions, and pretending that this is the best we can do.

The next time someone suggests Helm for your project, ask them to explain values precedence, three-way merge, and subchart overrides. Their stammering response will tell you everything about whether they understand the complexity they're advocating. Sometimes the best package manager is no package manager at all.