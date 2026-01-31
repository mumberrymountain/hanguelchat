#!/bin/bash
set -euo pipefail

apt-get update

apt-get install -y git curl ca-certificates gnupg lsb-release

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update

apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

systemctl enable docker
systemctl start docker

usermod -aG docker ubuntu

KUBECTL_VERSION="${KUBECTL_VERSION:-v1.30.0}"
curl -LO "https://dl.k8s.io/release/${KUBECTL_VERSION}/bin/linux/amd64/kubectl"
curl -LO "https://dl.k8s.io/release/${KUBECTL_VERSION}/bin/linux/amd64/kubectl.sha256"
echo "$(cat kubectl.sha256)  kubectl" | sha256sum -c -
install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
rm -f kubectl kubectl.sha256

kubectl version --client

# Helm 설치
HELM_VERSION="${HELM_VERSION:-v3.14.0}"
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
chmod 700 get_helm.sh
./get_helm.sh --version ${HELM_VERSION}
rm -f get_helm.sh

helm version

# nginx Ingress Controller 설치
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

# nginx Ingress Controller를 NodePort 타입으로 설치
# ALB target group이 EC2 인스턴스의 30080 포트를 타겟으로 하도록 설정 필요
helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  --set controller.service.type=NodePort \ 
  --set controller.service.nodePorts.http=30080 \
  --wait \
  --timeout 5m
