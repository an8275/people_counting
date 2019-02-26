#!/usr/bin/python
# -*- coding: utf-8 -*-
import sys, os, time, atexit
from signal import SIGTERM 

def daemonize(stdin='D:/web/alidata1/dev/null', stdout='D:/web/alidata1/dev/null', stderr='D:/web/alidata1/dev/null', dir='/'):
#        return

        

        #os.setsid()
        os.chdir(dir)
        os.umask(0)

	pid=os.getpid()
	print pid

	sys.stdout.flush()
	sys.stderr.flush()

        si = file(stdin, 'r')

        so = file(stdout, 'a+')

        se = file(stderr, 'a+', 0)
        
        #os.dup2(si.fileno(), sys.stdin.fileno())

        #os.dup2(so.fileno(), sys.stdout.fileno())

        #os.dup2(se.fileno(), sys.stderr.fileno())

        return
 

