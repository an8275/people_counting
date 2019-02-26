#!/usr/bin/python
# -*- coding: utf8 -*-

from utils import *
from common import *
import uuid
import json
import doDB 
from django.http import HttpResponse
def customer_already_exist(customer_name):
    ''' def customer_already_exist(customer_name): 检查是否已经存在用户名
    '''

    sql = "select username from userinfo where username='%s'"%(customer_name)
    
    # Gettting data from db
    db = doDB.sqldb(cfg=doDB.cfg)

    res = db.sqldb_query(sql)

    if res[0] > 0:
        return True

    return False

def AddCust(request):
    ''' customer->AddCust 添加/修改用户 
    请求: http://127.0.0.1:8080/CustFlow/servlet/AddCustServlet?guid=5D3609B4-9A7B-419B-9A15-41BB622E4575&custName=test&custPwd=&responsiblePerson=rayeye&custDescription=6&custContact=6&custDetailInfo=6&ownProject=8fcfe580-d63e-4a20-8ffd-32c89a3c7162&addTime=2013-10-14%2013:11:40&random=15dc6cfe-587b-5da9-7af9-1d38e3242579&Action=get
    返回:SUCCESS

    '''
    s="?"+request.META['QUERY_STRING']
    url = getUrlData(s)
    print url
    print "Into AddCust"

    opt = OPT_ADD
    if url['guid'] != '':
        opt = OPT_MODIFY

    ## Do operation
    '''
        新增: :/CustFlow/servlet/AddCustServlet?guid=&custName=leo&custPwd=1&responsiblePerson=rayeye&custDescription=leo%20desc&custContact=leo%\
        20info&custDetailInfo=leo%20detail&ownProject=8fcfe580-d63e-4a20-8ffd-32c89a3c7162&addTime=&random=768a8af8-bb1c-1db8-eb4b-626a5483b190&Action=get
             guid: 2C995F15-4A2D-4A17-87E1-C153C1F0DE07
          proguid: 52767307-243F-4774-A1C8-4A307B31D4F3
         username: 44
          userpwd: 4
responsibleperson: rayeye4
      contactinfo: 44
      description: 44
           remark: 44
          addtime: 2013-11-04 10:32:24
    '''

    msg = "FAILED"
    if OPT_ADD == opt:
        sql = "INSERT INTO userinfo (`guid`, `proguid`, `username`, `userpwd`, `responsibleperson`, `contactinfo`, `description`, `remark`, `addtime`)\
        VALUES ('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s')"\
        %(uuid.uuid1().hex, url['ownProject'], url['custName'], url['custPwd'], url['responsiblePerson'], \
          url['custContact'], url['custDetailInfo'], url['custDetailInfo'], get_time())

        if customer_already_exist(url['custName']):
            msg = "UNIQUENAMEERROR"
    elif OPT_MODIFY == opt:
        sql = "UPDATE userinfo set proguid='%s', username='%s', responsibleperson='%s', contactinfo='%s', description='%s', \
            remark='%s'"%(url['ownProject'], url['custName'], url['responsiblePerson'], url['custContact'], url['custDescription'], url['custDetailInfo'])
        
        ## 当密码不为空修改密码
        if url['custPwd'] != '':
            sql += ", userpwd='%s'"%(url['custPwd'])
        
        sql += " where guid='%s'"%(url['guid'])

    #print sql

    ## 数据有效后通过
    if msg not in ['UNIQUENAMEERROR']:
        # Gettting data from db
        db = doDB.sqldb(cfg=doDB.cfg)

        res = db.sqldb_query(sql)

        if res[0] > 0:
            msg = "SUCCESS"

        if OPT_MODIFY == opt and res[0] == 0:
            msg = "SUCCESS"
    
    # Output
    #output.write(CONTENT_TYPE_HEAD)
    #output.write(msg)
    return HttpResponse(msg)

def DelCust(request):
    ''' custom->DelCust
        请求: http://127.0.0.1:8080/CustFlow/servlet/DelCustServlet?Guid=5D3609B4-9A7B-419B-9A15-41BB622E4575&random=46a54299-be5e-7021-adf6-aee535433dbe&Action=get
        返回:SUCCES
    '''
    s="?"+request.META['QUERY_STRING']
    url = getUrlData(s)
    print url
    print "Into DelCust"

    sql = "DELETE from userinfo where guid='%s'"%(url['Guid']);

    print sql

    # Gettting data from db
    db = doDB.sqldb(cfg=doDB.cfg)

    res = db.do_del(sql)

    msg = "FAILED"

    if res[0] > 0:
        msg = "SUCCESS"
    
    # Output
    #output.write(CONTENT_TYPE_HEAD)
    #output.write(msg)
    return HttpResponse(msg)

def CustDetail(request):
    ''' custom->CustDetail: 获取用户详细信息
        请求: http://127.0.0.1:8080/CustFlow/servlet/CustDetailServlet?Guid=5D3609B4-9A7B-419B-9A15-41BB622E4575&random=e7653468-c840-e2a0-e5d9-7ded12974b55&Action=get
        返回: {"custDetailInfo":"6","responsiblePerson":"rayeye","ownProject":"8fcfe580-d63e-4a20-8ffd-32c89a3c7162","custPwd":"**********","custContact":"6","custName":"test","addTime":"2013-10-14 13:11:40","custDescription":"6"}
    '''
    s="?"+request.META['QUERY_STRING']
    url = getUrlData(s)
    print url
    print "Into CustDetail"

    # Init ret msg data
    msg={}

    # Gettting data from db
    sql = "select username as custName, responsibleperson as responsiblePerson, contactinfo as custContact, \
        description as custDescription, remark as custDetailInfo, proguid as ownProject, addtime as addTime,\
        starttime as startTimeGap, endtime as endTimeGap\
        from userinfo where guid='%s'"%(url['Guid'])

    print sql

    db = doDB.sqldb(cfg=doDB.cfg)

    res = db.do_select(sql)

    if res[0] > 0:
        msg=res[1][0]
        msg['addTime'] = str(msg['addTime'])
        msg['custPwd'] = "**********"
    
    # Output
    #output.write(CONTENT_TYPE_HEAD)
    #output.write(json.dumps(msg))
    return HttpResponse(json.dumps(msg))

def CustList(request):
    ''' customer->CustList 获取客户列表 
    REQUEST_URI:/CustFlow/servlet/CustListServlet?beginIndex=0&endIndex=10&random=d9a0c139-3f3d-dc72-6564-e0868cf13403&Action=get
    {"custList":[{"strGuid":"2C995F15-4A2D-4A17-87E1-C153C1F0DE07","strCustName":"44","strCustDescription":"44"},{"strGuid":"5D3609B4-9A7B-419B-9A15-41BB622E4575","strCustName":"test","strCustDescription":"6"},{"strGuid":"F3F1537E-FB9A-4138-AE8D-767B0D8790C0", "strCustName":"林伟红","strCustDescription":"55555555555555555555555555555555555555555555555555"}],"itemCount":3}
    '''
    s="?"+request.META['QUERY_STRING']
    url = getUrlData(s)
    print url
    print "Into CustList"
    #msg = '''{"custList":[{"strGuid":"2C995F15-4A2D-4A17-87E1-C153C1F0DE07","strCustName":"44","strCustDescription":"44"},{"strGuid":"5D3609B4-9A7B-419B-9A15-41BB622E4575","strCustName":"test","strCustDescription":"6"},{"strGuid":"F3F1537E-FB9A-4138-AE8D-767B0D8790C0", "strCustName":"林伟红","strCustDescription":"55555555555555555555555555555555555555555555555555"}],"itemCount":3}'''

    # Init ret msg data
    msg={}
    custtList=[]
    msg['custList']=[]
    msg['itemCount']=0
    
    # Gettting data from db

    db = doDB.sqldb(cfg=doDB.cfg)

    sql = "SELECT guid as strGuid, username as strCustName, description as strCustDescription FROM userinfo "
    
    if 'custname' in url:
        sql += " where username like '%%%s%%'"%(url['custname'])

    sql += "order by id desc;"

    res = db.do_select(sql)

    if res[0] > 0:
        custList=res[1]
        msg['itemCount']=res[0]
    
    if int(msg['itemCount']) > 0:
        msg['custList'] = custList[int(url['beginIndex']):int(url['endIndex'])]

    # Output
    #output.write(CONTENT_TYPE_HEAD)
    #output.write(json.dumps(msg))
    return HttpResponse(json.dumps(msg))
