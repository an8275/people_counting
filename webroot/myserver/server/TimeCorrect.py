#!/usr/bin/python
# -*- coding: utf8 -*-

import sys
import os
from common import *
from utils import *
from django.http import HttpResponse

def TimeCorrect(request):

    print "Into TimeCorrect"

    msg="JunYuFr_CustFlow_ReturnCode=%s"%(get_time())

    #output.write(CONTENT_TYPE_HEAD)
    #output.write(msg)
    return HttpResponse(msg)
