#!/bin/bash

# Ensure Tailwind CSS is properly processed
echo "Building CSS..."
npx tailwindcss -i ./src/app/globals.css -o ./src/app/output.css

# Run Next.js build
echo "Building Next.js app..."
npm run build

echo "Build completed!"
