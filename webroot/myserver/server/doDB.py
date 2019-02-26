#!/usr/bin/env python
# -*- coding: utf8 -*-
import MySQLdb
import MySQLdb.cursors 
from utils import get_server_cfg
import traceback

cfg = None

class db_class:
    #default_config_file="/var/lib/tomcat7/webapps/CustFlow/settings.ini"
    default_config_file="../config/settings.ini"


    def __init(self, config_file=None):
        if None == config_file:
            self.config_file = default_config_file
        else:
            self.config_file = config_file
        

        self.host = host
        self.port = port
        self.user = user
        self.passwd = passwd
        self.dbname = dbname
        self.conn = MySQLdb.connect(host=self.host, user=self.user,passwd=self.passwd,port=self.port,db=self.dbname)
        self.cursor = self.conn.cursor(cursorclass=MySQLdb.cursors.DictCursor)
        self.cursor.execute("set NAMES UTF8")

class sqldb:
    def __init__(self, host='127.0.0.1', port=3306, user='root', passwd='', dbname='', cfg=''):

        if None == cfg:
            self.host = host
            self.port = port
            self.user = user
            self.passwd = passwd
            self.dbname = dbname
        else:
            self.host = cfg['ip']
            self.port = int(cfg['port'])
            self.user = cfg['username']
            self.passwd = cfg['userpwd']
            self.dbname = cfg['database']

        self.sqldb_connect()

    def __del__(self):
        self.sqldb_close()

    def sqldb_connect(self):
        self.conn = MySQLdb.connect(host=self.host, user=self.user,passwd=self.passwd,port=self.port,db=self.dbname)
        self.conn.autocommit(True)
        self.cursor = self.conn.cursor(cursorclass=MySQLdb.cursors.DictCursor)
        self.cursor.execute("set NAMES UTF8")

        #print "sqldb_connect ok"

    def sqldb_query(self, sqlstr):
        try:
            res = self.cursor.execute(sqlstr)
        except Exception,e:
            if e[0] == 2006:
                print e
                self.cursor.close()

                self.sqldb_connect()
                res = self.cursor.execute(sqlstr)
            else:
                exstr = traceback.format_exc()
                print exstr

        return [res, self.cursor.fetchall()]
 
    def do_select(self, sqlstr):
        return self.sqldb_query(sqlstr)

    def do_update(self, sqlstr):
        return self.sqldb_query(sqlstr)

    def do_insert(self, sqlstr):
        return self.sqldb_query(sqlstr)

    def do_del(self, sqlstr):
        return self.sqldb_query(sqlstr)

    def sqldb_close(self):
        self.cursor.close()
    

#cfg = get_server_cfg('/ice/conf/db.conf')

cfg = get_server_cfg(db_class.default_config_file)


if __name__ == '__main__':

    from utils import get_server_cfg

    cfg = get_server_cfg(db_class.default_config_file)
    db = sqldb(cfg['ip'], int(cfg['port']), cfg['username'], cfg['userpwd'], cfg['database'])

    res = db.do_select('select * from userinfo');
    print res

    res = db.do_update('update userinfo set contactinfo="xx" where id=2');
    print res
    
    db.sqldb_close()
