#!/usr/bin/python
# -*- coding: utf8 -*-

import sys
import os
from common import *
from utils import *
import doDB
import uuid
from django.http import HttpResponse

def get_device_info(uuid=None):
    ''' get_device_info(uuid=uuid): 或获取设备信息
    '''
    device_info = {}

    if uuid is None:
        return device_info
        
    # DB init
    db = doDB.sqldb(cfg=doDB.cfg)

    sql_cust = "select * from device_cust where 1"
    sql_age = "select * from device_cust where 1"

    if uuid is not None:
        sql_cust += " and uuid='%s'"%(uuid)
        sql_age += " and uuid='%s'"%(uuid)

    res = db.do_select(sql_cust)

    if res[0] > 0:
        device_info = res[1][0]
    else:
        res = db.do_select(sql_age)

        if res[0] > 0:
            device_info = res[1][0]

    return device_info
    

def HeartBeat(request):
    print "Into HeartBeat"

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

    device_info = get_device_info(uuid=data['uuid'])

    print "device_info", device_info

    print "len device_info=", len(device_info)

    if len(device_info) == 0:
        msg="JunYuFr_CustFlow_ReturnCode=%d"%(ret_code['error_para'])

    else:
        lastcontime = get_time()

        print "lastcontime", lastcontime

        sql_update = "update device_update set ip='%s', cpurate=%s, lastcontime='%s' where deviceuuid='%s'"%(data['ip'], data['cpu'], lastcontime, data['uuid'])
        sql_insert = "insert into  device_update (guid, deviceuuid, deviceguid, proguid, ip, cpurate, lastcontime) values ('%s', '%s', '%s', '%s', '%s', %s, '%s')"%(uuid.uuid1().hex, data['uuid'], device_info['guid'], device_info['proguid'], data['ip'], data['cpu'], lastcontime)

        print "sql_update", sql_update
        print "sql_insert", sql_insert
    
        try:
            # DB init
            db = doDB.sqldb(cfg=doDB.cfg)

            res = db.do_update(sql_update)

            #print "update:", res

            if res[0] > 0:
                ret = ret_code['success']
            else:
                res = db.do_insert(sql_insert)
                #print "insert", res

                if res[0] > 0:
                    ret = ret_code['success']
                else:
                    ret = ret_code['error_db']
        except Exception,data:
            ret = ret_code['error_db']

    msg="JunYuFr_CustFlow_ReturnCode=%d"%(ret)

    #output.write(CONTENT_TYPE_HEAD)
    #output.write(msg)
    return HttpResponse(msg)
