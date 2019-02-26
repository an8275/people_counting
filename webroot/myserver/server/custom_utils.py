#!/usr/bin/python
# -*- coding: utf8 -*-

from common import *
import doDB 

''' 项目所需常用函数库 '''

def value_exist(key, value, table, where=None):
    ''' value_exist(key, value, table, where=None): 用于检查数据是否存在
        输入参数: key - column name
                  value
                  where : 增强得判断条件
        返回值: True: 值存在, False: 值不存在
    '''
    exist = False

    db = doDB.sqldb(cfg=doDB.cfg)

    sql = "select %s from %s where %s='%s'"%(key, table, key, value)
    if where is not None:
        sql += " %s"%(where)

    print sql

    res = db.do_select(sql)
    
    if res[0] > 0:
        exist = True

    db.sqldb_close()

    return exist

def valid_device_name(project_uid, device_name, device_guid, table='device_cust'):
    ''' valid_device_name(device_name, device_guid, table='device_cust'): 判断设备名称有效性 '''

    result = 'INVALIDFORMAT'

    where = "and proguid='%s'"%(project_uid)
    if device_guid != '':
        where += " and guid!='%s'"%(device_guid)

    if value_exist('name', device_name, table, where=where):
        result = 'UNIQUENAMEERROR'
    else:
        result = 'VALID'

    #print "result [%s] = valid_device_name (%s, %s)"%(result, device_name, table)

    return result

def valid_device_uuid(device_uuid, table, device_guid):
    '''valid_device_uuid(device_uuid, device_type='cust', device_guid): 判断是否有效得GUID
        device_uuid: 自定义uuid
        table: 表名
        device_guid: When device_guiad='' new, not '' exclude self
        返回值: 'UNIQUEERROR': 不唯一, 'INVALIDFORMAT':无效格式, 'VALID': 有效
    '''
    result = 'INVALIDFORMAT'

    where = ''
    if device_guid != '':
        where = "and guid != '%s'"%(device_guid)
     
    if value_exist('uuid', device_uuid, table, where=where):
        result = 'UNIQUEERROR'
    else:
        result = 'VALID'

    return result

def GetActualDeviceDataGuidList(dataguid, isvirtual=False):
    ''' GetActualDeviceDataGuidList(dataguid, isvirtual="0"): 根据输入dataguid数据，获取虚拟设备对应得有效物理设备对应datatlist列表
        返回值: list ['xxx','xxx']
    '''

    ## 1. 初始化数据
    result = []
    #print dataguid
    #print "Into GetActualDeviceDataGuidList"

    
    ## 2. 物理设备直接返回
    if isvirtual == False:
        result.append(dataguid)
        return result

    ## 3. 虚拟设备
    ## 3.1) DB 获取数据
    db = doDB.sqldb(cfg=doDB.cfg)

    sql = "select * from device_virtual where virtualguid='%s';"%(dataguid)

    res = db.do_select(sql)

    if res[0] > 0:
        for i in xrange(res[0]):
            device = res[1][i]
            if device['ischildvirtual'] == True:
                virtual_result = GetActualDeviceDataGuidList(device['childdataguid'], isvirtual=True)
            else:
                virtual_result = GetActualDeviceDataGuidList(device['childdataguid'], isvirtual=False)

            result.extend(virtual_result)

    db.sqldb_close()

    return result

def get_device_dataguid(guid=None,deviceType=None, proguid=None, uuid=None):
    ''' get_device_dataguid(guid=None, proguid=None, uuid=None): 从输入条件获取dataguid
    '''
    dataguid = ''
    where = ''

    ## 忽略无效
    if guid is None and proguid is None and uuid is None:
        return dataguid
    
    if guid is not None:
        where += " and guid='%s'"%(guid)
    if proguid is not None:
        where += " and proguid='%s'"%(proguid)
    if uuid is not None:
        where += " and uuid='%s'"%(uuid)

    sql = 'select dataguid from %s where 1 %s'%(deviceType,where)

    ## DB init
    db = doDB.sqldb(cfg=doDB.cfg)

    res = db.do_select(sql)
    
    if res[0] > 0:
        dataguid = res[1][0]['dataguid']

    ## DB close
    db.sqldb_close()

    return dataguid

def get_device_info(guid=None, proguid=None, uuid=None):
    ''' def get_device_info(guid=None, proguid=None, uuid=None): 从输入条件获取设备信息
    '''
    device_info = {}
    where = ''

    ## 忽略无效
    if guid is None and proguid is None and uuid is None:
        return dataguid
    
    if guid is not None:
        where += " and guid='%s'"%(guid)
    if proguid is not None:
        where += " and proguid='%s'"%(proguid)
    if uuid is not None:
        where += " and uuid='%s'"%(uuid)

    sql = 'select * from device_cust where 1 %s'%(where)

    ## DB init
    db = doDB.sqldb(cfg=doDB.cfg)

    res = db.do_select(sql)
    
    if res[0] > 0:
        device_info = res[1][0]

    ## DB close
    db.sqldb_close()

    return device_info

def get_device_control_status(device_guid):
    ''' get_device_control_status(device_guid): 获取设备控制状态
        返回值: issign, isusable 元组
    '''
    is_sign = False
    is_usable = False

    ## DB init
    db = doDB.sqldb(cfg=doDB.cfg)

    ### 人流量统计设备
    sql = "select issign,isusable from device_cust where guid='%s'"%(device_guid)
    res = db.do_select(sql)

    if res[0] > 0:
        if res[1][0]['issign'] == '\x01':
            is_sign = True
        if res[1][0]['isusable'] == '\x01':
            is_usable = True
    else:
    ### 年龄统计设备
        sql = "select issign,isusable from device_age where guid='%s'"%(device_guid)
        res = db.do_select(sql)

        if res[0] > 0:
            if res[1][0]['issign'] == '\x01':
                is_sign = True
            if res[1][0]['isusable'] == '\x01':
                is_usable = True

    ## DB close
    db.sqldb_close()

    return is_sign, is_usable


device_status = {
    'unregistered':0, # 设备禁用: issign=false
    'disabled':0,     # 设备禁用: isusable=false
    'online': 1,      # 设备在线: issign=true, isusable=true, and update active
    'offline': 2      # 设备离线: issign=true, siusable=true, and update timeout
}

def get_device_status(device_guid, is_sign=None, is_usable=None):
    ''' get_device_status(device_guid, device_is_sign, device_is_usable): 获取设备状态
        返回值：参考device_status定义
    '''
    state = device_status['unregistered']

    # 无状态输入时，从device_cust 设备列表获取状态信息
    if is_sign is None and is_usable is None:
        print '111111111111111111111111111111111111111111'
        is_sign, is_usable = get_device_control_status(device_guid)

    #print "get_device_status()", is_sign, is_usable
        
    if is_sign == '\x00' or is_sign == False:
        state = device_status['unregistered']
    elif is_usable == '\x00' or is_usable == False:
        state = device_status['disabled']
    else:
    ## 获取在线状态
        state = device_status['offline']

        sql = "select now()-lastcontime,unix_timestamp(now())-unix_timestamp(lastcontime) as timeout from device_update where deviceguid='%s'"%(device_guid)

        print sql

        ## DB init
        db = doDB.sqldb(cfg=doDB.cfg)
        res = db.do_select(sql)
        print res
        if res[0] > 0:
            if int(res[1][0]['timeout']) < DEVICE_MAX_TIMEOUT:
                state = device_status['online']

        ## DB close
        db.sqldb_close()

    return state

def get_device_guid_list(project_guid):
    ''' def get_device_guid_list(guid): 根据项目guid输出物理设备guid列表

    '''
    device_list = []

    ## DB init
    db = doDB.sqldb(cfg=doDB.cfg)

    sql = "select guid from device_cust where isvirtual=0 and proguid='%s'"%(project_guid)
    #print sql
    res = db.do_select(sql)

    if res[0] > 0:
        for item in res[1]:
            device_list.append(item['guid'])

    ## DB close
    db.sqldb_close()

    return device_list

project_status = {
    'disabled': '0',    # 项目已禁用
    'online': '1',      # 项目启用,有设备在线
    'offline': '2'      # 项目启用,无设备在线
}

def get_project_status(guid):
    '''def get_project_status(guid): 获取返回项目状态
    返回值：
        0 ： 项目已禁用
        1 ： 项目启用,有设备在线
        2 ： 项目启用,无设备在线
    '''
    status = project_status['offline']

    #
    sql = "SELECT bin(isusable) as isUsage from project where guid='%s'"%(guid)
    #print sql
    ## DB init
    db = doDB.sqldb(cfg=doDB.cfg)
    res = db.do_select(sql)
    if res[0] > 0:
        # 项目禁用
        if res[1][0]['isUsage'] == '0':
            status = project_status['disabled']
        # 项目启用
        else: 
            # 获取设备列表
            device_guid_list = get_device_guid_list(guid)

            for device_guid in device_guid_list:
                _device_status = get_device_status(device_guid)
                if _device_status == device_status['online']:
                    status = project_status['online']
                    break
    ## DB close
    db.sqldb_close()

    return status

def ssh_connected(uuid):
    ''' def ssh_connected(uuid): 检查设备是否ssh连线'''
    connected = False

    sql = "select * from connect_device where deviceuuid='%s'"%(uuid)

    ## DB init
    db = doDB.sqldb(cfg=doDB.cfg)
    res = db.do_select(sql)
    if res[0] > 0:
        connected = True

    ## DB close
    db.sqldb_close()

    return connected

####################
## test
if __name__ == '__main__':
    #print value_exist('name', '年龄性别虚拟总', 'device_cust', where="and isvirtual=False")
    print get_device_dataguid(guid='977b08d2-5a46-11e3-aa50-9c4e36c5898c')
    print get_device_dataguid(uuid='leo1111')
    print get_device_dataguid(proguid='90ab5516-5901-11e3-aa50-9c4e36c5898c', uuid='leo1111')
