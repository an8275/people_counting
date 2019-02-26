$(function () {

    var currentDateTime = new Date();
    $("#startTime").val(currentDateTime.format('yyyy-MM-dd'));
    $("#endTime").val(currentDateTime.format('yyyy-MM-dd'));

    var shadowCSS = [];
    shadowCSS["width"] = $("#staycontainer").width();
    shadowCSS["height"] = $("#staycontainer").height();
    $("#stay_Shadow").css(shadowCSS);
    $("#stay_Error").css(shadowCSS);
    $("#stay_Shadow").hide();
    $("#stay_Error").hide();

    LoadProjectType("ownProject");
    $("#ownProject").change(function () {
        $("#deviceGuid").empty();//请选择设备类型不需要清空
        $("#deviceGuid").append("<option value='-1'>--请选择设备--</option>");
        LoadDeviceType("deviceGuid", $(this).val(), "device_cust");
    });
});
function createStayNum() {
    $("#stay_Error").hide();
    $("#stay_Errordiv").remove();
    $("#stay_Shadow").show();
    var param = [];
    var curDateTime = parseISO8601($("#startTime").val());//ie9+, chrome firefox opera下 string到Date 使用   Date("2013-01-01")ok; 但在ie7， ie8下 返回NaN

    param["startDate"] = encodeURI($("#startTime").val());
    param["endDate"] = encodeURI($("#endTime").val());

    param["startTimeGap"] = encodeURI("00:00:00");
    param["endTimeGap"] = encodeURI("23:59:00");
    var ownProject = $("#ownProject").val();
    if (ownProject == "-1") {
        alert("请先选择所属项目！");
        $("#stay_Shadow").hide();
        return;
    }
    var deviceguid = $("#deviceGuid").val();
    if (deviceguid == "" || deviceguid == "-1") {
        $("#stay_Shadow").hide();
        alert("请先选择项目设备！");
        return;
    }
    //	alert($("#" + deviceguid).data("isvirtual"));

    //	alert(deviceguid);
    param["deviceGuid"] = encodeURI(deviceguid);
    //param["isvirtual"] = encodeURI(1);
    param["random"] = newGuid();
    var url = "/servlet/StayCountChartServlet" + GetURLParam(param);
    //		alert(url);
    $
			.get(
					url,
					{
					    Action: "get"
					},
					function (data, textStatus) {

					    if (textStatus != "success") {
					        $("#stay_Shadow").hide();
					        $("#stay_Error").show();
					        $("#stay_Error")
									.append(
											"<div id='stay_Errordiv'>请求错误</br>请<a href='javascript:createStayNum();'class='pagecolor'>刷新</a></div>");
					        return;
					    }
					    if (data === "ERROR") {
					        $("#stay_Shadow").hide();
					        $("#stay_Error").show();
					        $("#stay_Error")
									.append(
											"<div id='stay_Errordiv'>后台发生错误</br>请<a href='javascript:createStayNum();'class='pagecolor'>刷新</a></div>");
					        return;
					    }
					    try {
					        var myobj = eval('(' + data + ')');
							
					    } catch (Error) {
					        $("#stay_Shadow").hide();
					        $("#stay_Error").show();
					        $("#stay_Error")
									.append(
											"<div id='stay_Errordiv'>数据转换失败,格式不正确</br>请<a href='javascript:createStayNum();'class='pagecolor'>刷新</a></div>");

					        return;
					    }
					    if (myobj == undefined) {
					        $("#stay_Shadow").hide();
					        $("#stay_Error").show();
					        $("#stay_Error")
									.append(
											"<div id='stay_Errordiv'>未获取到数据</br>请<a href='javascript:createStayNum();'class='pagecolor'>刷新</a></div>");

					        return;
					    }

					    var chart = new Highcharts.Chart({
					        chart: {
					            renderTo: 'staycontainer',
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
					                pointInterval: 900000, //15分钟
					                pointStart: Date.UTC(curDateTime
											.format('yyyy'), curDateTime
											.format('MM') - 1, curDateTime
											.format('dd'), 0, 0, 0)
					            }
					        },
					        series: [{
					            name: '停留人数',
					            data: myobj['stayPersonCount'],
					            color: 'purple',
					            lineWidth: 4,
					            marker: {
					                symbol: 'square'
					            }
					        }]
					    });
					    $("#stay_Shadow").hide();
					});
}

