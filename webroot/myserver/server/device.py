#!/usr/bin/python
# -*- coding: utf8 -*-

import os,sys
from utils import *
from custom_utils import *
from common import *
import uuid
import json
import doDB 
from django.http import HttpResponse
def AddDevice(request):
    ''' device->AddDevice: 增加/修改设备信息
    请求:
      增加: http://127.0.0.1:8080/CustFlow/servlet/AddDeviceServlet?guid=&deviceName=aaa&ownDeviceType=device_cust&\
      deviceUUID=aaaaaaaaaaaaa&deviceDescription=aaa%E8%AE%BE%E5%A4%87%E6%8F%8F%E8%BF%B0&\
      deviceDetailInfo=aaa%E8%AE%BE%E5%A4%87%E8%AF%A6%E7%BB%86%E4%BF%A1%E6%81%AF&ownProject=8fcfe580-d63e-4a20-8ffd-32c89a3c7162&\
      addTime=&random=79b5fb00-6f97-b0c6-7f50-211176996e0d&Action=get
      修改: http://127.0.0.1:8080/CustFlow/servlet/AddDeviceServlet?guid=FC9C1884-0712-4D3E-B040-13B40649DFC3&deviceName=aaa&ownDeviceType=device_cust&deviceUUID=aaaaaaaaaaaaa&deviceDescription=aaa%E8%AE%BE%E5%A4%87%E6%8F%8F%E8%BF%B04&deviceDetailInfo=aaa%E8%AE%BE%E5%A4%87%E8%AF%A6%E7%BB%86%E4%BF%A1%E6%81%AF&ownProject=8fcfe580-d63e-4a20-8ffd-32c89a3c7162&addTime=2013-10-28%2014:44:47&random=76633b40-fd2a-44c5-9e06-c185e581e527&Action=get
    返回: SUCCESS
    '''
    s="?"+request.META['QUERY_STRING']
    url = getUrlData(s)
    #url = getUrlData(env)
    print url
    print "Into AddDevice"

    GenDeviceguid = uuid.uuid1().hex
    GenDataGuid = uuid.uuid1().hex

    # 判断提交参数有效性
    # 修改时候可以修改UUID，name等
    msg = valid_device_uuid(url['deviceUUID'], url['ownDeviceType'], url['guid'])

    if msg == 'VALID':
        msg = valid_device_name(url['ownProject'], url['deviceName'], url['guid'], table='device_cust')

    print msg

    if msg != 'VALID':
        # Output
        #output.write(CONTENT_TYPE_HEAD)
        #output.write(msg)
        #return
        return HttpResponse(json.dumps(msg))

    opt = OPT_ADD
    if url['guid'] != '':
        opt = OPT_MODIFY

    if OPT_ADD == opt:
        #年龄属性 热区 尚未添加设备注册等功能
        if url['ownDeviceType'] == 'device_age' or url['ownDeviceType'] == 'device_heat':
            issign="true"        
            isusable="true"        
        else:
            issign="false"        
            isusable="false"

        sql = "INSERT INTO %s (`guid`, `dataguid`, `proguid`, `uuid`, `name`, `description`, `remark`, `isvirtual`, `issign`, \
        `isusable`, `addtime`) VALUES ('%s', '%s', '%s', '%s', '%s', '%s', '%s', false, %s, %s, '%s')"% \
            (url['ownDeviceType'], GenDeviceguid, GenDataGuid, url['ownProject'], url['deviceUUID'], url['deviceName'], url['deviceDescription'], url['deviceDetailInfo'], issign, isusable, get_time())
    elif OPT_MODIFY == opt:
        sql = "UPDATE %s set uuid='%s', name='%s', description='%s', remark='%s', addtime='%s'"  \
            %(url['ownDeviceType'], url['deviceUUID'], url['deviceName'], url['deviceDescription'], url['deviceDetailInfo'], url['addTime'])
        
        sql += " where guid='%s'"%(url['guid'])

    print sql

    # Gettting data from db
    db = doDB.sqldb(cfg=doDB.cfg)

    res = db.sqldb_query(sql)

    print res

    msg = "FAILED"

    if res[0] > 0:
        msg = "SUCCESS"

    if OPT_MODIFY == opt and res[0] == 0:
        msg = "SUCCESS"

    flag = 0
    for key in url:
        if 'lxText' == key:
            msgLxText = {}
            msgLxText['state'] = msg
            print msgLxText
            msgLxText['deviceGuid'] = GenDeviceguid
            msgLxText['dataGuid'] = GenDataGuid
            flag = 1
            #output.write(CONTENT_TYPE_HEAD)
            #output.write(json.dumps(msgLxText))
            return HttpResponse(json.dumps(msgLxText))
                      
    
    # Output
    if flag == 0:
        #output.write(CONTENT_TYPE_HEAD)
        #output.write(msg)
        return HttpResponse(msg)

def AdminDeviceList(request):
    ''' device->AdminDeviceList: 获取项目设备列表
    请求: http://127.0.0.1:8080/CustFlow/servlet/AdminDeviceListServlet?beginIndex=0&endIndex=10&proguid=8fcfe580-d63e-4a20-8ffd-32c89a3c7162&random=397241d7-9134-1c3f-f65b-effe825e6472&Action=get
    返回: JSON: 
        deviceList: [device]
            device:
                isSign false
                strDeviceDescription "6" 
                isUsable false
                strGuid "55468A0B-23AA-4C54-9BE6-CB5211A9F114" 
                state "0" 
                strFromTable "device_cust"
                strDeviceName "6"
        itemCount: int
    返回: 实例 {"deviceList":[{"strGuid":"53a69fa0-90f5-41c0-ae84-d94eb8ec993e","strFromTable":"device_cust","strDeviceName":"测试6"},{"strDeviceDescription":"","strGuid":"e5f57fdc-5e78-4bc1-9d37-255ecb1eaa95","strFromTable":"device_cust","strDeviceName":"真实测试2222222222222222222222222222"},{"strDeviceDescription":"8","strGuid":"97127AD7-196A-4266-A95A-13EB7F10A420","strFromTable":"device_cust","strDeviceName":"真实8"},{"strDeviceDescription":"6","strGuid":"28C20CE1-2E84-44BE-A4C4-3A56BA506E46","strFromTable":"device_cust","strDeviceName":"真实6"},{"strDeviceDescription":"99","strGuid":"E341ADA9-1C66-4596-922F-509C91EABB2C","strFromTable":"device_cust","strDeviceName":"真实99"},{"strDeviceDescription":"5555","strGuid":"a8aa92cf-9322-43d2-8372-6b7cdef3c4f4","strFromTable":"device_age","strDeviceName":"年龄测试1"},{"strDeviceDescription":"描述什么2呢描述什么2呢描述什么2呢描述什么2呢描述什么2呢描述什么2呢描述什么2呢描述什么2呢描述什么2呢描述什么2呢描述什么2呢描述什么2呢描述什么2呢","strGuid":"dfaf2fd2-4e7d-4e33-a79d-717d6674c1e0","strFromTable":"device_cust","strDeviceName":"真实测试1"},{"strDeviceDescription":"这是骏聿科技骏聿科技骏聿科技骏聿科技骏聿科技骏聿科技骏聿科技骏聿科技骏聿科技骏聿科技骏聿科技骏聿科技骏聿科技骏聿科技骏聿科技骏聿科技骏聿科技","strGuid":"0DAE73E3-FF43-4E74-A658-7449BD3455D5","strFromTable":"device_cust","strDeviceName":"真实测试7"}],"itemCount":8}
    '''

    s="?"+request.META['QUERY_STRING']
    url = getUrlData(s)
    #url = getUrlData(env)
    print url
    print "Into AdminDeviceList"

    # Init ret msg data
    msg={}
    deviceList = []
    msg['deviceList']=[]
    msg['itemCount']=0
    
    # Gettting data from db

    db = doDB.sqldb(cfg=doDB.cfg)

    ## TODO 两个表合并
    ## 从客流量设备表查询
    sql = "SELECT uuid, guid as strGuid, name as strDeviceName, issign as isSign, isusable as isUsable FROM \
device_cust where isvirtual=false and proguid='%s'"%(url['proguid'])

    if 'devicename' in url:
        sql += " and name like '%%%s%%'"%(url['devicename'])

    sql += "order by addtime desc;"

    print sql

    res = db.do_select(sql)
    print "0res",res[1] 
    if res[0] > 0:
        # TODO
        for i in xrange(res[0]):
            device = res[1][i]
            #print device
            device['state'] = get_device_status(device['strGuid'], is_sign=device['isSign'], is_usable=device['isUsable'])
            device['strFromTable']="device_cust"
        
            if device['isSign'] == '\x01':
                device['isSign'] = True
            else:
                device['isSign'] = False

            if device['isUsable'] == '\x01':
                device['isUsable'] = True
            else:
                device['isUsable'] = False

            device['isConnect'] = ssh_connected(device['uuid'])
            ##获取对应设备的ip
            sql = "SELECT ip as deviceIp, DATE_FORMAT(lastcontime, '%%Y-%%m-%%d %%T') as lastTime FROM device_update where deviceguid='%s' "%(device['strGuid'])
            resIp = db.do_select(sql)
            if resIp[0]>0:
                device['deviceIp'] = resIp[1][0]['deviceIp']
                device['lastTime'] = resIp[1][0]['lastTime']
            
        print "1res",res[1]    
        deviceList.extend(res[1])
        msg['itemCount']=res[0]

    ## 从年龄属性设备表查询
    sql = "SELECT guid as strGuid, name as strDeviceName, issign as isSign, isusable as isUsable FROM \
device_age where isvirtual=false and proguid='%s' "%(url['proguid'])

    if 'devicename' in url:
        sql += " and name like '%%%s%%'"%(url['devicename'])

    sql += "order by addtime desc;"

    print sql

    res = db.do_select(sql)

    if res[0] > 0:
        for i in xrange(res[0]):
            device = res[1][i]
            res[1][i]['state'] = device_status['unregistered']
            res[1][i]['strFromTable']="device_age"
            sql = "SELECT ip as deviceIp, DATE_FORMAT(lastcontime, '%%Y-%%m-%%d %%T') as lastTime FROM device_update where deviceguid='%s' "%(device['strGuid'])
            resIp = db.do_select(sql)
            if resIp[0]>0:
                res[1][i]['deviceIp'] = resIp[1][0]['deviceIp']
                res[1][i]['lastTime'] = resIp[1][0]['lastTime']
        deviceList.extend(res[1])
        msg['itemCount'] += res[0]

    ## 从热区 设备表查询
    sql = "SELECT guid as strGuid, name as strDeviceName, issign as isSign, isusable as isUsable FROM \
device_heat where isvirtual=false and proguid='%s' "%(url['proguid'])

    if 'devicename' in url:
        sql += " and name like '%%%s%%'"%(url['devicename'])

    sql += "order by addtime desc;"

    print sql

    res = db.do_select(sql)

    if res[0] > 0:
        for i in xrange(res[0]):
            device = res[1][i]
            res[1][i]['state'] = device_status['unregistered']
            res[1][i]['strFromTable']="device_heat"
            sql = "SELECT ip as deviceIp, DATE_FORMAT(lastcontime, '%%Y-%%m-%%d %%T') as lastTime FROM device_update where deviceguid='%s' "%(device['strGuid'])
            resIp = db.do_select(sql)
            if resIp[0]>0:
                res[1][i]['deviceIp'] = resIp[1][0]['deviceIp']
                res[1][i]['lastTime'] = resIp[1][0]['lastTime']
        deviceList.extend(res[1])
        msg['itemCount'] += res[0]


    msg['deviceList'] = deviceList[int(url['beginIndex']):int(url['endIndex'])]
    
    # Output
    #output.write(CONTENT_TYPE_HEAD)
    #output.write(json.dumps(msg))
    return HttpResponse(json.dumps(msg))

def UserDeviceList(request):
    # TODO 应该和AdminDeviceList复用一个获取功能
    ''' device->AdminDeviceList: 获取项目设备列表
    请求: http://127.0.0.1:8080/CustFlow/servlet/UserDeviceListServlet?beginIndex=0&endIndex=10&proguid=3E39AE3F-6F8B-405F-912F-B00CA444984F&random=28321e6a-6a83-726e-983f-b22131610e69&Action=get
    Res : {"deviceList":[{"strDeviceDescription":"后门","strLastConTime":"",\
    "strGuid":"D8EF93D3-38B5-47F4-AAC5-F7304ECDB516","state":"2","strFromTable":"device_age","strDeviceName":"年龄性别 后门"},{"strDeviceDescription":"东偏门","strLastConTime":"","strGuid":"294AC56C-674B-454E-AA20-D67A8F77856C","state":"2","strFromTable":"device_age","strDeviceName":"年龄性别 东偏门"},{"strDeviceDescription":"侧通道\n","strLastConTime":"","strGuid":"9EFD342C-8931-46BD-84F6-BD3B863CFA15","state":"2","strFromTable":"device_age","strDeviceName":"年龄性别 侧通道"},{"strDeviceDescription":"年龄性别","strLastConTime":"","strGuid":"337E1DBC-075B-490B-B69A-884744EF79C5","state":"2","strFromTable":"device_age","strDeviceName":"年龄性别 正门"},{"strDeviceDescription":"后门","strLastConTime":"2013-11-26 16:40:34","strGuid":"7A62752A-BEC1-4118-B352-482492614487","state":"2","strFromTable":"device_cust","strDeviceName":"后门"},{"strDeviceDescription":"东偏门","strLastConTime":"2013-11-26 16:41:35","strGuid":"B6113A8D-6F61-47C1-9A44-07EF4E12ADE7","state":"2","strFromTable":"device_cust","strDeviceName":"东偏门"},{"strDeviceDescription":"西侧小门","strLastConTime":"2013-11-26 16:40:46","strGuid":"154FFD38-2A0C-42C4-AAC1-74C1B88688C6","state":"2","strFromTable":"device_cust","strDeviceName":"西侧小门"},{"strDeviceDescription":"小卷帘门","strLastConTime":"2013-11-26 16:38:22","strGuid":"51F40F59-563A-49EB-8615-63376C145A92","state":"2","strFromTable":"device_cust","strDeviceName":"小卷帘门"},{"strDeviceDescription":"北正门","strLastConTime":"2013-11-26 16:40:37","strGuid":"8E95E899-B19F-4BC7-9523-D5FBAABAB33A","state":"2","strFromTable":"device_cust","strDeviceName":"北正门"},{"strDeviceDescription":"3米宽卷帘门，侧门。","strLastConTime":"2013-11-26 16:40:36","strGuid":"5D13432B-07F1-4D41-BEC0-5BC0A68AB2F1","state":"2","strFromTable":"device_cust","strDeviceName":"宽卷帘门"}],"itemCount":10}
    JSON: 
        deviceList: [device]
            device:
                isSign false
                strDeviceDescription "6" 
                isUsable false
                strGuid "55468A0B-23AA-4C54-9BE6-CB5211A9F114" 
                state "0" 
                strFromTable "device_cust"
                strDeviceName "6"
        itemCount: int
    '''

    s="?"+request.META['QUERY_STRING']
    url = getUrlData(s)
    #url = getUrlData(env)
    print url
    print "Into UserDeviceList"

    # Init ret msg data
    msg={}
    msg['deviceList']=[]
    msg['itemCount']=0
    
    # Gettting data from db

    db = doDB.sqldb(cfg=doDB.cfg)

    ## TODO 两个表合并
    ## 从客流量设备表查询
    sql = "SELECT guid as strGuid, name as strDeviceName, issign as isSign, isusable as isUsable FROM device_cust where isvirtual=false and proguid='%s' order by addtime desc limit %s,%s;"%(url['proguid'], url['beginIndex'], url['endIndex'])

    res = db.do_select(sql)

    if res[0] > 0:
        # TODO
        for i in xrange(res[0]):
            device = res[1][i]
            #print device
            device['state'] = get_device_status(device['strGuid'], is_sign=device['isSign'], is_usable=device['isUsable'])
            device['strFromTable']="device_cust"
        
            if device['isSign'] == '\x01':
                device['isSign'] = True
            else:
                device['isSign'] = False

            if device['isUsable'] == '\x01':
                device['isUsable'] = True
            else:
                device['isUsable'] = False

            ##获取对应设备的ip
            sql = "SELECT ip as deviceIp, DATE_FORMAT(lastcontime, '%%Y-%%m-%%d %%T') as lastTime FROM device_update where deviceguid='%s' "%(device['strGuid'])
            resIp = db.do_select(sql)
            if resIp[0]>0:
                device['deviceIp'] = resIp[1][0]['deviceIp']
                device['lastTime'] = resIp[1][0]['lastTime']

        msg['deviceList'].extend(res[1])
        msg['itemCount']=res[0]

    ## 从年龄属性设备表查询
    sql = "SELECT guid as strGuid, name as strDeviceName, issign as isSign, isusable as isUsable FROM device_age where isvirtual=false and proguid='%s' order by addtime desc limit %s,%s;"%(url['proguid'], url['beginIndex'], url['endIndex'])

    res = db.do_select(sql)

    if res[0] > 0:
        for i in xrange(res[0]):
            device = res[1][i]
            res[1][i]['state'] = device_status['unregistered']
            res[1][i]['strFromTable']="device_age"
            sql = "SELECT ip as deviceIp, DATE_FORMAT(lastcontime, '%%Y-%%m-%%d %%T') as lastTime FROM device_update where deviceguid='%s' "%(device['strGuid'])
            resIp = db.do_select(sql)
            if resIp[0]>0:
                res[1][i]['deviceIp'] = resIp[1][0]['deviceIp']
                res[1][i]['lastTime'] = resIp[1][0]['lastTime']
            
        msg['deviceList'].extend(res[1])
        msg['itemCount'] += res[0]
    
    # Output
    #output.write(CONTENT_TYPE_HEAD)
    #output.write(json.dumps(msg))
    return HttpResponse(json.dumps(msg))

def CheckProjectDevice(device_guid, from_table):
    ''' CheckProjectDevice: 判断设备是否是项目设备: 每个项目只能有一个项目设备
    '''

    proTypeTable = ''

    if from_table =="device_cust":
        proTypeTable = 'project_device_cust'
    if from_table =="device_age":
        proTypeTable = 'project_device_age'
    if from_table =="device_heat":
        proTypeTable = 'project_device_heat'
        
    sql = "SELECT * FROM %s WHERE deviceguid='%s'"%(proTypeTable,device_guid)

    db = doDB.sqldb(cfg=doDB.cfg)

    res = db.do_select(sql)

    if res[0] > 0:
        return True

    return False


def DevDetail(request):
    ''' device->DevDetail: 获取设备详细信息
    请求: http://127.0.0.1:8080/CustFlow/servlet/DevDetailServlet?Guid=0F3AA585-49DC-4482-B8B4-D9911529692F&FromTable=device_cust&\
    random=b2917b71-86db-6525-c4fb-6d6140611235&Action=get
    返回: {"deviceDescription":"8","deviceDetailInfo":"8","deviceName":"虚拟测试1","detailOwnProject":"8fcfe580-d63e-4a20-8ffd-32c89a3c7162","isProject":true,"deviceUUID":"8","ownDeviceType":"device_cust","addTime":"2013-10-09 15:56:40"}
    JSON:
        deviceName "111"
        deviceDescription "333"
        deviceDetailInfo "444"
        dataGUID "A1C2A2A8-B1B0-4B83-ACF7-CBA0B81F632A"
        deviceUUID "222"
        detailOwnProject "8fcfe580-d63e-4a20-8ffd-32c89a3c7162"
        ownDeviceType "device_cust"
        isProject true
        addTime "2013-11-17 09:16:35"
    '''
    s="?"+request.META['QUERY_STRING']
    url = getUrlData(s)
    #url = getUrlData(env)
    print url
    print "Into DevDetail"

    # Init ret msg data
    msg={}

    # Gettting data from db
    sql = "select name as deviceName, description as deviceDescription, remark as deviceDetailInfo, \
        dataguid as dataGUID, uuid as deviceUUID, proguid as detailOwnProject, addtime as addTime, issale as isSalesDevice\
        from %s where guid='%s'"%(url['FromTable'], url['Guid'])

    #print sql

    db = doDB.sqldb(cfg=doDB.cfg)

    res = db.do_select(sql)
    print res

    if res[0] > 0:
        msg=res[1][0]
        msg['addTime'] = str(msg['addTime'])
        msg['ownDeviceType'] = url['FromTable']
        msg['isProject'] = CheckProjectDevice(url['Guid'],url['FromTable'])
    
    # Output
    #output.write(CONTENT_TYPE_HEAD)
    #output.write(json.dumps(msg))
    return HttpResponse(json.dumps(msg))
def ChangeDeviceRegister(request):
    ''' device->ChangeDeviceRegister: 改变设备注册状态
    请求: http://127.0.0.1:8080/CustFlow/servlet/ChangeDeviceRegisterServlet?Guid=cb709eb0-4f2c-11e3-aa50-9c4e36c5898c&isRegister=true&random=3b57e4b0-ad0c-de63-f607-aa377dc3861e&Action=get
    返回: {"state":"0"}
    '''
    s="?"+request.META['QUERY_STRING']
    url = getUrlData(s)
    #url = getUrlData(env)
    print url
    print "Into ChangeDeviceRegister"

    # 只有客流量设备有
    sql = "UPDATE device_cust set issign=%s where guid='%s'"%(url['isRegister'], url['Guid'])

    print sql

    # Gettting data from db
    db = doDB.sqldb(cfg=doDB.cfg)

    res = db.do_update(sql)

    msg = {}
    msg['state'] = get_device_status(url['Guid'])

    # Output
    #output.write(CONTENT_TYPE_HEAD)
    #output.write(json.dumps(msg))
    return HttpResponse(json.dumps(msg))

def ChangeDeviceUsable(request):
    ''' device->ChangeDeviceUsable: 改变设备使用状态
    请求:http://127.0.0.1:8081/CustFlow/servlet/ChangeDeviceUsableServlet?Guid=5EEFC54A-4742-4C3B-BA16-A303C6AC4012&isUsable=false&random=42b8ac53-cdeb-15cf-df2c-7747f6ffd74f&Action=get
    返回: {"state":"0"}
    '''
    s="?"+request.META['QUERY_STRING']
    url = getUrlData(s)
    #url = getUrlData(env)
    print url
    print "Into ChangeDeviceUsableServlet"

    # 只有客流量设备有
    sql = "UPDATE device_cust set isusable=%s where guid='%s'"%(url['isUsable'], url['Guid'])

    print sql

    # Gettting data from db
    db = doDB.sqldb(cfg=doDB.cfg)

    res = db.do_update(sql)

    msg = {}
    msg['state'] = get_device_status(url['Guid'])

    # Output
    #output.write(CONTENT_TYPE_HEAD)
    #output.write(json.dumps(msg))
    return HttpResponse(json.dumps(msg))

def ChangeDeviceConnect(request):
    ''' device->ChangeDeviceConnect: 改变设备SSH连接使用状态
    请求: http://rayeye.cn:8081/CustFlow/servlet/ChangeDeviceConnectServlet?Guid=8ffc07ca5e1d11e38dbc00163e002ba0&isConnect=false&random=8b65cf21-42fb-71fa-5817-a8177989f4fd&Action=get
    Guid: device_cust.guid
    返回: SUCCESS
    '''
    s="?"+request.META['QUERY_STRING']
    url = getUrlData(s)
    #url = getUrlData(env)
    print url
    print "Into ChangeDeviceConnect"

    device_info = get_device_info(guid=url['Guid'])

    # 只有客流量设备有
    del_sql = "DELETE FROM connect_device";


    ins_sql = ""
    if url['isConnect'] == 'true':
        ins_sql = "INSERT INTO connect_device (guid, deviceuuid, curtime) VALUES ('%s', '%s', '%s')"% \
            (uuid.uuid1().hex, device_info['uuid'], get_time())

    # Gettting data from db
    db = doDB.sqldb(cfg=doDB.cfg)

    res = db.do_del(del_sql)
    print ins_sql

    ## 断开连接
    os.system(DROP_SSH_CONNECT)

    if len(ins_sql) > 0:
        res = db.do_insert(ins_sql)

    msg = "SUCCESS"

    # Output
    #output.write(CONTENT_TYPE_HEAD)
    #output.write(json.dumps(msg))
    return HttpResponse(json.dumps(msg))
def DeleteDevice(request):
    ''' 删除物理设备
    返回: SUCCESS
    '''
    s="?"+request.META['QUERY_STRING']
    url = getUrlData(s)
    #url = getUrlData(env)
    print url
    print "Into DeleteDevice"


    # 昊亿只有客流设备
    #第一步删除物理设备
    del_sql = "DELETE  FROM device_cust where guid='%s'"%(url['Guid'])
    db = doDB.sqldb(cfg=doDB.cfg)
    res = db.do_del(del_sql)
    msg = "FAILED"
    if res[0] > 0:
        msg = "SUCCESS"
    else:
        return HttpResponse(json.dumps(msg))
    #第二步删除虚拟设备中的物理设备
    del_sql = "DELETE FROM device_virtual where childdeviceguid='%s'"%(url['Guid'])
    db = doDB.sqldb(cfg=doDB.cfg)
    res = db.do_del(del_sql)
    if res[0] > 0:
        msg = "SUCCESS"
    else:
        msg = "FAILED"
        return HttpResponse(json.dumps(msg))
    
    # Output
    #output.write(CONTENT_TYPE_HEAD)
    #output.write(json.dumps(msg))
    return HttpResponse(json.dumps(msg))

def DeviceConnectExist(request):
    ''' device->DeviceConnectExist: 检查ssh连接情况
    请求: http://127.0.0.1:8080/CustFlow/servlet/DeviceConnectExistServlet?Guid=5EEFC54A-4742-4C3B-BA16-A303C6AC4012&random=a5c95702-d69a-5876-3d3b-b5eb60088557
    返回:{"deviceuuid":""}
    '''
    s="?"+request.META['QUERY_STRING']
    url = getUrlData(s)
    #url = getUrlData(env)
    print url
    print "Into DeviceConnectExistServlet"

    # Return msg
    msg = {}
    msg['deviceuuid'] = "" #

    # Output
    #output.write(CONTENT_TYPE_HEAD)
    #output.write(json.dumps(msg))
    return HttpResponse(json.dumps(msg))

def GetDeviceType(request):
    ''' device->GetDeviceType: 获取项目设备列表
    请求: http://127.0.0.1:8080/CustFlow/servlet/GetDeviceTypeServlet?proguid=8fcfe580-d63e-4a20-8ffd-32c89a3c7162&random=4fb1f7aa-2118-f0cd-98fe-ee69672a3aba&Action=get
    返回: [{"guid":"d014e458-4fa9-11e3-aa50-9c4e36c5898c","name":"aa","isvirtual":1},{"guid":"A1C2A2A8-B1B0-4B83-ACF7-CBA0B81F632A","name":"111","isvirtual":0},{"guid":"A8A0AFC5-768D-4597-9D5A-12617B41ACE5","name":"11","isvirtual":0},{"guid":"cb70fb9e-4f2c-11e3-aa50-9c4e36c5898c","name":"1231","isvirtual":0},{"guid":"E1D9DBC7-0DDA-4E6A-9CBE-76E5C5D1587A","name":"6","isvirtual":0},{"guid":"A951F315-6C65-4D8F-B370-83414FD0D03F","name":"4","isvirtual":0},{"guid":"A465B7E7-C71E-4665-B8AF-21A534328165","name":"77","isvirtual":0},{"guid":"F941DF13-BCEA-4442-A681-D897D3C9AAAB","name":"虚拟5","isvirtual":1},{"guid":"21F8A444-93D2-4158-BEC4-3A5951B3BA1F","name":"虚拟测试1","isvirtual":1},{"guid":"53a69fa0-90f5-41c0-ae84-d94eb8ec993e","name":"测试6","isvirtual":0},{"guid":"30b96c4a-728b-4e0b-9dba-fd97f0a6f3eb","name":"真实测试2222222222222222222222222222","isvirtual":0},{"guid":"83C4C3C5-0D1B-4080-9E0E-66F1670C81BA","name":"虚拟18","isvirtual":1},{"guid":"7DB45718-B9AB-4988-9635-5A4DD003BAA6","name":"虚拟7","isvirtual":1},{"guid":"AB6F852D-4B4C-4456-B9CB-94B6C2080C93","name":"虚拟555","isvirtual":1},{"guid":"24EF8497-746D-4FB2-9DDD-FB8D5A9D319F","name":"真实8","isvirtual":0},{"guid":"389FBB76-729A-4A9B-842E-3FE14083F163","name":"真实6","isvirtual":0},{"guid":"4BA878BA-5E9E-4E65-A361-8616B6FD5D73","name":"真实99","isvirtual":0},{"guid":"a8aa92cf-9322-43d2-8372-6b7cdef3c4f4","name":"年龄测试1","isvirtual":0},{"guid":"A9E69485-EC99-4ECE-AE0B-E31FA414A4A6","name":"虚拟55","isvirtual":1},{"guid":"30b96c4a-728b-4e0b-9dba-fd97f0a6f3eb","name":"真实测试1","isvirtual":0},{"guid":"665F9F34-78B5-4908-ADF3-34F9A0A99E67","name":"真实测试7","isvirtual":0}]
    '''

    s="?"+request.META['QUERY_STRING']
    url = getUrlData(s)
    #url = getUrlData(env)
    print url
    print "Into GetDeviceType"

    # Init ret msg data
    msg=[]
    
    # Gettting data from db

    db = doDB.sqldb(cfg=doDB.cfg)

    ## 从客流量设备表查询
    if url['device_type'] == "device_cust":
        sql = "SELECT dataguid as guid, name,isvirtual, issale FROM device_cust where proguid='%s' and isusable=true order by addtime desc "%(url['proguid'])
        res = db.do_select(sql)
        print "getDeviceTYpe",res

        if res[0] > 0:
            msg.extend(res[1])

    ## 从年龄属性设备表查询
    if url['device_type'] == "device_age":
        sql = "SELECT dataguid as guid, name,isvirtual FROM device_age where proguid='%s' and isusable=true order by addtime desc "%(url['proguid'])
        res = db.do_select(sql)

        if res[0] > 0:
            msg.extend(res[1])

    ## 从年龄属性设备表查询
    if url['device_type'] == "device_heat":
        sql = "SELECT dataguid as guid, name,isvirtual FROM device_heat where proguid='%s' and isusable=true order by addtime desc "%(url['proguid'])
        res = db.do_select(sql)

        if res[0] > 0:
            msg.extend(res[1])        

    print msg

    # Output
    #output.write(CONTENT_TYPE_HEAD)
    #output.write(json.dumps(msg))
    return HttpResponse(json.dumps(msg))
