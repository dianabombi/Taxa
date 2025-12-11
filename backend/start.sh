#!/bin/bash
# Startup script for Railway deployment

# Use Railway's PORT or default to 8080
PORT=${PORT:-8080}

# Start uvicorn
uvicorn main:app --host 0.0.0.0 --port $PORT
