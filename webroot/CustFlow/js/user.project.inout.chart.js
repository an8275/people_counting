var theme = "";
var SerchResultData = [];
var SerchWeakend = [];
var YLabel = [];
var vErr = 0;

var startTimeGap = "";
var endTimeGap = "";
var salesItems;
var personItems;
//var preDeviceGuid = "";
//var vSameErr = 0;

$(function () {

    $.ajaxSetup({
        async: false
    });

	var currentDateTime = new Date();
	$("#startTime").val(currentDateTime.format('yyyy-MM-dd'));//默认是本月的数据,相差一个月
	//$("#startTime").val(currentDateTime.format('yyyy-MM-dd'));

    //$("#startTimeGap").val('00:00:00');//默认是本月的数据,相差一个月
    //$("#endTimeGap").val('23:59:59');

    //$("#startTime").attr("disabled", true);

	var shadowCSS = [];
	shadowCSS["width"] = $("#inoutcontainer").width();
	shadowCSS["height"] = $("#inoutcontainer").height();
	$("#inout_Shadow").css(shadowCSS);
	$("#inout_Error").css(shadowCSS);
	$("#inout_Shadow").hide();
	$("#inout_Error").hide();
	
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
	        $("#inoutChart").html("In & Out Statistics");
	    }
	    else {
	        //$("#startTime").attr('disabled', true);//默认是本月的数据,相差一个月
	        //$("#endTime").attr('disabled', true);

	        $("button[theme=" + theme + "]").addClass("btn-primary");
	        $("#chartclear").show();

	        if (theme == "inoutflow") {
	            if ($("#inoutChart").html() == "In & Out Statistics") {
	                SerchResultData.length = 0;
	                //preDeviceGuid = "";
	            }

	            $("#inoutChart").html("Add report");
	        }
	        else {
	            $("#inoutChart").html("In & Out Statistics");
	           // preDeviceGuid = "";
	           // vSameErr = 0;
	        }

	        DrawFlow();

	        // salesQuery();
	    }
	});

});


function personQuery() {

    $("#inout_Error").hide();
    $("#inout_Errordiv").remove();
    $("#inout_Shadow").show();
    var param = [];
    
	param["UserProGuid"] = getcookievalue("UserProGuid");
    param["startDate"] = encodeURI($("#startTime").val());
    param["endDate"] = encodeURI($("#startTime").val());
    param["startTimeGap"] = encodeURI(startTimeGap);
    param["endTimeGap"] = encodeURI(endTimeGap);

    var deviceguid = $("#deviceGuid").val();

    if (deviceguid == "" || deviceguid == "-1") {
        $("#inout_Shadow").hide();
        alert("Show failed, Please Select The Entrance！");
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
    var url = "/servlet/InOutCountChartServlet" + GetURLParam(param);
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
											"<div id='inout_Errordiv'>Error!!</br>Please<a href='javascript:DrawFlow();'class='pagecolor'>refresh the page</a></div>");
						//alert("请求错误,请刷新");
						return;
					    }
					    if (data === "ERROR") {
					        $("#inout_Shadow").hide();
					        $("#inout_Error").show();
					        $("#inout_Error")
									.append(
											"<div id='inout_Errordiv'>Background support run error!!</br>Please<a href='javascript:DrawFlow();'class='pagecolor'>refresh the page</a></div>");
						//alert("后台发生错误,请刷新");
						return;
					    }
					    try {
					        var myobj = eval('(' + data + ')');
					    } catch (Error) {
					        $("#inout_Shadow").hide();
					        $("#inout_Error").show();
					        $("#inout_Error")
									.append(
											"<div id='inout_Errordiv'>Data conversion failed, wrong page format!!</br>Please<a href='javascript:DrawFlow();'class='pagecolor'>refresh the page</a></div>");
						//alert("数据转换失败,格式不正确，请刷新!");
						return;
					    }
					    if (myobj == undefined) {
					        $("#inout_Shadow").hide();
					        $("#inout_Error").show();
					        $("#inout_Error")
									.append(
											"<div id='inout_Errordiv'>Data accessing failed!!</br>Please<a href='javascript:DrawFlow();'class='pagecolor'>refresh the page</a></div>");
						//alert("未获取到数据！请刷新");
						return;
					    }
                        //alert(data);
                        personItems = myobj;
					});
                    
                    return personItems;
}
function ClearAllChart() {
    $("#inoutcontainer").empty();
     if(theme !="inoutflow" )
    SerchResultData.length = 0;
    SerchWeakend.length = 0;
    YLabel.length = 0;

    $("#inout_Shadow").hide();
    $("#inout_Error").hide();

   // $("#startTime").attr("disabled", false);
    //$("#endTime").attr("disabled", false);
}

function createRandnColor() {
    return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);
}


function GenData() {

    if ($("#inoutChart").html() != "Add report")
        SerchResultData.length = 0;

    personQuery();

    if (personItems == null || personItems == "" || personItems == undefined)
        return;

    var vStartIndex = parseInt((parseInt(startTimeGap.substr(0, 2)) * 60 + parseInt(startTimeGap.substr(3, 2))) / 15);
    var vEndIndex = parseInt((parseInt(endTimeGap.substr(0, 2)) * 60 + parseInt(endTimeGap.substr(3, 2))) / 15);
    var vIndexInData = [];
    var vIndexOutData = [];

    for (var i = 0; i < personItems['inPersonCount'].length; i++) {
        if (i >= vStartIndex && i <= vEndIndex) {
            vIndexInData[i - vStartIndex] = personItems['inPersonCount'][i];
            vIndexOutData[i - vStartIndex] = personItems['outPersonCount'][i];
        }
    }
    
    var vSRdata = {
        name: $("#startTime").val() + " "+document.getElementById("deviceGuid").options[document.getElementById("deviceGuid").selectedIndex].text+" In",
        data: vIndexInData,
        color: createRandnColor(),
        type: 'line'
    };

    SerchResultData.push(vSRdata);

        vSRdata = {
            name: $("#startTime").val() + " " + document.getElementById("deviceGuid").options[document.getElementById("deviceGuid").selectedIndex].text + " Out",
            data: vIndexOutData,
            color: createRandnColor(),
            type: 'line'
        }
        SerchResultData.push(vSRdata);

        YLabel = [{ // Primary yAxis
            labels: {
                format: '{value}',
                style: {
                    color: vSRdata.color
                }
            },
            title: {
                text: 'People number',
                style: {
                    color: vSRdata.color
                }
            }
        }];

}


function DrawFlow() {

    $("#inout_Error").hide();
    $("#inout_Errordiv").remove();
    $("#inout_Shadow").show();
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
        
        if (i % 2 == 0)
        {
         var curName = curData.name;
            titleStr += curName.substr(0,curName.length-2)  + " Total：In " + vNum;
            }
        else
            titleStr += " Out " + vNum;

    }


    $('#inoutcontainer').highcharts({
        chart: {
        type: 'line',
            zoomType: 'xy',
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
            //startOnTick: true,
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
            shared: true
        },

        //右下角，数据来源连接
        credits: {
            enabled: false
        },
        legend: {
            enabled: true
        },

        plotOptions: {
            line: {
                pointInterval: 900000, //半小时
                pointStart: Date.UTC(year
                        .format('yyyy'), year
                        .format('MM')-1, year
                        .format('dd'), parseInt(startTimeGap.substr(0,2)), parseInt(startTimeGap.substr(3,2)))

                        //Date.UTC(year
                        //.format('yyyy'), year
                        //.format('MM'), year
                        //.format('dd'), parseInt(startTimeGap.substr(0,3)), parseInt(startTimeGap.substr(5,6)), 0)
                //						pointStart : Date.UTC(curDateTime.getFullYear(), curDateTime
                //								.getMonth() + 1, curDateTime.getDate(), 0, 0, 0)
                //,
                //dataLabels: { //表格显数字
                //    enabled: true
                //}
            }
        }
    });
        $("#inout_Shadow").hide();
}

