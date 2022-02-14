# cdk8s on AWS EKS

Kubernetes development with cdk8s on AWS EKS. 

- Refer: EKSctl to deploy EKS cluster on AWS. Checkout: https://github.com/productiveAnalytics/EKS-cluster/blob/master/eks_cluster_using_eksctl_on_mac.sh

## Setup cdk8s:

Install cdk8s
```
npm install -g cdk8s-cli
```
OR on MacOs, ```brew install cdk8s```

Confirm installation of cdk8s
```
cdk8s --version
```

## Initialize project

```
mkdir -p cdk8s_sandbox_on_eks && cd cdk8s_sandbox_on_eks/
```

### For Typescript
```
mkdir typescript/ && cd typescript/
```

Create starter typescript project:
```
cdk8s init typescript-app
```

### For Python3, 
```
mkdir python/ && cd python/
```

Create starter python3 project:
```
python3 -m pip install pipenv
cdk8s init python-app
```

## Synthesize Kubernetes YAML

### Compile and Build for typescript:
```
npm run compile && cdk8s synth
```

Other useful commands:
```
   # Compile
   npm run compile     Compile typescript code to javascript (or "yarn watch")
   npm run watch       Watch for changes and compile typescript in the background
   npm run build       Compile + synth
   
   # Generate kubernetes YAML
   npm run synth       Synthesize k8s manifests from charts to dist/ (ready for 'kubectl apply -f')
```

### Compile and Build for python3:
```
cdk8s synth
```

## Deploy Kubernetes YAML
```
# Deploy YAML using kubect:
kubectl apply -f dist/
```

Check the deployment:
```
   kubectl get deployments
```

See the Kubernetes LoadBalancer Service:
```
  kubectl get services
```
