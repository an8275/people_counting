from django.http import HttpResponse

def hello(request):
    return HttpResponse("Hello world")
def indexhtml(request):
    html="<html><script language='javascript' type='text/javascript'></script><a href='login.html'>aa</a></html>"
    #html="<html><script language='javascript' type='text/javascript'>alert('ok');window.location.href='D:\web\alidata1\web\html\CustFlow\login.html';alert('oo');</script><body>aa</body></html>"
    return HttpResponse(html)
