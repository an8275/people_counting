#!/usr/bin/python
# -*- coding: utf8 -*-
# 常量定义

OPT_ADD     = 1
OPT_MODIFY  = 2
OPT_INSERT  = 3
OPT_DEL     = 4

#CONF_FILE="/var/lib/tomcat7/webapps/CustFlow/settings.ini"
CONF_FILE="../config/settings.ini"

DROP_SSH_CONNECT="../config/drop_remote_ssh_connect.sh"


# HTTP const
CONTENT_TYPE_HEAD="Content-Type: text/plain\r\n\r\n"


# 设备超时离线时间
DEVICE_MAX_TIMEOUT = 300

#上传返回值
ret_code = {
    'success': 0,
    'error': -1,
    'error_para': -2,
    'error_db_connect': -3,
    'error_db': -4
}
