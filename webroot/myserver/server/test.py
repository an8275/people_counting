#!/usr/bin/python
# -*- coding: utf8 -*-

#from urllib import quote
import urllib
import sys,os


DST="http://127.0.0.1:8081"

def url_encode(url):
    l=url.split('?')

    if 1 == len(l):
        return url

    method=l[0]
    get_list=l[1].split('&')

    #print "method:", method
    #print "get_list:", get_list
    
    get_dict={}
    for item in get_list:
        get_dict[item.split('=')[0]] = item.split('=')[1]

    return "%s?%s"%(method, urllib.urlencode(get_dict))
    

def url_open(url):
    full_url="%s%s"%(DST, url)
    print "Access: %s"%(full_url)
    url_en = url_encode(full_url)
    response = urllib.urlopen(url_en)
    print "Response:", response.read()


# 退出
#url_open("/CustFlow/servlet/LogOutServlet?Action=get");

# 获取项目信息
#url_open("/CustFlow/servlet/GetProjectTypeServlet");

# 获取项目设备清单
#url_open("/CustFlow/servlet/GetProjectDeviceServlet?proguid=5A6D2D1B-6E84-4B83-9107-07D18D120D69&random=89d052f9-151d-52a4-d8aa-63daade14561&Action=get");

# 获取客户清单
#url_open("/CustFlow/servlet/CustListServlet?beginIndex=0&endIndex=10&random=50b9b456-da65-926e-32ab-d582d47d3b94&Action=get")

# 添加用户
url_open("/CustFlow/servlet/AddCustServlet?guid=&custName=leo&custPwd=1&responsiblePerson=rayeye&custDescription=leo%20%E6%8F%8F%E8%BF%B0&custContact=leo&custDetailInfo=leo%20%E8%AF%A6%E7%BB%86&ownProject=8fcfe580-d63e-4a20-8ffd-32c89a3c7162&addTime=&random=352baf45-fdb0-78a1-1b23-167b68e285a9&Action=get")

#sys.exit(0)

'''
# 客流量设备进出人数上传
#url_open("http://localhost:9080/CustCount/servlet/CustCountingServlet?uuid=e5f57fdc-5e78-4bc1-9d37-255ecb1eaa95&dataguid=30b96c4a-728b-4e0b-9dba-fd97f0a6f3eb&innum=10&outnum=9&curtime=2013-10-17 09:13:23")

#sys.exit(0)

# 年龄属性设备年龄性别上传
#url_open("http://localhost:9080/CustCount/servlet/AgeCountingServlet?uuid=e5f57fdc-5e78-4bc1-9d37-255ecb1eaa95&dataguid=30b96c4a-728b-4e0b-9dba-fd97f0a6f3eb&minage=12&maxage=30&sex=女&curtime=2013-10-17 09:12:23")

# 时间矫正
#url_open("http://localhost:9080/CustCount/servlet/TimeCorrectServlet")

# SSH远程连接
url_open("http://localhost:9080/CustCount/servlet/RemoteConnectServlet?uuid=e5f57fdc-5e78-4bc1-9d37-255ecb1eaa95&isconnect=true")
'''
