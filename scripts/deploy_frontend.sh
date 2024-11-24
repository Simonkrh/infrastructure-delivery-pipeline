#!/bin/bash
set -e

# Read environment variables
FRONTEND_IP=${FRONTEND_IP:-}
PEM_KEY_PATH=${PEM_KEY_PATH:-"infrastructure-delivery-pipeline-key-pair.pem"}

if [ -z "$FRONTEND_IP" ]; then
  echo "Error: FRONTEND_IP is not set."
  exit 1
fi

echo "Deploying frontend to $FRONTEND_IP..."

ssh -o StrictHostKeyChecking=no -i "$PEM_KEY_PATH" ubuntu@"$FRONTEND_IP" << 'EOF'
  sudo apt update
  sudo apt install -y nodejs npm
  mkdir -p /home/ubuntu/frontend
EOF

scp -o StrictHostKeyChecking=no -i "$PEM_KEY_PATH" -r ./frontend/* ubuntu@"$FRONTEND_IP":/home/ubuntu/frontend/

ssh -o StrictHostKeyChecking=no -i "$PEM_KEY_PATH" ubuntu@"$FRONTEND_IP" << 'EOF'
  cd /home/ubuntu/frontend
  npm install
  if lsof -t -i:8080; then
    sudo kill -9 $(lsof -t -i:8080)
  fi
  nohup node frontend-server.js > /home/ubuntu/frontend/frontend-server.log 2>&1 &
EOF

echo "Frontend deployed successfully!"
