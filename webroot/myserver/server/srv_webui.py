#!/usr/bin/python
# -*- coding: utf8 -*-

import sys
import os
import scgi
from scgi.scgi_server import *
from process_check import *
from daemon import *
import multiprocessing

#from utils import get_server_cfg
#import doDB 

from req_route import *

######## Global Para Define Here #########

##########################################

#SCGI_DIR='/leo/work/rayeye/rayeye002/rayeye002/server'
SCGI_DIR='D:/web/alidata1/web/server'
SCGI_PID='D:/web/alidata1/var/run/srv_webui.pid'

class Handler(SCGIHandler):
    def produce(self, env, bodysize, input, output):
        #try:
            post_data  = {}
            #print 'bodysize',bodysize
            #if bodysize > 0:
                #post_data = json.loads(input.read(bodysize))
            #print 'post_data',input.read(bodysize)
            #print "REQUEST_URI:%s"%env['REQUEST_URI']
            method = env['REQUEST_URI'].split('?')[0].split('/')[-1]
            #method = env['REQUEST_URI'].split('/')[2].split('?')[0]
            #print "method:", method

            if method in req_route_map:
                req_route_map[method](env, bodysize, input, output)
            else:
                print "Invalid method:", method
    
        #except Exception,data:
            #print "Scgi Hander product except"
    
    def produce_cgilike(self, env, bodysize):
        sys.stdout.write("Content-Type: text/plain\r\n\r\n")
        for k, v in env.items():
            print "%s: %r" % (k, v)
    
def init_system():
    return 1

    '''
    doDB.cfg = get_server_cfg(doDB.db_class.default_config_file)

    if None == doDB.cfg:
        return None

    try:
        doDB.db = doDB.sqldb(doDB.cfg['ip'], int(doDB.cfg['port']), doDB.cfg['username'], doDB.cfg['userpwd'], doDB.cfg['database'])
    except:
        print "sqldb except error"
        return None

    return 1
    '''

def main():
    basename=sys.argv[0].split('/')[-1]

    ## 1. 运行状态检查
    argc = len(sys.argv)
    ret = check_process_running(SCGI_PID, basename)
    if ret == 0:
        sys.exit(0)
    print os.getpid()
    ## 2. 初始化数据
    if None == init_system():
        print "init_system error"
        sys.exit(0) 
    print "into main"
    ## 3. 后台运行
    if argc < 2:
        pool = multiprocessing.Pool(processes=2)
        pool.apply_async(daemonize(dir='%s'%(SCGI_DIR)), ("", ))
        #daemonize(dir='%s'%(SCGI_DIR))
        print "aa"
    else:
        os.chdir(SCGI_DIR)
    print os.getpid()
    write_process_pid(SCGI_PID)
    print "bb"
    ## 4. 启动Scgi服务
    server = SCGIServer(
            handler_class = Handler,
            host="127.0.0.1",
            port=3001,
            )
    print "cc"
    print server
    ### 4.1. 主服务
    server.serve()

if __name__ == '__main__':  
    main()
	
