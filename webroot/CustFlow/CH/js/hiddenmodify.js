var pageSize = 14;
var tableCol = 4;
var iRow = 0;
var rownum=0;
function PersonflowQuery() {
	var table = $("#CustListTable");// 获取表格对象
	//EmptyTableItemDom(table);// 清空表
	//ClearTableText(table);// 清除之前的数据
	// ClearInputText();//清除详细表单数据
	// 清除绑定的数据
	
	$("#CustListTable tr").removeClass("tdClickColor");// 移除其他颜色
     
	
	
    var param = [];
    param["startDate"] = encodeURI($("#startTime").val());
    param["endDate"] = encodeURI($("#endTime").val());
	
    param["deviceGuid"] = encodeURI($("#deviceGuid").val());
    //param["isvirtual"] = encodeURI(1);
    param["random"] = newGuid();
    param["startTimeGap"] = '00:00:00';
	param["endTimeGap"] = '24:00:00';
    var url = "/servlet/InOutFlowCountServlet" + GetURLParam(param);
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
											"<div id='flow_Errordiv'>请求错误</br>请<a href='javascript:createPersonFlow();'class='pagecolor'>刷新</a></div>");
					        return;
					    }
					    if (data === "ERROR") {
					        $("#flow_Shadow").hide();
					        $("#flow_Error").show();
					        $("#flow_Error")
									.append(
											"<div id='flow_Errordiv'>后台发生错误</br>请<a href='javascript:createPersonFlow();'class='pagecolor'>刷新</a></div>");
					        return;
					    }
					    try {
					        var myobj = eval('(' + data + ')');
							//alert(data);
					    } catch (Error) {
					        $("#flow_Shadow").hide();
					        $("#flow_Error").show();
					        $("#flow_Error")
									.append(
											"<div id='flow_Errordiv'>数据转换失败,格式不正确</br>请<a href='javascript:createPersonFlow();'class='pagecolor'>刷新</a></div>");

					        return;
					    }
					    if (myobj == undefined) {
					        $("#flow_Shadow").hide();
					        $("#flow_Error").show();
					        $("#flow_Error")
									.append(
											"<div id='flow_Errordiv'>未获取到数据</br>请<a href='javascript:createPersonFlow();'class='pagecolor'>刷新</a></div>");

					        return;
					    };
						var table = $("#CustListTable");
                        var itemCountNode = myobj["categories"].length;
                        						
						
						//$("#CustListTable tr:not(:first)").empty();
						var rows=$("#CustListTable").find("tr").length;
						for(var i=0;i<rows;i++){
							//此处动态删除行会更新行号，所以一直删第一行
						   $("#CustListTable tr:eq(1)").remove();
						}
						if(itemCountNode>0){
						       InsertCustNullRow($("#CustListTable"), itemCountNode, tableCol);// 插入空数据
						       SetTableAttr(table, true, itemCountNode, tableCol);
						       $("#CustListTable tr td").bind("click", function() {
		                          $("#CustListTable tr").removeClass("tdClickColor");// 移除其他颜色
			                      $(this).parent().addClass("tdClickColor");// 当前点击的变色
	                           });
						}
						rownum=itemCountNode;
						iRow = 0;
                        for(var i=0;i<itemCountNode;i++){
						    var table = $("#CustListTable");// 获取表格对象
					        rowData = [];
					    	rowData[0] = '<div ><label id="'+i+'">' + myobj["categories"][i] + '</label></div>';
							rowData[1] = $("#deviceGuid").find("option:selected").text();
							rowData[2] ='<label id="'+i+"a"+'">' + myobj["column"][i] + '</label>';
                            rowData[3] = '<input id="'+i+"b"+'" type="text" style="color:#000000;" value="' + myobj["column"][i] + '" readonly="readonly" disabled/>';
							FillTableRow(table, iRow, rowData);
							iRow++;
						}
                         
                            

					});
}



function queryDevTable() {
	$("#PageInput").val("1");
	$("#CustListTable").data("beginIndex", 0);// 清除之前的数据
	//CustListTable_AJAX();
}

function onTimePicked() {
    iRow = 0;
    SetPageCtrlTable('#CustListTable', CustListTable_AJAX);
}

$(function () {

    var currentDateTime = new Date();
    //	currentDateTime.format('yyyy-MM-dd hh:mm:ss');
    $("#startTime").val(currentDateTime.format('yyyy-MM-dd'));
    $("#endTime").val(currentDateTime.format('yyyy-MM-dd'));

	$("#deviceGuid").empty();//请选择设备类型不需要清空
    $("#deviceGuid").append("<option value='-1'>--请选择区域--</option>");
    LoadVirtualType("deviceGuid", getcookievalue("UserProGuid"), "device_cust");

    InsertCustNullRow($("#CustListTable"), pageSize, tableCol);// 插入10条空数据

	$("#input").val('1.0');
	$("#input").attr({disabled:true});

    $("#cancelBtn").hide();
	var shadowCSS = [];
	shadowCSS["width"] = $("#CustListTable").width();
	shadowCSS["height"] = $("#CustListTable").height();
	//	alert($("#PageCtrl").height());
	$("#detailarticle").css('height', $("#listarticle").height());
    $("#CustListTable_Shadow").css(shadowCSS);
    $("#CustListTable_Error").css(shadowCSS);
	
    $("#CustListTable_Shadow").hide();
    $("#CustListTable_Error").hide();

    //默认点击只读不可用
    InputDisabledCss(true);

	$("#CustListTable_Shadow").css(shadowCSS);
	$("#CustListTable_Error").css(shadowCSS);
	$("#CustListTable_Error").hide();
	$("#CustListTable_Shadow").hide();

	var table = $("#CustListTable");
	//SetTableAttr(table, true, pageSize, tableCol);
	//SetPageCtrlTable("#CustListTable", CustListTable_AJAX);
	//CustListTable_AJAX();

	// 单击table的某一行变色
	$("#CustListTable tr td").bind("click", function() {
		$("#CustListTable tr").removeClass("tdClickColor");// 移除其他颜色
			$(this).parent().addClass("tdClickColor");// 当前点击的变色
	});

	
});
function InsertCustNullRow(tableObj, rowInsertCount, colInsertCount) {
	var tbody = tableObj.find("tbody").eq(0);
	for ( var k = 0; k < rowInsertCount; k++) {
		var row = $("<tr id='devlist" + k + "'></tr>");

		for ( var i = 0; i < colInsertCount; i++) {
			row.append($("<td align='center' class='hide'>&nbsp;</td>"));
		}
		tbody.append(row);
	}
}

//更改Input的只读属性
function devInputStatusChangeReadOnly(flag) {
    //$("#id").attr("readonly","readonly");    
    //添加readonly属性 
    // $("#ID").attr({ readonly: 'true' });
    //$("#id").removeAttr("readonly");    //去除readonly属性
    //	alert(flag);
    if (flag === undefined || flag == null)
        return;
    $("#CustListTable input").attr({
        readonly: flag,
		disabled: flag
    });

    $("#CustListTable textarea").attr({
        readonly: flag,
		disabled: flag
    });
    $("#input").attr({
		readonly: flag,
		disabled: flag});
    
    InputDisabledCss(flag);
    
}
//设置不可用时input底色变灰色（浏览器兼容）
function InputDisabledCss(flag) {
    if (flag === undefined || flag == null)
        return;
    if (flag) {
        $("#CustListTable input").addClass("inputDisabled");
        $("#alreadyDevice").addClass("inputDisabled");
        $("#alternativeDevice").addClass("inputDisabled");
        $("#CustListTable textarea").addClass("inputDisabled");

    } else {
        $("#CustListTable input").removeClass("inputDisabled");
        $("#alreadyDevice").removeClass("inputDisabled");
        $("#alternativeDevice").removeClass("inputDisabled");
        $("#CustListTable textarea").removeClass("inputDisabled");
    }
   // $("#addTime").addClass("inputDisabled");
}

//清空右边详细信息的数据
function ClearInputText() {
    $("#deviceName").val("");
    $("#deviceDescription").val("");
    $("#deviceDetailInfo").val("");
    $("#alternativeDevice").empty();//内容清空
    $("#alreadyDevice").empty();
    $("#isProjectDevice").attr("checked", false);
    $("#addTime").val("");
}


//点击取消所触发的事件（如果是新建，取消就是清空所有值，如果是修改，取消就是还原默认值）
function ClickCancel() {
    $("#CustListTable_Shadow").hide();
    $("#CustListTable_Error").hide();
    $("#cancelBtn").hide();
    $("#modifyBtn").html("修改");
    InputDisabledCss(true);
	devInputStatusChangeReadOnly(true);
    
}
function searchpersonflow() {
    var deviceGuid=$("#deviceGuid").val();
	if(deviceGuid==-1){
	    alert("请选择区域！");
	}else{
		//alert($("#deviceGuid").find("option:selected").text());
	    PersonflowQuery();
		//CustListTable_AJAX();
	}
    
}
//录入信息和GUID等信息
function ModifyDeviceChange() {
    //alert("修改");

    if ($("#modifyBtn").html() == "修改") {

        $("#cancelBtn").show();
        devInputStatusChangeReadOnly(false);//所有数据可写

        $("#CustListTable :text").attr("disabled", false);
        $("#CustListTable :text").attr("readonly", false);

        //$("#addTime").attr("disabled", false);
        //$("#addTime").removeClass("inputDisabled");//只有在修改时纳入时间可用

        $("#modifyBtn").html("提交");
    } else if ($("#modifyBtn").html() == "提交") {
		//$("#cancelBtn").hide();
        if (!confirm("确定要保存这条信息？")) {
            return;
        }

        var vRowCount = $('#CustListTable :text').length;
        //alert($('#CustListTable :text').length);
        var nFlag = 0;
		
        for (var i = 0; i < vRowCount; i++) {
			//alert($('#CustListTable :text:eq(' + ( i) + ')').val());
			//行列值都从1开始算起
			//alert(original+" "+finalval);
			var startdate=$("#startTime").val();
		    var d=new Date(Date.parse(startdate.replace(/-/g,　 "/")));
            d.setDate(d.getDate()+i);
            var m=d.getMonth()+1;
            //alert(d.getFullYear()+'-'+m+'-'+d.getDate()); 
			var date=d.getFullYear()+'-'+m+'-'+d.getDate();
			//alert(date);
			//var date=$('#CustListTable tr:eq('+(i+1)+') td:nth-child('+(1)+')').text();
            var finalval=$('#CustListTable :text:eq(' + i + ')').val();
                 var param = [];
                 param["deviceGuid"] =encodeURI($("#deviceGuid").val());
                 param["inoutaver"] = encodeURI(finalval);
				 param["nowDate"] = encodeURI(date);
                 param["random"] = newGuid();
                 var url = "/servlet/UpdatemodifyflowServlet" + GetURLParam(param);
                 //alert(url);
                 $.get(url, {
                     Action: "get"
                 }, function (data, textStatus) {
                         
                     if (textStatus != "success") {
                         $("#CustListTable_Shadow").hide();
                         alert("请求错误,提交失败!");
                         return;
                     }

                     if (data != "success") {
                         nFlag = 1;
                     }
                 });           
        }

        if (nFlag == 0) {
            $("#CustListTable_Shadow").hide();
            $("#modifyBtn").html("修改");
            devInputStatusChangeReadOnly(true);//所有数据可读不可写
            alert("提交成功!");
            $("#cancelBtn").hide();
        } else {
                $("#CustListTable_Shadow").hide();
                alert("后台发生错误,提交失败!");
                return;
            }
        }
    }
function datachange(dir){
	if(dir==1){
		//disabled属性设置为true时值为disabled，设置为false时实际是remove了该属性
        if($("#input").attr("disabled")==undefined){
		      $("#input").val($("#seclect").find("option:selected").text());
		}
	}
	var match=/^[0-9]+([.]{1}[0-9]+){0,1}$/;
    var inputval=$("#input").val();
	if(match.test(inputval)){
	     for(var i=0;i<rownum;i++){

		    var data=Math.round($("[id='"+i+"a"+"']").text()*inputval);
            $("[id='"+i+"b"+"']").val(data);
		 }
	}else{
	    alert("请输入整数或小数!");	
	}
		/*$("#seclect option").each(function() {
           if($(this).text()==inputval){
		      $(this).attr("selected", "true");
			  return;
		   }
        });*/
    //document.getElementById('input').value=$("#seclect").find("option:selected").text()
	//alert($("#input").val());
	
    //alert(id);
	//alert($("[id='"+lable+"']").text());
	//alert($("[id='"+select+"']").find("option:selected").text());
	//alert($("[id='"+input+"']").val());
	//var data=Math.round($("[id='"+lable+"']").text()*$("[id='"+select+"']").find("option:selected").text());
	//$("[id='"+input+"']").val(data);
}