#!/bin/bash
cd "$(dirname "$0")/Frontend"
nohup npm run dev -- --port 3010 --strict-port > ../frontend.log 2>&1 &
echo "Frontend started on port 3010 (PID: $!)"
