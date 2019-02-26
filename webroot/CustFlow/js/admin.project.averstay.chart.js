$(function () {
    var currentDateTime = new Date();
    //	currentDateTime.format('yyyy-MM-dd hh:mm:ss');
    $("#endTime").val(currentDateTime.format('yyyy-MM-dd'));//默认是本月的数据,相差一个月
    $("#startTime").val(currentDateTime.format('yyyy-MM') + "-01");
    var shadowCSS = [];
    shadowCSS["width"] = $("#averagecontainer").width();
    shadowCSS["height"] = $("#averagecontainer").height();
    $("#stay_Shadow").css(shadowCSS);
    $("#stay_Error").css(shadowCSS);
    $("#stay_Shadow").hide();
    $("#stay_Error").hide();
    LoadProjectType("ownProject");
    $("#ownProject").change(function () {
        $("#deviceGuid").empty();//请选择设备类型不需要清空
        $("#deviceGuid").append("<option value='-1'>--Please Select The Device--</option>");
        LoadDeviceType("deviceGuid", $(this).val(), "device_cust");
    });

});
function createaverstay() {
    $("#stay_Error").hide();
    $("#stay_Errordiv").remove();
    $("#stay_Shadow").show();
    var param = [];
    var year = parseISO8601($("#startTime").val());
    //	alert(year)
    param["startDate"] = encodeURI($("#startTime").val());
    param["endDate"] = encodeURI($("#endTime").val());

    param["startTimeGap"] = encodeURI("00:00:00");
    param["endTimeGap"] = encodeURI("23:59:00");
    var ownProject = $("#ownProject").val();
    if (ownProject == "-1") {
        alert("Please Select The Project！");
        $("#stay_Shadow").hide();
        return;
    }
    var deviceguid = $("#deviceGuid").val();
    if (deviceguid == "" || deviceguid == "-1") {
        $("#stay_Shadow").hide();
        alert("Please Select The Device！");
        return;
    }
    //	alert(deviceguid);
    param["deviceGuid"] = encodeURI(deviceguid);
    //param["isvirtual"] = encodeURI(1);
    param["random"] = newGuid();
    var url = "/servlet/AverageStayTimeServlet" + GetURLParam(param);
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
											"<div id='stay_Errordiv'>Error!!</br>Please<a href='javascript:createaverstay();'class='pagecolor'>refresh the page</a></div>");
					        return;
					    }
					    if (data === "ERROR") {
					        $("#stay_Shadow").hide();
					        $("#stay_Error").show();
					        $("#stay_Error")
									.append(
											"<div id='stay_Errordiv'>Background support run error!!</br>Please<a href='javascript:createaverstay();'class='pagecolor'>refresh the page</a></div>");
					        return;
					    }
					    try {
					        var myobj = eval('(' + data + ')');
					    } catch (Error) {
					        $("#stay_Shadow").hide();
					        $("#stay_Error").show();
					        $("#stay_Error")
									.append(
											"<div id='stay_Errordiv'>Data conversion failed, wrong page format!!</br>Please<a href='javascript:createaverstay();'class='pagecolor'>refresh the page</a></div>");

					        return;
					    }
					    if (myobj == undefined) {
					        $("#stay_Shadow").hide();
					        $("#stay_Error").show();
					        $("#stay_Error")
									.append(
											"<div id='stay_Errordiv'>Data accessing failed!!</br>Please<a href='javascript:createaverstay();'class='pagecolor'>refresh the page</a></div>");

					        return;
					    }
					    //	alert(myobj);
					    var chart = new Highcharts.Chart({
					        chart: {
					            renderTo: 'averagecontainer',
					            type: 'column'
					        },
					        title: {
					            text: 'Stay Time Statistics'
					            //center
					        },
					        subtitle: {
					            text:  $("#startTime").val() + "      " + $("#endTime").val()
					        },
					        xAxis: {
					            //	时间数据不能直接用categories，必须放到series的data里面去							categories : myobj["categories"],
					            type: 'datetime',
					            minTickInterval: 3600 * 1000 * 24,//最少一天画一个x刻度
					            labels: {
					                //									rotation : -45, //字体倾斜
					                align: 'center',
					                style: {
					                    //										fontSize : '8px'
					                    font: 'normal 8px Verdana, sans-serif'
					                    //                   color: 'white'  
					                },
					                formatter: function () {
					                    return Highcharts.dateFormat('%m-%d',
												this.value);
					                }
					            }
					        },
					        yAxis: {
					            title: {
					                text: 'minutes'
					            },
					            min: 0,
					            allowDecimals: false,
					            labels: {
					                overflow: 'justify'
					            }
					        },
					        tooltip: {
					            formatter: function () {

					                //									var xDate = this.x;
					                //									xDate = xDate.replace(".", "月") + "日";
					                //
					                //									return xDate + '<br/><b>'
					                //											+ this.series.name + ':' + this.y
					                //											+ '分钟</b>';
					                return Highcharts.dateFormat('%Y-%m-%d',
											this.x)
											+ '<br/><b>'
											+ this.series.name
											+ ':' + this.y + 'minutes</b>';
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
					            borderWidth: 1,
					            backgroundColor: '#FFFFFF',
					            shadow: true
					        },
					        plotOptions: {
					            column: {
					                pointInterval: 1000 * 3600 * 24, //一天
					                pointStart: Date.UTC(year.format('yyyy'),
											year.format('MM') - 1, year
													.format('dd'), 0, 0, 0)
					            }
					        },
					        series: [{
					            name: 'average stay time',
					            data: myobj['column'],
					            color: 'green'
					        }]
					    });
					    $("#stay_Shadow").hide();
					});
}