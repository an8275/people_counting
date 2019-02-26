#!/bin/bash

P=5858

PID=$(netstat -anp|grep 127.0.0.1:$P | grep sshd |grep LISTEN | grep -v grep | awk '{print $7}' | cut -d/ -f1)

if [ "_${PID}" != "_" ]; then
    if [ ${PID} -gt 0 ]; then
        eval kill -9 ${PID}
    fi
fi

exit 0
