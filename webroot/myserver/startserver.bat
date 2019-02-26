@echo off
net stop apache2.2
net start apache2.2
C:
cd C:\Apache2.2\webroot\myserver
hidden.vbs

echo The service is started¡­.
pauses