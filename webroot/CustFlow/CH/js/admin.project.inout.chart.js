$(function () {

    var currentDateTime = new Date();
    $("#startTime").val(currentDateTime.format('yyyy-MM-dd'));
    $("#endTime").val(currentDateTime.format('yyyy-MM-dd'));

    var shadowCSS = [];
    shadowCSS["width"] = $("#inoutcontainer").width();
    shadowCSS["height"] = $("#inoutcontainer").height();
    $("#inout_Shadow").css(shadowCSS);
    $("#inout_Error").css(shadowCSS);
    $("#inout_Shadow").hide();
    $("#inout_Error").hide();

    LoadProjectType("ownProject");
    $("#ownProject").change(function () {
        $("#deviceGuid").empty();//请选择设备类型不需要清空
        $("#deviceGuid").append("<option value='-1'>--请选择设备--</option>");
        LoadDeviceType("deviceGuid", $(this).val(), "device_cust");
    });

});
function createInOut() {
    $("#inout_Error").hide();
    $("#inout_Errordiv").remove();
    $("#inout_Shadow").show();
    var param = [];
    var curDateTime = parseISO8601($("#startTime").val());//ie9+, chrome firefox opera�� string��Date ʹ��   Date("2013-01-01")ok; ����ie7�� ie8�� ����NaN

    //	alert(curDateTime.format('MM'));
    //	alert(curDateTime);
    //	alert(curDateTime.getFullYear());
    //	alert(curDateTime.getMonth());
    //	alert(curDateTime.getDate());
    param["startDate"] = encodeURI($("#startTime").val());
    param["endDate"] = encodeURI($("#endTime").val());

    param["startTimeGap"] = encodeURI("00:00:00");
    param["endTimeGap"] = encodeURI("23:59:00");
    var ownProject = $("#ownProject").val();
    if (ownProject == "-1") {
        alert("请先选择所属项目！");
        $("#inout_Shadow").hide();
        return;
    }
    var deviceguid = $("#deviceGuid").val();
    if (deviceguid == "" || deviceguid == "-1") {
        $("#flow_Shadow").hide();
        alert("请先选择项目设备！");
        return;
    }
    //	alert($("#" + deviceguid).data("isvirtual"));

    //	alert(deviceguid);
    param["deviceGuid"] = encodeURI(deviceguid);
    //param["isvirtual"] = encodeURI(1);
    param["random"] = newGuid();
    var url = "/servlet/InOutCountChartServlet" + GetURLParam(param);
    //		alert(url);
    $
			.get(
					url,
					{
					    Action: "get"
					},
					function (data, textStatus) {

					    if (textStatus != "success") {
					        $("#inout_Shadow").hide();
					        $("#inout_Error").show();
					        $("#inout_Error")
									.append(
											"<div id='inout_Errordiv'>请求错误</br>请<a href='javascript:createInOut();'class='pagecolor'>刷新</a></div>");
					        return;
					    }
					    if (data === "ERROR") {
					        $("#inout_Shadow").hide();
					        $("#inout_Error").show();
					        $("#inout_Error")
									.append(
											"<div id='inout_Errordiv'>后台发生错误</br>请<a href='javascript:createInOut();'class='pagecolor'>刷新</a></div>");
					        return;
					    }
					    try {
					        var myobj = eval('(' + data + ')');
					    } catch (Error) {
					        $("#inout_Shadow").hide();
					        $("#inout_Error").show();
					        $("#inout_Error")
									.append(
											"<div id='inout_Errordiv'>数据转换失败,格式不正确</br>请<a href='javascript:createInOut();'class='pagecolor'>刷新</a></div>");

					        return;
					    }
					    if (myobj == undefined) {
					        $("#inout_Shadow").hide();
					        $("#inout_Error").show();
					        $("#inout_Error")
									.append(
											"<div id='inout_Errordiv'>未获取到数据</br>请<a href='javascript:createInOut();'class='pagecolor'>刷新</a></div>");

					        return;
					    }
					    //	alert(myobj);
					    //		alert(myobj['inPersonCount']);
					    //		alert(myobj['outPersonCount']);
					    //		alert(myobj['stayPersonCount']);
					    var chart = new Highcharts.Chart({
					        chart: {
					            renderTo: 'inoutcontainer',
					            type: 'line',
					            //								marginRight : 130,
					            marginBottom: 25
					        },
					        title: {
					            text: '',
					            x: -20
					            //center
					        },
					        subtitle: {
					            text: '',
					            x: -20
					        },
					        xAxis: {
					            type: 'datetime',
					            labels: {
					                formatter: function () {
					                    return Highcharts.dateFormat('%H:%M',
												this.value);
					                }
					            }
					            //				tickPixelInterval : 50
					            //				categories : [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
					            //						'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ]
					        },
					        yAxis: {
					            title: {
					                text: '人数(个)'
					            },
					            min: 0,
					            allowDecimals: false,
					            plotLines: [{
					                value: 0,
					                width: 1,
					                color: '#808080'
					            }]
					        },
					        tooltip: {
					            formatter: function () {
					                return '<b>'
											+ this.series.name
											+ ':'
											+ this.y
											+ '人</b><br/>'
											+ Highcharts.dateFormat(
											//													'%Y年%m月%d日 %H:%M:%S',
													'%H:%M:%S', this.x)
											+ "~"
											+ Highcharts.dateFormat('%H:%M:%S',
													this.x + 900000);
					            }
					        },
					        credits: {
					            enabled: false
					        },
					        legend: {
					            layout: 'vertical',
					            align: 'right',
					            verticalAlign: 'top',
					            x: -10,
					            y: 10,
					            floating: true,
					            borderWidth: 0
					        },
					        plotOptions: {
					            line: {
					                pointInterval: 900000, //半小时
					                pointStart: Date.UTC(curDateTime
											.format('yyyy'), curDateTime
											.format('MM') - 1, curDateTime
											.format('dd'), 0, 0, 0)
					                //						pointStart : Date.UTC(curDateTime.getFullYear(), curDateTime
					                //								.getMonth() + 1, curDateTime.getDate(), 0, 0, 0)
					            }
					        },
					        series: [{
					            name: '进入人数',
					            data: myobj['inPersonCount'],
					            color: 'green',
					            lineWidth: 4,
					            marker: {
					                symbol: 'square'
					            }
					        }, {
					            name: '出去人数',
					            data: myobj['outPersonCount'],
					            color: 'red'
					        }]
					    });
					    $("#inout_Shadow").hide();
					});
}
