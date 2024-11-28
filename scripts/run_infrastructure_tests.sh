#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status.

echo "Starting infrastructure tests..."

# Verify stack existence and status
STACK_NAME="infrastructure-delivery-pipeline-stack"
STACK_STATUS=$(openstack stack show $STACK_NAME -f value -c stack_status)

if [[ "$STACK_STATUS" != "CREATE_COMPLETE" && "$STACK_STATUS" != "UPDATE_COMPLETE" ]]; then
    echo "Error: Stack $STACK_NAME is not in a COMPLETE state. Current state: $STACK_STATUS"
    exit 1
fi
echo "Stack $STACK_NAME is in $STACK_STATUS state."

# Validate the number of instances in the stack
EXPECTED_INSTANCE_COUNT=2
INSTANCE_NAMES=("BackendServer" "FrontendServer")
ACTUAL_INSTANCE_COUNT=0

for INSTANCE_NAME in "${INSTANCE_NAMES[@]}"; do
    INSTANCE_STATUS=$(openstack server show $INSTANCE_NAME -f value -c status || echo "NOT_FOUND")
    if [[ "$INSTANCE_STATUS" == "ACTIVE" ]]; then
        ACTUAL_INSTANCE_COUNT=$((ACTUAL_INSTANCE_COUNT + 1))
    else
        echo "Error: Instance $INSTANCE_NAME is not ACTIVE. Current status: $INSTANCE_STATUS"
        exit 1
    fi
done

if [[ $ACTUAL_INSTANCE_COUNT -ne $EXPECTED_INSTANCE_COUNT ]]; then
    echo "Error: Expected $EXPECTED_INSTANCE_COUNT instances, but found $ACTUAL_INSTANCE_COUNT."
    exit 1
fi
echo "All instances are ACTIVE as expected."

# Verify network resources
NETWORK_NAME="infrastructure-delivery-pipeline-network"
NETWORK_EXISTS=$(openstack network show $NETWORK_NAME -f value -c id || echo "NOT_FOUND")
if [[ "$NETWORK_EXISTS" == "NOT_FOUND" ]]; then
    echo "Error: Network $NETWORK_NAME does not exist."
    exit 1
fi
echo "Network $NETWORK_NAME exists."

# Verify security groups
SECURITY_GROUPS=("infrastructure-delivery-pipeline-security-group-frontend" "infrastructure-delivery-pipeline-security-group-backend")
for SECURITY_GROUP in "${SECURITY_GROUPS[@]}"; do
    SECURITY_GROUP_EXISTS=$(openstack security group show $SECURITY_GROUP -f value -c id || echo "NOT_FOUND")
    if [[ "$SECURITY_GROUP_EXISTS" == "NOT_FOUND" ]]; then
        echo "Error: Security group $SECURITY_GROUP does not exist."
        exit 1
    fi
    echo "Security group $SECURITY_GROUP exists."
done

echo "All infrastructure tests passed successfully."
