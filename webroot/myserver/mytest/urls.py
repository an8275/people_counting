# -*- coding: utf8 -*-
from django.conf.urls import patterns, include, url
from django.contrib import admin
from mytest.view import *

from server.customer import *
from server.project import *
from server.device import *
from server.virtual_device import *
from server.statistic import *
from server.statisticLx import *
from server.login import *
from server.renderPDF import *

from server.CustCounting import *
from server.AgeCounting import *
from server.TimeCorrect import *
from server.RemoteConnect import *
from server.HeartBeat import *
from server.Register import *

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'mytest.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    #url(r'^.*LoginServlet.*$', Login),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^mytest/$', hello),
    url(r'^index/$', indexhtml),

    ## 客户管理 customer.py
    url(r'^.*AddCustServlet.*$', AddCust),   #Done
    url(r'^.*DelCustServlet.*$', DelCust),   #Done
    url(r'^.*CustDetailServlet.*$', CustDetail),   #Done
    url(r'^.*CustListServlet.*$', CustList),    #Done

    ## 项目管理 project.py
    url(r'^.*AddProjectServlet.*$', AddProject),        #Done
    url(r'^.*GetProjectTypeServlet.*$', GetProjectType), # Done
    url(r'^.*ProjectListServlet.*$', ProjectList),       #Done
    url(r'^.*ProDetailServlet.*$', ProDetail),        #Done
    url(r'^.*GetProjectDeviceServlet.*$', GetProjectDevice),
    url(r'^.*ChangeProjectStateServlet.*$', ChangeProjectState), #Done
    url(r'^.*UploadlogoServlet.*$', Uploadlogo), #Done

    ## 设备管理 device.py
    url(r'^.*DeleteDeviceServlet.*$', DeleteDevice),        #Done
    url(r'^.*AddDeviceServlet.*$', AddDevice),              #Done
    url(r'^.*AdminDeviceListServlet.*$', AdminDeviceList),  #Done
    url(r'^.*UserDeviceListServlet.*$', UserDeviceList),    #Done
    url(r'^.*DevDetailServlet.*$', DevDetail),            #Done
    url(r'^.*ChangeDeviceRegisterServlet.*$', ChangeDeviceRegister), #Done
    url(r'^.*ChangeDeviceUsableServlet.*$', ChangeDeviceUsable), #Done
    url(r'^.*ChangeDeviceConnectServlet.*$', ChangeDeviceConnect), #Done
    url(r'^.*DeviceConnectExistServlet.*$', DeviceConnectExist), #Done
    url(r'^.*GetDeviceTypeServlet.*$', GetDeviceType),  #Done

    ## 虚拟设备管理 virtual_device.py
    url(r'^.*VirtualDeviceListServlet.*$', VirtualDeviceList), #Done
    url(r'^.*AddVirtualDeviceServlet.*$', AddVirtualDevice), #Done
    url(r'^.*DelVirtualDeviceServlet.*$', DelVirtualDevice), #Done
    url(r'^.*GetRightLeftDeviceServlet.*$', GetRightLeftDevice), #Done

    ## 销售管理 custsales
    url(r'^.*CustSalesServlet.*$', CustSales), #录入当日销售 #Done
    url(r'^.*SalesInfoServlet.*$', SalesInfo), # 销售信息查询 #Done
    #CustSalesDetialServlet 访问销售额

    ##报表导出
    url(r'^.*exportPDFServlet.*$', exportPDF), #导出pdf
    url(r'^.*renderPDFServlet.*$', renderPDF), 

    ## 统计查询 statistic.py
    url(r'^.*GethiddenflowServlet.*$', gethiddenpersonflow),       # 查询隐藏人流量数据
    url(r'^.*UpdatemodifyflowServlet.*$', updatepersonflow),       # 更新隐藏人流量表数据
    url(r'^.*InOutFlowCountServlet.*$', InOutFlowCount),           # 人流量表查询       # Done
    url(r'^.*AverageStayTimeServlet.*$', AverageStayTime),         # 平均停留时间查询
    url(r'^.*InOutCountChartServlet.*$', InOutCountChart),         # 详细进出人数查询   # Done
    url(r'^.*StayCountChartServlet.*$', StayCountChart),           # 详细停留人数查询   # Done
    url(r'^.*AgeAttributeChartServlet.*$', AgeAttributeChart),     # 年龄分布表         # Done
    url(r'^.*SexAttributeChartServlet.*$', SexAttributeChart),     # 性别分布表
    url(r'^.*HeatMapServlet.*$', HeatMap),

 
    ## 登录&登出 login.py
    url(r'^.*LoginServlet.*$', Login),            #Done
    url(r'^.*LogOutServlet.*$', LogOut),          #Done
    url(r'^.*ModifyPwdCustServlet.*$', ModifyPwdCust),          #
    url(r'^.*ModifyAdminPwdServlet.*$', ModifyAdminPwd),
    url(r'^.*ModifyStartEndTimeCustServlet.*$', ModifyStartEndTimeCust),
    url(r'^.*ModifyCurrencyTypeServlet.*$', ModifyCurrencyType),


    ###联想客流接口
    url(r'^.*getThroughNumServlet.*$', getThroughNum),   #Done
    url(r'^.*getThroughNumsServlet.*$', getThroughNums), #Done
    url(r'^.*getThroughNumsSeparateServlet.*$', getThroughNumsSeparate), #Done

    ###联想人脸属性接口
    url(r'^.*getAgeServlet.*$', getAge),  #Done
    url(r'^.*getAgesServlet.*$', getAges),  #Done
    url(r'^.*getAgesSeparateServlet.*$', getAgesSeparate),  #Done
    
    ###联想性别属性接口
    url(r'^.*getSexServlet.*$', getSex),  #Done
    url(r'^.*getSexsServlet.*$', getSexs),  #Done
    url(r'^.*getSexsSeparateServlet.*$', getSexsSeparate),  #Done
    
    ###联想pos接口
    url(r'^.*getPosServlet.*$', getPos),  #Done
    url(r'^.*getPossServlet.*$', getPoss),  #Done
    url(r'^.*getPossSeparateServlet.*$', getPossSeparate),  #Done

    ##上传
    url(r'^.*CustCountingServlet.*$', CustCounting),  #Done
    url(r'^.*AgeCountingServlet.*$', AgeCounting),  #Done
    url(r'^.*TimeCorrectServlet.*$', TimeCorrect),  #Done
    url(r'^.*RemoteConnectServlet.*$', RemoteConnect),  #Done
    url(r'^.*HeartBeatServlet.*$', HeartBeat),  #Done
    url(r'^.*RegisterServlet.*$', Register),  #Done
    

)
