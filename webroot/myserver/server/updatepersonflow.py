# -*- coding: utf8 -*-
from django.http import HttpResponse
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
    print url
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

    print day_dict

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
