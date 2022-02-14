# cdk8s on AWS EKS

Kubernetes development with cdk8s on AWS EKS. 

- Refer: EKSctl to deploy EKS cluster on AWS. Checkout: https://github.com/productiveAnalytics/EKS-cluster/blob/master/eks_cluster_using_eksctl_on_mac.sh

## CDK8S Environment variables
export CDK8S_ENV_NAME='sbx'
export CDK8S_PREFIX='cdk8s-on-eks'
export CDK8S_NAMESPACE="cdk8s-eks-${CDK8S_ENV_NAME}"

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

## Ensure that namespace and fargate profile are created

### Create namespace
```
kubectl create namespace ${CDK8S_NAMESPACE}
```
OR
Use KubeCtl with JSON: ```kubectl apply -f properties/namespace_cdk8s-eks-sbx.json```

### Create Fargate Profile
eksctl create fargateprofile \
--namespace ${CDK8S_NAMESPACE} \
--name fp-cdk8s-${CDK8S_ENV_NAME} \
--cluster laap-eks-ue1-linear-cluster-sbx \
--labels app=${CDK8S_PREFIX},environment=${CDK8S_ENV_NAME},language='typescript'

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
