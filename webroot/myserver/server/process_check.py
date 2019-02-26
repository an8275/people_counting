#!/usr/bin/env python
# -*- coding: utf-8 -*-"""
import os
import sys




def write_process_pid(pidfile):
	pid = os.getpid()
	pidstr = '%d' % pid
	file = open(pidfile, "w")
	file.write(pidstr)
	file.close()


	
def check_process_running(pidfile, server_exe):
        try:
                file = open(pidfile, "r")
                lines = file.read()
                file.close()

                args = lines.split('\n')
                pid = args[0]
                cmdline = '/proc/%s/cmdline' % (pid)
                file = open(cmdline, "r")
                cmdstr = file.read()
                file.close()
                args = cmdstr.split('\0')
                argc = len(args)

                server_bin = ''

                if argc < 2:
                        return -1

                if args[0] == 'python':
                        bin = args[1]
                        pos = bin.rindex('/')
                        server_bin = bin[pos+1:]
                        if server_bin == server_exe:
                                return 0

                return -1

        except Exception, e:
                return -1

