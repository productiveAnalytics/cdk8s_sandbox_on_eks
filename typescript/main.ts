import { Construct } from 'constructs';
import { App, Chart, ChartProps } from 'cdk8s';

// imported constructs
import { KubeDeployment, KubeService, IntOrString } from './imports/k8s';

/**
 * CDK8S application 
 *    with simple webserver k8s nodes deployed on AWS EKS,
 *    front-ended by AWS LoadBalancer service
 * 
 * Author: ProductiveAnalytics
 */
export class MyChart extends Chart {

  constructor(scope: Construct, id: string, props: ChartProps = { }) {
    super(scope, id, props);

    // Refer: https://hub.docker.com/r/paulbouwer/hello-kubernetes/
    const DOCKER_IMG_VERSION = '1.10.1';
    const PREFIX = 'cdk8s-ts-on-eks';
    const label = { app: PREFIX }

    // define resources here
    const CDK_K8S_SERVICE_ID = (PREFIX + '-svc')
    new KubeService(this, CDK_K8S_SERVICE_ID, {
      spec: {
        type: 'LoadBalancer',
        ports: [ { port: 80, targetPort: IntOrString.fromNumber(8080) } ],
        selector: label
      }
    })

    const CDK_K8S_DEPLOYMENT_ID = (PREFIX + '-deployment')
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

const app = new App();
new MyChart(app, 'typescript');
app.synth();
