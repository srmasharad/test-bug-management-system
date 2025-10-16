#!/bin/bash

echo "Stopping servers..."

if [ -f .backend.pid ]; then
    BACKEND_PID=$(cat .backend.pid)
    kill $BACKEND_PID 2>/dev/null && echo "Backend stopped (PID: $BACKEND_PID)"
    rm .backend.pid
fi

if [ -f .frontend.pid ]; then
    FRONTEND_PID=$(cat .frontend.pid)
    kill $FRONTEND_PID 2>/dev/null && echo "Frontend stopped (PID: $FRONTEND_PID)"
    rm .frontend.pid
fi

lsof -ti:3000 | xargs kill -9 2>/dev/null && echo "Killed process on port 3000"
lsof -ti:5173 | xargs kill -9 2>/dev/null && echo "Killed process on port 5173"

echo "✅ All servers stopped!"
