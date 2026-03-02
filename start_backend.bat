@echo off
cd /d "%~dp0"
call makemyqr\Scripts\activate
cd QRmaker
python manage.py runserver 0.0.0.0:8010
pause
