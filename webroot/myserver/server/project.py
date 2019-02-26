#!/usr/bin/python
# -*- coding: utf8 -*-

from utils import *
from common import *
from custom_utils import *
import uuid
import json
import doDB 
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

def project_already_exist(name):
    ''' def project_already_exist(name): 检查是否已经存在项目名称
    '''

    sql = "select name from project where name='%s'"%(name)
    
    # Gettting data from db
    db = doDB.sqldb(cfg=doDB.cfg)

    res = db.sqldb_query(sql)

    if res[0] > 0:
        return True

    return False

def AddProject(request):
    ''' project->AddProject: 增加/修改项目信息
       新增: http://127.0.0.1:8080/CustFlow/servlet/AddProjectServlet?guid=&projectName=test1&projectDescription=test1%E9%A1%B9%E7%9B%AE%E6%8F%8F%E8%BF%B0&addTime=&responsiblePerson=test1%E8%B4%9F%E8%B4%A3%E4%BA%BA&projectDetailInfo=test1%E9%A1%B9%E7%9B%AE%E8%AF%A6%E7%BB%86%E4%BF%A1%E6%81%AF&random=b0459ed4-ae8f-f1af-a142-399d5baaa59c&Action=get
       修改: http://127.0.0.1:8080/CustFlow/servlet/AddProjectServlet?guid=17BBB3C5-185A-40A6-98A9-2B11A758AB60&projectName=test1&projectDescription=test1%E9%A1%B9%E7%9B%AE%E6%8F%8F%E8%BF%B01&addTime=2013-10-28%2014:29:24&responsiblePerson=test1%E8%B4%9F%E8%B4%A3%E4%BA%BA&projectDetailInfo=test1%E9%A1%B9%E7%9B%AE%E8%AF%A6%E7%BB%86%E4%BF%A1%E6%81%AF&random=af0cb93e-d588-f543-ded0-f79e3d03b6ff&Action=get
    返回:SUCCESS
               id: 10
             guid: 42712890-A914-412D-B472-3F52212859D9
             name: 1
         isusable: 
responsibleperson: 11
      description: 111
           remark: 1111
          addtime: 2013-11-16 23:37:08

    '''
    s="?"+request.META['QUERY_STRING']
    url = getUrlData(s)
    #url = getUrlData(env)
    print url
    print "Into AddProject"

    msg = "FAILED"

    opt = OPT_ADD
    if url['guid'] != '':
        opt = OPT_MODIFY

    ## Do operation
    if OPT_ADD == opt:
        sql = "INSERT INTO project (`guid`, `name`, `isusable`, `responsibleperson`, `description`, `remark`, `addtime`) VALUES ('%s', '%s', True, '%s', '%s', '%s', '%s')"%(uuid.uuid1().hex, url['projectName'], url['responsiblePerson'], url['projectDescription'], url['projectDetailInfo'], get_time())

        if project_already_exist(url['projectName']):
            msg = "UNIQUENAMEERROR"
        
    elif OPT_MODIFY == opt:
        sql = "UPDATE project set name='%s', isusable=True, responsibleperson='%s', description='%s', remark='%s', addtime='%s'"  \
            %(url['projectName'], url['responsiblePerson'], url['projectDescription'], url['projectDetailInfo'], url['addTime'])
        
        sql += " where guid='%s'"%(url['guid'])

    print sql

    ## 数据有效后通过
    if msg not in ['UNIQUENAMEERROR']:
        # Update DB
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

def GetProjectType(request):
    '''project->GetProjectType: Getting project list'''
    s="?"+request.META['QUERY_STRING']
    url = getUrlData(s)
    #url = getUrlData(env)
    print url
    print "Into GetProjectType"

    '''
    返回格式:
        <option value='-1'>--请选择项目--</option>
        <option value ='8fcfe580-d63e-4a20-8ffd-32c89a3c7162'>五角场万达</option>
        <option value ='52767307-243F-4774-A1C8-4A307B31D4F3'>宝山万达</option>
    '''

    # 1. 查询数据内容
    db = doDB.sqldb(cfg=doDB.cfg)

    # TODO isusable=1 ? 是否要加
    sql = "select guid,name from project order by id;"

    res = db.do_select(sql)
    if 'EN' in url:
        msg="<option value='-1'>--Please Select The Project--</option>\n"
    else:
        msg="<option value='-1'>--请选择项目--</option>\n"

    if res[0] > 0:
        for i in xrange(res[0]):
            msg += "<option value='%s'>%s</option>\n"%(res[1][i]['guid'], res[1][i]['name'])

    # 2. Output
    #output.write(CONTENT_TYPE_HEAD)
    #output.write(msg)
    return HttpResponse(msg)


def ProjectList(request):
    ''' project->ProjectList: 获取项目列表
    项目搜索: http://127.0.0.1:8080/CustFlow/servlet/ProjectListServlet?beginIndex=0&endIndex=10&random=d4b5ba53-4eb8-6848-0343-4901e9716606&Action=get
    返回: {"itemCount":0,"projectList":[]}
    {"itemCount":5,"projectList":[{"strProjectName":"test1","strGuid":"17BBB3C5-185A-40A6-98A9-2B11A758AB60","strTime":"2013-10-28 14:29:24","strProjectDescription":"test1项目描述1"},{"strProjectName":"林林林林林林林林林林林林林林林林林林林林林林林林林林林林林林林林林林林林林林林林林林林林林林林林林林","strGuid":"CF4F46DF-2E1A-4BD9-B042-EAE629FCA7FA","strTime":"2013-09-29 17:19:40","strProjectDescription":"6666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666699999999999999999999999999999999999"},{"strProjectName":"宝山万达","strGuid":"52767307-243F-4774-A1C8-4A307B31D4F3","strTime":"2013-09-29 17:12:44","strProjectDescription":"描述什么2呢描述什么2呢描述什么2呢描述什么2呢描述什么2呢描述什么2呢描述什么2呢描述什么2呢描述什么2呢描述什么2呢描述什么2呢描述什么2呢描述什么2呢"},{"strProjectName":"松江高科技园区","strGuid":"5A6D2D1B-6E84-4B83-9107-07D18D120D69","strTime":"2013-09-24 17:17:56","strProjectDescription":"8"},{"strProjectName":"五角场万达","strGuid":"8fcfe580-d63e-4a20-8ffd-32c89a3c7162","strTime":""}]}
    '''
    s="?"+request.META['QUERY_STRING']
    url = getUrlData(s)
    #url = getUrlData(env)
    print url
    print "Into ProjectList"

    # Init ret msg data
    msg={}
    projectList=[]
    msg['projectList']=[]
    msg['itemCount']=0
    
    # Gettting data from db

    db = doDB.sqldb(cfg=doDB.cfg)

    sql = "SELECT guid as strGuid, name as strProjectName, description as strProjectDescription, responsibleperson as responsiblePerson, remark as projectDetailInfo,bin(isusable) as isUsable FROM project "

    if 'projectname' in url:
        sql += "where name like '%%%s%%'"%(url['projectname'])

    sql += "order by id desc;"

    print sql

    res = db.do_select(sql)

    if res[0] > 0:
        for i in xrange(res[0]):
            res[1][i]['projectStatus'] = get_project_status(res[1][i]['strGuid'])
        projectList=res[1]
        msg['itemCount']=res[0]

    msg['projectList'] = projectList[int(url['beginIndex']):int(url['endIndex'])]
    
    # Output
    #output.write(CONTENT_TYPE_HEAD)
    #output.write(json.dumps(msg))
    return HttpResponse(json.dumps(msg))



def ProDetail(request):
    ''' project->ProDetail: 获取项目详细信息
    请求: http://127.0.0.1:8081/CustFlow/servlet/ProDetailServlet?Guid=3931E867-B4D0-4838-8577-4571BAE8E510&random=a99d6831-2297-b40b-8e0e-b090bdd0ac31&Action=get
    回应: {"responsiblePerson":"rayeye","projectName":"五角场万达","addTime":"2013-11-01 09:11:07"}

    '''
    s="?"+request.META['QUERY_STRING']
    url = getUrlData(s)
    #url = getUrlData(env)
    print url
    print "Into ProDetail"

    # Init ret msg data
    msg={}

    # Gettting data from db
    sql = "select name as projectName, responsibleperson as responsiblePerson, description as projectDescription, \
        remark as projectDetailInfo, addtime as addTime from project where guid='%s'"%(url['Guid'])

    #print sql

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

# 获取返回项目options清单
def GetProjectDevice(request):
    ''' project->GetProjectDevice: 返回项目设备信息
    请求: http://127.0.0.1:8080/CustFlow/servlet/GetProjectDeviceServlet?proguid=8fcfe580-d63e-4a20-8ffd-32c89a3c7162&random=7a819427-573f-56e1-23e6-691d9e385dbe&Action=get
    返回: {"guid":"21F8A444-93D2-4158-BEC4-3A5951B3BA1F"}
    '''

    s="?"+request.META['QUERY_STRING']
    url = getUrlData(s)
    #url = getUrlData(env)
    print url
    print "Into GetProjectDevice"

    # 初始化返回值
    msg=[]

    proTypeTable = ''

    if url['device_type'] =="device_cust":
        proTypeTable = 'project_device_cust'
    if url['device_type'] =="device_age":
        proTypeTable = 'project_device_age'
        
    # 获取数据
    # FIXME 返回的是设备dataguid
    sql = "select devicedataguid as guid from %s where proguid='%s';"%(proTypeTable,url['proguid'])
    db = doDB.sqldb(cfg=doDB.cfg)

    res = db.do_select(sql)
    print res

    if res[0] > 0:
        msg=res[1][0]

    # 2. Output
    #output.write(CONTENT_TYPE_HEAD)
    #output.write(json.dumps(msg))
    return HttpResponse(json.dumps(msg))

def ChangeProjectState(request):
    ''' project->ChangeProjectState: 改变项目状态
    请求: http://127.0.0.1:8080/CustFlow/servlet/ChangeProjectStateServlet?Guid=4c5f14b2-4ed7-11e3-aa50-9c4e36c5898c&isUsable=false&random=eb4c1b0c-35b0-f9a7-da89-8a37c71a6c64&Action=get
    返回: {"isUsable":"0"}
    '''
    s="?"+request.META['QUERY_STRING']
    url = getUrlData(s)
    #url = getUrlData(env)
    print url
    print "Into ChangeProjectState"

    # TODO 
    isUsage = 0
    if url['isUsable'] == 'true':
        isUsage = 1


    sql = "UPDATE project set isusable=b'%d' where guid='%s'"%(isUsage, url['Guid'])

    print sql

    # Gettting data from db
    db = doDB.sqldb(cfg=doDB.cfg)

    res = db.do_update(sql)

    msg = {}
    msg['isUsable']=isUsage
    msg['projectStatus']=get_project_status(url['Guid'])

    # Output
    #output.write(CONTENT_TYPE_HEAD)
    #output.write(json.dumps(msg))
    return HttpResponse(json.dumps(msg))
@csrf_exempt
def Uploadlogo(request):
    print 'Into Uploadlogo'
    s="?"+request.META['QUERY_STRING']
    url = getUrlData(s)
    msg = []
    msg='Failed'
    file_obj = request.FILES.get('file', None)
    #print file_obj
    if file_obj:
        if 'EN' in url:
            logo_name='../CustFlow/images/logo/'+url['proguid']+'.png'
        else:
            logo_name='../CustFlow/CH/images/logo/'+url['proguid']+'.png'
        dest = open(logo_name,'wb+')
        dest.write(file_obj.read())
        dest.close()
        msg='SUCCEED'
    else:
        msg='Failed'
   

    # Output
    #output.write(CONTENT_TYPE_HEAD)
    #output.write(json.dumps(msg))
    return HttpResponse(json.dumps(msg))


