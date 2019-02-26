var theme = "";
var SerchResultData = [];
var SerchWeakend = [];
var YLabel = [];
var vErr = 0;

var startTimeGap = "";
var endTimeGap = "";
var salesItems;
var personItems;

var vSameErr = 0;

var allPerson = 0;//总客流量
var perperson=0;//单个客流量
var detil="";

var allSale = 0;//总销售额
var perSale=0;//单个销售额
var allOrder = 0;//总订单数
var perOrder = 0;//单个订单数

var chartText = "";

var areaguid="";//区域编码值
var areaname="";//区域显示值

var salesguid="";//销售编码值
var salesname="";//销售显示值

var Methods="";//数据统计方式

$(function () {
    
    // 收缩展开效果
    $(".box h1").toggle(function(){
         $(this).next(".text").animate({height: 'toggle', opacity: 'toggle'}, "slow");
    },function(){
         $(this).next(".text").animate({height: 'toggle', opacity: 'toggle'}, "slow");
    });

    $.ajaxSetup({
        async: false
    });

    var currentDateTime = new Date();
    $("#endTime").val(currentDateTime.format('yyyy-MM-dd'));//默认是本月的数据,相差一个月
    $("#startTime").val(currentDateTime.format('yyyy-MM') + "-01");

    //$("#startTimeGap").val('00:00:00');//默认是本月的数据,相差一个月
    //$("#endTimeGap").val('23:59:59');

    //$("#startTime").attr("disabled", true);

    var shadowCSS = [];
    shadowCSS["width"] = $("#flowcontainer").width();
    shadowCSS["height"] = $("#flowcontainer").height();
    $("#flow_Shadow").css(shadowCSS);
    $("#flow_Error").css(shadowCSS);
    $("#flow_Shadow").hide();
    $("#flow_Error").hide();
	$("#detilbox").hide();

   
    
    $("#deviceSales").empty();//请选择销售类型不需要清空
    $("#deviceSales").append("<option value='-1'>--选择销售区域--</option>");
    LoadSalesDevice("deviceSales", getcookievalue("UserProGuid"), "device_cust");
    $("#saleselect").hide();//未知

    startTimeGap = getcookievalue("startTimeGap");
    endTimeGap = getcookievalue("endTimeGap");
	//全选框js
    $("#checkall").live("click", function () {
		
        $(":checkbox", $(this).parentsUntil("table")).attr("checked", $(this).attr("checked"));
		if (!$(this).attr("checked")) {
			 var checkedbox = $("#selectList :checked");
             for (var i = 0; i < checkedbox.length; i++) {
				 checkedbox[i].checked=false;
			 }
			} 
    });
    $("button.btn").click(function () {
        theme = $(this).attr("theme");
        
        $("button.btn-primary").removeClass("btn-primary");
        $("#startTime").attr('disabled', true);//默认是本月的数据,相差一个月
        $("#endTime").attr('disabled', true);
        $("button[theme=" + theme + "]").addClass("btn-primary");
        /*if (theme != "personflow") {
           vSameErr = 0;
        }*/
		Methods=document.getElementById("Methods").options[document.getElementById("Methods").selectedIndex].value;
		if(theme=="personflow"){//客流柱图
		   var checkBox = $("#selectList :checked");
           if(checkBox.length>0){
			   $("#detilbox").show();
               SerchResultData.length = 0;
               allPerson = 0;
               ClearAllChart();
               detil="";//点击按钮详细列表清空
		       for (var i = 0; i < checkBox.length; i++) {
				   if(checkBox[i].name==""){continue;}
				   perperson=0;
			       areaguid=checkBox[i].value;
				   areaname=checkBox[i].name;
				   DrawPersonFlow();
				   detil+="<div >"+areaname+"&nbsp;&nbsp;&nbsp;总人流量:<label style='font-size:20px;color: red;'>"+perperson+"</label>人次</div></br>";
				   $("#detil").html(detil);
				 
				  
               }
	        }else{
		       areaguid=-1;
			   areaname=-1;
			   ClearAllChart();
			   DrawPersonFlow();
	        }
		}else if(theme=="andsalesrate"){//客流与客单价
            SerchResultData.length = 0;
            allPerson = 0;
			perperson=0;
			allSale=0;
			perSale=0;
            ClearAllChart();
			detil="";//点击按钮详细列表清空
            salesguid=document.getElementById("deviceSales").options[document.getElementById("deviceSales").selectedIndex].value;
			salesname=document.getElementById("deviceSales").options[document.getElementById("deviceSales").selectedIndex].text;
            areaguid=salesguid;
			areaname=salesname;
			
			DrawPersonFlow();
            
			detil+="<div >"+areaname+"&nbsp;&nbsp;&nbsp;总人流量:<label style='font-size:20px;color: red;'>"+perperson+"</label>人次&nbsp;&nbsp;&nbsp;销售额：<label style='font-size:20px;color: red;'>"+perSale+"</label>元</div></br>";
		    $("#detil").html(detil);
			$("#detilbox").show();
		}else if(theme=="andsaleaverage"){//客流与提带率
			SerchResultData.length = 0;
            allPerson = 0;
			perperson=0;
			allOrder = 0;
			perOrder=0;
            ClearAllChart();
            detil="";//点击按钮详细列表清空
			salesguid=document.getElementById("deviceSales").options[document.getElementById("deviceSales").selectedIndex].value;
			salesname=document.getElementById("deviceSales").options[document.getElementById("deviceSales").selectedIndex].text;
            areaguid=salesguid;
			areaname=salesname;
			
			DrawPersonFlow();
			detil+="<div >"+areaname+"&nbsp;&nbsp;&nbsp;总人流量:<label style='font-size:20px;color: red;'>"+perperson+"</label>人次&nbsp;&nbsp;&nbsp;订单数：<label style='font-size:20px;color: red;'>"+perOrder+"</label>笔</div></br>";
		    $("#detil").html(detil);
			$("#detilbox").show();
		}else if(theme=="detilbtn"){
			 $("#startTime").attr("disabled", false);
             $("#endTime").attr("disabled", false);
		}
        
            
    });
});


function salesQuery() {

    $("#flow_Error").hide();
    $("#flow_Errordiv").remove();
    $("#flow_Shadow").show();

    var param = [];
    param["startDate"] = encodeURI($("#startTime").val());
    param["endDate"] = encodeURI($("#endTime").val());

    //var dataGuid = $("#deviceSales").val();
    if (salesguid == "" || salesguid == "-1") {
        alert("无法查询,请选择销售区域！");
        return;
    }
    param["dataGuid"] = encodeURI(salesguid);
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
					        $("#flow_Shadow").hide();
					        $("#flow_Error").show();
					        $("#flow_Error")
									.append(
											"<div id='flow_Errordiv'>请求错误</br>请<a href='javascript:DrawPersonFlow();'class='pagecolor'>刷新</a></div>");
					        return;
					    }
					    if (data === "ERROR") {
					        $("#flow_Shadow").hide();
					        $("#flow_Error").show();
					        $("#flow_Error")
									.append(
											"<div id='flow_Errordiv'>后台发生错误</br>请<a href='javascript:DrawPersonFlow();'class='pagecolor'>刷新</a></div>");
					        return;
					    }
					    try {
					        var myobj = eval('(' + data + ')');
					    } catch (Error) {
					        $("#flow_Shadow").hide();
					        $("#flow_Error").show();
					        $("#flow_Error")
									.append(
											"<div id='flow_Errordiv'>数据转换失败,格式不正确</br>请<a href='javascript:DrawPersonFlow();'class='pagecolor'>刷新</a></div>");

					        return;
					    }
					    if (myobj == undefined) {
					        $("#flow_Shadow").hide();
					        $("#flow_Error").show();
					        $("#flow_Error")
									.append(
											"<div id='flow_Errordiv'>未获取到数据</br>请<a href='javascript:DrawPersonFlow();'class='pagecolor'>刷新</a></div>");

					        return;
					    };
                        salesItems = myobj;
					});
    return salesItems;
}

function personQuery() {

    $("#flow_Error").hide();
    $("#flow_Errordiv").remove();
    $("#flow_Shadow").show();
    var param = [];

    param["startDate"] = encodeURI($("#startTime").val());
    param["endDate"] = encodeURI($("#endTime").val());
    param["startTimeGap"] = encodeURI(startTimeGap);
    param["endTimeGap"] = encodeURI(endTimeGap);

    
     if (areaguid == "" || areaguid == "-1") {
        if(theme=="personflow"){
            alert("无法查询,请先选择客流区域！");
		    personItems="";
		}else{
			alert("无法查询,请先选择销售区域！");
		    personItems="";
		}
        return;
    } 
    param["UserProGuid"] = getcookievalue("UserProGuid");
    param["deviceGuid"] = encodeURI(areaguid);
    param["isvirtual"] = encodeURI(1);
    param["random"] = newGuid();
    var url = "/servlet/InOutFlowCountServlet" + GetURLParam(param);
    $
			.get(
					url,
					{
					    Action: "get"
					},
					function (data, textStatus) {

					    if (textStatus != "success") {
					        $("#flow_Shadow").hide();
					        $("#flow_Error").show();
					        $("#flow_Error")
									.append(
											"<div id='flow_Errordiv'>请求错误</br>请<a href='javascript:DrawPersonFlow();'class='pagecolor'>刷新</a></div>");
					        return;
					    }
					    if (data === "ERROR") {
					        $("#flow_Shadow").hide();
					        $("#flow_Error").show();
					        $("#flow_Error")
									.append(
											"<div id='flow_Errordiv'>后台发生错误</br>请<a href='javascript:DrawPersonFlow();'class='pagecolor'>刷新</a></div>");
					        return;
					    }
					    try {
					        var myobj = eval('(' + data + ')');
					    } catch (Error) {
					        $("#flow_Shadow").hide();
					        $("#flow_Error").show();
					        $("#flow_Error")
									.append(
											"<div id='flow_Errordiv'>数据转换失败,格式不正确</br>请<a href='javascript:DrawPersonFlow();'class='pagecolor'>刷新</a></div>");

					        return;
					    }
					    if (myobj == undefined) {
					        $("#flow_Shadow").hide();
					        $("#flow_Error").show();
					        $("#flow_Error")
									.append(
											"<div id='flow_Errordiv'>未获取到数据</br>请<a href='javascript:DrawPersonFlow();'class='pagecolor'>刷新</a></div>");

					        return;
					    }
                        //personItems = myobj;
						//替换数据
						var res;
						var param=[];
						param["deviceGuid"] = encodeURI(areaguid);
						param["random"] = newGuid();
                        var url = "/servlet/GethiddenflowServlet"+ GetURLParam(param);
						$
			               .get(
					            url,
					                {
					                      Action: "get"
					                },
					             function (data, textStatus) {
                                     //alert(data);
					                 if (textStatus != "success") {
					                     return;
					                 }
					                 if (data === "ERROR") {
					                     return;
					                 }
					                 try {
					                      res = eval('(' + data + ')');
					                 } catch (Error) {
					                     return;
					             }
					             if (res == undefined) {
					                     return;
					             }
								 //alert(res);
								 //alert(myobj);
						         for(var i=0;i<myobj['column'].length;i++){
									var startdate=$("#startTime").val();
		                            var d=new Date(Date.parse(startdate.replace(/-/g,　 "/")));
						            d.setDate(d.getDate()+i);
                                    var m=d.getMonth()+1;
			                        var date=d.getFullYear()+'-'+m+'-'+d.getDate();
                                    
									for(var j=0;j<res['date'].length;j++){
									       if(date==res['date'][j]){
											   
										       myobj['column'][i]=res['inoutaver'][j];
										   }
									  }
						         }
						});
                        personItems = myobj;
					});
                    
                    return personItems;
}
function ClearAllChart() {
    $("#flowcontainer").empty();
     //if(theme !="personflow" )
    SerchResultData.length = 0;
    SerchWeakend.length = 0;
    YLabel.length = 0;

            $("#inout_Shadow").hide();
    $("#inout_Error").hide();

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

    if (SerchWeakend.length > 0 || personItems == null || personItems == "" || personItems == undefined )
        return ;
    //周末添加异色
    var TimeData = personItems['categories'];

    var nyear = $("#startTime").val();
    for (var i = 0; i < TimeData.length; i++) {
        var str = TimeData[i].replace(/-/g, "/");
        var nowWeak = new Date(nyear[0] + nyear[1] + nyear[2] + nyear[3] + '/' + str);

        if (nowWeak.getDay() == 5 || nowWeak.getDay() == 6) {

            var vSRdata = {
                color: '#D8D8EB',
                label: {
                //    text: '周末',
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


    personQuery();
    personflowdata();//处理按月按年数据
	var vPerData = personItems['column'];
    for (var i = 0; i < personItems['column'].length; i++) {
        //allPerson += vPerData[i];
		perperson += vPerData[i];
    }
    allPerson+=perperson;
    if (personItems == null || personItems == "" || personItems == undefined)
        return;
    var vSRdata = {
        name:areaname+ "：客流",
        data: personItems['column'],
        color: createRandnColor(),
        type: 'column'
    };

    
    
    if (vSameErr != 1) 
    SerchResultData.push(vSRdata);

    YLabel = [{ // Primary yAxis
            labels: {
                format: '{value}人',
                style: {
                    color: vSRdata.color
                }
            },
            title: {
                text: '人数',
                style: {
                    color: vSRdata.color
                }
            }
        }];

        var perColor = vSRdata.color;

    if (theme == "andsalesrate") {
        salesQuery();
		salesdata();
        var vSalesData =salesItems['Sales'];
        var vPersonData = personItems['column'];
        var vPersonSales = [];
        allSale = 0;
        for (var i = 0; i < salesItems['Sales'].length; i++)
        {
            if(vPersonData[i] == 0)
                vPersonSales[i] = 0;
            else
                vPersonSales[i] = vSalesData[i] / vPersonData[i];

            perSale += vSalesData[i];
        }
        allSale+=perSale;
        vSRdata = {
            name: salesname+"：客单价",
            data: vPersonSales,
            color: createRandnColor(),
            yAxis: 1,
            type: 'spline'
        }
        SerchResultData.push(vSRdata);

         YLabel = [{ // Primary yAxis
            labels: {
                format: '{value}人',
                style: {
                    color: perColor
                }
            },
            title: {
                text: '人数',
                style: {
                    color: perColor
                }
            }
        }, { // Secondary yAxis
            title: {
                text: '客单价',
                style: {
                    color: vSRdata.color
                }
            },
            min:0,
            labels: {
                
                format: '{value} 元',
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
        var vOrdersData =salesItems['Orders'];
        var vPersonData = personItems['column'];
        var vPersonOrders = [];
        allOrder = 0;
        for (var i = 0; i < salesItems['Sales'].length; i++)
        {
            if(vPersonData[i] == 0)
                vPersonOrders[i] = 0;
            else
                vPersonOrders[i] = vOrdersData[i] * 100/ vPersonData[i];

            perOrder += vOrdersData[i];
        }
        allOrder+=perOrder;
        vSRdata = {
            name: salesname+"：提带率",
            data: vPersonOrders,
            color: createRandnColor(),
            yAxis: 1,
            type: 'spline'
        }
        SerchResultData.push(vSRdata);

                 YLabel = [{ // Primary yAxis
            labels: {
                format: '{value}人',
                style: {
                    color: perColor
                }
            },
            title: {
                text: '人数',
                style: {
                    color: perColor
                }
            }
        }, { // Secondary yAxis
            title: {
                text: '提带率',
                style: {
                    color: vSRdata.color
                }
            },
            
                min: 0,
            labels: {
                format: '{value} %',
                style: {
                    color: vSRdata.color
                }
            },
            opposite: true
        }];
    }
}


function DrawPersonFlow() {

    $("#flow_Error").hide();
    $("#flow_Errordiv").remove();
    $("#flow_Shadow").show();
    var year = parseISO8601($("#startTime").val());
    GenData();
    if(Methods=='day'){
	    GenWeakend();
	}
    vSameErr = 0;

    if (theme == "personflow")
        chartText = "人流量 合计：" + allPerson + "人次";

    if (theme == "andsalesrate")
        chartText = "人流量 合计：" + allPerson + "人次 ---- 销售额 合计：" + allSale + "元";

    if (theme == "andsaleaverage")
        chartText = "人流量 合计：" + allPerson + "人次 ---- 订单数 合计：" + allOrder + "笔";

    $('#flowcontainer').highcharts({
        chart: {
        zoomType: 'xy',
            margin: [50, 80, 100, 80]
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
            categories: personItems["categories"],
            tickInterval: parseInt(personItems['categories'].length / 5),
            plotBands: SerchWeakend,

            minTickInterval: 1,//最少一天画一个x刻度

            labels: {
                overflow: 'justify'
            }
        },

        yAxis: YLabel,

        series: SerchResultData,

        tooltip: {
            enabled: false,
        },

        //右下角，数据来源连接
        credits: {
            enabled: false
        },
        tooltip: {
            shared: true
        },
        legend: {
            enabled: false
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
        $("#flow_Shadow").hide();
}

function personflowdata(){
       //按月或年显示
    //alert(personItems['categories']);
	//alert($("#startTime").val()+" "+$("#endTime").val());
	//alert(personItems['categories'].length);
    var startdate=new Date($("#startTime").val());
	var enddate=new Date($("#endTime").val());
	if(Methods=='month'){		
		var startmonth=startdate.getMonth();
		var oldlength=personItems['categories'].length;
		var newlength=enddate.getFullYear()*12+enddate.getMonth()-startdate.getFullYear()*12-startdate.getMonth();
	    var res={}
		res['column']=[]
		res['outall']=[]
		res['inall']=[]
		res['categories']=[]
	    for(var i=0;i<=newlength;i++){
			var categories=(startmonth+i+1)%12;
			if(categories==0){categories=12;}		
			if(categories<10){categories='0'+categories;}		    		
			res['column'].push(0);
		    res['outall'].push(0);
		    res['inall'].push(0);
			res['categories'].push(categories);
		}
		var key=0;//原始数据加到相应月份里
		for(var j=0;j<oldlength;j++){
			res['column'][key]+=personItems['column'][j];
			res['outall'][key]+=personItems['outall'][j];
			res['inall'][key]+=personItems['inall'][j];	
			if(j<oldlength-1){
				if(personItems['categories'][j].substring(0,2)!=personItems['categories'][j+1].substring(0,2)){
				   key+=1;
			    }//开始下一月
			}
			
        }
		personItems=res;
		//alert('date'+personItems['categories']);
	}else if(Methods=='year'){
        var startyear=startdate.getFullYear();
	    var startmonth=startdate.getMonth();
		var oldlength=personItems['categories'].length;
		var newlength=enddate.getFullYear()-startdate.getFullYear();
	    var res={}
		res['column']=[]
		res['outall']=[]
		res['inall']=[]
		res['categories']=[]
	    for(var i=0;i<=newlength;i++){
			var categories=startyear+i;	    		
			res['column'].push(0);
		    res['outall'].push(0);
		    res['inall'].push(0);
			res['categories'].push(categories);
		}
		var key=0;//原始数据加到相应年份里
		for(var j=0;j<oldlength;j++){
			res['column'][key]+=personItems['column'][j];
			res['outall'][key]+=personItems['outall'][j];
			res['inall'][key]+=personItems['inall'][j];	
			if(j<oldlength-1){
			   if(personItems['categories'][j].substring(0,2)==12&&personItems['categories'][j+1].substring(0,2)==1){
				key+=1;
			   }//开始下一年
			}
        }
		personItems=res;
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