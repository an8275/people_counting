#!/usr/bin/python
# -*- coding: utf8 -*-

from utils import *
from custom_utils import *
from common import *
import uuid
import json
import doDB
from django.http import HttpResponse
##导出pdf
from reportlab.graphics.shapes import Drawing, String
from reportlab.graphics import renderPDF

def get_virtual_realdevice_count(fromTable=None,dataguid=None):
    ''' get_virtual_realdevice_count(dataguid=None): 根据输入的dataguid获取（有效注册的，使用的）物理设备数量
    '''
    count = 0
    print 'into get_virtual_realdevice_count'

    if dataguid is not None:
        print dataguid
        dataguid_list = GetActualDeviceDataGuidList(dataguid, isvirtual=True)
        print 'dataguid_list', dataguid_list

        if len(dataguid_list) > 0:
            # 选取注册，使用设备

            ## 人流量设备 or 年龄设备 or 热区
            sql = "select guid from %s where dataguid in (%s) and issign=true and isusable=true"%\
                (fromTable,",".join(["'%s'"%w for w in dataguid_list]))

            print sql
            ## Initial DB
            db = doDB.sqldb(cfg=doDB.cfg)

            res = db.do_select(sql)
            print res

            if res[0] > 0:
                count += res[0]

##            ## 年龄设备
##            sql = "select guid from device_age where dataguid in (%s) and issign=true and isusable=true"%\
##                (",".join(["'%s'"%w for w in dataguid_list]))
##
##            print sql
##            ## Initial DB
##            db = doDB.sqldb(cfg=doDB.cfg)
##
##            res = db.do_select(sql)
##
##            if res[0] > 0:
##                count += res[0]
            
            ## Close DB
            db.sqldb_close()

    return count

def update_project_device(project_id, deviceguid, is_project_device,TypeTable):
    ''' update_project_device(project_id, deviceguid): 更新项目对应虚拟设备
        注意：每个项目只能够对应一个项目虚拟设备
    '''

    ## Initial DB
    db = doDB.sqldb(cfg=doDB.cfg)

    proTypeTable = ''

    if TypeTable =="device_cust":
        proTypeTable = 'project_device_cust'
    if TypeTable =="device_age":
        proTypeTable = 'project_device_age'
    if TypeTable =="device_heat":
        proTypeTable = 'project_device_heat'

    print 'TypeTable',TypeTable
        
    ## 先删除项目设备
    sql = "delete from %s where proguid='%s'"%(proTypeTable,project_id)
    print sql
    db.do_del(sql)

    if is_project_device == 'true':
        devicedataguid = get_device_dataguid(guid=deviceguid,deviceType=TypeTable, proguid=None, uuid=None)
        ## 添加项目设备
        sql = "insert into %s (guid, deviceguid, proguid, devicedataguid) values ('%s', '%s', '%s', '%s')"\
              %(proTypeTable, uuid.uuid1().hex, deviceguid, project_id, devicedataguid)
        print sql
        db.do_insert(sql)

    ## Close DB
    db.sqldb_close()

    return

def VirtualDeviceList(request):
    '''virtual_device->VirtualDeviceList: 获取虚拟设备列表 加入表选择
      项目全部  : http://127.0.0.1:8080/CustFlow/servlet/VirtualDeviceListServlet?beginIndex=0&endIndex=10&proguid=8fcfe580-d63e-4a20-8ffd-32c89a3c7162&random=93c44ecb-4065-7e20-6a73-52000d43a7bf&Action=get
      项目设备名: http://127.0.0.1:8080/CustFlow/servlet/VirtualDeviceListServlet?beginIndex=0&endIndex=10&proguid=8fcfe580-d63e-4a20-8ffd-32c89a3c7162&devicename=1&random=1ef03939-8c78-aeec-d502-d3d54610f88b&Action=get
        http://127.0.0.1:8080/CustFlow/servlet/VirtualDeviceListServlet?beginIndex=0&endIndex=12&proguid=8fcfe580-d63e-4a20-8ffd-32c89a3c7162&random=8e47c6e2-63c1-5e1f-7226-f1010e904f77&Action=get
    返回: JSON:
        deviceList:[]
            strDeviceName "虚拟5"    
            strGuid "7BB84884-6E05-435B-A555-B29668FB41BF"
            strDataGuid "F941DF13-BCEA-4442-A681-D897D3C9AAAB"
            strFromTable "device_cust" 
            realDeviceCount 1
        itemCount:int
    '''
    s="?"+request.META['QUERY_STRING']
    url = getUrlData(s)
    #url = getUrlData(env)
    #print url
    print "Into VirtualDeviceList"

    devicename=''
    if 'devicename' in url:
        devicename = url['devicename']

    # Init ret msg data
    msg={}
    deviceList=[]
    msg['deviceList']=[]
    msg['itemCount']=0
    
    # Gettting data from db
    db = doDB.sqldb(cfg=doDB.cfg)

    ## 从客流量设备表查询 or 从年龄属性设备表查询 or 热区
    sql = "SELECT name as strDeviceName, guid as strGuid, dataguid as strDataGuid, issale as isSalesDevice FROM %s where isvirtual=true \
and proguid='%s'"%(url['strFromTable'],url['proguid'])

    if devicename != '':
        sql += " and name like '%s%s%s'"%("%", devicename, "%");
    sql += " order by addtime desc;"

    #print sql

    res = db.do_select(sql)
    print res

    if res[0] > 0:
        # TODO
        for i in xrange(res[0]):
            res[1][i]['strFromTable']= url['strFromTable']
            res[1][i]['realDeviceCount'] = get_virtual_realdevice_count(url['strFromTable'],dataguid=res[1][i]['strDataGuid'])
        deviceList.extend(res[1])
        msg['itemCount']=res[0]

##    if url['strFromTable'] == "device_age":
##        #print "device_age"
##    ## 从年龄属性设备表查询
##        sql = "SELECT name as strDeviceName, guid as strGuid, dataguid as strDataGuid FROM device_age where isvirtual=true order by addtime desc limit %s,%s;"%(url['beginIndex'], url['endIndex'])
##
##        res = db.do_select(sql)
##
##        if res[0] > 0:
##            # TODO
##            for i in xrange(res[0]):
##                res[1][i]['strFromTable']="device_age"
##                res[1][i]['realDeviceCount']= get_virtual_realdevice_count(dataguid=res[1][i]['strDataGuid'])
##            msg['deviceList'].extend(res[1])
##            msg['itemCount'] += res[0]

    msg['deviceList'] = deviceList[int(url['beginIndex']):int(url['endIndex'])]
    #print msg
    
    # Output
    #output.write(CONTENT_TYPE_HEAD)
    #output.write(json.dumps(msg))
    return HttpResponse(json.dumps(msg))

def UpdateDeviceVirtualInfo(project_guid, dev_list, guid=None, dataguid=None):
    '''UpdateDeviceVirtualInfo(guid, dev_list):
        更新虚拟设备的对应虚拟设备列表
    '''
    print "Into VirtualDeviceList"

    ## 获取设备列表map信息和当前虚拟设备对应的dataguid
    device_map = GetDeviceIDMap(project_guid)
    print "device_map",device_map

    if dataguid is None and guid is not None:
        dataguid = device_map[guid]['dataguid']

    ## 清空虚拟设备对应设备数据
    sql = "DELETE FROM device_virtual WHERE virtualguid='%s'"%(dataguid)

    print sql

    db = doDB.sqldb(cfg=doDB.cfg)
    res = db.do_del(sql)

    print 'dev_list',dev_list
    print 'len(dev_list)',len(dev_list)

    ## 更新虚拟设备对应设备数据
    if len(dev_list)>0 and dev_list[0] is not '':
        sql = "INSERT INTO device_virtual (`guid`, `ischildvirtual`, `childdataguid`, `childdeviceguid`, `virtualguid`) VALUES"

        for i in xrange(len(dev_list)):
            device=device_map[dev_list[i]]
            print 'device',device
            sql += "('%s', %s, '%s', '%s', '%s')"%(uuid.uuid1().hex, device['isvirtual'] and "true" or "false", \
                    device['dataguid'], dev_list[i], dataguid)
            if i < len(dev_list)-1:
                sql += ","
        
        print sql

        res = db.do_insert(sql)

        
def AddVirtualDevice(request):
    ''' virtual_device->AddVirtualDevice: 增加虚拟设备 客流， 年龄属性，。。。
      增加: http://127.0.0.1:8080/CustFlow/servlet/AddVirtualDeviceServlet?guid=&deviceName=new%E8%99%9A%E6%8B%9F&\
      FromTable=&ownProject=8fcfe580-d63e-4a20-8ffd-32c89a3c7162&alreadyDevice=e5f57fdc-5e78-4bc1-9d37-255ecb1eaa95,\
      7BB84884-6E05-435B-A555-B29668FB41BF&deviceDescription=new%E8%99%9A%E6%8B%9F%E6%8F%8F%E8%BF%B0&\
      deviceDetailInfo=&isProjectDevice=false&addTime=&random=4e062f36-816a-089d-2420-286b2fd6bf6e&Action=get
      修改: http://127.0.0.1:8080/CustFlow/servlet/AddVirtualDeviceServlet?guid=2c77e9a2-4f9b-11e3-aa50-9c4e36c5898c\
      &deviceName=vleo&FromTable=device_cust&ownProject=8fcfe580-d63e-4a20-8ffd-32c89a3c7162&\
      alreadyDevice=e5f57fdc-5e78-4bc1-9d37-255ecb1eaa95,dfaf2fd2-4e7d-4e33-a79d-717d6674c1e0&\
      deviceDescription=vleo1&deviceDetailInfo=vleo2&isProjectDevice=false&addTime=2013-11-17%2023:16:03&\
      random=a4090451-22d6-111c-960b-c822c2e5e92f&Action=get
    返回: SUCCESS
    '''
    s="?"+request.META['QUERY_STRING']
    url = getUrlData(s)
    #url = getUrlData(env)
    print url
    print "Into AddVirtualDevice"

    opt = OPT_ADD
    if url['guid'] != '':
        opt = OPT_MODIFY

    #判断提交的设备类型


    # 判断提交参数有效性
    msg = valid_device_name(url['ownProject'], url['deviceName'], url['guid'], table=url['FromTable'])

    if 'VALID'!= msg:
        # Output
        #output.write(CONTENT_TYPE_HEAD)
        #output.write(msg)
        #return
        return HttpResponse(msg)

    guid=url['guid']

    ifsale = 1
    if url['isSalesDevice'] == 'false':
        ifsale = 0

    if OPT_ADD == opt:
        guid=uuid.uuid1().hex
        dataguid=uuid.uuid1().hex
        sql = "INSERT INTO %s (`guid`, `dataguid`, `proguid`, `name`, `description`, `remark`, `isvirtual`, `issale`,\
            `issign`, `isusable`, `addtime`) VALUES ('%s', '%s', '%s', '%s', '%s', '%s', true, %d, false, true, '%s')"% \
            (url['FromTable'],guid, dataguid, url['ownProject'], url['deviceName'], url['deviceDescription'], url['deviceDetailInfo'], ifsale, get_time())
    elif OPT_MODIFY == opt:
        guid=url['guid']
        sql = "UPDATE %s set name='%s', description='%s', remark='%s',issale=%d, addtime='%s'"%(url['FromTable'],url['deviceName'], \
            url['deviceDescription'], url['deviceDetailInfo'],ifsale, url['addTime'])
        
        sql += " where guid='%s'"%(url['guid'])

    print sql
    
    # Gettting data from db
    db = doDB.sqldb(cfg=doDB.cfg)

    res = db.sqldb_query(sql)
    print res
        
    db.sqldb_close()

    print "url['FromTable']",url['FromTable']
    # Update Project Device 
    update_project_device(url['ownProject'], guid, url['isProjectDevice'],url['FromTable'])

    msg = "SUCCESS"

    #更新关联设备
    if OPT_ADD == opt:
        UpdateDeviceVirtualInfo(url['ownProject'], url['alreadyDevice'].split(","), dataguid=dataguid)
    else:
        UpdateDeviceVirtualInfo(url['ownProject'], url['alreadyDevice'].split(","), guid=guid)
    
    # Output
    #output.write(CONTENT_TYPE_HEAD)
    #output.write(msg)
    return HttpResponse(msg)

def DelVirtualDevice(request):
    '''virtual_device->DelVirtualDevice： 删除虚拟设备
    请求: http://127.0.0.1:8080/CustFlow/servlet/DelVirtualDeviceServlet?Guid=B4B2AAAC-71DE-402A-A2EA-64D654DF4D1E&FromTable=device_cust&random=cb9dfc42-6109-0d61-63b7-67a71f8043ae&Action=get
    返回: SUCCESS
    '''
    s="?"+request.META['QUERY_STRING']
    url = getUrlData(s)
    #url = getUrlData(env)
    print url
    print "Into DelVirtualDevice"

    sql = "DELETE from %s where guid='%s'"%(url['FromTable'],url['Guid']);

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

def GetDeviceIDMap(proguid=None, exclude_dataguid=None):
    '''GetDeviceIDMap(proguid=None, exclude_dataguid=None): 根据device guid 生成map
        proguid： 项目id
        exclude_dataguid：需要剔除的dataguid设备
    '''
    device_map = {}

    if proguid == None:
        return device_map

    # Gettting data from db
    db = doDB.sqldb(cfg=doDB.cfg)
        
    ## 客流量设备
    sql = "SELECT * FROM  device_cust WHERE proguid='%s'"%(proguid)
    if exclude_dataguid is not None:
        sql += " and dataguid!='%s'"%( exclude_dataguid)

    res = db.do_select(sql)
    for i in xrange(res[0]):
        device_map[res[1][i]['guid']] = res[1][i]

    ##年龄属性
    sql = "SELECT * FROM  device_age WHERE proguid='%s'"%(proguid)
    if exclude_dataguid is not None:
        sql += " and dataguid!='%s'"%( exclude_dataguid)

    res = db.do_select(sql)
    for i in xrange(res[0]):
        device_map[res[1][i]['guid']] = res[1][i]

    ##热区
    sql = "SELECT * FROM  device_heat WHERE proguid='%s'"%(proguid)
    if exclude_dataguid is not None:
        sql += " and dataguid!='%s'"%( exclude_dataguid)

    res = db.do_select(sql)
    for i in xrange(res[0]):
        device_map[res[1][i]['guid']] = res[1][i]

    return device_map

def GetRightLeftDevice(request):
    '''virtual_device->GetRightLeftDevice: 获取虚拟设备绑定设备列表
    请求: http://127.0.0.1:8080/CustFlow/servlet/GetRightLeftDeviceServlet?
    proguid=8fcfe580-d63e-4a20-8ffd-32c89a3c7162&virtualguid=21F8A444-93D2-4158-BEC4-3A5951B3BA1F&random=4f2ab348-649a-39ae-504d-d2c9143faab0&Action=get
    返回: 
        JSON:
        alreadyDevice=[obj]
            obj:
                guid "e5f57fdc-5e78-4bc1-9d37-255ecb1eaa95" 
                name "真实测试2222222222222222222222222222"
        alternativeDevice=[obj]
            obj:
                guid "e5f57fdc-5e78-4bc1-9d37-255ecb1eaa95" 
                name "真实测试2222222222222222222222222222"
    '''
    s="?"+request.META['QUERY_STRING']
    url = getUrlData(s)
    #url = getUrlData(env)

    #print url
    print "Into GetRightLeftDevice"
 
    # Init ret msg data
    msg={}
    msg['alreadyDevice'] = []
    msg['alternativeDevice'] = []

    # Gettting data from db
    db = doDB.sqldb(cfg=doDB.cfg)

    ## 获取虚拟设备已经选择列表
    ### 人流量设备 or 年龄设备 or 热区
    sql = "SELECT a.guid as guid,a.name as name, isvirtual from %s as a left join device_virtual as \
b on a.guid=b.childdeviceguid where b.virtualguid='%s' order by a.addtime desc;"%(url['strFromTable'],url['virtualguid'])
    #print sql

    res = db.do_select(sql)
    if res[0] > 0:
        msg['alreadyDevice'].extend(res[1])

    ## 获取项目所有设备列表
    ### 人流量设备 or 年龄设备 or 热区
    sql = "SELECT guid, name, isvirtual from %s where proguid='%s' and dataguid!='%s' order by addtime desc;"%(url['strFromTable'],url['proguid'], url['virtualguid'])
    #print sql

    res = db.do_select(sql)
    if res[0] > 0:
        msg['alternativeDevice'].extend(res[1])

    # Output
    #output.write(CONTENT_TYPE_HEAD)
    #output.write(json.dumps(msg))
    return HttpResponse(json.dumps(msg))

def CustSales(request):
    '''virtual_device->CustSalesServlet: 获取虚拟设备列表
      项目全部  : http://127.0.0.1:8080/CustFlow/servlet/CustSalesServlet?nowDate=2013-10-01&\
    deviceGuid=21F8A444-93D2-4158-BEC4-3A5951B3BA1F&random=5305df0d-ebc3-5af1-0518-d322def64913&Action=get
    项目设备名: http://127.0.0.1:8080/CustFlow/servlet/CustSalesServlet?beginIndex=0&endIndex=10&proguid=8fcfe580-d63e-4a20-8ffd-32c89a3c7162&devicename=1&random=1ef03939-8c78-aeec-d502-d3d54610f88b&Action=get
        http://127.0.0.1:8080/CustFlow/servlet/VirtualDeviceListServlet?beginIndex=0&endIndex=12&proguid=8fcfe580-d63e-4a20-8ffd-32c89a3c7162&random=8e47c6e2-63c1-5e1f-7226-f1010e904f77&Action=get
    返回: SUCCESS:

    '''
    s="?"+request.META['QUERY_STRING']
    url = getUrlData(s)
    #url = getUrlData(env)
    #print url
    #print "Into CustSalesServlet"

      
    # Gettting data from db, 数据配置 初始化
    db = doDB.sqldb(cfg=doDB.cfg)

    #首先判断语句是否存在
    sql = "SELECT id from cust_sales where dataguid='%s' and curtime='%s'"%(url['deviceGuid'], url['nowDate'])
    res = db.do_insert(sql)

    if res[0]>0:

        ## TODO 两个表合并
        ## 从客流量设备表查询
        ##sql = "UPDATE name as strDeviceName, guid as strGuid, dataguid as strDataGuid FROM device_cust where isvirtual=true and proguid='%s'"%(url['deviceGuid'])
        ##and proguid='%s'"%(url['proguid'])
        sql = "UPDATE cust_sales set `sales` = '%s', `orders` = '%s' where id = '%s'"%( url['sales'], url['orders'], res[1][0]['id'])
        #res = db.do_select(sql)
        res = db.do_update(sql)
    else:
        sql = "INSERT INTO cust_sales (`dataguid`, `sales`, `orders`, `curtime`) VALUES ('%s', '%s', '%s', '%s')"%(url['deviceGuid'], url['sales'], url['orders'], url['nowDate'],)
        #res = db.do_select(sql)
        res = db.do_insert(sql)
    
    # Init ret msg data

    msg = 'SUCCESS'
    
    #print msg

    # Output
    #output.write(CONTENT_TYPE_HEAD)
    #output.write(msg)
    return HttpResponse(msg)
    
def SalesInfo(request):
    ''' statistic->SalesInfoServlet: 提取销售信息，返回数据
    请求: http://127.0.0.1:8080/CustFlow/servlet/SalesInfoServlet?startDate=2013-11-18&\
    endDate=2013-11-18&dataGuid=30b96c4a-728b-4e0b-9dba-fd97f0a6f3eb&\
    &random=f41d4569-8fdd-5743-7e88-0efcb6d292dc&Action=get
    返回: {"Sales":0,"Orders":12}

    msg={}
    msg['Sales']=10
    msg['Orders']=20
    '''
    print "Into SalesInfoServlet" 
    s="?"+request.META['QUERY_STRING']
    url = getUrlData(s)
    #url = getUrlData(env)
    #print url
    #print "Into SalesInfoServlet"

    ##db 初始化配置
    db = doDB.sqldb(cfg=doDB.cfg)

    sql = "select DATE_FORMAT(curtime, '%%Y-%%m-%%d') as day, Sales, Orders from cust_sales where dataguid = '%s' and DATE_FORMAT(curtime, '%%Y-%%m-%%d') >='%s' \
and DATE_FORMAT(curtime, '%%Y-%%m-%%d')<='%s' order by curtime;"%(url['dataGuid'],url['startDate'], url['endDate'])

    #print sql

    ## 获取DB数据
    res = db.do_select(sql)

    db.sqldb_close()

    ''' 计算格式化数据 '''
    ## 初始化返回数据
    msg = res
##    msg = {}
##    va = res[1]
##    msg['Sales'] = 0
##    msg['Orders'] = 0
##
##    if res[0]>0:
##            msg['Sales'] = res[1][0]['Sales']
##            msg['Orders'] = res[1][0]['Orders']
    ''' 计算格式化数据 '''

    dayList = make_day_list(url['startDate'], url['endDate'])
    ## 初始化返回数据
    msg = {}
    msg['Sales'] = []
    msg['Orders'] = []
    msg['categories'] = []

    

    ## 初始化临时存储数据结构
    day_dict = {}
    for day in dayList:
        day_dict[day] = {}
        day_dict[day]['x_date'] = '-'.join(day.split('-')[0:])
        day_dict[day]['y_sales'] = 0
        day_dict[day]['Z_orders'] = 0

    #print day_dict

    ## 赋值
    if res[0] > 0:
        for i in xrange(res[0]):
                sales = res[1][i]
                day_dict[str(sales['day'])]['y_sales'] = int(sales['Sales'])
                day_dict[str(sales['day'])]['Z_orders'] = int(sales['Orders'])

    ## 
    for key in dayList:
        msg['Orders'].append(day_dict[key]['Z_orders'])
        msg['Sales'].append(day_dict[key]['y_sales'])
        msg['categories'].append(day_dict[key]['x_date'])        

    #print msg
        # Output
    #output.write(CONTENT_TYPE_HEAD)
    #output.write(json.dumps(msg))
    return HttpResponse(json.dumps(msg))

def exportPDF(request):

    #exportPDFServlet
    s="?"+request.META['QUERY_STRING']
    url = getUrlData(s)
    #url = getUrlData(env)
    #print url
    
    d = Drawing(300, 300)
    s = String(50, 50, url['proName'], textAnchor='middle') 
    d.add(s)
    s = String(50, 50, url['nowDate'], textAnchor='middle') 
    d.add(s)
    s = String(50, 50, url['peoCount'], textAnchor='middle') 
    d.add(s)

    renderPDF.drawToFile(d, '../html/CustFlow/pdf/hello.pdf', 'A simple PDF file')

    msg = {}
        # Output
    #output.write(CONTENT_TYPE_HEAD)
    #output.write(json.dumps(msg))
    return HttpResponse(json.dumps(msg))
