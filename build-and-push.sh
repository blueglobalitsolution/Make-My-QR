#!/bin/bash

set -e

REGISTRY="bgtuser"
BACKEND_IMAGE="make-my-qr-backend"
FRONTEND_IMAGE="make-my-qr-frontend"

echo "========================================="
echo "Building and pushing latest images"
echo "========================================="

# Show local code status
echo ""
echo "=== Local Code Status ==="
echo "Backend files:"
ls -la Backend/QRmaker/*.py 2>/dev/null | head -5 || echo "No Python files found"
echo ""
echo "Frontend files:"
ls -la Frontend/*.tsx 2>/dev/null | head -5 || echo "No TSX files found"
echo ""

echo "Building backend image..."
docker build --no-cache -t "${REGISTRY}/${BACKEND_IMAGE}:latest" -f Dockerfile.backend .

echo "Building frontend image..."
docker build --no-cache -t "${REGISTRY}/${FRONTEND_IMAGE}:latest" -f Dockerfile.frontend .

echo ""
echo "=== Verifying build ==="
echo "Backend image contents:"
docker run --rm "${REGISTRY}/${BACKEND_IMAGE}:latest" ls -la /app/ | head -10

echo ""
echo "Frontend image contents (checking for superadmin code):"
docker run --rm "${REGISTRY}/${FRONTEND_IMAGE}:latest" grep -r "superadmin" /usr/share/nginx/html/ || echo "Note: superadmin might be minified in production build"

echo ""
echo "Pushing to Docker Hub..."
echo "Pushing backend..."
docker push "${REGISTRY}/${BACKEND_IMAGE}:latest"

echo "Pushing frontend..."
docker push "${REGISTRY}/${FRONTEND_IMAGE}:latest"

echo ""
echo "========================================="
echo "Done! Images pushed:"
echo "  - ${REGISTRY}/${BACKEND_IMAGE}:latest"
echo "  - ${REGISTRY}/${FRONTEND_IMAGE}:latest"
echo "========================================="
echo ""
echo "To deploy on aapanel:"
echo "1. Go to your container settings"
echo "2. Click 'Update' or 'Pull Latest'"
echo "3. Stop and restart the container"
echo ""
echo "To deploy via docker-compose:"
echo "  docker-compose down && docker-compose pull && docker-compose up -d"