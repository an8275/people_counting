/*
Navicat MySQL Data Transfer

Source Server         : local
Source Server Version : 50532
Source Host           : localhost:3306
Source Database       : custcount

Target Server Type    : MYSQL
Target Server Version : 50532
File Encoding         : 65001

Date: 2014-12-16 10:16:29
*/
CREATE DATABASE custcount;
USE custcount;
SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `ageattr`
-- ----------------------------
DROP TABLE IF EXISTS `ageattr`;
CREATE TABLE `ageattr` (
`id`  int(11) NOT NULL AUTO_INCREMENT ,
`guid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL ,
`sex`  bit(1) NULL DEFAULT NULL COMMENT '性别(0表示女，1表示男)' ,
`minage`  int(11) NULL DEFAULT NULL COMMENT '年龄上限' ,
`age`  int(11) NULL DEFAULT NULL COMMENT '年龄中间值' ,
`maxage`  int(11) NULL DEFAULT NULL COMMENT '年龄下限' ,
`deviceuuid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`dataguid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`curtime`  datetime NULL DEFAULT NULL ,
PRIMARY KEY (`id`),
UNIQUE INDEX `index_guid` (`guid`) USING BTREE ,
INDEX `index_dataguid` (`dataguid`) USING BTREE 
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci
AUTO_INCREMENT=244078

;

-- ----------------------------
-- Table structure for `connect_device`
-- ----------------------------
DROP TABLE IF EXISTS `connect_device`;
CREATE TABLE `connect_device` (
`id`  int(11) NOT NULL AUTO_INCREMENT ,
`guid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL ,
`deviceuuid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '设备唯一guid' ,
`curtime`  datetime NULL DEFAULT NULL COMMENT '连接时间' ,
PRIMARY KEY (`id`),
UNIQUE INDEX `remoteconnect_guid` (`guid`) USING BTREE 
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci
AUTO_INCREMENT=1

;

-- ----------------------------
-- Table structure for `cust_sales`
-- ----------------------------
DROP TABLE IF EXISTS `cust_sales`;
CREATE TABLE `cust_sales` (
`curtime`  date NULL DEFAULT '0000-00-00' ,
`dataguid`  char(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT '' ,
`orders`  int(11) NULL DEFAULT NULL ,
`sales`  int(11) NULL DEFAULT NULL ,
`id`  int(11) NOT NULL AUTO_INCREMENT ,
PRIMARY KEY (`id`),
UNIQUE INDEX `curtime` (`curtime`, `dataguid`) USING BTREE 
)
ENGINE=MyISAM
DEFAULT CHARACTER SET=latin1 COLLATE=latin1_swedish_ci
AUTO_INCREMENT=655

;

-- ----------------------------
-- Table structure for `device`
-- ----------------------------
DROP TABLE IF EXISTS `device`;
CREATE TABLE `device` (
`id`  int(11) NOT NULL AUTO_INCREMENT ,
`guid`  varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
`proguid`  varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL ,
`devicename`  varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL ,
`location`  varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL ,
`addtime`  datetime NULL DEFAULT NULL ,
`responsibleperson`  varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL ,
`remark`  varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL ,
PRIMARY KEY (`id`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=latin1 COLLATE=latin1_swedish_ci
AUTO_INCREMENT=1

;

-- ----------------------------
-- Table structure for `device_age`
-- ----------------------------
DROP TABLE IF EXISTS `device_age`;
CREATE TABLE `device_age` (
`issale`  bit(1) NULL DEFAULT NULL ,
`id`  int(11) NOT NULL AUTO_INCREMENT ,
`guid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '主键（保证唯一）' ,
`dataguid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '数据guid，用于统计' ,
`proguid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '所属项目' ,
`uuid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '注册guid' ,
`isvirtual`  bit(1) NULL DEFAULT NULL COMMENT '是否为虚拟' ,
`issign`  bit(1) NULL DEFAULT NULL COMMENT '是否注册' ,
`name`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '设备名' ,
`isusable`  bit(1) NULL DEFAULT NULL COMMENT '设备状态，1为可用，0为禁用' ,
`addtime`  datetime NULL DEFAULT NULL COMMENT '纳入时间\r\n' ,
`description`  varchar(1023) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`remark`  varchar(1023) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
PRIMARY KEY (`id`),
UNIQUE INDEX `index_guid` (`guid`) USING BTREE ,
UNIQUE INDEX `index_uuid` (`uuid`) USING BTREE ,
INDEX `index_dataguid` (`dataguid`) USING BTREE ,
INDEX `index_proguid` (`proguid`) USING BTREE 
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci
AUTO_INCREMENT=31

;

-- ----------------------------
-- Table structure for `device_cust`
-- ----------------------------
DROP TABLE IF EXISTS `device_cust`;
CREATE TABLE `device_cust` (
`issale`  bit(1) NULL DEFAULT NULL ,
`id`  int(11) NOT NULL AUTO_INCREMENT ,
`guid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '主键（保证唯一）' ,
`dataguid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '数据guid，用于统计' ,
`proguid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '所属项目' ,
`uuid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '注册guid' ,
`isvirtual`  bit(1) NULL DEFAULT NULL COMMENT '是否为虚拟' ,
`issign`  bit(1) NULL DEFAULT NULL COMMENT '是否注册' ,
`name`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '设备名' ,
`addtime`  datetime NULL DEFAULT NULL COMMENT '纳入时间\r\n' ,
`description`  varchar(1023) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`remark`  varchar(1023) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`isusable`  bit(1) NULL DEFAULT NULL COMMENT '设备状态，1为可用，0为禁用' ,
PRIMARY KEY (`id`),
UNIQUE INDEX `index_guid` (`guid`) USING BTREE ,
UNIQUE INDEX `index_uuid` (`uuid`) USING BTREE ,
INDEX `index_dataguid` (`dataguid`) USING BTREE ,
INDEX `index_proguid` (`proguid`) USING BTREE 
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci
AUTO_INCREMENT=402

;

-- ----------------------------
-- Table structure for `device_heat`
-- ----------------------------
DROP TABLE IF EXISTS `device_heat`;
CREATE TABLE `device_heat` (
`issale`  bit(1) NULL DEFAULT NULL ,
`id`  int(11) NOT NULL AUTO_INCREMENT ,
`guid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '主键（保证唯一）' ,
`dataguid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '数据guid，用于统计' ,
`proguid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '所属项目' ,
`uuid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '注册guid' ,
`isvirtual`  bit(1) NULL DEFAULT NULL COMMENT '是否为虚拟' ,
`issign`  bit(1) NULL DEFAULT NULL COMMENT '是否注册' ,
`name`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '设备名' ,
`addtime`  datetime NULL DEFAULT NULL COMMENT '纳入时间\r\n' ,
`description`  varchar(1023) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`remark`  varchar(1023) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`isusable`  bit(1) NULL DEFAULT NULL COMMENT '设备状态，1为可用，0为禁用' ,
PRIMARY KEY (`id`),
UNIQUE INDEX `index_guid` (`guid`) USING BTREE ,
UNIQUE INDEX `index_uuid` (`uuid`) USING BTREE ,
INDEX `index_dataguid` (`dataguid`) USING BTREE ,
INDEX `index_proguid` (`proguid`) USING BTREE 
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci
AUTO_INCREMENT=246

;

-- ----------------------------
-- Table structure for `device_register`
-- ----------------------------
DROP TABLE IF EXISTS `device_register`;
CREATE TABLE `device_register` (
`id`  int(11) NOT NULL AUTO_INCREMENT ,
`guid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL ,
`proguid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`deviceuuid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '设备uuid' ,
`deviceguid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '设备guid(冗余)' ,
`applytime`  datetime NULL DEFAULT NULL COMMENT '申请时间' ,
`state`  char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '设备状态(0：未注册，1：已审批未注册，2：已注册)' ,
`lastmodtime`  datetime NULL DEFAULT NULL COMMENT '最后修改时间' ,
`publickey`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '给设备的key' ,
`checkkey`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '校验的key' ,
PRIMARY KEY (`id`),
UNIQUE INDEX `guid` (`guid`) USING BTREE 
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci
AUTO_INCREMENT=13

;

-- ----------------------------
-- Table structure for `device_update`
-- ----------------------------
DROP TABLE IF EXISTS `device_update`;
CREATE TABLE `device_update` (
`id`  int(11) NOT NULL AUTO_INCREMENT ,
`guid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL ,
`deviceuuid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '设备uuid' ,
`deviceguid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '设备guid(冗余)' ,
`proguid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '项目guid' ,
`ip`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '状态' ,
`cpurate`  int(11) NULL DEFAULT NULL COMMENT 'cpu占用率' ,
`lastcontime`  datetime NULL DEFAULT NULL COMMENT '上一次连接时间' ,
PRIMARY KEY (`id`),
UNIQUE INDEX `index_guid` (`guid`) USING BTREE ,
INDEX `index_deviceguid` (`deviceguid`) USING BTREE 
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci
AUTO_INCREMENT=2124

;

-- ----------------------------
-- Table structure for `device_virtual`
-- ----------------------------
DROP TABLE IF EXISTS `device_virtual`;
CREATE TABLE `device_virtual` (
`id`  int(11) NOT NULL AUTO_INCREMENT ,
`guid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL ,
`ischildvirtual`  bit(1) NULL DEFAULT NULL COMMENT '虚拟设备对应的设备是否是虚拟设备(冗余)' ,
`childdataguid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '子设备dataguid' ,
`childdeviceguid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '子设备deviceguid(冗余)' ,
`virtualguid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '所属虚拟设备' ,
PRIMARY KEY (`id`),
UNIQUE INDEX `device_virtual_guid` (`guid`) USING BTREE 
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci
AUTO_INCREMENT=748

;

-- ----------------------------
-- Table structure for `film`
-- ----------------------------
DROP TABLE IF EXISTS `film`;
CREATE TABLE `film` (
`id`  int(11) NOT NULL AUTO_INCREMENT ,
`auditorium`  char(1) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
`showtime`  datetime NOT NULL ,
`cinema`  char(8) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL ,
PRIMARY KEY (`id`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=latin1 COLLATE=latin1_swedish_ci
AUTO_INCREMENT=7635

;

-- ----------------------------
-- Table structure for `inoutnum`
-- ----------------------------
DROP TABLE IF EXISTS `inoutnum`;
CREATE TABLE `inoutnum` (
`id`  int(11) NOT NULL AUTO_INCREMENT ,
`guid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL ,
`innum`  int(11) NULL DEFAULT NULL ,
`outnum`  int(11) NULL DEFAULT NULL ,
`curtime`  datetime NULL DEFAULT NULL ,
`dataguid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`deviceuuid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`deviceguid`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
PRIMARY KEY (`id`),
UNIQUE INDEX `index_guid` (`guid`) USING BTREE ,
INDEX `index_dataguid` (`dataguid`) USING BTREE 
)
ENGINE=MyISAM
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci
AUTO_INCREMENT=4279815

;

-- ----------------------------
-- Table structure for `modifypersonflow`
-- ----------------------------
DROP TABLE IF EXISTS `modifypersonflow`;
CREATE TABLE `modifypersonflow` (
`id`  int(11) NOT NULL AUTO_INCREMENT ,
`deviceGuid`  varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
`inoutaver`  int(11) NOT NULL ,
`date`  varchar(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`id`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=latin1 COLLATE=latin1_swedish_ci
AUTO_INCREMENT=73

;

-- ----------------------------
-- Table structure for `project`
-- ----------------------------
DROP TABLE IF EXISTS `project`;
CREATE TABLE `project` (
`id`  int(11) NOT NULL AUTO_INCREMENT ,
`guid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL ,
`name`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '项目名' ,
`isusable`  bit(1) NULL DEFAULT NULL COMMENT '项目状态（1为可用、0为禁用）' ,
`addtime`  datetime NULL DEFAULT NULL COMMENT '入纳时间' ,
`responsibleperson`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT 'rayeye' COMMENT '项目负责人' ,
`description`  varchar(1023) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '描述信息' ,
`remark`  varchar(1023) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '详细信息' ,
`address`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`starttime`  datetime NULL DEFAULT NULL ,
PRIMARY KEY (`id`),
UNIQUE INDEX `index_guid` (`guid`) USING BTREE 
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci
AUTO_INCREMENT=93

;

-- ----------------------------
-- Table structure for `project_device`
-- ----------------------------
DROP TABLE IF EXISTS `project_device`;
CREATE TABLE `project_device` (
`id`  int(11) NOT NULL AUTO_INCREMENT ,
`guid`  varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
`deviceguid`  varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT '标记是哪台设备' ,
`proguid`  varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL ,
`devicedataguid`  varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT '冗余' ,
PRIMARY KEY (`id`),
UNIQUE INDEX `guid` (`guid`) USING BTREE 
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=latin1 COLLATE=latin1_swedish_ci
AUTO_INCREMENT=1

;

-- ----------------------------
-- Table structure for `project_device_age`
-- ----------------------------
DROP TABLE IF EXISTS `project_device_age`;
CREATE TABLE `project_device_age` (
`id`  int(11) NOT NULL AUTO_INCREMENT ,
`guid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL ,
`deviceguid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '标记是哪台设备' ,
`proguid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`devicedataguid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '冗余' ,
PRIMARY KEY (`id`),
UNIQUE INDEX `guid` (`guid`) USING BTREE 
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci
AUTO_INCREMENT=82

;

-- ----------------------------
-- Table structure for `project_device_cust`
-- ----------------------------
DROP TABLE IF EXISTS `project_device_cust`;
CREATE TABLE `project_device_cust` (
`id`  int(11) NOT NULL AUTO_INCREMENT ,
`guid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL ,
`deviceguid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '标记是哪台设备' ,
`proguid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`devicedataguid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '冗余' ,
PRIMARY KEY (`id`),
UNIQUE INDEX `guid` (`guid`) USING BTREE 
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci
AUTO_INCREMENT=164

;

-- ----------------------------
-- Table structure for `project_device_heat`
-- ----------------------------
DROP TABLE IF EXISTS `project_device_heat`;
CREATE TABLE `project_device_heat` (
`id`  int(11) NOT NULL AUTO_INCREMENT ,
`guid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL ,
`deviceguid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '标记是哪台设备' ,
`proguid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`devicedataguid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '冗余' ,
PRIMARY KEY (`id`),
UNIQUE INDEX `guid` (`guid`) USING BTREE 
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci
AUTO_INCREMENT=49

;

-- ----------------------------
-- Table structure for `userinfo`
-- ----------------------------
DROP TABLE IF EXISTS `userinfo`;
CREATE TABLE `userinfo` (
`endtime`  char(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`starttime`  char(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`id`  int(11) NOT NULL AUTO_INCREMENT ,
`guid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL ,
`proguid`  char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`username`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '用户名' ,
`userpwd`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '密码' ,
`responsibleperson`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT 'rayeye' COMMENT '负责人' ,
`contactinfo`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '联系信息' ,
`description`  varchar(1023) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '描述' ,
`remark`  varchar(1023) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '详细信息' ,
`addtime`  datetime NULL DEFAULT NULL COMMENT '纳入时间' ,
`currencytype`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
PRIMARY KEY (`id`),
UNIQUE INDEX `index_guid` (`guid`) USING BTREE ,
INDEX `index_proguid` (`proguid`) USING BTREE 
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci
AUTO_INCREMENT=63

;

-- ----------------------------
-- Auto increment value for `ageattr`
-- ----------------------------
ALTER TABLE `ageattr` AUTO_INCREMENT=244078;

-- ----------------------------
-- Auto increment value for `connect_device`
-- ----------------------------
ALTER TABLE `connect_device` AUTO_INCREMENT=1;

-- ----------------------------
-- Auto increment value for `cust_sales`
-- ----------------------------
ALTER TABLE `cust_sales` AUTO_INCREMENT=655;

-- ----------------------------
-- Auto increment value for `device`
-- ----------------------------
ALTER TABLE `device` AUTO_INCREMENT=1;

-- ----------------------------
-- Auto increment value for `device_age`
-- ----------------------------
ALTER TABLE `device_age` AUTO_INCREMENT=31;

-- ----------------------------
-- Auto increment value for `device_cust`
-- ----------------------------
ALTER TABLE `device_cust` AUTO_INCREMENT=402;

-- ----------------------------
-- Auto increment value for `device_heat`
-- ----------------------------
ALTER TABLE `device_heat` AUTO_INCREMENT=246;

-- ----------------------------
-- Auto increment value for `device_register`
-- ----------------------------
ALTER TABLE `device_register` AUTO_INCREMENT=13;

-- ----------------------------
-- Auto increment value for `device_update`
-- ----------------------------
ALTER TABLE `device_update` AUTO_INCREMENT=2124;

-- ----------------------------
-- Auto increment value for `device_virtual`
-- ----------------------------
ALTER TABLE `device_virtual` AUTO_INCREMENT=748;

-- ----------------------------
-- Auto increment value for `film`
-- ----------------------------
ALTER TABLE `film` AUTO_INCREMENT=7635;

-- ----------------------------
-- Auto increment value for `inoutnum`
-- ----------------------------
ALTER TABLE `inoutnum` AUTO_INCREMENT=4279815;

-- ----------------------------
-- Auto increment value for `modifypersonflow`
-- ----------------------------
ALTER TABLE `modifypersonflow` AUTO_INCREMENT=73;

-- ----------------------------
-- Auto increment value for `project`
-- ----------------------------
ALTER TABLE `project` AUTO_INCREMENT=93;

-- ----------------------------
-- Auto increment value for `project_device`
-- ----------------------------
ALTER TABLE `project_device` AUTO_INCREMENT=1;

-- ----------------------------
-- Auto increment value for `project_device_age`
-- ----------------------------
ALTER TABLE `project_device_age` AUTO_INCREMENT=82;

-- ----------------------------
-- Auto increment value for `project_device_cust`
-- ----------------------------
ALTER TABLE `project_device_cust` AUTO_INCREMENT=164;

-- ----------------------------
-- Auto increment value for `project_device_heat`
-- ----------------------------
ALTER TABLE `project_device_heat` AUTO_INCREMENT=49;

-- ----------------------------
-- Auto increment value for `userinfo`
-- ----------------------------
ALTER TABLE `userinfo` AUTO_INCREMENT=63;
