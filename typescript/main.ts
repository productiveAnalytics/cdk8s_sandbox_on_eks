import { Construct } from 'constructs';
import { App, Chart, ChartProps } from 'cdk8s';

// imported constructs
import { KubeDeployment, KubeService, IntOrString } from './imports/k8s';

// REPLACE name of environment as per AWS account
const K8S_ENV = 'sbx'; // environment = { sbx, dev, test, prod }

const K8S_NAMESPACE = 'default'; // 'cdk8s-eks-'+K8S_ENV
const K8S_PREFIX = 'cdk8s-on-eks';

/**
 * CDK8S application 
 *    with simple webserver k8s nodes deployed on AWS EKS,
 *    front-ended by AWS LoadBalancer service
 * 
 * Author: ProductiveAnalytics
 */
export class MyCdk8sChart extends Chart {

  constructor(scope: Construct, id: string, props: ChartProps = { }) {
    super(scope, id, props);

    // Refer: https://hub.docker.com/r/paulbouwer/hello-kubernetes/
    const DOCKER_IMG_VERSION = '1.10.1';
    const label = (props && props.labels) ? props.labels : { app: K8S_PREFIX }

    // define resources here
    const CDK_K8S_SERVICE_ID = (K8S_PREFIX + '-svc')
    new KubeService(this, CDK_K8S_SERVICE_ID, {
      spec: {
        type: 'LoadBalancer',
        ports: [ { port: 80, targetPort: IntOrString.fromNumber(8080) } ],
        selector: label
      }
    })

    const CDK_K8S_DEPLOYMENT_ID = (K8S_PREFIX + '-deployment')
    new KubeDeployment(this, CDK_K8S_DEPLOYMENT_ID, {
      spec: {
        selector: {
          matchLabels: label
        },
        replicas: 3,
        template: {
          metadata: { labels: label },
          spec: {
            containers: [
              {
                name: 'hello-kubernetes',
                image: 'paulbouwer/hello-kubernetes:'+DOCKER_IMG_VERSION,
                ports: [ { containerPort: 8080 } ]
              }
            ]
          }
        }
      }
    })
  }
}

console.log('[DEBUG] ENV='+ K8S_PREFIX)
console.log('[DEBUG] NAMESPACE='+ K8S_NAMESPACE)

const app = new App( {
    outdir: 'dist'
  }
);

const cdk8s_chart:Chart = new MyCdk8sChart(app, 'k8s-typescript', {
    labels: {
      app: K8S_PREFIX,
      environment: K8S_ENV,
      language: 'typescript'
    },
    // Create k8s namespace in advance
    //    kubectl create namespace cdk8s-eks-sbx
    //    OR
    //    kubectl apply -f properties/namespace_cdk8s-eks-sbx.json
    namespace: K8S_NAMESPACE
  }
);
app.synth();

console.log('[DEBUG] Deployed K8S '+ cdk8s_chart.toJson())
