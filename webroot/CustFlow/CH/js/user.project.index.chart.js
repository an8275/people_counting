
var startTime = "";
var endTime = "";
var idName = "selectDay";

function timeUpdate() {
    var currentDateTime = new Date();
    var vh = currentDateTime.getHours();
    var vM = currentDateTime.getMinutes();
    var vS = currentDateTime.getSeconds();

    var vShow = "";
    if (vh < 10)
        vShow += "0" + vh;
    else
        vShow += vh;

    if (vM < 10)
        vShow += ":0" + vM;
    else
        vShow += ":" + vM;

    if (vS < 10)
        vShow += ":0" + vS;
    else
        vShow += ":" + vS;

    $("#showCurTime").html(vShow);
    setTimeout('timeUpdate()', 1000);
}

function InOutPersonAll() {
    var param = [];
    var currentDateTime = new Date();
    param["startDate"] = encodeURI(currentDateTime.format('yyyy-MM-dd'));
    param["endDate"] = encodeURI(currentDateTime.format('yyyy-MM-dd'));
    param["startTimeGap"] = encodeURI(getcookievalue("startTimeGap"));
    param["endTimeGap"] = encodeURI(getcookievalue("endTimeGap"));
    var deviceguid = $("#deviceGuid").val();
    param["deviceGuid"] = encodeURI(deviceguid);
    param["isvirtual"] = encodeURI(1);
    param["random"] = newGuid();
    var url = "/servlet/InOutFlowCountServlet" + GetURLParam(param);
    $.get(
			url,
			{
			    Action: "get"
			},
			function (data, textStatus) {
			    if (textStatus != "success") {
			        $("#personAll").html("Error!");
			        $("#personIn").html("Error!");
			        $("#personOut").html("Error!");
			        return;
			    }
			    if (data === "ERROR") {
			        $("#personAll").html("Error!");
			        $("#personIn").html("Error!");
			        $("#personOut").html("Error!");;
			        return;
			    }
			    try {
			        var myobj = eval('(' + data + ')');
			    } catch (Error) {
			        $("#personAll").html("Error!");
			        $("#personIn").html("Error!");
			        $("#personOut").html("Error!");;
			        return;
			    }
			    if (myobj == undefined) {


			        $("#personAll").html("Error!");
			        $("#personIn").html("Error!");
			        $("#personOut").html("Error!");;
			        return;
			    }
			    $("#personAll").html(myobj["column"][0]);
			    $("#personIn").html(myobj["inall"][0]);
			    //$("#personIn").css('color', 'rgb(255,150,114)');
			    $("#personOut").html(myobj["outall"][0]);
			    //$("#personOut").css('color', 'green');
			});

    setTimeout('InOutPersonAll()', 3000);
}

function SalesInfoAll() {
    var param = [];
    var currentDateTime = new Date();
    param["startDate"] = encodeURI(currentDateTime.format('yyyy-MM-dd'));
    param["endDate"] = encodeURI(currentDateTime.format('yyyy-MM-dd'));
    var deviceguid = $("#deviceGuid").val();
    param["dataGuid"] = encodeURI(deviceguid);
    param["random"] = newGuid();
    var url = "/servlet/SalesInfoServlet" + GetURLParam(param);
    $.get(
			url,
			{
			    Action: "get"
			},
			function (data, textStatus) {
			    if (textStatus != "success") {
			        $("#salesAll").html("Error!");
			        $("#ordersAll").html("Error!");
			        return;
			    }
			    if (data === "ERROR") {
			        $("#salesAll").html("Error!");
			        $("#ordersAll").html("Error!");
			        return;
			    }
			    try {
			        var myobj = eval('(' + data + ')');
			    } catch (Error) {
			        $("#salesAll").html("Error!");
			        $("#ordersAll").html("Error!");
			        return;
			    }
			    if (myobj == undefined) {
			        $("#salesAll").html("Error!");
			        $("#ordersAll").html("Error!");
			        return;
			    }
			    $("#salesAll").html(myobj["Sales"][0]);
			    $("#ordersAll").html(myobj["Orders"][0]);
			});

    setTimeout('SalesInfoAll()', 3000);
}

function vRate(frData, secData){
    if (secData == 0)
        return 0;
    else
        return (100* (frData - secData) / secData).toFixed(1);
}

function changeState(RateId, vRate){
    if (vRate > 0.05) {
        $("#"+RateId).css('color', 'red');
        $("#"+RateId +" img").attr('src', '../images/up.png');
    }

        if (vRate < -0.05) {
        $("#"+RateId).css('color', 'green');
        $("#"+RateId +" img").attr('src', '../images/down.png');
    }

        if (vRate > -0.05 && vRate < 0.05) {
        $("#"+RateId).css('color', 'blue');
        $("#"+RateId +" img").attr('src', '../images/shuiping.png');
    }
}

function calRates(myPeoObj, mySaleObj) {

    // first 表示 昨（天， 周， 月)， second 表示 前（天， 周， 月)
    var FirstPeoData = 0;
    var SecondPeoData = 0;
    var FirstSaleData = 0;
    var SecondSaleData = 0;
    var FirstOrderData = 0;
    var SecondOrderData = 0;
    var vTiDaiLv = 0;
    var vKeDanJia = 0;
    var vJianDanJia = 0;

    if (idName == "selectDay")//提取最近三天
    {
        FirstData = myPeoObj['column'][1];
        SecondData = myPeoObj['column'][0];
        FirstSaleData = mySaleObj['Sales'][1];
        SecondSaleData = mySaleObj['Sales'][0];
        FirstOrderData = mySaleObj['Orders'][1];
        SecondOrderData = mySaleObj['Orders'][0];
    }
    else if (idName == "selectWeek") {
        FirstData = eval((myPeoObj['column'].slice(7,14)).join("+"));
        SecondData = eval((myPeoObj['column'].slice(0,7)).join("+"));
        FirstSaleData = eval((mySaleObj['Sales'].slice(7,14)).join("+"));
        SecondSaleData = eval((mySaleObj['Sales'].slice(0,7)).join("+"));
        FirstOrderData = eval((mySaleObj['Orders'].slice(7,14)).join("+"));
        SecondOrderData = eval((mySaleObj['Orders'].slice(0,7)).join("+"));
    }
    else if (idName == "selectMonth") {
        secondMonthDays = 32 - new Date(parseInt(startTime.substr(0, 4)), parseInt(startTime.substr(5, 2)) - 3, 32).getDate();
        firstMonthDays = 32 - new Date( parseInt(startTime.substr(0,4)), parseInt(startTime.substr(5,2)) - 2, 32).getDate();

        SecondData = eval((myPeoObj['column'].slice(0,firstMonthDays)).join("+"));
        FirstData = eval((myPeoObj['column'].slice(firstMonthDays, firstMonthDays+secondMonthDays)).join("+"));
        SecondSaleData = eval((mySaleObj['Sales'].slice(0,firstMonthDays)).join("+"));
        FirstSaleData = eval((mySaleObj['Sales'].slice(firstMonthDays, firstMonthDays+secondMonthDays)).join("+"));
        SecondOrderData = eval((mySaleObj['Orders'].slice(0,firstMonthDays)).join("+"));
        FirstOrderData = eval((mySaleObj['Orders'].slice(firstMonthDays, firstMonthDays+secondMonthDays)).join("+"));
    }
    //人流量
    $("#perflowDayInfo td:eq(1)").html(FirstData);
    var vRRate = vRate(FirstData,SecondData);
    $("#perflowDayInfo td:eq(3)").html(vRRate+"%");
    changeState("perflowDayInfo", vRRate);

    //销售额
    $("#saleDayInfo td:eq(1)").html(FirstSaleData);
    vRRate = vRate(FirstSaleData, SecondSaleData);
    $("#saleDayInfo td:eq(3)").html(vRRate + "%");
    changeState("saleDayInfo", vRRate);

        //销售额
    $("#orderDayInfo td:eq(1)").html(FirstOrderData);
    vRRate = vRate(FirstOrderData, SecondOrderData);
    $("#orderDayInfo td:eq(3)").html(vRRate + "%");
    changeState("orderDayInfo", vRRate);

        //提带率
    $("#tidaiDayInfo td:eq(1)").html((FirstData ? (100*FirstOrderData/FirstData).toFixed(1):0)+"%");
    vRRate = vRate(FirstData ? 100*FirstOrderData/FirstData:0,SecondData ? 100*SecondOrderData/SecondData:0);
    $("#tidaiDayInfo td:eq(3)").html(vRRate+"%");
    changeState("tidaiDayInfo", vRRate);
    //客单价
    $("#kedanDayInfo td:eq(1)").html((FirstData? (FirstSaleData/FirstData).toFixed(1):0));
    vRRate = vRate(FirstData ? FirstSaleData/FirstData:0,SecondData ? SecondSaleData/SecondData:0);
    $("#kedanDayInfo td:eq(3)").html(vRRate + "%");
    changeState("kedanDayInfo", vRRate);

        //件单价
    $("#jiandanDayInfo td:eq(1)").html((FirstOrderData ? (FirstSaleData/FirstOrderData).toFixed(1):0));
    vRRate = vRate(FirstOrderData ? FirstSaleData/FirstOrderData:0,SecondOrderData ? SecondSaleData/SecondOrderData:0);
    $("#jiandanDayInfo td:eq(3)").html(vRRate + "%");
    changeState("jiandanDayInfo", vRRate);
}

function checkDeviceValue() {
	//alert($("#deviceGuid").val());
    if ($("#deviceGuid").val() != "") {
        var myDate = new Date();
        var myYear = myDate.getFullYear();    //获取完整的年份(4位,1970-????)
        var myMonth = myDate.getMonth();       //获取当前月份(0-11,0代表1月)
        var myDay = myDate.getDate();        //获取当前日(1-31)

        var myBefroeDay = new Date(myYear, myMonth, myDay - 2, 0, 0, 0);

        startTime = myBefroeDay.format('yyyy-MM-dd');
        endTime = myDate.format('yyyy-MM-dd');
        getPeoFlowAndSalesInfo();
    }
    else
        setTimeout('checkDeviceValue()', 1000);
}

function getPeoFlowAndSalesInfo() {
    $("#flow_Error").hide();
    $("#flow_Errordiv").remove();
    $("#flow_Shadow").show();
    var param = [];
    param["startDate"] = encodeURI(startTime);
    param["endDate"] = encodeURI(endTime);
    param["startTimeGap"] = encodeURI(getcookievalue("startTimeGap"));
    param["endTimeGap"] = encodeURI(getcookievalue("endTimeGap"));
    var deviceguid = $("#deviceGuid").val();
    //alert(deviceguid);
    param["deviceGuid"] = encodeURI(deviceguid);
    param["isvirtual"] = encodeURI(1);
    param["random"] = newGuid();
    var url = "/servlet/InOutFlowCountServlet" + GetURLParam(param);
    //alert(url);
    $.get(
			url,
			{
			    Action: "get"
			},
			function (data, textStatus) {
			    if (textStatus != "success") {
			        alert("error");
			        return;
			    }
			    if (data === "ERROR") {
			        alert("error");
			        return;
			    }
			    try {
			        var myPeoObj = eval('(' + data + ')');
			    } catch (Error) {
			        alert("error");
			        return;
			    }
			    if (myPeoObj == undefined) {
			        alert("error");
			        return;
			    }
			    //成功取到人流数据后，提取销售和订单数据
			    ///////////////////////////////////////
			    param = [];
			    param["startDate"] = encodeURI(startTime);
			    param["endDate"] = encodeURI(endTime);
			    param["dataGuid"] = encodeURI($("#deviceGuid").val());
			    param["random"] = newGuid();
			    url = "/servlet/SalesInfoServlet" + GetURLParam(param);
			    $.get(
                        url,
                        {
                            Action: "get"
                        },
                        function (data, textStatus) {
                            if (textStatus != "success") {
                                $("#CustListTable_Shadow").hide();
                                $("#CustListTable_Error").show();
                                $("#CustListTable_Error")
                                        .append(
                                                "<div id='CustListTable_Errordiv'>请求错误</br>请<a href='javascript:getPeoFlowAndSalesInfo();'class='pagecolor'>刷新</a></div>");
                                return;
                            }
                            if (data === "ERROR") {
                                $("#CustListTable_Shadow").hide();
                                $("#CustListTable_Error").show();
                                $("#CustListTable_Error")
                                        .append(
                                                "<div id='CustListTable_Errordiv'>后台发生错误</br>请<a href='javascript:getPeoFlowAndSalesInfo();'class='pagecolor'>刷新</a></div>");
                                return;
                            }
                            try {
                                var mySaleObj = eval('(' + data + ')');
                            } catch (Error) {
                                $("#CustListTable_Shadow").hide();
                                $("#CustListTable_Error").show();
                                $("#CustListTable_Error")
                                        .append(
                                                "<div id='CustListTable_Errordiv'>数据转换失败,格式不正确</br>请<a href='javascript:getPeoFlowAndSalesInfo();'class='pagecolor'>刷新</a></div>");
                                return;
                            }
                            if (mySaleObj == undefined) {
                                $("#CustListTable_Shadow").hide();
                                $("#CustListTable_Error").show();
                                $("#CustListTable_Error")
                                        .append(
                                                "<div id='CustListTable_Errordiv'>未获取到数据</br>请<a href='javascript:getPeoFlowAndSalesInfo();'class='pagecolor'>刷新</a></div>");
                                return;
                            }

                            calRates(myPeoObj, mySaleObj);
                            //取到 myPeoObj， mySaleObj，画图表
                            //alert(myPeoObj);
                            //alert(mySaleObj);
                            var nTitleGap = "日";
                            if (idName == "selectDay")
                                nTitleGap = "日";
                            else if (idName == "selectWeek")
                                nTitleGap = "周";
                            else if (idName == "selectMonth")
                                nTitleGap = "月";

                            $('#personChart').highcharts({
                                chart: {
                                    zoomType: 'xy'
                                },
                                title: {
                                    text: '最近三'+ nTitleGap + '客流与销售数据'
                                },
                                xAxis: [{
                                    tickInterval: parseInt(myPeoObj['categories'].length / 5),
                                    categories: myPeoObj['categories']
                                }],
                                yAxis: [{ // Primary yAxis
                                    min: 0,
                                    labels: {
                                        formatter: function () {
                                            return this.value + '人';
                                        },
                                        style: {
                                            color: '#4572A7'
                                        }
                                    },
                                    title: {
                                        text: '人流量',
                                        style: {
                                            color: '#4572A7'
                                        }
                                    },

                                }, { // Secondary yAxis
                                    min: 0,
                                    gridLineWidth: 0,
                                    title: {
                                        text: '销售额',
                                        style: {
                                            color: '#AA4643'
                                        }
                                    },
                                    labels: {
                                        formatter: function () {
                                            return this.value + '元';
                                        },
                                        style: {
                                            color: '#AA4643'
                                        }
                                    },
                                    opposite: true
                                }, { // Tertiary yAxis
                                    min: 0,
                                    gridLineWidth: 0,
                                    title: {
                                        text: '成单数',
                                        style: {
                                            color: '#89A54E'
                                        }
                                    },
                                    labels: {
                                        formatter: function () {
                                            return this.value + '笔';
                                        },
                                        style: {
                                            color: '#89A54E'
                                        }
                                    },
                                    opposite: true
                                }],
                                tooltip: {
                                    shared: true
                                },
                                credits: {
                                    enabled: false
                                },
                                series: [{
                                    name: '人流量',
                                    color: '#4572A7',
                                    type: 'column',
                                    yAxis: 0,
                                    data: myPeoObj['column'],
                                    tooltip: {
                                        valueSuffix: ' 个'
                                    },
                                }, {
                                    name: '销售额',
                                    type: 'spline',
                                    color: '#AA4643',
                                    yAxis: 1,
                                    data: mySaleObj['Sales'],
                                    marker: {
                                        enabled: false
                                    },
                                    tooltip: {
                                        valueSuffix: ' 元'
                                    }
                                }, {
                                    name: '成单数',
                                    color: '#89A54E',
                                    yAxis: 2,
                                    type: 'spline',
                                    dashStyle: 'shortdot',
                                    data: mySaleObj['Orders'],
                                    tooltip: {
                                        valueSuffix: '笔'
                                    }
                                }],
                            });
                            $("#flow_Shadow").hide();
                        });
			    ///////////////////////////////////////
			});
}

$(function () {

    LoadProjectDevice(getcookievalue("UserProGuid"), "device_cust");

    $("#personFlow").click(function () {
        $("#ageAndSex").css('border-bottom', 'none');
        $("#heatmap").css('border-bottom', 'none');
        $("#personFlow").css('border-bottom', '3px solid #ff6a00');
        $("#ageInfo").hide();
        $("#heatmapInfo").hide();

        $("#personChart").show();
        $("#personInfo").show();
        getPeoFlowAndSalesInfo();
    });

    var currentDateTime = new Date();
    $("#showCurDate").html(currentDateTime.getFullYear() + '年' + (currentDateTime.getMonth() + 1) + '月' + currentDateTime.getDate() + '日');

    //实时更新时间
    timeUpdate();

    //实时更新当日总人流， 进入人数，出去人数
    InOutPersonAll();

    //实时更新当日总销售额，订单数
    SalesInfoAll();

    checkDeviceValue();

    $("#selectAll button").click(function () {
        idName = $(this).attr("id");

        $("#selectAll button").css('color', '#65BCF1');
        $("#selectAll button").css('background-color', '#FFFFFF');

        $(this).css('color', '#FFFFFF');
        $(this).css('background-color', '#65BCF1');

        var myNewDate = new Date();//取得当前时间
        endTime = myNewDate.format('yyyy-MM-dd');

        var myNewYear = myNewDate.getFullYear();    //获取完整的年份(4位,1970-????)
        var myNewMonth = myNewDate.getMonth();       //获取当前月份(0-11,0代表1月)
        var myNewDay = myNewDate.getDate();        //获取当前日(1-31)
        var myNewWeak = myNewDate.getDay();         //获得周(0~6)
        var vTime = "";

        if (idName == "selectDay")//提取最近三天
        {
            vTime = new Date(myNewYear, myNewMonth, myNewDay - 2);
        }
        else if (idName == "selectWeek") {
            vTime = new Date(myNewYear, myNewMonth, myNewDay - myNewWeak + 1 - 14);
        }
        else if (idName == "selectMonth") {
            vTime = new Date(myNewYear, myNewMonth - 2, 1);
        }
        startTime = vTime.format('yyyy-MM-dd');
        getPeoFlowAndSalesInfo();
    });

    var shadowCSS = [];
    shadowCSS["width"] = $("#personChart").width();
    shadowCSS["height"] = $("#personChart").height();
    $("#flow_Shadow").css(shadowCSS);
    $("#flow_Error").css(shadowCSS);
    $("#flow_Shadow").hide();
    $("#flow_Error").hide();

    $("#projectName").html(getcookievalue("UserProject"));

});

function exportPDF() {

    $("#downBtn").removeAttr("href");
    $("#downBtn").removeAttr("download");

    var param = [];
    param["random"] = newGuid();
    param["proGuid"] = encodeURI(getcookievalue("UserProGuid"));
    param["proName"] = encodeURI(getcookievalue("UserProject"));
    param["startTimeGap"] = encodeURI(getcookievalue("startTimeGap"));
    param["endTimeGap"] = encodeURI(getcookievalue("endTimeGap"));

    var currentDateTime = new Date();
    param["nowDate"] = encodeURI(currentDateTime.format('yyyy-MM-dd'));
    param["peoCount"] = encodeURI( $("#orderDayInfo td:eq(1)").html());

    var vUrl = "/servlet/renderPDFServlet" + GetURLParam(param);
    //alert(vUrl);
    //提交方式改成了get
    $.ajax({ 
          type : "get", 
          url : vUrl, 
          //data : "test=" + test, 
          async : false, 
          success : function(data){ 
            data = eval("(" + data + ")"); 
			$("#downBtn").attr("href", "../../../../myserver/pdf/"+param["random"]+".pdf");
            $("#downBtn").attr("download", "report.pdf");
            //aDataSet = data; 
          } 
          }); 

}