
## Install Apache 



## Python configuration :

### Install Django : 

    cd src/ 
    sudo python ez_setup.py
    cd Django-1.7.1
    sudo python setup.py install

### Install MySql


    sudo apt-get update
    sudo apt-get install mysql-server
    sudo ufw allow mysql
    mysql_secure_installation
    Y/N  ? N 
    
    sudo mysql
    mysql-> SELECT user,authentication_string,plugin,host FROM mysql.user;

    mysql-> ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '1204geneve';
    mysql-> FLUSH PRIVILEGES;


    mysql-> \. creat_custcount.sql 




Library :

    sudo apt-get install libmysqlclient-dev

### Install python-mysql module

    sudo apt install python-pip
    pip install mysqlclient
    sudo pip install mysql-python
    pip install reportlab
    python manage.py runserver 8000

## start 1st server:
cd src/webroot/myserver
python manage.py migrate
python manage.py runserver 8000


## Apache Configuration :

sudo a2enmod proxy proxy_http
sudo service apache2 restart




Add this line into following file : /etc/apache2/ports.conf
    Listen 8686


Create new file /etc/apache2/sites-available/hpc.conf :

```
<VirtualHost *:8686>
        ServerName localhost:8686

        ServerAdmin webmaster@localhost
        DocumentRoot /var/www/HPC008/src/webroot

        <Directory /var/www/HPC008/src/webroot>
           Options Indexes FollowSymLinks
           Require all granted
        </Directory>

        <IfModule dir_module>
            DirectoryIndex index.html login.html index.php
        </IfModule>

        ErrorLog ${APACHE_LOG_DIR}/hpc.error.log
        CustomLog ${APACHE_LOG_DIR}/hpc.access.log combined

        ProxyPass /servlet http://localhost:8000/servlet
        ProxyPass /CustCount http://localhost:8000/servlet
</VirtualHost>
```