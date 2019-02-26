#!/usr/bin/python
# -*- coding: utf8 -*-

import sys
import os
from common import *
from utils import *
import doDB
import uuid
from django.http import HttpResponse

def ssh_connect_allow_check(uuid):
    ''' def ssh_connect_allow_check(uuid): 是否允许ssh连接
    返回：True允许，False不允许
    '''
    allow_connected = False

    db = doDB.sqldb(cfg=doDB.cfg)

    sql = "select * from connect_device where deviceuuid='%s'"%(uuid)

    res = db.do_select(sql)

    if res[0] > 0:
        allow_connected = True

    db.sqldb_close()

    return  allow_connected

def RemoteConnect(request):
    '''
    参数说明：参数间以地址符“&”间隔
    uuid：唯一识别码字符串，标记设备
    isconnect:true/false， 用于区别是请求远程连接还是请求远程断开
    
    返回结果：
    JunYuFr_CustFlow_ReturnCode=返回码 
    
    返回说明：
    1;//如果请求的是连接，那么1表示允许连接。如果请求的是断开，1表示允许断开。
    0:/如果请求的是连接，那么0表示不连接。如果请求的是断开，0表示不断开。
    -1;//程序内部错误或未知错误
    -2;//参数错误或参数格式错误
    -3;//数据库连接错误
    -4;//数据库其他错误
    
    调用例子:
    请求
    http://localhost:9080/CustCount/servlet/RemoteConnectServlet?uuid=e5f57fdc-5e78-4bc1-9d37-255ecb1eaa95&isconnect=true 
    返回
    JunYuFr_CustFlow_ReturnCode=0
    '''
    print "Into RemoteConnect"

    ret = ret_code['error']
    '''
    post_data  = {}
    if bodysize > 0:
        body = input.read(bodysize)
        post_data = body_parse(body)
    '''
    s="?"+request.META['QUERY_STRING']
    get_data = getUrlData(s)
    #get_data = getUrlData(env)

    print "get_data", get_data
    #print "post_data", post_data

    if 'uuid' in get_data:
        data = get_data
    #elif 'uuid' in post_data:
        #data = post_data
    else:
        ret = ret_code['error_para']

    ## DO SSH Control ##
    allow_connect = ssh_connect_allow_check(data['uuid']) 

    '''
    1;//如果请求的是连接，那么1表示允许连接。如果请求的是断开，1表示允许断开。
    0:/如果请求的是连接，那么0表示不连接。如果请求的是断开，0表示不断开。
    '''
    ## 请求连接
    if data['isconnect'] == "true":
        if allow_connect is True:
            ret = 1
        else:
            ret = 0
    ## 请求断开
    else:
        if allow_connect is False:
            ret = 1
        else:
            ret = 0
        
    msg="JunYuFr_CustFlow_ReturnCode=%d"%(ret)

    #output.write(CONTENT_TYPE_HEAD)
    #output.write(msg)
    return HttpResponse(msg)
