#!/usr/bin/python
#
from suds.client import Client
from suds.sax.element import Element

url = 'http://180.168.181.182/POSService/POSService.asmx?wsdl'
client = Client(url)

client.service.getSchedules()

