for /f "tokens=5" %%i in ('"netstat -ano | findstr 8000"') do  (
   if %%i gtr 0 taskkill /f /pid %%i /t)

C:
cd C:\Apache2.2\webroot\myserver
python manage.py runserver 8000
