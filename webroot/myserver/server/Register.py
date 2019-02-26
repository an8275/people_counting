#!/usr/bin/python
# -*- coding: utf8 -*-

import sys
import os
from common import *
from utils import *
import doDB
import uuid
from django.http import HttpResponse



def Register(request):
    s="?"+request.META['QUERY_STRING']
    url = getUrlData(s)
    print url

    print "Into RemoteConnect"


    ## TODO ##
    ## DO SSH Control ##

    '''
    print doDB.cfg
    db = doDB.sqldb(cfg=doDB.cfg)

    sql = "INSERT INTO `inoutnum` (`guid`, `innum`, `outnum`, `curtime`, `dataguid`, `deviceguid`) VALUES ('%s', %s, %s, '%s', '%s', '%s');"%(uuid.uuid1().hex, url['innum'], url['outnum'], url['curtime'], url['dataguid'], url['uuid'])
    #sql = "INSERT INTO inoutnum (guid, innum, outnum, curtime, dataguid, deviceguid) VALUES ('%s', %s, %s, '%s', '%s', '%s')"%(url['uuid'], url['innum'], url['outnum'], url['curtime'], url['dataguid'], url['uuid'])

    print "do_insert(%s)"%sql
    res = db.do_insert(sql)

    print "res:", res
    '''

    msg="JunYuFr_CustFlow_ReturnCode=0"

    #output.write(CONTENT_TYPE_HEAD)
    #output.write(msg)
    return HttpResponse(msg)
