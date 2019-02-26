#!/usr/bin/python
# -*- coding: utf8 -*-

from utils import *
from custom_utils import *
from common import *
from datetime import *
import uuid
import json
import doDB
import  datetime 
from django.http import HttpResponse
############################################################################
class statistic_req:
    ''' class statistic_req: 统计分析基础类 '''

    ## 每日默认统计间隔时间
    DEFAULT_INTERVAL = 15


    ## 年龄查询默认分配间隔
    AGE_KEYNAME='ageCount'
    AGE_LIST=[0, 15, 25, 30, 35, 40, 45, 55, 65]

    def __init__(self, request, interval=None):

        # 输入值
        #self.env = env
        #self.bodysize = bodysize
        #self.input = input
        #self.output = output
        self.request = request
        if interval == None:        # Minitues
            self.interval = statistic_req.DEFAULT_INTERVAL
        else:
            self.interval = interval

        # 本地数据
        self.ishwslgy=0
        self.req = {}         # Get请求数据字典
        self.day_list = []    # 有效日期列表
        self.time_list = []   # 时间间隔列表
        self.device_list = [] # 有效dataguid设备列表
        self.data = {}        # get_data数据库返回数据

        # 返回值
        self.msg = {}

    def get_time_key(self, curtime):
        ''' get_time_key(self, curtime): 根据当前分割间隔，获取当前时间对应得time_key，
            用于时间分割信息定位
        '''
        key=0
        time_second = day_time_offset(curtime)
        for v in self.time_list:
            if time_second < v:
                break
            else:
                key = v

        return key

    def get_age_key(self, age):
        ''' get_age_key(self, age): 根据当前年龄分割定义，获取输入年龄得范围key
        '''
        key=0
        for v in statistic_req.AGE_LIST:
            if age < v:
                break
            else:
                key = v

        return key

    def check_active_time_list(self, begin_time, end_time):
        ''' check_active_time_list(check_start_time, check_stop_time) 调整列表，获取有效时间范围内数据
        '''
        result = []

        begin_key = self.get_time_key(begin_time)
        end_key = self.get_time_key(end_time)

        valid = 0
        for v in self.time_list:
            if v == begin_key:
                valid = 1
            elif v == end_key:
                valid = 0
                result.append(v)
                break

            if valid:
                result.append(v)

        return result

    def get_data(self):
        ''' 数据库读取数据 '''
        pass

    def format_data(self):
        ''' 计算格式化数据 '''
        pass

    def output_data(self):
        ''' 返回数据 '''
        #self.output.write(CONTENT_TYPE_HEAD)
        #self.output.write(json.dumps(self.msg))
        return json.dumps(self.msg)

    def produce(self):
        ''' class statistic_req: def product() 处理生成返回统计数据 '''

        ##  1. 分解URL Get请求信息字典
        s="?"+self.request.META['QUERY_STRING']
        url = getUrlData(s)
        #self.req = getUrlData(self.env)
        self.req = url
        #print "req:", self.req

        ## 1.1) 日期范围列表
        if 'startDate' in self.req and 'endDate' in self.req:
            self.day_list = make_day_list(self.req['startDate'], self.req['endDate'])

        ## 1.2) 时间间隔列表
        self.time_list = make_day_time_list(self.interval)

        ##查询设备是否为虚拟设备
        sql = "select isvirtual from device_cust where dataguid = '%s'; "%(self.req['deviceGuid'])
        db = doDB.sqldb(cfg=doDB.cfg)
        res = db.do_select(sql)
        if res[0] > 0:
            self.req['isvirtual'] = res[1][0]['isvirtual']

        sql = "select isvirtual from device_age where dataguid = '%s'; "%(self.req['deviceGuid'])
        res = db.do_select(sql)
        db.sqldb_close()
        if res[0] > 0:
            self.req['isvirtual'] = res[1][0]['isvirtual']
        
        ## 2. 获取虚拟设备对应物理设备信息
        if self.req['isvirtual'] in ["\x01", "1"]:
            self.device_list = GetActualDeviceDataGuidList(self.req['deviceGuid'], isvirtual=True)
        else:
            self.device_list = GetActualDeviceDataGuidList(self.req['deviceGuid'], isvirtual=False)

        #print "self.device_list", self.device_list

        ## 数据库读取数据
        if len(self.device_list) > 0:
            self.data = self.get_data()

        ## 计算格式化数据
        self.msg = self.format_data()

        ## 返回数据
        return self.output_data()

class InOutFlowCountReq(statistic_req):
    ''' statistic->InOutFlowCountReq: 人流量表查询统计查询
    请求: http://127.0.0.1:8080/CustFlow/servlet/InOutFlowCountServlet?startDate=2013-10-01&endDate=2013-10-28&deviceGuid=21F8A444-93D2-4158-BEC4-3A5951B3BA1F&isvirtual=1&random=d9e22eef-79a9-5167-20de-75bbc4df10f4&Action=get
    返回: {"column":[0,0,0,0,0,26,0,0,8,8,0,0,0,0,0,0,85,0,0,0,0,0,0,0,0,0,0,0],"categories":["10.1","10.2","10.3","10.4","10.5","10.6","10.7","10.8","10.9","10.10","10.11","10.12","10.13","10.14","10.15","10.16","10.17","10.18","10.19","10.20","10.21","10.22","10.23","10.24","10.25","10.26","10.27","10.28"]}
    '''
    def get_data(self):
        ''' 数据库读取数据 '''
        '''海湾森林公园数据设备列表查询'''
        
        print 'into InOutFlowCountReq'
        self.ishwslgy=0
        devicelist_hw=[]
        sql = "SELECT dataguid as strGuid FROM device_cust where  proguid='3b609868e64c11e38dbc00163e002ba0'"
        db = doDB.sqldb(cfg=doDB.cfg)
        res = db.do_select(sql)
 
        if res[0]>0:
            for i in xrange(res[0]):
                devicelist_hw.append(res[1][i]['strGuid'])
        sql = "SELECT dataguid as strGuid FROM device_age where  proguid='3b609868e64c11e38dbc00163e002ba0'"
        db = doDB.sqldb(cfg=doDB.cfg)
        res = db.do_select(sql)
        if res[0]>0:
            for i in xrange(res[0]):
                devicelist_hw.append(res[1][i]['strGuid'])
        sql = "SELECT dataguid as strGuid FROM device_heat where  proguid='3b609868e64c11e38dbc00163e002ba0'"
        db = doDB.sqldb(cfg=doDB.cfg)
        res = db.do_select(sql)
        if res[0]>0:
            for i in xrange(res[0]):
                devicelist_hw.append(res[1][i]['strGuid'])
        #print len(devicelist_hw)
        #print devicelist_hw
        #print self.req['deviceGuid']
        '''判断是否在列表内'''
        for i in xrange(len(devicelist_hw)):
            if devicelist_hw[i]==self.req['deviceGuid']:
                #print devicelist_hw[i]
                self.ishwslgy=1
        sql = "select sum(innum) as inall, sum(outnum) as outall, (sum(innum)+sum(outnum))/2 as inout_aver, DATE_FORMAT(curtime, '%Y-%m-%d') as day from inoutnum where dataguid in ("
        #print self.device_list
        device_num = len(self.device_list)

        for  i in xrange(device_num):
            sql += "'%s'"%(self.device_list[i])
            if i < device_num-1:
                sql += ","

##        sql += ") and curtime>'2014-01-10 00:00:00' and curtime<'%s 23:59:59' and DATE_FORMAT(curtime, '%H:%m:00') > \
##'09:00:00' and DATE_FORMAT(curtime, '%H:%m:00') < '21:00:00' group by day;"%(2014-05-15)
        sql += ") and curtime>'%s 00:00:00' and curtime<'%s 23:59:59' and DATE_FORMAT(curtime, '%%H:%%m:00') >\
'%s' and DATE_FORMAT(curtime, '%%H:%%m:00') < '%s' group by day;"%(self.req['startDate'], self.req['endDate'],self.req['startTimeGap'], self.req['endTimeGap'])
##        and DATE_FORMAT(curtime, '%H:%m:00') < '%s' group by day;"%(self.req['startDate'], self.req['endDate'],
        #self.req['startTimeGap'], self.req['endTimeGap'])
        #print sql

        ## 获取DB数据
        db = doDB.sqldb(cfg=doDB.cfg)
        res = db.do_select(sql)

        db.sqldb_close()
        return res

    def format_data(self):
        #print self.ishwslgy
        ''' 计算格式化数据 '''
        ## 初始化返回数据
        msg = {}
        msg['inall'] = []
        msg['outall'] = []
        msg['column'] = []
        msg['categories'] = []

        ## 初始化临时存储数据结构
        day_dict = {}
        for day in self.day_list:
            day_dict[day] = {}
            day_dict[day]['x_month_day'] = '-'.join(day.split('-')[1:])
            day_dict[day]['y_inout_aver'] = 0
            day_dict[day]['inall'] = 0
            day_dict[day]['outall'] = 0

        ## 赋值
        if len(self.data) > 0:
            for i in xrange(self.data[0]):
                inout = self.data[1][i]
                #森林公园数据修改
                if self.ishwslgy==1:
                    #print '修改海湾森林公园数据'
                    print datetime.datetime.strptime(self.day_list[i],'%Y-%m-%d').isoweekday()
                    
                    inout['inout_aver']=int(int(inout['inout_aver'])*9)
                    inout['inall']=int(int(inout['inall'])*9)
                    inout['outall']= int(int(inout['outall'])*9)
                day_dict[str(inout['day'])]['y_inout_aver'] = int(inout['inout_aver'])
                day_dict[str(inout['day'])]['inall'] = int(inout['inall'])
                day_dict[str(inout['day'])]['outall'] = int(inout['outall'])

        ## X轴-天(对应日期)，Y轴-柱状图(每日人数)
        for key in self.day_list:
            msg['inall'].append(day_dict[key]['inall'])
            msg['outall'].append(day_dict[key]['outall'])
            #人流量为出入口相加除以2，暂改为纯入口
            #msg['column'].append(day_dict[key]['y_inout_aver'])
            msg['column'].append(day_dict[key]['inall'])
            msg['categories'].append(day_dict[key]['x_month_day'])
        return msg

class AverageStayTimeReq(statistic_req):
    '''  statistic->AverageStayTimeReq:计算 平均停留时间返回数据
    请求: http://127.0.0.1:8080/CustFlow/servlet/AverageStayTimeServlet?startDate=2013-10-01&endDate=2013-10-28&\
    deviceGuid=21F8A444-93D2-4158-BEC4-3A5951B3BA1F&isvirtual=1&random=5305df0d-ebc3-5af1-0518-d322def64913&Action=get
    返回: {"column":[0,0,0,0,0,491,0,0,53,12,0,0,0,0,0,0,90,0,0,0,0,0,0,0,0,0,0,0],"categories":["10.1","10.2","10.3","10.4","10.5","10.6","10.7","10.8","10.9","10.10","10.11","10.12","10.13","10.14","10.15","10.16","10.17","10.18","10.19","10.20","10.21","10.22","10.23","10.24","10.25","10.26","10.27","10.28"]}

    msg={}
    msg['column']=[10,20]
    msg['categories']=["10.1","10.2"]
    '''

    def get_data(self):
        ''' 数据库读取数据 '''

        sql = "select innum, outnum, unix_timestamp(curtime) as timestamp, DATE_FORMAT(curtime, '%Y-%m-%d') as day from inoutnum where dataguid in ("

        device_num = len(self.device_list)

        for  i in xrange(device_num):
            sql += "'%s'"%(self.device_list[i])
            if i < device_num-1:
                sql += ","

##        sql += ") and curtime>'%s 00:00:00' and curtime<'%s 23:59:59' order by curtime;"%(self.req['startDate'], self.req['endDate'])
        sql += ") and curtime>'%s 00:00:00' and curtime<'%s 23:59:59' and DATE_FORMAT(curtime, '%%H:%%m:00') >\
'%s' and DATE_FORMAT(curtime, '%%H:%%m:00') < '%s' order by curtime;"%(self.req['startDate'], self.req['endDate'],self.req['startTimeGap'], self.req['endTimeGap'])
##      DATE_FORMAT(`heatmap`.`time`, '%H:%m:%s') < '16:00:00'
        #print sql

        ## 获取DB数据
        db = doDB.sqldb(cfg=doDB.cfg)
        res = db.do_select(sql)

        db.sqldb_close()

        return res

    def format_data(self):
        ''' 计算格式化数据 '''
        ## 初始化返回数据
        msg={}
        msg['column']=[]
        msg['categories']=[]

        ## 初始化临时存储数据结构
        ## 数据分析结构
        day_dict = {}
        for day in self.day_list:
            day_dict[day] = {}
            day_dict[day]['data_valid'] = 0          # 数据有效检查状态：0-无效，1-有效：过滤开始只有出没有进得数据
            day_dict[day]['total_in'] = 0            # 当天有效进入人数总和，去除最后只有进，没有出得数据
            day_dict[day]['total_out'] = 0           # 当天有效出去人数总和，去除开始只有出，没有进得数据
            day_dict[day]['actual_person_count'] = 0 # min(total_in,total_out)
            day_dict[day]['average_stay_time'] = 0   # Average stay time in minutes
            day_dict[day]['in_list'] = []            # Incoming timestamp, per person
            day_dict[day]['out_list'] = []           # Outging timestamp, per person


        ## 赋值
        if len(self.data) > 0:
            for i in xrange(self.data[0]):
                inout = self.data[1][i]

                #print inout

                innum = int(inout['innum'])
                outnum = int(inout['outnum'])

               # print 'innum',innum

                #### 数据有效性检查
                if innum == 0 and outnum == 0:
                    continue

                ## 按照时间顺序分析每日数据
                day_key = inout['day']

                #### 每日,开始结束有效性数据过滤
                if not day_dict[day_key]['data_valid']:
                    if innum > 0:
                        day_dict[day_key]['data_valid'] = 1
                    else:
                        continue

                #### 数据统计
                if innum != 0:  # 增加 -1 徘徊处理
                    day_dict[day_key]['total_in'] += innum
                    for i in xrange(innum):
                        if innum == -1:
                            day_dict[day_key]['in_list'].pop()
                        else:
                            day_dict[day_key]['in_list'].append(int(inout['timestamp']))
                        

                if outnum != 0:
                    day_dict[day_key]['total_out'] += outnum
                    for i in xrange(outnum):
                         if innum == -1:
                            day_dict[day_key]['in_list'].pop()
                         else:
                            day_dict[day_key]['out_list'].append(int(inout['timestamp']))


        ## Judging actual_person_count
        for day in self.day_list:
            actual_person_count = min(day_dict[day]['total_in'], day_dict[day]['total_out'])

            in_offset = day_dict[day]['total_in']-actual_person_count
            out_offset = day_dict[day]['total_out']-actual_person_count

            in_sum = sum(day_dict[day]['in_list'][in_offset:])
            out_sum = sum(day_dict[day]['out_list'][:-out_offset])

            if actual_person_count > 0:
                if day_dict[day]['total_out'] > 0 and day_dict[day]['total_in'] > 0:
                    day_dict[day]['average_stay_time'] = (sum(day_dict[day]['out_list'])/len(day_dict[day]['out_list'])\
                                                          - sum(day_dict[day]['in_list'])/len(day_dict[day]['in_list']))/60
                    print "out_list:", day_dict[day]['out_list']
                    print "total_out:", day_dict[day]['total_out']
                    print "in_list:", day_dict[day]['in_list']
                    print "total_in:", day_dict[day]['total_in']
                    print "stay_time",day_dict[day]['average_stay_time']
                    print "out_list_len",len(day_dict[day]['out_list'])
                    print "in_list_len",len(day_dict[day]['in_list'])
                    print "average_out",sum(day_dict[day]['out_list'])/len(day_dict[day]['out_list'])
                    print "average_in",sum(day_dict[day]['in_list'])/len(day_dict[day]['in_list'])
                    print "diff",(sum(day_dict[day]['out_list'])/len(day_dict[day]['out_list'])\
                                                          - sum(day_dict[day]['in_list'])/len(day_dict[day]['in_list']))/60
##                    raw_input( )

                '''
                day_dict[day]['average_stay_time'] = (out_sum-in_sum)/actual_person_count/60
                #day_dict[day]['average_stay_time'] = (sum(day_dict[day]['out_list'][:-out_offset])-sum(day_dict[day]['in_list'][in_offset:]))/day_dict[day]['actual_person_count']/60
                '''

            day_dict[day]['average_stay_time'] = abs(day_dict[day]['average_stay_time'])


            day_dict[day]['actual_person_count'] = actual_person_count

            #print 'acpero', actual_person_count

            if actual_person_count < 10:
                day_dict[day]['average_stay_time'] = 0

            if actual_person_count > 200 and day_dict[day]['average_stay_time']==0:
                day_dict[day]['average_stay_time'] = 3

##            print "== DAY ", day,
##            for key in ['actual_person_count', 'total_in', 'total_out', 'average_stay_time']:
##                print key,'=',day_dict[day][key],
##            print "in_sum:",in_sum,"out_sum:",out_sum,
##            print "in_list len:",len(day_dict[day]['in_list']), "out_list len:", len(day_dict[day]['out_list'])


        ## X轴-(天)对应日期，Y轴-柱状图(平均停留时间 单位:分钟)
        for day in self.day_list:
            msg['categories'].append('-'.join(day.split('-')[1:]))
            msg['column'].append(day_dict[day]['average_stay_time'])



        return msg

class InOutCountChartReq(statistic_req):
    ''' statistic->InOutCountChartReq: 详细进出人数查询
    请求: http://127.0.0.1:8080/CustFlow/servlet/InOutCountChartServlet?startDate=2013-10-28&endDate=2013-10-28&deviceGuid=21F8A444-93D2-4158-BEC4-3A5951B3BA1F&isvirtual=1&random=5b71d0bf-693c-bbf4-ae48-8555c5a2efd7&Action=get
    返回: {"outPersonCount":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"inPersonCount":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}
    msg={}
    msg['outPersonCount']=[10,20]
    msg['inPersonCount']=[20,30]
    '''

    def get_data(self):
        ''' 数据库读取数据 '''

        '''海湾森林公园数据设备列表查询'''
        #print 'into 详细人流量'
        self.ishwslgy=0
        devicelist_hw=[]
        sql = "SELECT dataguid as strGuid FROM device_cust where  proguid='3b609868e64c11e38dbc00163e002ba0'"
        db = doDB.sqldb(cfg=doDB.cfg)
        res = db.do_select(sql)
        if res[0]>0:
            for i in xrange(res[0]):
                devicelist_hw.append(res[1][i]['strGuid'])
        sql = "SELECT dataguid as strGuid FROM device_age where  proguid='3b609868e64c11e38dbc00163e002ba0'"
        db = doDB.sqldb(cfg=doDB.cfg)
        res = db.do_select(sql)
        if res[0]>0:
            for i in xrange(res[0]):
                devicelist_hw.append(res[1][i]['strGuid'])
        sql = "SELECT dataguid as strGuid FROM device_heat where  proguid='3b609868e64c11e38dbc00163e002ba0'"
        db = doDB.sqldb(cfg=doDB.cfg)
        res = db.do_select(sql)
        if res[0]>0:
            for i in xrange(res[0]):
                devicelist_hw.append(res[1][i]['strGuid'])
        #print len(devicelist_hw)
        #print devicelist_hw
        #print self.req['deviceGuid']
        '''判断是否在列表内'''
        for i in xrange(len(devicelist_hw)):
            if devicelist_hw[i]==self.req['deviceGuid']:
                #print devicelist_hw[i]
                self.ishwslgy=1  

        sql = "select innum, outnum, DATE_FORMAT(curtime, '%T') as time from inoutnum where dataguid in ("

        device_num = len(self.device_list)

        for  i in xrange(device_num):
            sql += "'%s'"%(self.device_list[i])
            if i < device_num-1:
                sql += ","
        sql += ") and curtime>'%s 00:00:00' and curtime<'%s 23:59:59' and DATE_FORMAT(curtime, '%%H:%%m:00')>'%s' \
and DATE_FORMAT(curtime, '%%H:%%m:00')<'%s' order by DATE_FORMAT(curtime, '%%T');"%(self.req['startDate'], self.req['endDate'],self.req['startTimeGap'], self.req['endTimeGap'])

        #print sql

        ## 获取DB数据
        db = doDB.sqldb(cfg=doDB.cfg)
        res = db.do_select(sql)

        db.sqldb_close()

        return res

    def format_data(self):
        #print self.ishwslgy
        ''' 计算格式化数据 '''
        ## 初始化返回数据
        msg = {}
        msg['outPersonCount'] = []
        msg['inPersonCount'] = []

        ## 初始化临时存储数据结构
        time_dict = {}   # key:'00:00' 间隔开始时间， value {'inPersonCount':xx,'outPersonCount':xx}
        for v in self.time_list:
            time_dict[v] = {}
            time_dict[v]['outPersonCount'] = 0
            time_dict[v]['inPersonCount'] = 0

        ## 赋值
        if len(self.data) > 0:
            for i in xrange(self.data[0]):
                inout = self.data[1][i]

                ## 定位key值
                key = self.get_time_key(inout['time'])

                

                innum = int(inout['innum'])
                outnum = int(inout['outnum'])

                #print "key[%d] time_second[%d]"%(key, time_second)
                #print inout

                #if innum > 0:
                time_dict[key]['inPersonCount'] += innum
                #if outnum > 0:
                time_dict[key]['outPersonCount'] += outnum
                

        ## X轴-一天24小时时间轴，Y轴-折线图(进入人数+出去人数)
        for key in self.time_list:
            #森林公园数据修改
            if self.ishwslgy==1:
                #print '海湾森林公园数据修改'
                time_dict[key]['inPersonCount']=int(time_dict[key]['inPersonCount']*9)
                time_dict[key]['outPersonCount']= int(time_dict[key]['outPersonCount']*9)
            msg['outPersonCount'].append(time_dict[key]['outPersonCount'])
            msg['inPersonCount'].append(time_dict[key]['inPersonCount'])

        #print msg

        return msg

class StayCountChartReq(statistic_req):
    ''' statistic->GetStayCountChartReq: 计算详细停留人数返回数据
    请求: http://127.0.0.1:8080/CustFlow/servlet/StayCountChartServlet?startDate=2013-10-28&endDate=2013-10-28&deviceGuid=21F8A444-93D2-4158-BEC4-3A5951B3BA1F&isvirtual=1&random=9bd5bbb9-5bd4-81d2-821e-a23bf4002e03&Action=get
    返回: {"stayPersonCount":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}
    '''
    def get_data(self):
        ''' 数据库读取数据 '''

        sql = "select innum, outnum, DATE_FORMAT(curtime, '%Y-%m-%d') as day, DATE_FORMAT(curtime, '%T') as time from inoutnum where dataguid in ("

        device_num = len(self.device_list)

        for  i in xrange(device_num):
            sql += "'%s'"%(self.device_list[i])
            if i < device_num-1:
                sql += ","

        sql += ") and curtime>'%s 00:00:00' and curtime<'%s 23:59:59' order by curtime;"%(self.req['startDate'], self.req['endDate'])

        #print sql

        ## 获取DB数据
        db = doDB.sqldb(cfg=doDB.cfg)
        res = db.do_select(sql)

        db.sqldb_close()

        return res

    def format_data(self):
        ''' 计算格式化数据 '''
        ## 初始化返回数据
        msg = {}
        msg['stayPersonCount'] = []

        ## 初始化临时存储数据结构

        ## 数据分析结构
        day_dict = {}
        for day in self.day_list:
            day_dict[day] = {}
            day_dict[day]['data_valid'] = 0         # 数据有效检查状态：0-无效，1-有效：过滤开始只有出没有进得数据
            day_dict[day]['total_in'] = 0      # 当天有效进入人数总和，去除最后只有进，没有出得数据
            day_dict[day]['total_out'] = 0     # 当天有效出去人数总和，去除开始只有出，没有进得数据
            day_dict[day]['in_ratio'] = 0      # 当天有效进入比率
            day_dict[day]['out_ratio'] = 0     # 当天有效出去比率
            day_dict[day]['actual_person'] = 0 # min(total_in,total_out)
            day_dict[day]['day_time_info'] = {}     # 记录当天每个时间段内统计数据
            for v in self.time_list:
                day_dict[day]['day_time_info'][v] = {}
                day_dict[day]['day_time_info'][v]['in'] = 0          # 时间段内进入人数
                day_dict[day]['day_time_info'][v]['out'] = 0         # 时间段内出去人数

        ## 赋值
        if len(self.data) > 0:
            for i in xrange(self.data[0]):
                inout = self.data[1][i]

                #print inout

                innum = int(inout['innum'])
                outnum = int(inout['outnum'])

                #### 数据有效性检查
                if innum == 0 and outnum == 0:
                    continue

                ## 按照时间顺序分析每日数据
                day_key = inout['day']
                time_key = self.get_time_key(inout['time'])

                #### 每日,开始结束有效性数据过滤 (TODO: 开始ok，结束部分还没处理)
                if not day_dict[day_key]['data_valid']:
                    if innum > 0:
                        day_dict[day_key]['data_valid'] = 1
                    else:
                        continue

                #### 数据统计
                #if innum > 0:
                day_dict[day_key]['total_in'] += innum

                #if outnum > 0:
                day_dict[day_key]['total_out'] += outnum

                ### 时间段统计
                #if innum > 0:
                day_dict[day_key]['day_time_info'][time_key]['in'] += innum
                #if outnum > 0:
                day_dict[day_key]['day_time_info'][time_key]['out'] += outnum

        '''
        for k in self.day_list:
            print "day:",k,
            for key in ['total_in', 'total_out', 'actual_person']:
                print key,"=",day_dict[k][key],
            print
            #for t in self.time_list:
            #    print t,day_dict[k]['day_time_info'][t]
        '''
        '''
        for k in self.day_list:
            print "day:",k,

            for t in self.time_list:
                print t,day_dict[k]['day_time_info'][t]
        '''
        ## X轴-一天24小时时间轴，Y轴-折线图(停留人数)
        ## 计算进出比率
        for day in self.day_list:
            in_ratio = 100
            out_ratio = 100

            if day_dict[day]['total_in'] > 0 and day_dict[day]['total_out'] > 0:
                if day_dict[day]['total_in'] > day_dict[day]['total_out']:
                    in_ratio = 100 - 100*(day_dict[day]['total_in'] - day_dict[day]['total_out'])/day_dict[day]['total_in']
                else:
                    out_ratio = 100 - 100*(day_dict[day]['total_out'] - day_dict[day]['total_in'])/day_dict[day]['total_out']

            #print "day[%s] total_in[%s] total_out[%s] in_ratio[%d%%] out_ratio[%d%%]"%(day, day_dict[day]['total_in'], day_dict[day]['total_out'], in_ratio, out_ratio)

            day_dict[day]['in_ratio'] = in_ratio
            day_dict[day]['out_ratio'] = out_ratio

        #记录这几天进出人数，判断total_in是否与allday_in相等，即剩余时间段数据为0，下班后数据置0
        allday_in=0
        allday_out=0
        for day in self.day_list:
            allday_in += day_dict[day]['total_in']
            allday_out += day_dict[day]['total_out']
        #print allday_in,allday_out
        total_in = 0
        total_out = 0

        for v in self.time_list:
            for day in self.day_list:
                
                #total_in += day_dict[day]['day_time_info'][v]['in']*day_dict[day]['in_ratio']/100
                #total_out += day_dict[day]['day_time_info'][v]['out']*day_dict[day]['out_ratio']/100
                total_in += day_dict[day]['day_time_info'][v]['in']
                total_out += day_dict[day]['day_time_info'][v]['out']
                #print day_dict[day]['day_time_info'][v]['in'],day_dict[day]['day_time_info'][v]['in']*day_dict[day]['in_ratio']/100

            stay_person_count = (total_in - total_out)/len(self.day_list)
            #print day,v,total_in,total_out,stay_person_count
            if stay_person_count < 0 or (total_in==allday_in and total_out==allday_out):
                stay_person_count = 0

            msg['stayPersonCount'].append(stay_person_count)


        return msg

class AgeAttributeChartReq(statistic_req):
    ''' statistic->AgeAttributeChartReq: 计算年龄分布返回数据
    请求: http://127.0.0.1:8081/CustFlow/servlet/AgeAttributeChartServlet?startDate=2013-11-18&endDate=2013-11-18&\
    deviceGuid=dfaf2fd2-4e7d-4e33-a79d-717d6674c1e0&isvirtual=%00&random=05a6e060-1d5c-9f38-343b-f9e648a1027f&Action=get
    返回: {"ageCount45":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"ageCount55":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"ageCount65":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"ageCount35":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"ageCount25":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"ageCount0":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"categories":0,"ageCount30":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"ageCount40":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"ageCount15":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}
    msg={}
    msg['categories']=0
    for item in  ['ageCount0', 'ageCount15', 'ageCount25', 'ageCount30', 'ageCount35', 'ageCount40', 'ageCount45', 'ageCount55', 'ageCount65']:
        msg[item]=[1,2,3] # FIXME
    '''
    def get_data(self):
        ''' 数据库读取数据 '''
        print 'intoage'
 
        sql = "select age, DATE_FORMAT(curtime, '%Y-%m-%d') as day, DATE_FORMAT(curtime, '%T') as time from ageattr where dataguid in ("
        device_num = len(self.device_list)
        for  i in xrange(device_num):
            sql += "'%s'"%(self.device_list[i])
            if i < device_num-1:
                sql += ","

        sql += ") and curtime>'%s 00:00:00' and curtime<'%s 23:59:59'  and DATE_FORMAT(curtime, '%%H:%%m:00')>'%s' \
and DATE_FORMAT(curtime, '%%H:%%m:00')<'%s' and age is not NULL order by curtime;"%(self.req['startDate'], self.req['endDate'],self.req['startTimeGap'], self.req['endTimeGap'])
        #print sql

        ## 获取DB数据
        db = doDB.sqldb(cfg=doDB.cfg)
        res = db.do_select(sql)
        

        db.sqldb_close()
        #print res
        return res

    def format_data(self):
        ''' 计算格式化数据 '''
        ## 初始化返回数据
        msg = {}
        if 'app' in self.req:
            #临时存储
            day_dir={}
            #初始化返回结果
            for age in statistic_req.AGE_LIST:
                key = "%s%d"%(statistic_req.AGE_KEYNAME,age)
                msg[key] = []
            msg['categories'] = []
            #初始化临时数据和赋值日期值
            for day in self.day_list:
                msg['categories'].append('-'.join(day.split('-')[1:]))
                #print day
                #print msg['categories']
                day_dir[day]={}
                for age in statistic_req.AGE_LIST:
                    day_dir[day][age]=0
            if len(self.data) > 0:
                for i in xrange(self.data[0]):
                    item = self.data[1][i]

                    #print item

                    age = int(item['age'])
                    date=item['day']
                    
                    #### 数据有效性检查
                    if not 0 < age < 100:
                        continue
                    for day in self.day_list:
                        if date==day:
                            age_key=self.get_age_key(age)
                            day_dir[day][age_key]+=1
            for day in self.day_list:
                for age in statistic_req.AGE_LIST:
                    key = "%s%d"%(statistic_req.AGE_KEYNAME,age)
                    msg[key].append(int(day_dir[day][age]))
            #print msg
        ## 初始化临时存储数据结构
        ## 数据分析结构
        else:
            msg['categories'] = 0
            for age in statistic_req.AGE_LIST:
                key = "%s%d"%(statistic_req.AGE_KEYNAME,age)
                msg[key] = []

            ## 初始化临时存储数据结构
            ## 数据分析结构
            day_dict = {}
            for day in self.day_list:
                day_dict[day] = {}

                for time in self.time_list:
                    day_dict[day][time] = {}          # 初始化每天每个时间段
                    for age in statistic_req.AGE_LIST:
                        day_dict[day][time][age] = 0  # 初始化每天每个时间段内每个年龄段数量

            ## 赋值
            if len(self.data) > 0:
                for i in xrange(self.data[0]):
                    item = self.data[1][i]

                    #print item

                    age = int(item['age'])

                    #### 数据有效性检查
                    if not 0 < age < 100:
                        continue

                    ## 按照时间顺序分析每日数据
                    day_key = item['day']
                    time_key = self.get_time_key(item['time'])
                    age_key = self.get_age_key(age)

                    #### 数据统计
                    day_dict[day_key][time_key][age_key] += 1

            ## X轴-一天24小时时间轴，Y轴-折线图(多个年龄段统计人数)
            for time in self.time_list:
                for age in statistic_req.AGE_LIST:
                    num = 0
                    for day in self.day_list:
                        num += day_dict[day][time][age]

                    key = "%s%d"%(statistic_req.AGE_KEYNAME,age)

                    msg[key].append(num)

        return msg

class SexAttributeChartReq(statistic_req):
    ''' statistic->GetSexAttributeChart: 计算性别分布返回数据
    请求: http://127.0.0.1:8080/CustFlow/servlet/SexAttributeChartServlet?startDate=2013-11-18&endDate=2013-11-18&deviceGuid=30b96c4a-728b-4e0b-9dba-fd97f0a6f3eb&isvirtual=0&random=f41d4569-8fdd-5743-7e88-0efcb6d292dc&Action=get
    返回: {"maleTotal":0,"maleCount":[0,0,0,0,0,0,0,0,0,0,0,0,0,0],"categories":8,"femaleTotal":0,"femaleCount":[0,0,0,0,0,0,0,0,0,0,0,0,0,0]}

    msg={}
    msg['maleTotal']=10
    msg['maleCount']=[1,2,3,4]
    msg['femaleTotal']=20
    msg['femaleCount']=[2,4,6,8]
    msg['categories']=0
    '''
    def get_data(self):
        ''' 数据库读取数据 '''
        print 'intosex'
        sql = "select sex, DATE_FORMAT(curtime, '%Y-%m-%d') as day, DATE_FORMAT(curtime, '%T') as time from ageattr where dataguid in ("

        device_num = len(self.device_list)

        for  i in xrange(device_num):
            sql += "'%s'"%(self.device_list[i])
            if i < device_num-1:
                sql += ","

        sql += ") and curtime>'%s 00:00:00' and curtime<'%s 23:59:59' and DATE_FORMAT(curtime, '%%H:%%m:00')>'%s' \
and DATE_FORMAT(curtime, '%%H:%%m:00')<'%s'and sex is not NULL order by curtime;"%(self.req['startDate'], self.req['endDate'],self.req['startTimeGap'], self.req['endTimeGap'])

        #print sql

        ## 获取DB数据
        db = doDB.sqldb(cfg=doDB.cfg)
        res = db.do_select(sql)

        db.sqldb_close()

        return res

    def format_data(self):
        ''' 计算格式化数据 '''
        ## 初始化返回数据
        msg = {}
        if 'app' in self.req:
            #临时存储
            day_dir={}
            #初始化返回结果
            msg['maleTotal'] = 0
            msg['maleCount'] = []
            msg['femaleTotal'] = 0
            msg['femaleCount'] = []
            msg['categories'] = []
            #初始化临时数据和赋值日期值
            for day in self.day_list:
                msg['categories'].append('-'.join(day.split('-')[1:]))
                day_dir[day]={}
                day_dir[day]['female']=0
                day_dir[day]['male']=0
            if len(self.data) > 0:
                for i in xrange(self.data[0]):
                    item = self.data[1][i]

                    #print item

                    date=item['day']
                    sex = item['sex']

                    #### 数据统计
                    if sex == '\x01': # 男性
                        day_dir[date]['male'] += 1
                    else:
                        day_dir[date]['female'] += 1
            for day in self.day_list:
                msg['maleCount'].append(int(day_dir[day]['male']))
                msg['femaleCount'].append(int(day_dir[day]['female']))
                msg['maleTotal']+=day_dir[day]['male']
                msg['femaleTotal']+=day_dir[day]['female']
            #print msg
        ## 初始化临时存储数据结构
        ## 数据分析结构
        else:
            msg['maleTotal'] = 0
            msg['maleCount'] = []
            msg['femaleTotal'] = 0
            msg['femaleCount'] = []
            msg['categories'] = 8 # FIXME

            ## 初始化临时存储数据结构
            ## 数据分析结构
            day_dict = {}
            for day in self.day_list:
                day_dict[day] = {}

                for time in self.time_list:
                    day_dict[day][time] = {}          # 初始化每天每个时间段
                    day_dict[day][time]['female'] = 0 # 初始化每天每个时间段内女性数量
                    day_dict[day][time]['male'] = 0   # 初始化每天每个时间段内男性数量

            ## 赋值
            if len(self.data) > 0:
                for i in xrange(self.data[0]):
                    item = self.data[1][i]

                    #print item

                    sex = item['sex']

                    ## 按照时间顺序分析每日数据
                    day_key = item['day']
                    time_key = self.get_time_key(item['time'])

                    #### 数据统计
                    if sex == '\x01': # 男性
                        day_dict[day_key][time_key]['male'] += 1
                    else:
                        day_dict[day_key][time_key]['female'] += 1


            ## X轴-一天24小时时间轴，Y轴-柱状图(男+女),  总数饼图(男总数+女总数)
            female_total = 0
            male_total = 0

            active_time_list = self.check_active_time_list('08:00:00', '21:00:00')
            #print "active_time_list", active_time_list
            for time in active_time_list:
                female_count = 0
                male_count = 0
                for day in self.day_list:
                    female_count += day_dict[day][time]['female']
                    male_count += day_dict[day][time]['male']

                    female_total += day_dict[day][time]['female']
                    male_total += day_dict[day][time]['male']

                msg['femaleCount'].append(female_count)
                msg['maleCount'].append(male_count)

            msg['maleTotal'] = male_total
            msg['femaleTotal'] = female_total

        return msg

############################################################################################
#  Extern functions
############################################################################################

def InOutFlowCount(request):
    ''' statistic->InOutFlowCount: 人流量表查询统计查询 '''
    res=InOutFlowCountReq(request).produce()
    return HttpResponse(res)
def AverageStayTime(request):
    ''' statistic->AverageStayTime: 平均停留时间查询 '''
    res=AverageStayTimeReq(request).produce()
    return HttpResponse(res)
def InOutCountChart(request):
    ''' statistic->InOutCountChart: 详细进出人数查询 '''
    res=InOutCountChartReq(request).produce()
    return HttpResponse(res)
def StayCountChart(request):
    ''' statistic->StayCountChart: 详细停留人数查询 '''
    res=StayCountChartReq(request).produce()
    return HttpResponse(res)
def AgeAttributeChart(request):
    ''' statistic->AgeAttributeChart: 年龄分布表查询 '''
    res=AgeAttributeChartReq(request, interval=60).produce()
    return HttpResponse(res)
def SexAttributeChart(request):
    ''' statistic->SexAttributeChart: 性别分布查询 '''
    res=SexAttributeChartReq(request, interval=60).produce()
    return HttpResponse(res)

def HeatMap(request):
    s="?"+request.META['QUERY_STRING']
    url = getUrlData(s)
    #url = getUrlData(env)
    print url
    print "Into HeatMap"

##    stt = url['deviceGuid']
##    result=[]
##    with open("../html/CustFlow/heatFiles/heatdata/"+stt+".txt",'r') as f:
##        for line in f:
##            print line
##            if line == '#x,y,count\n':
##                continue;
##            tempData = []
##            tempData = map(int,line.split(' '))
##            result.append(tempData)

    sql = "select imgPox, imgPoy, heatdata from heatmapdata where dataguid = '%s'  and curtime>'%s 00:00:00' and curtime<'%s 23:59:59' \
order by curtime;"%(url['deviceGuid'], url['startDate'], url['endDate'])

    #print sql

    ## 获取DB数据
    db = doDB.sqldb(cfg=doDB.cfg)
    res = db.do_select(sql)

    db.sqldb_close()

    return res
    #print(res)

    #output.write(CONTENT_TYPE_HEAD)
    #output.write(json.dumps(res))
    return HttpResponse(json.dumps(res))
def updatepersonflow(request):
    s="?"+request.META['QUERY_STRING']
    url = getUrlData(s)
    #url = getUrlData(env)
    #print url
    print "Into updatepersonflow"
    
    sql = "select deviceGuid,date from modifypersonflow"
    db = doDB.sqldb(cfg=doDB.cfg)
    res = db.sqldb_query(sql)
    msg='error'
    flag=0
    #print res
    for i in xrange(res[0]):
        if res[1][i]['deviceGuid']==url['deviceGuid'] and res[1][i]["date"]==url["nowDate"]:
            flag=1
    #print flag
    if flag==1:        
        sql="update modifypersonflow set inoutaver='%s' where deviceGuid='%s' and date='%s'"%(url['inoutaver'],url['deviceGuid'],url['nowDate'])
        msg='success'
    else:
        sql="insert into modifypersonflow(deviceGuid,inoutaver,date) values('%s','%s','%s')"%(url['deviceGuid'],url['inoutaver'],url['nowDate'])
        msg='success'
    db.sqldb_query(sql)
    
    db.sqldb_close()
    #output.write(CONTENT_TYPE_HEAD)
    #output.write(msg)
    return HttpResponse(msg)
def gethiddenpersonflow(request):
    s="?"+request.META['QUERY_STRING']
    url = getUrlData(s)
    #url = getUrlData(env)
    #print url
    print "Into gethiddenpersonflow"
    
    sql = "select * from modifypersonflow where deviceGuid='%s'"%(url['deviceGuid'])
    db = doDB.sqldb(cfg=doDB.cfg)
    res = db.sqldb_query(sql)

    #print res
    msg={}
    msg['date']=[]
    msg['deviceGuid']=[]
    msg['inoutaver']=[]
    
    for i in xrange(res[0]):
        msg['date'].append(res[1][i]['date'])
        msg['deviceGuid'].append(res[1][i]['deviceGuid'])
        msg['inoutaver'].append(res[1][i]['inoutaver'])
    db.sqldb_close()
    #print msg
    
    #output.write(CONTENT_TYPE_HEAD)
    #output.write(json.dumps(msg))
    return HttpResponse(json.dumps(msg))

####################################################################################################
## Local Test
####################################################################################################
#if __name__ == '__main__':
 #   HeatMap()
##    result = GetActualDeviceDataGuidList('CE01C7BB-B3E2-4DF4-80B2-D253B5255116')
    ##print result
    #result = GetActualDeviceDataGuidList('21F8A444-93D2-4158-BEC4-3A5951B3BA1F', isvirtual="1")
    #print result
    #result = GetActualDeviceDataGuidList('7DB45718-B9AB-4988-9635-5A4DD003BAA6')
    #print result
    ##  varsa = make_day_list('2012-11-12', '2012-12-30')
    ##  for day in varsa:
    ##  aa = '-'.join(day.split('-')[0:])
    ##  print aa
