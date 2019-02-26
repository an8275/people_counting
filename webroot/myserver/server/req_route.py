#!/usr/bin/python
# -*- coding: utf8 -*-

from customer import *
from project import *
from device import *
from virtual_device import *
from statistic import *
from statisticLx import *
from login import *
from renderPDF import *

req_route_map={   
    ## 客户管理 customer.py
    'AddCustServlet': AddCust, # Done
    'DelCustServlet': DelCust,      # Done
    'CustDetailServlet': CustDetail, # Done
    'CustListServlet': CustList, # Done

    ## 项目管理 project.py
    'AddProjectServlet': AddProject,        #Done
    'GetProjectTypeServlet': GetProjectType, # Done
    'ProjectListServlet': ProjectList,        #Done
    'ProDetailServlet': ProDetail,        #Done
    'GetProjectDeviceServlet': GetProjectDevice,
    'ChangeProjectStateServlet':ChangeProjectState, #Done
    'UploadlogoServlet':Uploadlogo, #Done

    ## 设备管理 device.py
    'DeleteDeviceServlet': DeleteDevice,         #Done
    'AddDeviceServlet': AddDevice,               #Done
    'AdminDeviceListServlet': AdminDeviceList,   #Done
    'UserDeviceListServlet': UserDeviceList,     #Done
    'DevDetailServlet': DevDetail,               #Done
    'ChangeDeviceRegisterServlet':ChangeDeviceRegister, #Done
    'ChangeDeviceUsableServlet':ChangeDeviceUsable, #Done
    'ChangeDeviceUsableServlet':ChangeDeviceUsable, #Done
    'ChangeDeviceConnectServlet':ChangeDeviceConnect, #Done
    'DeviceConnectExistServlet':DeviceConnectExist, #Done
    'GetDeviceTypeServlet':GetDeviceType,  #Done

    ## 虚拟设备管理 virtual_device.py
    'VirtualDeviceListServlet': VirtualDeviceList, #Done
    'AddVirtualDeviceServlet': AddVirtualDevice, #Done
    'DelVirtualDeviceServlet': DelVirtualDevice, #Done
    'GetRightLeftDeviceServlet': GetRightLeftDevice, #Done

    ## 销售管理 custsales
    'CustSalesServlet':CustSales, #录入当日销售 #Done
    'SalesInfoServlet':SalesInfo, # 销售信息查询 #Done
    #CustSalesDetialServlet 访问销售额

    ##报表导出
    'exportPDFServlet': exportPDF,#导出pdf
    'renderPDFServlet': renderPDF,

    ## 统计查询 statistic.py
    'GethiddenflowServlet': gethiddenpersonflow,       # 查询隐藏人流量数据
    'UpdatemodifyflowServlet': updatepersonflow,       # 更新隐藏人流量表数据
    'InOutFlowCountServlet': InOutFlowCount,           # 人流量表查询       # Done
    'AverageStayTimeServlet': AverageStayTime,         # 平均停留时间查询
    'InOutCountChartServlet': InOutCountChart,         # 详细进出人数查询   # Done
    'StayCountChartServlet': StayCountChart,           # 详细停留人数查询   # Done
    'AgeAttributeChartServlet': AgeAttributeChart,     # 年龄分布表         # Done
    'SexAttributeChartServlet': SexAttributeChart,     # 性别分布表
    'HeatMapServlet':HeatMap,

 
    ## 登录&登出 login.py
    'LoginServlet': Login,            #Done
    'LogOutServlet': LogOut,          #Done
    'ModifyPwdCustServlet': ModifyPwdCust,          #
    'ModifyAdminPwdServlet': ModifyAdminPwd,  
    'ModifyStartEndTimeCustServlet': ModifyStartEndTimeCust,
    'ModifyCurrencyTypeServlet': ModifyCurrencyType,


    ###联想客流接口
    'getThroughNumServlet':getThroughNum, #Done
    'getThroughNumsServlet':getThroughNums, #Done
    'getThroughNumsSeparateServlet':getThroughNumsSeparate, #Done

    ###联想人脸属性接口
    'getAgeServlet':getAge,  #Done
    'getAgesServlet':getAges,  #Done
    'getAgesSeparateServlet':getAgesSeparate,  #Done
    
    ###联想性别属性接口
    'getSexServlet':getSex,  #Done
    'getSexsServlet':getSexs,  #Done
    'getSexsSeparateServlet':getSexsSeparate,  #Done
    
    ###联想pos接口
    'getPosServlet':getPos,  #Done
    'getPossServlet':getPoss,  #Done
    'getPossSeparateServlet':getPossSeparate,  #Done
    
}
