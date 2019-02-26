#!/usr/bin/python
# -*- coding: utf8 -*-
from django.http import HttpResponse
from utils import *
from common import *
import json
import doDB



def Login2(request):
    #print request   
    #print request.META['QUERY_STRING']
    s="?"+request.META['QUERY_STRING']
    url = getUrlData(s)
    print url    
    return HttpResponse("Hello")
def Login(request):
    print "Into Login"
    s="?"+request.META['QUERY_STRING']
    print s
    url = getUrlData(s)
    #url = getUrlData(env)

    print "Into Login:", url

    # 1. 读取管理员账户信息
    print CONF_FILE
    cfg = get_server_cfg(CONF_FILE)


    ## 2. 用户认证
    msg={}
    msg['isSuccess']=False
    
    if 'username' in url and 'userpwd' in url and 'adminname' in cfg and 'adminpwd' in cfg:
        #### 2.1 管理员认证
        if url['username'] == cfg['adminname'] and url['userpwd'] == cfg['adminpwd']:
        #{"userName":"admin","isAdmin":true,"isSuccess":true}
            msg['userName']=url['username']
            msg['isAdmin']=True
            msg['isSuccess']=True
        #### 2.2 项目用户认证
        else:
        #{"proName":"\346\235\276\346\261\237\351\253\230\347\247\221\346\212\200\345\233\255\345\214\272","proGuid":"5A6D2D1B-6E84-4B83-9107-07D18D120D69","userName":"test","isAdmin":false,"isSuccess":true,"userGuid":"5D3609B4-9A7B-419B-9A15-41BB622E4575"
            db = doDB.sqldb(cfg=doDB.cfg)

            sql = "select a.username as userName, a.guid as userGuid,a.currencytype as currencytype, b.guid as proGuid, b.name as proName, a.starttime as startTimeGap,\
a.endtime as endTimeGap from userinfo as a left join project as b  on a.proguid=b.guid where b.isusable=1 and a.username='%s' and a.userpwd='%s';"\
%(url['username'], url['userpwd'])
            print 'sql**',sql
            res = db.do_select(sql)
            print 'res**',res

            if res[0] > 0:
                msg['isAdmin']=False
                msg['isSuccess']=True

                for item in ['userName', 'userGuid','currencytype', 'proGuid', 'proName','startTimeGap','endTimeGap']:
                    msg[item]=res[1][0][item]
    
    ## 3. Output
    #output.write(CONTENT_TYPE_HEAD)
    #output.write(json.dumps(msg))
    return HttpResponse(json.dumps(msg))

def LogOut(request):
    msg="SUCCESS"
    print msg
    ## 1. Output utf8
    #output.write(CONTENT_TYPE_HEAD)
    #output.write(msg)
    return HttpResponse(msg)

def ModifyPwdCust(request):
    ''' ModifyPwdCust(request): 修改项目用户密码
    请求: http://127.0.0.1:8080/CustFlow/servlet/ModifyPwdCustServlet?guid=1CF71688-EDBB-4723-A41A-42F8078558F2&\
    custName=%E7%AC%AC%E4%B8%80%E9%A3%9F%E5%93%81&starttime=09:00:00&endtime=23:59:59&custPwd=1&random=6231431c-1086-5340-1608-645f15fa8e8f&Action=get
    返回: SUCCESS
    '''
    s="?"+request.META['QUERY_STRING']
    url = getUrlData(s)
    #url = getUrlData(env)

    print "Into ModifyPwdCust:", url

    msg = "FAILED"

    sql = "update userinfo set userpwd='%s' where guid='%s' and username='%s'"%(url['custPwd'], url['guid'], url['custName'])

    ## DB init
    db = doDB.sqldb(cfg=doDB.cfg)
    
    res = db.do_update(sql)

    if res[0] > 0:
        msg = "SUCCESS" 
    ## 3. Output
    #output.write(CONTENT_TYPE_HEAD)
    #output.write(msg)
    return HttpResponse(msg)
def ModifyAdminPwd(request):
    #ModifyAdminPwd(request): 修改管理员密码
    s="?"+request.META['QUERY_STRING']
    url = getUrlData(s)
    
    print "Into ModifyAdminPwd:", url
    msg = "FAILED"
    cfg = get_server_cfg(CONF_FILE)
    msg = "FAILED"
    if 'AdminPwd' in url and 'newAdminPwd' in url  and 'adminpwd' in cfg:
        #### 2.1 管理员认证
        if url['AdminPwd'] == cfg['adminpwd']:
            cfg['adminpwd']=url['newAdminPwd']
            write(cfg)
            msg="SUCCESS"
            
        else:
            msg="PWDERROR"
    
    return HttpResponse(msg)
def write(cfg):
    with open('config/settings.ini', 'w') as f:
        for k,v in cfg.items():
            f.write('%s=%s\n'%(k,v))

def ModifyStartEndTimeCust(request):
    ''' ModifyPwdCust(request): 修改项目用户密码
    请求: http://127.0.0.1:8080/CustFlow/servlet/ModifyPwdCustServlet?guid=1CF71688-EDBB-4723-A41A-42F8078558F2&\
    custName=%E7%AC%AC%E4%B8%80%E9%A3%9F%E5%93%81&starttime=09:00:00&endtime=23:59:59&custPwd=1&random=6231431c-1086-5340-1608-645f15fa8e8f&Action=get
    返回: SUCCESS
    '''
    s="?"+request.META['QUERY_STRING']
    url = getUrlData(s)
    #url = getUrlData(env)

    print "Into ModifyStartEndTimeCust:", url

    msg = "FAILED"

    sql = "update userinfo set starttime='%s', endtime='%s' where guid='%s' and username='%s'"%(url['startTimeGap'],url['endTimeGap'], url['guid'], url['custName'])

    print sql

    ## DB init
    db = doDB.sqldb(cfg=doDB.cfg)
    
    res = db.do_update(sql)
    print res
    if res[0] > 0:
        msg = "SUCCESS" 
    ## 3. Output
    #output.write(CONTENT_TYPE_HEAD)
    #output.write(msg)
    return HttpResponse(msg)
def ModifyCurrencyType(request):
    #ModifyAdminPwd(request): 修改管理员密码
    s="?"+request.META['QUERY_STRING']
    url = getUrlData(s)
    
    print "Into ModifyCurrencyType:", url
    msg = "FAILED"
    cfg = get_server_cfg(CONF_FILE)
    msg = "FAILED"
    if 'guid' in url and 'custName' in url  and 'currencytype' in url:
        sql = "update userinfo set currencytype='%s' where guid='%s' and username='%s'"%(url['currencytype'], url['guid'], url['custName'])

        print sql

        ## DB init
        db = doDB.sqldb(cfg=doDB.cfg)
        
        res = db.do_update(sql)
        print res
        if res[0] > 0:
            msg = "SUCCESS" 
    
    return HttpResponse(msg)
