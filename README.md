# Infrastructure Delivery Pipeline

## Project for the course [IDATA2502 Cloud services administration](https://www.ntnu.edu/studies/courses/IDATA2502) at NTNU

This project implements an infrastructure delivery pipeline using OpenStack and includes both a frontend and backend application for a simple shopping list. The pipeline automaticly handles the deployment, testing, and updates for a simple shopping list application, using both a frontend and a backend. It leverages Infrastructure as Code (IaC) principles, continuous integration, and continuous deployment (CI/CD) practices.

## Overview

### Infrastructure
The infrastructure is running on OpenStack using a Heat template **template.yaml** and includes
- **One Ubuntu Server instance** for the frontend (Ubuntu Server 24.04 LTS)
- **One Ubuntu Server instance** for the backend (Ubuntu Server 24.04 LTS)
- Both instances are provisioned with **1 vCPU and 3GB RAM**.

### CI/CD Pipeline
The CI/CD pipeline is defined by the **update-openstack.yaml** workflow file and automates the following:
1. Linting and validation of infrastructure and application code.
2. Running automated tests for both backend and frontend.
3. Deploying application components to OpenStack instances.
4. Load testing to ensure performance under stress.

## Key Features

- **Frontend**: 
  - A simple web interface for managing the shopping list.
  - Developed using HTML, JavaScript, and Node.js.
  - Communicates with the backend server via RESTful APIs.
  - Hosted on an Ubuntu instance.

- **Backend**:
  - An API built with Express.js and MySQL that manages shopping list item data.
  - Provides an API for CRUD operations on shopping list items
  - Brodcasts updates to connected clients via WebSockets to ensure real-time synchronization across clients.
  - Hosted on a separate Ubuntu instance.

- **Infrastructure**:
  - Infrastructure as Code (IaC) leveraging OpenStack Heat templates for the deployment of the application environment.
  - Continuous Integration/Continuous Deployment (CI/CD) integration with GitHub Actions for automated and reliable deployment processes.
 
- **Pipeline**
  - **Self-hosted Runner**: A self-hosted GitHub Actions runner is deployed on an OpenStack instance, enabling pipeline execution within NTNU's network. This is because of the restriction of OpenStack accessibility from the external     GitHub-hosted runners.
  - **Locally Executable**: The pipeline can also be executed locally using [**act.exe**](https://github.com/nektos/act?tab=readme-ov-file) (a locally-run GitHub Actions tool) to simulate the CI/CD pipeline locally.

## Testsing Strategy
### Automated Tests
1. Linting and Validation:
    - **YAML Linting**: Validates the syntaxing and formating of the `template.yaml` file using `yamllint`.
    - **JSON Validation**: Uses `jq` to validate the syntaxing and formating of `package.json` files in both frontend and backend directories. 
    - **Dependency Validation**: Runs `npm install` to verify that all dependencies specified in `package.json` files for the frontend and backend are correct and can be installed without any errors.
    - **JavaScript Linting**: Uses `ESLint` with a simple style guide to maintain a good and consistent code quality and styling in the JavaScript files.
2. Backend Testing:
    - **Unit Tests**: Validates individual backend components.
    - **Integration Tests**: Tests the interaction between the backend API and the MySQL database.
3. Frontend-Backend Testing:
    - **End-to-End (E2E) Tests**: Ensures components on the frontend functions as expected when interacting with the backend.
4. Load Testing
    - Uses `k6` to evaluate the application’s performance with simulating 10 concurrent users accessing the application for 30 seconds.

### Security
- **Security Vulnerability Scanning**: Conducts a security audit using `npm audit --audit-level=high` for both the frontend and the backend which identifies any high-severity vulnerabilities in the dependencies.
- **OpenStack Security Groups**: Security group rules are configured to allow only necessary traffic. Client can only access the frontend, while the frontend uses a private connection to the backend. 

