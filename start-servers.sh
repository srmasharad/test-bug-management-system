#!/bin/bash

echo "Starting backend server..."
cd backend && npm start &
BACKEND_PID=$!

echo "Waiting for backend to start..."
sleep 5

echo "Starting frontend server..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo "Waiting for frontend to start..."
sleep 5

echo ""
echo "✅ Servers started!"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "Backend: http://localhost:3000"
echo "Frontend: http://localhost:5173"
echo ""
echo "To stop servers, run:"
echo "kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "Or use: ./stop-servers.sh"

echo "$BACKEND_PID" > .backend.pid
echo "$FRONTEND_PID" > .frontend.pid
