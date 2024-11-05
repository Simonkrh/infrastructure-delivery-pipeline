# Infrastructure Delivery Pipeline

## OpenStack Heat Templates for IDATA2502 Portfolio

### Overview

This repository contains infrastructure-as-code templates used for deploying a multi-instance setup on OpenStack as part of the **IDATA2502 - Cloud Services Administration** portfolio assignment. These templates are written in YAML and use OpenStack's **Heat Orchestration Template (HOT)** format.

The primary template in this repository deploys:
- **One Windows Server instance** (Windows 10 22H2 Enterprise [Evaluation])
- **One Ubuntu Server instance** (Ubuntu Server 24.04 LTS)
- Both instances are provisioned with **1 vCPU and 4GB RAM**.
