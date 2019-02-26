var theme = "";
var SerchResultData = [];
var SerchWeakend = [];
var YLabel = [];
var vErr = 0;

var startTimeGap = "";
var endTimeGap = "";
var salesItems;
var personItems;

$(function () {

    $.ajaxSetup({
        async: false
    });

    var currentDateTime = new Date();
    $("#startTime").val(currentDateTime.format('yyyy-MM-dd'));//默认是本月的数据,相差一个月


	var shadowCSS = [];
	shadowCSS["width"] = $("#staycontainer").width();
	shadowCSS["height"] = $("#staycontainer").height();
	$("#stay_Shadow").css(shadowCSS);
	$("#stay_Error").css(shadowCSS);
	$("#stay_Shadow").hide();
	$("#stay_Error").hide();

	$("#deviceGuid").empty();//请选择设备类型不需要清空
	$("#deviceGuid").append("<option value='-1'>--Please Select The Entrance--</option>");
	LoadVirtualType("deviceGuid", getcookievalue("UserProGuid"), "device_cust");

	$("#deviceSales").empty();//请选择设备类型不需要清空
	$("#deviceSales").append("<option value='-1'>--Please Select The Entrance--</option>");
	LoadSalesDevice("deviceSales", getcookievalue("UserProGuid"), "device_cust");
	$("#chartclear").hide();

	startTimeGap = getcookievalue("startTimeGap");
	endTimeGap = getcookievalue("endTimeGap");

	$("button.btn").click(function () {
	    theme = $(this).attr("theme");
	    ClearAllChart();

	    $("button.btn-primary").removeClass("btn-primary");

	    if (theme == "chartclear") {
	        $("#chartclear").hide();
	        $("#staynumChart").html("Stay Number Statistics");
	    }
	    else {
	        //$("#startTime").attr('disabled', true);//默认是本月的数据,相差一个月
	        //$("#endTime").attr('disabled', true);

	        $("button[theme=" + theme + "]").addClass("btn-primary");
	        $("#chartclear").show();

	        if (theme == "staynumflow") {
	            if ($("#staynumChart").html() == "Stay Number Statistics") {
	                SerchResultData.length = 0;
	                //preDeviceGuid = "";
	            }

	            $("#staynumChart").html("Add report");
	        }
	        else {
	            $("#staynumChart").html("Stay Number Statistics");
	            // preDeviceGuid = "";
	            // vSameErr = 0;
	        }

	        DrawFlow();

	        // salesQuery();
	    }
	});
});

function personQuery() {

    $("#stay_Error").hide();
    $("#stay_Errordiv").remove();
    $("#stay_Shadow").show();
    var param = [];

    param["startDate"] = encodeURI($("#startTime").val());
    param["endDate"] = encodeURI($("#startTime").val());
    param["startTimeGap"] = encodeURI(startTimeGap);
    param["endTimeGap"] = encodeURI(endTimeGap);

    var deviceguid = $("#deviceGuid").val();

    if (deviceguid == "" || deviceguid == "-1") {
        $("#stay_Shadow").hide();
        alert("Show failed, Please Select The Entrance!");
        return;
    }

    //if (preDeviceGuid == deviceguid) {
    //    vSameErr = 1;
    //    alert("区域已添加，请再次选择！");
    //    return;
    //}
    //preDeviceGuid = deviceguid;

    param["deviceGuid"] = encodeURI(deviceguid);
    param["isvirtual"] = encodeURI(1);
    param["random"] = newGuid();
    var url = "/servlet/StayCountChartServlet" + GetURLParam(param);
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
											"<div id='stay_Errordiv'>Error!!</br>Please<a href='javascript:DrawFlow();'class='pagecolor'>refresh the page</a></div>");
						//alert("请求错误,请刷新");
						return;
					    }
					    if (data === "ERROR") {
					        $("#stay_Shadow").hide();
					        $("#stay_Error").show();
					        $("#stay_Error")
									.append(
											"<div id='stay_Errordiv'>Background support run error!!</br>Please<a href='javascript:DrawFlow();'class='pagecolor'>refresh the page</a></div>");
						//alert("后台发生错误,请刷新");
						return;
					    }
					    try {
					        var myobj = eval('(' + data + ')');
							
					    } catch (Error) {
					        $("#stay_Shadow").hide();
					        $("#stay_Error").show();
					        $("#stay_Error")
									.append(
											"<div id='stay_Errordiv'>Data conversion failed, wrong page format!!</br>Please<a href='javascript:DrawFlow();'class='pagecolor'>refresh the page</a></div>");
						//alert("数据转换失败,格式不正确，请刷新!");
						return;
					    }
					    if (myobj == undefined) {
					        $("#stay_Shadow").hide();
					        $("#stay_Error").show();
					        $("#stay_Error")
									.append(
											"<div id='stay_Errordiv'>Data accessing failed!!</br>Please<a href='javascript:DrawFlow();'class='pagecolor'>refresh the page</a></div>");
						//alert("未获取到数据！请刷新");
						return;
					    }
                        personItems = myobj;
					});
                    
                    return personItems;
}
function ClearAllChart() {
    $("#staycontainer").empty();
    if (theme != "staynumflow")
    SerchResultData.length = 0;
    SerchWeakend.length = 0;
    YLabel.length = 0;

    $("#stay_Shadow").hide();
    $("#stay_Error").hide();

   // $("#startTime").attr("disabled", false);
    //$("#endTime").attr("disabled", false);
}

function createRandnColor() {
    return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);
}


function GenData() {

    if ($("#staynumChart").html() != "Add report")
        SerchResultData.length = 0;

    personQuery();

    if (personItems == null || personItems == "" || personItems == undefined)
        return;

    var vStartIndex = parseInt((parseInt(startTimeGap.substr(0, 2)) * 60 + parseInt(startTimeGap.substr(3, 2))) / 15);
    var vEndIndex = parseInt((parseInt(endTimeGap.substr(0, 2)) * 60 + parseInt(endTimeGap.substr(3, 2))) / 15);
    var vIndexInData = [];

    for (var i = 0; i < personItems['stayPersonCount'].length; i++) {
        if (i >= vStartIndex && i <= vEndIndex) {
            vIndexInData[i - vStartIndex] = personItems['stayPersonCount'][i];
        }
    }

    var vSRdata = {
        name:$("#startTime").val() +"  "+ document.getElementById("deviceGuid").options[document.getElementById("deviceGuid").selectedIndex].text,
        data: vIndexInData,
        color: createRandnColor(),
        type: 'line'
    };
    
        SerchResultData.push(vSRdata);

    YLabel = [{ // Primary yAxis
            labels: {
                format: '{value}',
                style: {
                    color: vSRdata.color
                }
            },
            title: {
                text: 'people number',
                style: {
                    color: vSRdata.color
                }
            }
        }];

}


function DrawFlow() {

    $("#stay_Error").hide();
    $("#stay_Errordiv").remove();
    $("#stay_Shadow").show();
    var year = parseISO8601($("#startTime").val());
    GenData();
    //vSameErr = 0;

    var titleStr = "";
    for (var i = 0; i < SerchResultData.length; i++)
    {
        var curData = SerchResultData[i];
        var curDataNum = curData.data;
        var vNum = 0;
        for( var j=0; j< curDataNum.length; j++)
        {
        vNum += curDataNum[j];}
        

        titleStr += curData.name + " Total：" + vNum;
    }

    $('#staycontainer').highcharts({
        chart: {
	zoomType: 'xy',
        type: 'line',
            margin: [50, 50, 100, 80]
        },
        title: {
            text: titleStr,
            style: {
                //color: '#F79B44',
                fontWeight: 'bold'
            }
        },
        //subtitle: {
        //    text: $("#startTime").val()
        //},
        exporting: {
            buttons: {
                contextButton: {
                    text: 'Export',
                    // align:'center'
                }
            }
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

        yAxis: YLabel,

        series: SerchResultData,

        tooltip: {
            enabled: true,
        },

        //右下角，数据来源连接
        credits: {
            enabled: false
        },
        legend: {
            enabled: false
        },

        plotOptions: {
            line: {
                pointInterval: 900000, //半小时
                pointStart: Date.UTC(year
                        .format('yyyy'), year
                        .format('MM') - 1, year
                        .format('dd'), parseInt(startTimeGap.substr(0, 2)), parseInt(startTimeGap.substr(3, 2)))
                //						pointStart : Date.UTC(curDateTime.getFullYear(), curDateTime
                //								.getMonth() + 1, curDateTime.getDate(), 0, 0, 0)
                //,
                //dataLabels: { //表格显数字
                //    enabled: true
                //}
            }
        },
        legend: {
            enabled: true
        },
    });
        $("#stay_Shadow").hide();
}



