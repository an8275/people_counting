#!/usr/bin/python
# -*- coding: utf8 -*-

import sys
import os
from common import *
from utils import *
import doDB
import uuid
from django.http import HttpResponse



def AgeCounting(request):
    print "Into AgeCounting"

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

    ## 分析数据
    if data['sex'] == "1":
        sex = True  #  \0x01
    else:
        sex = False  #  \0x00

    age =  (int(data['minage'])+int(data['maxage']))/2

    print doDB.cfg
    db = doDB.sqldb(cfg=doDB.cfg)

    sql = "INSERT INTO `ageattr` (`guid`, `dataguid`, `sex`, `minage`, `age`, `maxage`, `deviceuuid`, `curtime`) VALUES ('%s', '%s', %s, %s, %d, %s, '%s','%s');"%\
        (uuid.uuid1().hex, data['dataguid'], sex, data['minage'], age, data['maxage'], data['uuid'], data['curtime'])

    print "do_insert(%s)"%sql
    res = db.do_insert(sql)

    print "res:", res

    msg="JunYuFr_CustFlow_ReturnCode=%d"%(ret)

    #output.write(CONTENT_TYPE_HEAD)
    #output.write(msg)
    return HttpResponse(msg)
