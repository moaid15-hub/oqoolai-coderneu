#!/bin/bash

# Build all packages
echo "🔨 Building OqoolAI Monorepo..."

# Build shared first (dependencies)
echo "📦 Building shared packages..."
npm run build --workspace=packages/shared

# Build CLI
echo "🖥️  Building CLI..."
npm run build --workspace=packages/cli

# Build Cloud Editor
echo "☁️  Building Cloud Editor..."
npm run build --workspace=packages/cloud-editor

echo "✅ Build completed successfully!"