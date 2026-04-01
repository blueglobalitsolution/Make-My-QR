#!/bin/bash

set -e

echo "========================================="
echo "Deploying Make-My-QR to Production"
echo "========================================="

echo "Checking current containers..."
docker-compose ps

echo ""
echo "Stopping containers..."
docker-compose down

echo ""
echo "Removing all containers (force fresh start)..."
docker rm -f $(docker ps -aq) 2>/dev/null || true

echo ""
echo "Pulling latest images..."
docker-compose pull --no-parallel

echo ""
echo "Starting containers fresh..."
docker-compose up -d

echo ""
echo "Waiting for containers to start..."
sleep 5

echo ""
echo "========================================="
echo "Deployment complete!"
echo "========================================="
echo ""
echo "Current status:"
docker-compose ps

echo ""
echo "Check logs if needed:"
echo "  docker-compose logs -f backend"
echo "  docker-compose logs -f frontend"