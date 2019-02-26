#!/usr/bin/python
# -*- coding: utf8 -*-

import sys
import os
from common import *
from utils import *
import doDB
import uuid
from django.http import HttpResponse


def CustCounting(request):
    print "Into CustCounting"
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

        msg="JunYuFr_CustFlow_ReturnCode=%d"%(ret)

        #output.write(CONTENT_TYPE_HEAD)
        #output.write(msg)
        #return
        return HttpResponse(msg)

    sql = "INSERT INTO `inoutnum` (`guid`, `innum`, `outnum`, `curtime`, `dataguid`, `deviceuuid`) VALUES ('%s', %s, %s, '%s', '%s', '%s');"%(uuid.uuid1().hex, data['innum'], data['outnum'], data['curtime'], data['dataguid'], data['uuid'])

    try:
        db = doDB.sqldb(cfg=doDB.cfg)
        print "do_insert(%s)"%sql
        res = db.do_insert(sql)
        print res
        ret = ret_code['success']
    except Exception,data:
        ret = ret_code['error_db']

    msg="JunYuFr_CustFlow_ReturnCode=%d"%(ret)

    #output.write(CONTENT_TYPE_HEAD)
    #output.write(msg)
    return HttpResponse(msg)

