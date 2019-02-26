var theme = "";
var SerchResultData = [];
var SerchWeakend = [];
var YLabel = [];
var vErr = 0;

var startTimeGap = "";
var endTimeGap = "";
var salesItems;
var staytimeItems;
var preDeviceGuid = "";
var vSameErr = 0;

var allAverTime = 0;
var allSale = 0;
var allOrder = 0;

var chartText = "";

var Methods="";//数据统计方式


$(function () {

    $.ajaxSetup({
        async: false
    });

    var currentDateTime = new Date();
    $("#endTime").val(currentDateTime.format('yyyy-MM-dd'));//默认是本月的数据,相差一个月
    $("#startTime").val(currentDateTime.format('yyyy-MM') + "-01");

    var shadowCSS = [];
    shadowCSS["width"] = $("#averagecontainer").width();
    shadowCSS["height"] = $("#averagecontainer").height();
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
    $("#saleselect").hide();
    $("#chartclear").hide();

    startTimeGap = getcookievalue("startTimeGap");
    endTimeGap = getcookievalue("endTimeGap");

    $("button.btn").click(function () {
        theme = $(this).attr("theme");
        ClearAllChart();

        $("button.btn-primary").removeClass("btn-primary");
        Methods=document.getElementById("Methods").options[document.getElementById("Methods").selectedIndex].value;
        if (theme == "chartclear") {
            $("#chartclear").hide();
            $("#staytimeChart").html("Stay Time Statistics");
            allAverTime = 0;
            allSale = 0;
            allOrder = 0;
        }
        else {
            $("#startTime").attr('disabled', true);//默认是本月的数据,相差一个月
            $("#endTime").attr('disabled', true);

            $("button[theme=" + theme + "]").addClass("btn-primary");
            $("#chartclear").show();

            if (theme == "staytimeflow") {
                if ($("#staytimeChart").html() == "Stay Time Statistics") {
                    SerchResultData.length = 0;
                    allAverTime = 0;
                    preDeviceGuid = "";
                }

                $("#staytimeChart").html("Add report");
            }
            else {
                $("#staytimeChart").html("Stay Time Statistics");
                preDeviceGuid = "";
                vSameErr = 0;
            }


            DrawFlow();

        }

    });
});

function salesQuery() {

    $("#stay_Error").hide();
    $("#stay_Errordiv").remove();
    $("#stay_Shadow").show();

    var param = [];
    param["startDate"] = encodeURI($("#startTime").val());
    param["endDate"] = encodeURI($("#endTime").val());

    var dataGuid = $("#deviceSales").val();
    if (dataGuid == "" || dataGuid == "-1") {
        alert("Show failed, Please Select The Entrance Of Sales！");
        return;
    }
    param["dataGuid"] = encodeURI(dataGuid);
    //param["isvirtual"] = encodeURI(1);
    param["random"] = newGuid();
    var url = "/servlet/SalesInfoServlet" + GetURLParam(param);
    //alert(url);
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
					    };
					    salesItems = myobj;
					});
    $("#stay_Shadow").hide();

    return salesItems;
}

function AverageStayTimeQuery() {

    $("#stay_Error").hide();
    $("#stay_Errordiv").remove();
    $("#stay_Shadow").show();
    var param = [];

    param["startDate"] = encodeURI($("#startTime").val());
    param["endDate"] = encodeURI($("#endTime").val());
    param["startTimeGap"] = encodeURI(startTimeGap);
    param["endTimeGap"] = encodeURI(endTimeGap);

    var deviceguid = $("#deviceGuid").val();

    if (deviceguid == "" || deviceguid == "-1") {
        $("#stay_Shadow").hide();
        alert("Show failed, Please Select The Entrance!");
        return;
    }

    if (preDeviceGuid == deviceguid) {
        vSameErr = 1;
        alert("Area added,Please reselect!");
        return;
    }
    preDeviceGuid = deviceguid;

    param["deviceGuid"] = encodeURI(deviceguid);
    param["isvirtual"] = encodeURI(1);
    param["random"] = newGuid();
    var url = "/servlet/AverageStayTimeServlet" + GetURLParam(param);

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
					        $("#stay").hide();
					        $("#stay").show();
					        $("#stay")
									.append(
											"<div id='stay_Errordiv'>Data accessing failed!!</br>Please<a href='javascript:DrawFlow();'class='pagecolor'>refresh the page</a></div>");
						//alert("未获取到数据！请刷新");
						return;
					    }
					    staytimeItems = myobj;
					});
    $("#stay_Shadow").hide();
    return staytimeItems;
}

function ClearAllChart() {
    $("#averagecontainer").empty();
    if ($("#staytimeChart").html() != "Add report" && theme != "staytimeflow")
        SerchResultData.length = 0;
    SerchWeakend.length = 0;
    YLabel.length = 0;

    $("#stay_Shadow").hide();
    $("#stay_Error").hide();

    $("#startTime").attr("disabled", false);
    $("#endTime").attr("disabled", false);
}

function createRandnColor() {
    return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);
}

//plotBands: [{ // mark the weekend
//    color: '#FCFFC5',
//    from: Date.UTC(2010, 0, 2),
//    to: Date.UTC(2010, 0, 4)
//}],
function GenWeakend() {

    if (SerchWeakend.length > 0 || staytimeItems == null || staytimeItems == "" || staytimeItems == undefined)
        return;
    //周末添加异色
    var TimeData = staytimeItems['categories'];

    var nyear = $("#startTime").val();
    for (var i = 0; i < TimeData.length; i++) {
        var str = TimeData[i].replace(/-/g, "/");
        var nowWeak = new Date(nyear[0] + nyear[1] + nyear[2] + nyear[3] + '/' + str);

        if (nowWeak.getDay() == 5 || nowWeak.getDay() == 6) {

            var vSRdata = {
                color: '#D8D8EB',
                label: {
                    //text: '周末',
                    style: {
                        color: '#5A5AAD',
                    }
                },
                from: i + 0.5,
                to: Math.min(TimeData.length, i + 1 + 0.5)
            };
            SerchWeakend.push(vSRdata);
        }
    }
}

function GenData() {

    if ($("#staytimeChart").html() != "Add report") {
        SerchResultData.length = 0;
        allAverTime = 0;
    }

    AverageStayTimeQuery();
    AverageStayTimedata();
    if (staytimeItems == null || staytimeItems == "" || staytimeItems == undefined)
        return;

    var vTimeData = staytimeItems['column'];
    for (var i = 0; i < staytimeItems['column'].length; i++) {
        allAverTime += vTimeData[i];
    }

    if (staytimeItems['column'].length > 0)
        allAverTime /= staytimeItems['column'].length;
    allAverTime = parseInt(allAverTime);

    var vSRdata = {
        name: document.getElementById("deviceGuid").options[document.getElementById("deviceGuid").selectedIndex].text + "：average stay time",
        data: staytimeItems['column'],
        color: createRandnColor(),
        type: 'column'
    };

    if (vSameErr != 1)
        SerchResultData.push(vSRdata);

    YLabel = [{ // Primary yAxis
        labels: {
            format: '{value}',
            style: {
                color: vSRdata.color
            }
        },
        title: {
            text: 'minutes',
            style: {
                color: vSRdata.color
            }
        }
    }];

    var perColor = vSRdata.color;

    if (theme == "andsalesrate") {
        salesQuery();
		salesdata();
        var vSalesData = salesItems['Sales'];

        for (var i = 0; i < salesItems['Sales'].length; i++) {
            allSale += vSalesData[i];
        }

        vSRdata = {
            name: document.getElementById("deviceGuid").options[document.getElementById("deviceGuid").selectedIndex].text+"：sales",
            data: vSalesData,
            color: createRandnColor(),
            yAxis: 1,
            type: 'spline'
        }
        SerchResultData.push(vSRdata);

        YLabel = [{ // Primary yAxis
            labels: {
                format: '{value}minute',
                style: {
                    color: perColor
                }
            },
            title: {
                text: 'average stay time',
                style: {
                    color: perColor
                }
            }
        }, { // Secondary yAxis
            title: {
                text: 'sales',
                style: {
                    color: vSRdata.color
                }
            },
            min: 0,
            labels: {
                format: '{value}',
                style: {
                    color: vSRdata.color
                }
            },
            opposite: true
        }];
    }

    if (theme == "andsaleaverage") {
        salesQuery();
		salesdata();
        var vOrdersData = salesItems['Orders'];

        for (var i = 0; i < salesItems['Orders'].length; i++) {
            allOrder += vOrdersData[i];
        }

        vSRdata = {
            name: document.getElementById("deviceGuid").options[document.getElementById("deviceGuid").selectedIndex].text + "：orders",
            data: vOrdersData,
            color: createRandnColor(),
            yAxis: 1,
            type: 'spline'
        }
        SerchResultData.push(vSRdata);

        YLabel = [{ // Primary yAxis
            labels: {
                format: '{value}minute',
                style: {
                    color: perColor
                }
            },
            title: {
                text: 'average stay time',
                style: {
                    color: perColor
                }
            }
        }, { // Secondary yAxis
            title: {
                text: 'orders',
                style: {
                    color: vSRdata.color
                }
            },
            min: 0,
            labels: {
                format: '{value}',
                style: {
                    color: vSRdata.color
                }
            },
            opposite: true
        }];
    }
}


function DrawFlow() {
    $("#stay_Error").hide();
    $("#stay_Errordiv").remove();
    $("#stay_Shadow").show();
    var year = parseISO8601($("#startTime").val());
    GenData();
    if(Methods=='day'){
	    GenWeakend();
	}
    vSameErr = 0;

    if (theme == "staytimeflow")
        chartText = "average stay time：" + allAverTime + "(minute)";

    if (theme == "andsalesrate")
        chartText = "average stay time：" + allAverTime + "minute ---- sales volum amount("+currencytype+")：" + allSale;

    if (theme == "andsaleaverage")
        chartText = "average stay time：" + allAverTime + "minute ---- order number amount：" + allOrder ;

    $('#averagecontainer').highcharts({
        chart: {
            zoomType: 'xy',
            margin: [50, 50, 100, 80]
        },
        title: {
            text: chartText,
            style: {
                //color: '#F79B44',
                fontWeight: 'bold'
            }
        },
        subtitle: {
            text: $("#startTime").val() + "      " + $("#endTime").val()
        },
        exporting: {
            buttons: {
                contextButton: {
                    text: 'Export',
                    // align:'center'
                }
            }
        },
        xAxis: {
            categories: staytimeItems["categories"],
            tickInterval: parseInt(staytimeItems['categories'].length / 5),
            plotBands: SerchWeakend,

            minTickInterval: 1,//最少一天画一个x刻度

            labels: {
                overflow: 'justify'
            }
        },
        tooltip: {
            enabled: true,
        },
        yAxis: YLabel,

        series: SerchResultData,

        //右下角，数据来源连接
        credits: {
            enabled: false
        },
        tooltip: {
            shared: true
        },

        plotOptions: {
            column: {
                dataLabels: { //表格显数字
                    enabled: true
                }
            }
        },
        legend: {
            enabled: true
        },
    });
    $("#stay_Shadow").hide();
}
function AverageStayTimedata(){
       //按月或年显示
    //alert(personItems['categories']);
	//alert($("#startTime").val()+" "+$("#endTime").val());
	//alert(personItems['categories'].length);
	//alert(Methods);
    var startdate=new Date($("#startTime").val());
	var enddate=new Date($("#endTime").val());
	if(Methods=='month'){		
		var startmonth=startdate.getMonth();
		var oldlength=staytimeItems['categories'].length;
		var newlength=enddate.getFullYear()*12+enddate.getMonth()-startdate.getFullYear()*12-startdate.getMonth();
	    var res={}
		res['column']=[]
		res['categories']=[]
	    for(var i=0;i<=newlength;i++){
			var categories=(startmonth+i+1)%12;
			if(categories==0){categories=12;}		
			if(categories<10){categories='0'+categories;}		    		
			res['column'].push(0);
			res['categories'].push(categories);
		}
		var key=0;//原始数据加到相应月份里
		for(var j=0;j<oldlength;j++){
			res['column'][key]+=staytimeItems['column'][j];
			if(j<oldlength-1){
				if(staytimeItems['categories'][j].substring(0,2)!=staytimeItems['categories'][j+1].substring(0,2)){
				   key+=1;
			    }//开始下一月
			}
			
        }
		staytimeItems=res;
		//alert('date'+personItems['categories']);
	}else if(Methods=='year'){
        var startyear=startdate.getFullYear();
	    var startmonth=startdate.getMonth();
		var oldlength=staytimeItems['categories'].length;
		var newlength=enddate.getFullYear()-startdate.getFullYear();
	    var res={}
		res['column']=[]
		res['categories']=[]
	    for(var i=0;i<=newlength;i++){
			var categories=startyear+i;	    		
			res['column'].push(0);
			res['categories'].push(categories);
		}
		var key=0;//原始数据加到相应年份里
		for(var j=0;j<oldlength;j++){
			res['column'][key]+=staytimeItems['column'][j];
			if(j<oldlength-1){
			   if(staytimeItems['categories'][j].substring(0,2)==12&&staytimeItems['categories'][j+1].substring(0,2)==1){
				key+=1;
			   }//开始下一年
			}
        }
		staytimeItems=res;
		//alert('date'+personItems['categories']);
	
	}
}
function salesdata(){
    var startdate=new Date($("#startTime").val());
	var enddate=new Date($("#endTime").val());
	if(Methods=='month'){		
		var startmonth=startdate.getMonth();
		var oldlength=salesItems['categories'].length;
		var newlength=enddate.getFullYear()*12+enddate.getMonth()-startdate.getFullYear()*12-startdate.getMonth();
	    var res={}
		res['Sales']=[]
		res['Orders']=[]
		res['categories']=[]
	    for(var i=0;i<=newlength;i++){
			var categories=(startmonth+i+1)%12;
			if(categories==0){categories=12;}		
			if(categories<10){categories='0'+categories;}		    		
			res['Sales'].push(0);
		    res['Orders'].push(0);
			res['categories'].push(categories);
		}
		var key=0;//原始数据加到相应月份里
		for(var j=0;j<oldlength;j++){
			res['Sales'][key]+=salesItems['Sales'][j];
			res['Orders'][key]+=salesItems['Orders'][j];
			if(j<oldlength-1){
				if(salesItems['categories'][j].substring(5,7)!=salesItems['categories'][j+1].substring(5,7)){
				   key+=1;
			    }//开始下一月
			}
			
        }
		salesItems=res;
		//alert('date'+salesItems['categories']);
	}else if(Methods=='year'){
        var startyear=startdate.getFullYear();
	    var startmonth=startdate.getMonth();
		var oldlength=salesItems['categories'].length;
		var newlength=enddate.getFullYear()-startdate.getFullYear();
	    var res={}
		res['Sales']=[]
		res['Orders']=[]
		res['categories']=[]
	    for(var i=0;i<=newlength;i++){
			var categories=startyear+i;	    		
			res['Sales'].push(0);
		    res['Orders'].push(0);
			res['categories'].push(categories);
		}
		var key=0;//原始数据加到相应年份里
		for(var j=0;j<oldlength;j++){
			res['Sales'][key]+=salesItems['Sales'][j];
			res['Orders'][key]+=salesItems['Orders'][j];
			if(j<oldlength-1){
			   if(salesItems['categories'][j].substring(5,7)==12&&salesItems['categories'][j+1].substring(5,7)==1){
				key+=1;
			   }//开始下一年
			}
        }
		salesItems=res;
		//alert('date'+salesItems['categories']);
	
	}

}