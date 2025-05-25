#!/bin/bash

# === Input parameters ===
DOCKER_USERNAME="$1"
TAG="${2:-latest}"  # Default to "latest" if not provided

# === Check for required arguments ===
if [ -z "$DOCKER_USERNAME" ]; then
  echo "Usage: $0 <docker-username-or-registry> [tag]"
  exit 1
fi

# === Define image paths ===
declare -A apps
apps[server]="./apps/server"
apps[web]="./apps/web"

# === Login first ===
echo "Logging into Docker Hub/Registry..."
docker login || { echo "Login failed"; exit 1; }

# === Loop through apps and build/push ===
for app in "${!apps[@]}"; do
  APP_PATH="${apps[$app]}"
  IMAGE_NAME="$DOCKER_USERNAME/woovi_playground_$app:$TAG"

  echo "Building image for $app from $APP_PATH..."
  docker build -t "$IMAGE_NAME" -f "$APP_PATH/Dockerfile" . --no-cache || { echo "Build failed for $app"; exit 1; }

  echo "Pushing $IMAGE_NAME..."
  docker push "$IMAGE_NAME" || { echo "Push failed for $app"; exit 1; }

  echo "Successfully pushed $IMAGE_NAME"
done

echo "All images pushed successfully!"
