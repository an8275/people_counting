#!/usr/bin/python
# -*- coding: utf8 -*-

import datetime

''' Python 常用函数库 '''

from urllib import unquote
import ConfigParser
import codecs
import time

def url_parse(query):

    length = len(query)
    num = 1
    dict = {}

    flag = 0

    for i in xrange(0, length):
        if query[i] == '&':
            num = num + 1
        if query[i] == '=':
            flag = 1
    if flag == 1:
        arg_list = query.split('&', num)
        for i in xrange(0, num):
            text = arg_list[i].split('=', 1)
            dict[text[0]] = unquote(text[1])

    return dict

def getUrlData(env):
    #print 'url',env
    #uri = env['REQUEST_URI'].split('?', 1)
    uri = env.split('?', 1)
    url={}
    if len(uri) > 1:
        url = url_parse(uri[1])
    return  url


# 功能: 读取key-value配置文件
# 返回: 正常返回数据字典, 异常返回None
def get_server_cfg(path):
    cfg_dict={}
    try:
        f=open(r"config/settings.ini")
        for line in f.readlines():   #循环读取要读取文件的每一行
            #line=unicode(line,'utf-8') #类似于u"好" 转化为unicode编码
            for c in line:
                if c== '=':
                    text = line.split('=', 1)
                    #去除空格和换行符
                    cfg_dict[''.join(text[0].split())] = ''.join(text[1].split())
        #ConfigParser在python下运行良好，可是在servlet环境中就不行了，很郁闷
        '''
        cf = ConfigParser.ConfigParser()
        #cf.readfp(codecs.open(path, "r", "utf-8-sig"))
        cf.read(path)
        print len(cf.sections())
        for section in cf.sections():            
            for option in cf.options(section):
                cfg_dict[option] = cf.get(section, option).encode('utf-8')
        print  cfg_dict
        '''
        return cfg_dict
    except:
        return None


# 返回 YYYY-mm-dd HH:MM:SS格式时间字符串
def get_time():
    #return time.strftime('%Y-%m-%d %T')
    return time.strftime('%Y-%m-%d %H:%M:%S')

if __name__ == "__main__":
    #CONF="/var/lib/tomcat7/webapps/CustFlow/settings.ini"
    #CONF="a.conf"
    #print get_server_cfg(CONF)
    print get_time()
def make_day_list(start_date, end_date):
    '''  make_day_list(start_date, end_date): 根据输入得日期范围，返回日期列表 
        返回值: ['yyyy-mm-dd', ......]
    '''

    day_list = []    

    ## 日期范围错误，直接返回
    if start_date > end_date:
        return day_list

    ## Start day
    day_list.append(start_date)

    start_list = start_date.split('-')
    start_year = int(start_list[0])
    start_mon = int(start_list[1])
    start_day = int(start_list[2])

    d1 = datetime.date(start_year, start_mon, start_day)

    # 日期累计
    while True:
        d2 =  d1 + datetime.timedelta(1)

        if d2.isoformat() > end_date:
            break

        day_list.append(d2.isoformat())
        d1 = d2

    return day_list

def day_time_offset(day_time):
    ''' day_time_offset(day_time): 将时间格式"HH:MM:SS"转换为当天秒数 
        返回值: < 0, 异常
    '''
    s = day_time.split(':')

    if len(s) != 3:
        return -1

    hour = int(s[0])
    minute = int(s[1])
    second = int(s[2])

    if hour < 0 or hour > 23:
        return -2

    if minute < 0 or minute > 59:
        return -3

    if second < 0 or second > 59:
        return -4

    return hour*3600+minute*60+second


def make_day_time_list( interval):
    '''  make_day_time_list(interval, reverse=False)): 基于间隔秒数返回间隔开始时间字符串列表
        从 00:00:00 开始, interval 间隔分钟, 
        一天有 60*60*24=86400秒
        返回值: [0,....] max 86400
    '''
    offset = 0
    result = []
    interval_seconds = 60*interval

    while 1: 
        if offset >= 86400:
            break;
        
        result.append(offset)
        offset += interval_seconds

    return result
    

##############################################
##  Test
##############################################
##if __name__ == '__main__':
##    print make_day_list('2012-11-11', '2013-02-01')
##    l = make_day_time_list(15)
##    print len(l),l
##
##    print day_time_offset('00:10:00')
##    print day_time_offset('01:00:01')
##    varss = "http://localhost:9080/CustCount/SERVLET/INOUTFLOWCOUNTSERVLET?STARTDATE=2014-05-01&ENDDATE=2014-05-15&\
##STARTTIMEGAP=09:00:00&ENDTIMEGAP=21:00:00&DEVICEGUID=F941DF13-BCEA-4442-A681-D897D3C9AAAB&ISVIRTUAL=1&RANDOM=338126AF-CF52-8217-B45B-18754FE737AE"
##    print getUrlData(varss)

##     print url_parse("http://localhost:9080/CustCount/SERVLET/INOUTFLOWCOUNTSERVLET?STARTDATE=2014-05-01&ENDDATE=2014-05-15&\
##STARTTIMEGAP=09:00:00&ENDTIMEGAP=21:00:00&DEVICEGUID=F941DF13-BCEA-4442-A681-D897D3C9AAAB&ISVIRTUAL=1&RANDOM=338126AF-CF52-8217-B45B-18754FE737AE")
##



