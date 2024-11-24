#!/bin/bash
set -e

echo "Running load tests..."

# Backend Load Test
cd backend
npm install
echo "Running backend load tests..."
npx k6 run tests/load/load.test.js

# Frontend Load Test
cd ../frontend
npm install
echo "Running frontend load tests..."
npx k6 run tests/load/load.test.js

echo "Load tests completed!"
