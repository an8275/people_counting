#!/usr/bin/python
# -*- coding: utf8 -*-

from utils import *
from custom_utils import *
from common import *
import uuid
import json
import doDB
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
        return json.dumps(msg)

    def produce(self):
        ''' class statistic_req: def product() 处理生成返回统计数据 '''

        ##  1. 分解URL Get请求信息字典
        s="?"+self.request.META['QUERY_STRING']
        url = getUrlData(s)
        #self.req = getUrlData(self.env)
        self.req = url
        print "req:", self.req

        ## 1.1) 日期范围列表
        if 'startDate' in self.req and 'endDate' in self.req:
            self.day_list = make_day_list(self.req['startDate'], self.req['endDate'])

        ## 1.2) 时间间隔列表
        self.time_list = make_day_time_list(self.interval)

        ##查询设备是否为虚拟设备
        if 'deviceGuid' in self.req:
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

            print "self.device_list", self.device_list

            ## 数据库读取数据
            if len(self.device_list) > 0:
                self.data = self.get_data()
        ####当通过proGuid查询真是设备dataguid时，调用
        if 'proGuid' in self.req:
            self.data = self.get_data()

        ## 计算格式化数据
        self.msg = self.format_data()

        ## 返回数据
        return self.output_data()

class getThroughNumReq(statistic_req):
    ''' statistic->getThroughNumReq: 人流量表查询统计查询
    请求: http://www.rayeye.cn:8080/CustFlow/servlet/getThroughNumServlet?startDate=2014-07-01&endDate=2014-07-13&startTimeGap=09:00:00&endTimeGap=17:00:00&deviceGuid=804a11cef4fd11e38dbc00163e002ba0&isvirtual=1&random=d9e22eef-79a9-5167-20de-75bbc4df10f4&Action=get
    返回: {
          "2014-07-11": {"out": 237, "in": 215},
          "2014-07-13": {"out": 0, "in": 0},
          "2014-07-10": {"out": 249, "in": 229},
          "2014-07-01": {"out": 235, "in": 245},
          "2014-07-02": {"out": 270, "in": 254},
          "2014-07-03": {"out": 304, "in": 287},
          "2014-07-04": {"out": 255, "in": 262},
          "2014-07-05": {"out": 166, "in": 171},
          "2014-07-06": {"out": 0, "in": 0},
          "2014-07-07": {"out": 327, "in": 294},
          "2014-07-08": {"out": 330, "in": 300},
          "2014-07-09": {"out": 298, "in": 281},
          "2014-07-12": {"out": 264, "in": 265}
          }
    '''

    def get_data(self):
        ''' 数据库读取数据 '''
        
        sql = "select sum(innum) as inall, sum(outnum) as outall, DATE_FORMAT(curtime, '%Y-%m-%d') as day from inoutnum where dataguid in ("
        #print self.device_list
        device_num = len(self.device_list)

        for  i in xrange(device_num):
            sql += "'%s'"%(self.device_list[i])
            if i < device_num-1:
                sql += ","

        sql += ") and curtime>'%s 00:00:00' and curtime<'%s 23:59:59' and DATE_FORMAT(curtime, '%%H:%%m:00') >\
'%s' and DATE_FORMAT(curtime, '%%H:%%m:00') < '%s' group by day;"%(self.req['startDate'], self.req['endDate'],self.req['startTimeGap'], self.req['endTimeGap'])

        #print sql

        ## 获取DB数据
        db = doDB.sqldb(cfg=doDB.cfg)
        res = db.do_select(sql)

        db.sqldb_close()

        #print res

        return res

    def format_data(self):
        ''' 计算格式化数据 '''

        ## 初始化存储数据结构
        day_dict = {}
        for day in self.day_list:
            day_dict[day] = {}
            day_dict[day]['in'] = 0
            day_dict[day]['out'] = 0

        ## 赋值
        if len(self.data) > 0:
            for i in xrange(self.data[0]):
                inout = self.data[1][i]
                day_dict[str(inout['day'])]['in'] = int(inout['inall'])
                day_dict[str(inout['day'])]['out'] = int(inout['outall'])
        
        return day_dict

class getThroughNumsReq(statistic_req):
    ''' statistic->getThroughNumsReq: 人流量表查询统计查询
    请求: http://127.0.0.1:8080/CustFlow/servlet/getThroughNumsServlet?startDate=2013-10-01&endDate=2013-10-28&deviceGuid=21F8A444-93D2-4158-BEC4-3A5951B3BA1F&isvirtual=1&random=d9e22eef-79a9-5167-20de-75bbc4df10f4&Action=get
    返回: {"column":[0,0,0,0,0,26,0,0,8,8,0,0,0,0,0,0,85,0,0,0,0,0,0,0,0,0,0,0],"categories":["10.1","10.2","10.3","10.4","10.5","10.6","10.7","10.8","10.9","10.10","10.11","10.12","10.13","10.14","10.15","10.16","10.17","10.18","10.19","10.20","10.21","10.22","10.23","10.24","10.25","10.26","10.27","10.28"]}
    '''

    def get_data(self):
        ''' 数据库读取数据 '''
        ###查找某个proGuid下，所有的实际客流设备
        sql = "select dataguid as dataGuid from device_cust where proguid = '%s' and isvirtual = 0"%(self.req['proGuid'])
        #print sql
        
        ### 获取实际的设备dataguid
        db = doDB.sqldb(cfg=doDB.cfg)
        res = db.do_select(sql)
        #print'dataguid',res
        
        sql = "select sum(innum) as inall, sum(outnum) as outall, DATE_FORMAT(curtime, '%Y-%m-%d') as day from inoutnum where dataguid in ("
        device_num = res[0]

        for  i in xrange(res[0]):
            deviceReal = res[1][i]
            sql += "'%s'"%(deviceReal['dataGuid'])
            if i < device_num-1:
                sql += ","

        sql += ") and curtime>'%s 00:00:00' and curtime<'%s 23:59:59' and DATE_FORMAT(curtime, '%%H:%%m:00') >\
'%s' and DATE_FORMAT(curtime, '%%H:%%m:00') < '%s' group by day;"%(self.req['startDate'], self.req['endDate'],self.req['startTimeGap'], self.req['endTimeGap'])

        #print sql

        ## 获取DB数据
        #db = doDB.sqldb(cfg=doDB.cfg)
        res = db.do_select(sql)

        db.sqldb_close()

        #print res

        return res

    def format_data(self):
        ''' 计算格式化数据 '''

        ## 初始化存储数据结构
        day_dict = {}
        for day in self.day_list:
            day_dict[day] = {}
            day_dict[day]['in'] = 0
            day_dict[day]['out'] = 0

        ## 赋值
        if len(self.data) > 0:
            for i in xrange(self.data[0]):
                inout = self.data[1][i]
                day_dict[str(inout['day'])]['in'] = int(inout['inall'])
                day_dict[str(inout['day'])]['out'] = int(inout['outall'])
        
        return day_dict

class getThroughNumsSeparateReq(statistic_req):
    ''' statistic->getThroughNumsReq: 人流量表查询统计查询
    请求: http://127.0.0.1:8080/CustFlow/servlet/getThroughNumsServlet?startDate=2013-10-01&endDate=2013-10-28&deviceGuid=21F8A444-93D2-4158-BEC4-3A5951B3BA1F&isvirtual=1&random=d9e22eef-79a9-5167-20de-75bbc4df10f4&Action=get
    返回: {"column":[0,0,0,0,0,26,0,0,8,8,0,0,0,0,0,0,85,0,0,0,0,0,0,0,0,0,0,0],"categories":["10.1","10.2","10.3","10.4","10.5","10.6","10.7","10.8","10.9","10.10","10.11","10.12","10.13","10.14","10.15","10.16","10.17","10.18","10.19","10.20","10.21","10.22","10.23","10.24","10.25","10.26","10.27","10.28"]}
    '''

    def get_data(self):
        ''' 数据库读取数据 '''
        res = {}
        ###查找某个proGuid下，所有的实际客流设备
        sql = "select dataguid as dataGuid from device_cust where proguid = '%s' and isvirtual = 0"%(self.req['proGuid'])
        #print sql
        
        ### 获取实际的设备dataguid
        db = doDB.sqldb(cfg=doDB.cfg)
        DeviceRes = db.do_select(sql)
        res['dataGuid'] = DeviceRes
        #print'dataguid',res
        #raw_input()

        if DeviceRes[0] > 0:
            for deviceI in xrange(DeviceRes[0]):
                sql = "select sum(innum) as inall, sum(outnum) as outall, DATE_FORMAT(curtime, '%%Y-%%m-%%d') as day from inoutnum where dataguid ='%s' \
    and curtime>'%s 00:00:00' and curtime<'%s 23:59:59' and DATE_FORMAT(curtime, '%%H:%%m:00') >\
        '%s' and DATE_FORMAT(curtime, '%%H:%%m:00') < '%s' group by day;"%(DeviceRes[1][deviceI]['dataGuid'],self.req['startDate'], self.req['endDate'],self.req['startTimeGap'], self.req['endTimeGap'])
                
                #print sql

                ## 获取DB数据
                #db = doDB.sqldb(cfg=doDB.cfg)
                valueRes = db.do_select(sql)
                res[str(DeviceRes[1][deviceI]['dataGuid'])]=valueRes
            
        #print res   

        db.sqldb_close()

        #print res

        return res

    def format_data(self):
        ''' 计算格式化数据 '''

        ## 初始化存储数据结构
        day_dict = {}
        for deviceI in xrange(self.data['dataGuid'][0]):
            day_dict[str(self.data['dataGuid'][1][deviceI]['dataGuid'])] = {}
            for day in self.day_list:
                day_dict[str(self.data['dataGuid'][1][deviceI]['dataGuid'])][day] = {}
                day_dict[str(self.data['dataGuid'][1][deviceI]['dataGuid'])][day]['in'] = 0
                day_dict[str(self.data['dataGuid'][1][deviceI]['dataGuid'])][day]['out'] = 0

        print day_dict    
        

        ## 赋值
        if len(self.data) > 0:
            for deviceI in xrange(self.data['dataGuid'][0]):
                deviceValue = self.data[str(self.data['dataGuid'][1][deviceI]['dataGuid'])]
                print deviceValue
                for i in xrange(deviceValue[0]):
                    inout = deviceValue[1][i]
                    day_dict[str(self.data['dataGuid'][1][deviceI]['dataGuid'])][str(inout['day'])]['in'] = int(inout['inall'])
                    day_dict[str(self.data['dataGuid'][1][deviceI]['dataGuid'])][str(inout['day'])]['out'] = int(inout['outall'])
                
        
        return day_dict

class getAgeReq(statistic_req):
    ''' statistic->getThroughNumReq: 人流量表查询统计查询
    请求: http://www.rayeye.cn:8080/CustFlow/servlet/getThroughNumServlet?startDate=2014-07-01&endDate=2014-07-13&startTimeGap=09:00:00&endTimeGap=17:00:00&deviceGuid=804a11cef4fd11e38dbc00163e002ba0&isvirtual=1&random=d9e22eef-79a9-5167-20de-75bbc4df10f4&Action=get
    返回: {
          "2014-07-11": {"out": 237, "in": 215},
          "2014-07-13": {"out": 0, "in": 0},
          "2014-07-12": {"out": 264, "in": 265}
          }
    '''

    def get_data(self):
        ''' 数据库读取数据 '''

        sql = "select age, DATE_FORMAT(curtime, '%Y-%m-%d') as day from ageattr where dataguid in ("

        device_num = len(self.device_list)

        for  i in xrange(device_num):
            sql += "'%s'"%(self.device_list[i])
            if i < device_num-1:
                sql += ","

        sql += ") and curtime>'%s 00:00:00' and curtime<'%s 23:59:59'  and DATE_FORMAT(curtime, '%%H:%%m:00')>'%s' \
and DATE_FORMAT(curtime, '%%H:%%m:00')<'%s' and age is not NULL order by age;"%(self.req['startDate'], self.req['endDate'],self.req['startTimeGap'], self.req['endTimeGap'])
        #print sql

        ## 获取DB数据
        db = doDB.sqldb(cfg=doDB.cfg)
        res = db.do_select(sql)
        #print res

        db.sqldb_close()

        return res

    def format_data(self):
        ''' 计算格式化数据 '''

        ## 初始化存储数据结构
        ## 数据分析结构
        day_dict = {}
        for day in self.day_list:
            day_dict[day] = {}
            for age in statistic_req.AGE_LIST:
                key = "%s%d"%(statistic_req.AGE_KEYNAME,age)
                day_dict[day][key] = 0

        #print day_dict

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
                age_key = self.get_age_key(age)

                #print day_key
                #print age_key

                #### 数据统计
                key = "%s%d"%(statistic_req.AGE_KEYNAME,age_key)
                day_dict[str(day_key)][key] += 1

        return day_dict

class getAgesReq(statistic_req):
    ''' statistic->getThroughNumReq: 人流量表查询统计查询
    请求: http://www.rayeye.cn:8080/CustFlow/servlet/getThroughNumServlet?startDate=2014-07-01&endDate=2014-07-13&startTimeGap=09:00:00&endTimeGap=17:00:00&deviceGuid=804a11cef4fd11e38dbc00163e002ba0&isvirtual=1&random=d9e22eef-79a9-5167-20de-75bbc4df10f4&Action=get
    返回: {
          "2014-07-11": {"out": 237, "in": 215},
          "2014-07-13": {"out": 0, "in": 0},
          "2014-07-12": {"out": 264, "in": 265}
          }
    '''

    def get_data(self):
        ''' 数据库读取数据 '''
        ###查找某个proGuid下，所有的实际客流设备
        sql = "select dataguid as dataGuid from device_age where proguid = '%s' and isvirtual = 0"%(self.req['proGuid'])
        #print sql
        
        ### 获取实际的设备dataguid
        db = doDB.sqldb(cfg=doDB.cfg)
        res = db.do_select(sql)
        print'dataguid',res
        
        sql = "select age, DATE_FORMAT(curtime, '%Y-%m-%d') as day from ageattr where dataguid in ("
        device_num = res[0]

        for  i in xrange(res[0]):
            deviceReal = res[1][i]
            sql += "'%s'"%(deviceReal['dataGuid'])
            if i < device_num-1:
                sql += ","

        sql += ") and curtime>'%s 00:00:00' and curtime<'%s 23:59:59'  and DATE_FORMAT(curtime, '%%H:%%m:00')>'%s' \
and DATE_FORMAT(curtime, '%%H:%%m:00')<'%s' and age is not NULL order by age;"%(self.req['startDate'], self.req['endDate'],self.req['startTimeGap'], self.req['endTimeGap'])
        #print sql

        ## 获取DB数据
        db = doDB.sqldb(cfg=doDB.cfg)
        res = db.do_select(sql)
        #print res

        db.sqldb_close()

        return res

    def format_data(self):
        ''' 计算格式化数据 '''

        ## 初始化存储数据结构
        ## 数据分析结构
        day_dict = {}
        for day in self.day_list:
            day_dict[day] = {}
            for age in statistic_req.AGE_LIST:
                key = "%s%d"%(statistic_req.AGE_KEYNAME,age)
                day_dict[day][key] = 0

        #print day_dict

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
                age_key = self.get_age_key(age)

                #print day_key
                #print age_key

                #### 数据统计
                key = "%s%d"%(statistic_req.AGE_KEYNAME,age_key)
                day_dict[str(day_key)][key] += 1

        return day_dict


class getAgesSeparateReq(statistic_req):
    ''' statistic->getThroughNumReq: 人流量表查询统计查询
    请求: http://www.rayeye.cn:8080/CustFlow/servlet/getThroughNumServlet?startDate=2014-07-01&endDate=2014-07-13&startTimeGap=09:00:00&endTimeGap=17:00:00&deviceGuid=804a11cef4fd11e38dbc00163e002ba0&isvirtual=1&random=d9e22eef-79a9-5167-20de-75bbc4df10f4&Action=get
    返回: {
          "2014-07-11": {"out": 237, "in": 215},
          "2014-07-13": {"out": 0, "in": 0},
          "2014-07-12": {"out": 264, "in": 265}
          }
    '''

    def get_data(self):
        ''' 数据库读取数据 '''
        res = {}
        ###查找某个proGuid下，所有的实际客流设备
        sql = "select dataguid as dataGuid from device_age where proguid = '%s' and isvirtual = 0"%(self.req['proGuid'])
        #print sql
        
        ### 获取实际的设备dataguid
        db = doDB.sqldb(cfg=doDB.cfg)
        DeviceRes = db.do_select(sql)
        res['dataGuid'] = DeviceRes
        #print'dataguid',res
        #raw_input()

        if DeviceRes[0] > 0:
            for deviceI in xrange(DeviceRes[0]):
                sql = "select age, DATE_FORMAT(curtime, '%%Y-%%m-%%d') as day from ageattr where dataguid ='%s' and curtime>'%s 00:00:00' and curtime<'%s 23:59:59'  and DATE_FORMAT(curtime, '%%H:%%m:00')>'%s' \
        and DATE_FORMAT(curtime, '%%H:%%m:00')<'%s' and age is not NULL order by age;"%(DeviceRes[1][deviceI]['dataGuid'],self.req['startDate'], self.req['endDate'],self.req['startTimeGap'], self.req['endTimeGap'])
                #print sql

                ## 获取DB数据
                valueRes = db.do_select(sql)
                res[str(DeviceRes[1][deviceI]['dataGuid'])]=valueRes
        print res

        db.sqldb_close()

        return res

    def format_data(self):
        ''' 计算格式化数据 '''

        ## 初始化存储数据结构
        ## 数据分析结构
        day_dict = {}
        for deviceI in xrange(self.data['dataGuid'][0]):
            day_dict[str(self.data['dataGuid'][1][deviceI]['dataGuid'])] = {}
            for day in self.day_list:
                day_dict[str(self.data['dataGuid'][1][deviceI]['dataGuid'])][day] = {}
                for age in statistic_req.AGE_LIST:
                    key = "%s%d"%(statistic_req.AGE_KEYNAME,age)
                    day_dict[str(self.data['dataGuid'][1][deviceI]['dataGuid'])][day][key] = 0
                    
        ## 赋值
        if len(self.data) > 0:
            for deviceI in xrange(self.data['dataGuid'][0]):
                deviceValue = self.data[str(self.data['dataGuid'][1][deviceI]['dataGuid'])]
                for i in xrange(deviceValue[0]):
                    ageItem = deviceValue[1][i]

                    age = int(ageItem['age'])

                    #### 数据有效性检查
                    if not 0 < age < 100:
                        continue

                    ## 按照时间顺序分析每日数据
                    day_key = ageItem['day']
                    age_key = self.get_age_key(age)

                    #print day_key
                    #print age_key

                    #### 数据统计
                    key = "%s%d"%(statistic_req.AGE_KEYNAME,age_key)
                    day_dict[str(self.data['dataGuid'][1][deviceI]['dataGuid'])][str(day_key)][key] += 1

        return day_dict



class getSexReq(statistic_req):
    ''' statistic->getThroughNumReq: 人流量表查询统计查询
    请求: http://www.rayeye.cn:8080/CustFlow/servlet/getThroughNumServlet?startDate=2014-07-01&endDate=2014-07-13&startTimeGap=09:00:00&endTimeGap=17:00:00&deviceGuid=804a11cef4fd11e38dbc00163e002ba0&isvirtual=1&random=d9e22eef-79a9-5167-20de-75bbc4df10f4&Action=get
    返回: {
          "2014-07-11": {"out": 237, "in": 215},
          "2014-07-13": {"out": 0, "in": 0},
          "2014-07-10": {"out": 249, "in": 229},
          "2014-07-01": {"out": 235, "in": 245},
          "2014-07-02": {"out": 270, "in": 254},
          "2014-07-03": {"out": 304, "in": 287},
          "2014-07-04": {"out": 255, "in": 262},
          "2014-07-05": {"out": 166, "in": 171},
          "2014-07-06": {"out": 0, "in": 0},
          "2014-07-07": {"out": 327, "in": 294},
          "2014-07-08": {"out": 330, "in": 300},
          "2014-07-09": {"out": 298, "in": 281},
          "2014-07-12": {"out": 264, "in": 265}
          }
    '''

    def get_data(self):
        ''' 数据库读取数据 '''
        
        sql = "select sex, DATE_FORMAT(curtime, '%Y-%m-%d') as day from ageattr where dataguid in ("
        #print self.device_list
        device_num = len(self.device_list)

        for  i in xrange(device_num):
            sql += "'%s'"%(self.device_list[i])
            if i < device_num-1:
                sql += ","

        sql += ") and curtime>'%s 00:00:00' and curtime<'%s 23:59:59' and DATE_FORMAT(curtime, '%%H:%%m:00') >\
'%s' and DATE_FORMAT(curtime, '%%H:%%m:00') < '%s' group by day;"%(self.req['startDate'], self.req['endDate'],self.req['startTimeGap'], self.req['endTimeGap'])

        #print sql

        ## 获取DB数据
        db = doDB.sqldb(cfg=doDB.cfg)
        res = db.do_select(sql)

        db.sqldb_close()

        #print res

        return res

    def format_data(self):
        ''' 计算格式化数据 '''

        ## 初始化存储数据结构
        day_dict = {}
        print self.data
        for day in self.day_list:
            day_dict[day] = {}
            day_dict[day]['male'] = 0
            day_dict[day]['woman'] = 0

        ## 赋值
        if len(self.data) > 0:
            for i in xrange(self.data[0]):
                sex = self.data[1][i]
                if sex['sex'] == '\x01':
                    day_dict[str(sex['day'])]['male'] += 1
                if sex['sex'] == '\x00':
                    day_dict[str(sex['day'])]['woman'] += 1
        
        return day_dict


class getSexsReq(statistic_req):
    ''' statistic->getThroughNumReq: 人流量表查询统计查询
    请求: http://www.rayeye.cn:8080/CustFlow/servlet/getThroughNumServlet?startDate=2014-07-01&endDate=2014-07-13&startTimeGap=09:00:00&endTimeGap=17:00:00&deviceGuid=804a11cef4fd11e38dbc00163e002ba0&isvirtual=1&random=d9e22eef-79a9-5167-20de-75bbc4df10f4&Action=get
    返回: {
          "2014-07-11": {"out": 237, "in": 215},
          "2014-07-13": {"out": 0, "in": 0},
          "2014-07-10": {"out": 249, "in": 229},
          "2014-07-01": {"out": 235, "in": 245},
          "2014-07-02": {"out": 270, "in": 254},
          "2014-07-03": {"out": 304, "in": 287},
          "2014-07-04": {"out": 255, "in": 262},
          "2014-07-05": {"out": 166, "in": 171},
          "2014-07-06": {"out": 0, "in": 0},
          "2014-07-07": {"out": 327, "in": 294},
          "2014-07-08": {"out": 330, "in": 300},
          "2014-07-09": {"out": 298, "in": 281},
          "2014-07-12": {"out": 264, "in": 265}
          }
    '''

    def get_data(self):
        ''' 数据库读取数据 '''
        
        sql = "select dataguid as dataGuid from device_age where proguid = '%s' and isvirtual = 0"%(self.req['proGuid'])
        #print sql
        
        ### 获取实际的设备dataguid
        db = doDB.sqldb(cfg=doDB.cfg)
        res = db.do_select(sql)
        print'dataguid',res
        sql = "select sex, DATE_FORMAT(curtime, '%Y-%m-%d') as day from ageattr where dataguid in ("
        device_num = res[0]
        for  i in xrange(res[0]):
            deviceReal = res[1][i]
            sql += "'%s'"%(deviceReal['dataGuid'])
            if i < device_num-1:
                sql += ","

        sql += ") and curtime>'%s 00:00:00' and curtime<'%s 23:59:59' and DATE_FORMAT(curtime, '%%H:%%m:00') >\
'%s' and DATE_FORMAT(curtime, '%%H:%%m:00') < '%s' group by day;"%(self.req['startDate'], self.req['endDate'],self.req['startTimeGap'], self.req['endTimeGap'])

        #print sql

        ## 获取DB数据
        db = doDB.sqldb(cfg=doDB.cfg)
        res = db.do_select(sql)

        db.sqldb_close()

        #print res

        return res

    def format_data(self):
        ''' 计算格式化数据 '''

        ## 初始化存储数据结构
        day_dict = {}
        print self.data
        for day in self.day_list:
            day_dict[day] = {}
            day_dict[day]['male'] = 0
            day_dict[day]['woman'] = 0

        ## 赋值
        if len(self.data) > 0:
            for i in xrange(self.data[0]):
                sex = self.data[1][i]
                if sex['sex'] == '\x01':
                    day_dict[str(sex['day'])]['male'] += 1
                if sex['sex'] == '\x00':
                    day_dict[str(sex['day'])]['woman'] += 1
        
        return day_dict

    
class getSexsSeparateReq(statistic_req):
    ''' statistic->getThroughNumReq: 人流量表查询统计查询
    请求: http://www.rayeye.cn:8080/CustFlow/servlet/getThroughNumServlet?startDate=2014-07-01&endDate=2014-07-13&startTimeGap=09:00:00&endTimeGap=17:00:00&deviceGuid=804a11cef4fd11e38dbc00163e002ba0&isvirtual=1&random=d9e22eef-79a9-5167-20de-75bbc4df10f4&Action=get
    返回: {
          "2014-07-11": {"out": 237, "in": 215},
          "2014-07-13": {"out": 0, "in": 0},
          "2014-07-10": {"out": 249, "in": 229},
          "2014-07-01": {"out": 235, "in": 245},
          "2014-07-02": {"out": 270, "in": 254},
          "2014-07-03": {"out": 304, "in": 287},
          "2014-07-04": {"out": 255, "in": 262},
          "2014-07-05": {"out": 166, "in": 171},
          "2014-07-06": {"out": 0, "in": 0},
          "2014-07-07": {"out": 327, "in": 294},
          "2014-07-08": {"out": 330, "in": 300},
          "2014-07-09": {"out": 298, "in": 281},
          "2014-07-12": {"out": 264, "in": 265}
          }
    '''

    def get_data(self):
        ''' 数据库读取数据 '''
        res = {}
        sql = "select dataguid as dataGuid from device_age where proguid = '%s' and isvirtual = 0"%(self.req['proGuid'])
        #print sql
        
        ### 获取实际的设备dataguid
        db = doDB.sqldb(cfg=doDB.cfg)
        DeviceRes = db.do_select(sql)
        res['dataGuid'] = DeviceRes
        print'dataguid',res
        
        if DeviceRes[0] > 0:
            for deviceI in xrange(DeviceRes[0]):
                sql = "select sex, DATE_FORMAT(curtime, '%%Y-%%m-%%d') as day from ageattr where dataguid ='%s' and curtime>'%s 00:00:00' and curtime<'%s 23:59:59' and DATE_FORMAT(curtime, '%%H:%%m:00') >\
        '%s' and DATE_FORMAT(curtime, '%%H:%%m:00') < '%s' group by day;"%(DeviceRes[1][deviceI]['dataGuid'],self.req['startDate'], self.req['endDate'],self.req['startTimeGap'], self.req['endTimeGap'])

                #print sql

                ## 获取DB数据
                db = doDB.sqldb(cfg=doDB.cfg)
                valueRes = db.do_select(sql)
                res[str(DeviceRes[1][deviceI]['dataGuid'])]=valueRes

        db.sqldb_close()

        #print res

        return res

    def format_data(self):
        ''' 计算格式化数据 '''

        ## 初始化存储数据结构
        day_dict = {}
        print self.data
        for deviceI in xrange(self.data['dataGuid'][0]):
            day_dict[str(self.data['dataGuid'][1][deviceI]['dataGuid'])] = {}
            for day in self.day_list:
                day_dict[str(self.data['dataGuid'][1][deviceI]['dataGuid'])][day] = {}
                day_dict[str(self.data['dataGuid'][1][deviceI]['dataGuid'])][day]['male'] = 0
                day_dict[str(self.data['dataGuid'][1][deviceI]['dataGuid'])][day]['woman'] = 0

        ## 赋值
        if len(self.data) > 0:
            for deviceI in xrange(self.data['dataGuid'][0]):
                deviceValue = self.data[str(self.data['dataGuid'][1][deviceI]['dataGuid'])]
                print deviceValue
                for i in xrange(deviceValue[0]):
                    sex = deviceValue[1][i]
                    if sex['sex'] == '\x01':
                        day_dict[str(self.data['dataGuid'][1][deviceI]['dataGuid'])][str(sex['day'])]['male'] += 1
                    if sex['sex'] == '\x00':
                        day_dict[str(self.data['dataGuid'][1][deviceI]['dataGuid'])][str(sex['day'])]['woman'] += 1
        
        return day_dict



class getPosReq(statistic_req):
    ''' statistic->getThroughNumReq: 人流量表查询统计查询
    请求: http://www.rayeye.cn:8080/CustFlow/servlet/getThroughNumServlet?startDate=2014-07-01&endDate=2014-07-13&startTimeGap=09:00:00&endTimeGap=17:00:00&deviceGuid=804a11cef4fd11e38dbc00163e002ba0&isvirtual=1&random=d9e22eef-79a9-5167-20de-75bbc4df10f4&Action=get
    返回: {
          "2014-07-11": {"out": 237, "in": 215},
          "2014-07-13": {"out": 0, "in": 0},
          "2014-07-10": {"out": 249, "in": 229},
          "2014-07-01": {"out": 235, "in": 245},
          "2014-07-02": {"out": 270, "in": 254},
          "2014-07-03": {"out": 304, "in": 287},
          "2014-07-04": {"out": 255, "in": 262},
          "2014-07-05": {"out": 166, "in": 171},
          "2014-07-06": {"out": 0, "in": 0},
          "2014-07-07": {"out": 327, "in": 294},
          "2014-07-08": {"out": 330, "in": 300},
          "2014-07-09": {"out": 298, "in": 281},
          "2014-07-12": {"out": 264, "in": 265}
          }
    '''

    def get_data(self):
        ''' 数据库读取数据 '''
        
        sql = "select DATE_FORMAT(curtime, '%%Y-%%m-%%d') as day, Sales, Orders from cust_sales where dataguid = '%s' and DATE_FORMAT(curtime, '%%Y-%%m-%%d') >='%s' \
    and DATE_FORMAT(curtime, '%%Y-%%m-%%d')<='%s' order by curtime;"%(url['dataGuid'],url['startDate'], url['endDate'])

        #print sql

        ## 获取DB数据
        db = doDB.sqldb(cfg=doDB.cfg)
        res = db.do_select(sql)

        db.sqldb_close()

        print res

        return res

    def format_data(self):
        ''' 计算格式化数据 '''

        ## 初始化存储数据结构
        day_dict = {}
        print self.data
        for day in self.day_list:
            day_dict[day] = {}
            day_dict[day]['total'] = 0
            day_dict[day]['num'] = 0

        ## 赋值
        if len(self.data) > 0:
            for i in xrange(self.data[0]):
                sales = self.data[1][i]
                day_dict[day]['total'] = int(sales['Sales'])
                day_dict[day]['num'] = int(sales['Orders'])
        
        return day_dict
    

class getPossReq(statistic_req):
    ''' statistic->getThroughNumReq: 人流量表查询统计查询
    请求: http://www.rayeye.cn:8080/CustFlow/servlet/getThroughNumServlet?startDate=2014-07-01&endDate=2014-07-13&startTimeGap=09:00:00&endTimeGap=17:00:00&deviceGuid=804a11cef4fd11e38dbc00163e002ba0&isvirtual=1&random=d9e22eef-79a9-5167-20de-75bbc4df10f4&Action=get
    返回: {
          "2014-07-11": {"out": 237, "in": 215},
          "2014-07-13": {"out": 0, "in": 0},
          "2014-07-10": {"out": 249, "in": 229},
          "2014-07-01": {"out": 235, "in": 245},
          "2014-07-02": {"out": 270, "in": 254},
          "2014-07-03": {"out": 304, "in": 287},
          "2014-07-04": {"out": 255, "in": 262},
          "2014-07-05": {"out": 166, "in": 171},
          "2014-07-06": {"out": 0, "in": 0},
          "2014-07-07": {"out": 327, "in": 294},
          "2014-07-08": {"out": 330, "in": 300},
          "2014-07-09": {"out": 298, "in": 281},
          "2014-07-12": {"out": 264, "in": 265}
          }
    '''

    def get_data(self):
        ''' 数据库读取数据 '''
        
        sql = "select dataguid as dataGuid from device_cust where proguid = '%s' and issale = 1"%(self.req['proGuid'])
        
        ### 获取实际的设备dataguid
        db = doDB.sqldb(cfg=doDB.cfg)
        res = db.do_select(sql)
        #print'dataguid',res
        sql = "select sum(Sales) as allSale, sum(Orders) as allOrders, DATE_FORMAT(curtime, '%Y-%m-%d') as day from cust_sales where dataguid in ("
        device_num = res[0]
        for  i in xrange(res[0]):
            deviceReal = res[1][i]
            sql += "'%s'"%(deviceReal['dataGuid'])
            if i < device_num-1:
                sql += ","

        sql += ") and curtime>'%s 00:00:00' and curtime<'%s 23:59:59' group by day;"%(self.req['startDate'], self.req['endDate'])

        #print sql

        ## 获取DB数据
        db = doDB.sqldb(cfg=doDB.cfg)
        res = db.do_select(sql)

        db.sqldb_close()

        #print res

        return res

    def format_data(self):
        ''' 计算格式化数据 '''

        ## 初始化存储数据结构
        day_dict = {}
        print self.data
        for day in self.day_list:
            day_dict[day] = {}
            day_dict[day]['total'] = 0
            day_dict[day]['num'] = 0

        ## 赋值
        if len(self.data) > 0:
            for i in xrange(self.data[0]):
                sales = self.data[1][i]
                day_dict[day]['total'] = int(sales['Sales'])
                day_dict[day]['num'] = int(sales['Orders'])
        
        return day_dict


class getPossSeparateReq(statistic_req):
    ''' statistic->getThroughNumReq: 人流量表查询统计查询
    请求: http://www.rayeye.cn:8080/CustFlow/servlet/getThroughNumServlet?startDate=2014-07-01&endDate=2014-07-13&startTimeGap=09:00:00&endTimeGap=17:00:00&deviceGuid=804a11cef4fd11e38dbc00163e002ba0&isvirtual=1&random=d9e22eef-79a9-5167-20de-75bbc4df10f4&Action=get
    返回: {
          "2014-07-11": {"out": 237, "in": 215},
          "2014-07-12": {"out": 264, "in": 265}
          }
    '''

    def get_data(self):
        ''' 数据库读取数据 '''
        res = {}
        sql = "select dataguid as dataGuid from device_cust where proguid = '%s' and issale = 1"%(self.req['proGuid'])
        #print sql
        
        ### 获取实际的设备dataguid
        db = doDB.sqldb(cfg=doDB.cfg)
        DeviceRes = db.do_select(sql)
        res['dataGuid'] = DeviceRes
        print'dataguid',res
        
        if DeviceRes[0] > 0:
            for deviceI in xrange(DeviceRes[0]):
                sql = "select Sales, Orders, DATE_FORMAT(curtime, '%%Y-%%m-%%d') as day from cust_sales where dataguid ='%s'\
and curtime>'%s 00:00:00' and curtime<'%s 23:59:59' group by day;"%(DeviceRes[1][deviceI]['dataGuid'],self.req['startDate'], self.req['endDate'])

                #print sql

                ## 获取DB数据
                valueRes = db.do_select(sql)
                res[str(DeviceRes[1][deviceI]['dataGuid'])]=valueRes

        db.sqldb_close()

        print res

        return res

    def format_data(self):
        ''' 计算格式化数据 '''

        ## 初始化存储数据结构
        day_dict = {}
        print self.data
        for deviceI in xrange(self.data['dataGuid'][0]):
            day_dict[str(self.data['dataGuid'][1][deviceI]['dataGuid'])] = {}
            for day in self.day_list:
                day_dict[str(self.data['dataGuid'][1][deviceI]['dataGuid'])][day] = {}
                day_dict[str(self.data['dataGuid'][1][deviceI]['dataGuid'])][day]['total'] = 0
                day_dict[str(self.data['dataGuid'][1][deviceI]['dataGuid'])][day]['num'] = 0

        ## 赋值
        if len(self.data) > 0:
            for deviceI in xrange(self.data['dataGuid'][0]):
                deviceValue = self.data[str(self.data['dataGuid'][1][deviceI]['dataGuid'])]
                print deviceValue
                for i in xrange(deviceValue[0]):
                    sales = deviceValue[1][i]
                    day_dict[str(self.data['dataGuid'][1][deviceI]['dataGuid'])][str(sex['day'])]['total'] = sales['Sales']
                    day_dict[str(self.data['dataGuid'][1][deviceI]['dataGuid'])][str(sex['day'])]['num'] = sales['Orders']
        
        return day_dict



############################################################################################
#  Extern functions
############################################################################################

def getThroughNum(request):
    ''' statistic->InOutFlowCount: 人流量表查询统计查询 '''
    res=getThroughNumReq(request).produce()
    return HttpResponse(res)
def getThroughNums(request):
    ''' statistic->AverageStayTime: 人流量表查询统计查询 '''
    res=getThroughNumsReq(request).produce()
    return HttpResponse(res)
def getThroughNumsSeparate(request):
    ''' statistic->AverageStayTime: 人流量表查询统计查询 '''
    res=getThroughNumsSeparateReq(request).produce()
    return HttpResponse(res)
def getAge(request):
    ''' statistic->InOutFlowCount: 人流量表查询统计查询 '''
    res=getAgeReq(request).produce()
    return HttpResponse(res)
def getAges(request):
    ''' statistic->InOutFlowCount: 人流量表查询统计查询 '''
    res=getAgesReq(request).produce()
    return HttpResponse(res)
def getAgesSeparate(request):
    ''' statistic->InOutFlowCount: 人流量表查询统计查询 '''
    res=getAgesSeparateReq(request).produce()
    return HttpResponse(res)
def getSex(request):
    ''' statistic->InOutFlowCount: 人流量表查询统计查询 '''
    res=getSexReq(request).produce()
    return HttpResponse(res)
def getSexs(request):
    ''' statistic->InOutFlowCount: 人流量表查询统计查询 '''
    res=getSexsReq(request).produce()
    return HttpResponse(res)
def getSexsSeparate(request):
    ''' statistic->InOutFlowCount: 人流量表查询统计查询 '''
    res=getSexsSeparateReq(request).produce()
    return HttpResponse(res)
def getPos(request):
    ''' statistic->InOutFlowCount: 人流量表查询统计查询 '''
    res=getPosReq(request).produce()
    return HttpResponse(res)
def getPoss(request):
    ''' statistic->InOutFlowCount: 人流量表查询统计查询 '''
    res=getPossReq(request).produce()
    return HttpResponse(res)
def getPossSeparate(request):
    ''' statistic->InOutFlowCount: 人流量表查询统计查询 '''
    res=getPossSeparateReq(request).produce()
    return HttpResponse(res)
def HeatMap(request):
    s="?"+request.META['QUERY_STRING']
    url = getUrlData(s)
    #url = getUrlData(env)
    print url
    print "Into HeatMap"

    stt = "sdaa1.txt"
    result=[]
    with open("../../../srv/ftp/test/"+stt,'r') as f:
        for line in f:
            print line
            if line == '#x,y,count\n':
                continue;
            tempData = []
            tempData = map(int,line.split(','))
            result.append(tempData)
    print(result)

    #output.write(CONTENT_TYPE_HEAD)
    #output.write(json.dumps(res))
    return HttpResponse(json.dumps(res))

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
