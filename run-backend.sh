#!/bin/bash
cd "$(dirname "$0")/Backend/QRmaker"
nohup python manage.py runserver 8010 > ../backend.log 2>&1 &
echo "Backend started on port 8010 (PID: $!)"
