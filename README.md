# Infrastructure Delivery Pipeline

## Project for the course [IDATA2502 Cloud services administration](https://www.ntnu.edu/studies/courses/IDATA2502) at NTNU

### Overview
This project implements an infrastructure delivery pipeline using OpenStack and includes both a frontend and backend application for a simple shopping list. The pipeline automates the deployment and testing of the application components and manages communication between the frontend and backend servers.

The primary **template.yaml** file in this repository is responsible for deploying:
- **One Ubuntu Server instance** for the frontend (Ubuntu Server 24.04 LTS)
- **One Ubuntu Server instance** for the backend (Ubuntu Server 24.04 LTS)
- Both instances are provisioned with **1 vCPU and 3GB RAM**.

The **update-openstack.yaml** file is used to update the infrastructure stack and servers created from the **template.yaml** file in OpenStack.

## Running the CI/CD Pipeline Locally
Because of network restrictions within NTNU, GitHub Actions cannot directly interact with the OpenStack server. For that reasons, this project uses [**act.exe**](https://github.com/nektos/act?tab=readme-ov-file) (a locally-run GitHub Actions tool) to simulate the CI/CD pipeline locally. When connected to the NTNU netowrk, `act.exe` will execute the pipeline steps in the same way as GitHub Actions but without relying on GitHub's servers, making it compatible with the OpenStack environment at NTNU.

## Features

- **Frontend**: 
  - A simple web interface for managing the shopping list.
  - Communicates with the backend through a proxy server, streamlining the fetching and updating of the shopping list items.

- **Backend**:
  - An API built with Express.js and MySQL that manages shopping list item data.
  - Brodcasts updates to connected clients via WebSockets so that all users have the latest information.

- **Infrastructure**:
  - Infrastructure as Code (IaC) leveraging OpenStack Heat templates for the deployment of the application environment.
  - Continuous Integration/Continuous Deployment (CI/CD) integration with GitHub Actions for automated and reliable deployment processes.
 
- **Tests**:
  - **Automated Low-Level Tests**
    - **YAML Linting**: Validates the syntaxing and formating of the `template.yaml` file using `yamllint`.
    - **JSON Validation**: Uses `jq` to validate the syntaxing and formating of `package.json` files in both frontend and backend directories. 
    - **Dependency Validation**: Runs `npm install` to verify that all dependencies specified in `package.json` files for the frontend and backend are correct and can be installed without any errors.
    - **JavaScript Linting**: Uses ESLint with a simple style guide to maintain a good and consistent code quality and styling in the JavaScript files. 
    - **Security Vulnerability Scanning**: Conducts a security audit using `npm audit --audit-level=high` for both the frontend and the backend which identifies any high-severity vulnerabilities in the dependencies.

