# Infrastructure Delivery Pipeline

## Project for IDATA2502 Portfolio

### Overview
This project implements an infrastructure delivery pipeline using OpenStack and includes both a frontend and backend application for a simple shopping list. The pipeline automates the deployment of application components and manages communication between the frontend and backend servers.

The primary **template.yaml** file in this repository is responsible for deploying:
- **One Ubuntu Server instance** for the frontend (Ubuntu Server 24.04 LTS)
- **One Ubuntu Server instance** for the backend (Ubuntu Server 24.04 LTS)
- Both instances are provisioned with **1 vCPU and 4GB RAM**.

The **update-openstack.yaml** file is used to update the infrastructure stack and servers created from the **template.yaml** file in OpenStack.

## Features

- **Frontend**: 
  - A simple web interface for managing the shopping list.
  - Communicates with the backend through a proxy server, streamlining the fetching and updating of the shopping list items.

- **Backend**:
  - An API built with Express.js and MySQL that manages shopping list item data.
  - Real-time broadcasting of updates to connected clients via WebSockets, ensuring all users have the latest information.

- **Infrastructure**:
  - Infrastructure as Code (IaC) leveraging OpenStack Heat templates for the deployment of the application environment.
  - Continuous Integration/Continuous Deployment (CI/CD) integration with GitHub Actions for automated and reliable deployment processes.
