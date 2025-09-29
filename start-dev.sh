#!/bin/bash

# StillPoint Astro Development Server
# Quick start script for local development

# Set up Node.js environment
export PATH="/home/walub/.local/share/fnm:$PATH"
eval "$(fnm env)"
fnm use v22.20.0

# Change to Astro directory and start dev server
cd astro-dev-site
echo "Starting Astro development server..."
echo "Local: http://localhost:4321/"
echo "Press Ctrl+C to stop"
npm run dev