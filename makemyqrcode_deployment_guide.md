# MakeMyQRCode Production Deployment Guide

## Stack Overview

| Component | Technology |
|---|---|
| Frontend | React + Vite + TypeScript |
| Backend | Django + Gunicorn |
| Database | MySQL 8 |
| Storage | MinIO (S3 Compatible) |
| Reverse Proxy | Nginx (aaPanel) |
| Process Manager | systemd |
| SSL | Let's Encrypt via aaPanel |

---

# 1. DOMAIN & DNS SETUP

## Required Domains

| Domain | Purpose |
|---|---|
| app.makemyqrcode.com | Main Application |
| qrstorage.makemyqrcode.com | MinIO Storage |

---

# 2. FRONTEND DEPLOYMENT (React + Vite)

## Frontend Path

```bash
/www/wwwroot/app.makemyqrcode.com/Make-My-QR/Frontend
```

## Install Dependencies

```bash
npm install
```

## Build Frontend

```bash
npm run build
```

Generated build folder:

```bash
dist/
```

---

# 3. MYSQL DATABASE SETUP

Create database in aaPanel:

- Database Name: `qrmaker`
- Username: `qrmaker`
- Password: `StrongPassword`

Example `.env` database config:

```env
DATABASE_NAME=qrmaker
DATABASE_USER=qrmaker
DATABASE_PASSWORD=StrongPassword
DATABASE_HOST=localhost
DATABASE_PORT=3306
```

---

# 4. DJANGO BACKEND DEPLOYMENT

## Backend Path

```bash
/www/wwwroot/app.makemyqrcode.com/Make-My-QR/Backend/QRmaker
```

## Create Virtual Environment

```bash
python3 -m venv venv
```

## Activate Virtual Environment

```bash
source venv/bin/activate
```

## Install Requirements

```bash
pip install -r requirements.txt
```

---

# 5. DJANGO .ENV CONFIGURATION

```env
SECRET_KEY=your-production-secret-key
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0,app.makemyqrcode.com

DATABASE_NAME=qrmaker
DATABASE_USER=qrmaker
DATABASE_PASSWORD=StrongPassword
DATABASE_HOST=localhost
DATABASE_PORT=3306

MINIO_ENDPOINT=127.0.0.1:9012
MINIO_SERVER_URL=https://qrstorage.makemyqrcode.com
MINIO_PUBLIC_URL=https://qrstorage.makemyqrcode.com/file
AWS_S3_CUSTOM_DOMAIN=qrstorage.makemyqrcode.com
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=qrmaker-files
MINIO_SECURE=True

FRONTEND_URL=https://app.makemyqrcode.com
BACKEND_URL=https://app.makemyqrcode.com
```

---

# 6. DJANGO SETTINGS FIX

Inside `QRmaker/settings.py`:

```python
from dotenv import load_dotenv
import os
import pymysql

load_dotenv()

pymysql.install_as_MySQLdb()

SECRET_KEY = os.getenv("SECRET_KEY")

if not SECRET_KEY:
    raise ValueError(
        "SECRET_KEY environment variable is required and must not be empty."
    )
```

---

# 7. RUN MIGRATIONS

```bash
python3 manage.py migrate
```

---

# 8. COLLECT STATIC FILES

```bash
python3 manage.py collectstatic
```

---

# 9. TEST GUNICORN

```bash
gunicorn QRmaker.wsgi:application --bind 0.0.0.0:9091
```

---

# 10. SYSTEMD SERVICE

Create:

```bash
sudo nano /etc/systemd/system/app.makemyqrcode.service
```

Service content:

```ini
[Unit]
Description=MakeMyQRCode Django Backend
After=network.target

[Service]
User=bgtdev
Group=bgtdev

WorkingDirectory=/www/wwwroot/app.makemyqrcode.com/Make-My-QR/Backend/QRmaker

ExecStart=/www/wwwroot/app.makemyqrcode.com/Make-My-QR/Backend/QRmaker/venv/bin/gunicorn QRmaker.wsgi:application --bind 127.0.0.1:9091

Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

Enable service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable app.makemyqrcode
sudo systemctl start app.makemyqrcode
```

---

# 11. NGINX CONFIGURATION

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:9091;

    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

location / {
    try_files $uri $uri/ /index.html;
}
```

---

# 12. MINIO DEPLOYMENT (DOCKER)

Create data directory:

```bash
mkdir -p /www/minio/data
```

Run MinIO:

```bash
docker run -d \
--name minio \
-p 9012:9000 \
-p 9013:9001 \
-v /www/minio/data:/data \
-e MINIO_ROOT_USER=minioadmin \
-e MINIO_ROOT_PASSWORD=minioadmin \
--restart unless-stopped \
quay.io/minio/minio server /data --console-address ":9001"
```

---

# 13. CREATE MINIO BUCKET

Open:

```text
http://SERVER-IP:9013
```

Login:

- Username: `minioadmin`
- Password: `minioadmin`

Create bucket:

```text
qrmaker-files
```

---

# 14. MAKE BUCKET PUBLIC

```bash
sudo docker exec -it minio mc alias set myminio http://localhost:9000 minioadmin minioadmin
```

```bash
sudo docker exec -it minio mc anonymous set public myminio/qrmaker-files
```

Verify:

```bash
sudo docker exec -it minio mc anonymous get myminio/qrmaker-files
```

---

# 15. STORAGE NGINX CONFIG

```nginx
location /file/ {

    proxy_pass http://127.0.0.1:9012/qrmaker-files/;

    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

---

# 16. RESTART BACKEND

```bash
sudo systemctl restart makemyqrcode
```

---

# 17. VERIFY STORAGE

Open:

```text
https://qrstorage.makemyqrcode.com/file/
```

Expected response:

```xml
<ListBucketResult>
```

---

# DEPLOYMENT COMPLETE

Infrastructure includes:

- React frontend
- Django backend
- Gunicorn + systemd
- MySQL database
- Dockerized MinIO
- SSL-enabled nginx
- Public S3-compatible storage
