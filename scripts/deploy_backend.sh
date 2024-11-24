#!/bin/bash
set -e

# Read environment variables
BACKEND_IP=${BACKEND_IP:-}
PEM_KEY_PATH=${PEM_KEY_PATH:-"infrastructure-delivery-pipeline-key-pair.pem"}

if [ -z "$BACKEND_IP" ]; then
  echo "Error: BACKEND_IP is not set."
  exit 1
fi

echo "Deploying backend to $BACKEND_IP..."

ssh -o StrictHostKeyChecking=no -i "$PEM_KEY_PATH" ubuntu@"$BACKEND_IP" << 'EOF'
  sudo apt update
  sudo apt install -y nodejs npm
  mkdir -p /home/ubuntu/backend
EOF

scp -o StrictHostKeyChecking=no -i "$PEM_KEY_PATH" -r ./backend/* ubuntu@"$BACKEND_IP":/home/ubuntu/backend/

ssh -o StrictHostKeyChecking=no -i "$PEM_KEY_PATH" ubuntu@"$BACKEND_IP" << 'EOF'
  cd /home/ubuntu/backend
  npm install
  if lsof -t -i:8080; then
    sudo kill -9 $(lsof -t -i:8080)
  fi
  nohup node app.js > /home/ubuntu/backend/backend-server.log 2>&1 &
EOF

echo "Backend deployed successfully!"
