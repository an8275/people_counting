var pageSize = 8;
var tableCol = 5;
var virtualDevices = [];
var iRow = 0;

function salesQuery(itemdata) {
    var param = [];
    param["startDate"] = encodeURI($("#nowTime").val());
    param["endDate"] = encodeURI($("#nowTime").val());
    param["dataGuid"] = encodeURI(itemdata["strDataGuid"]);
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
											"<div id='flow_Errordiv'>Error!!</br>Please<a href='javascript:createPersonFlow();'class='pagecolor'>refresh the page</a></div>");
						//alert("请求错误,请刷新");
							return;
					    }
					    if (data === "ERROR") {
					        $("#flow_Shadow").hide();
					        $("#flow_Error").show();
					        $("#flow_Error")
									.append(
											"<div id='flow_Errordiv'>Background support run error!!</br>Please<a href='javascript:createPersonFlow();'class='pagecolor'>refresh the page</a></div>");
						//alert("后台发生错误,请刷新");
							return;
					    }
					    try {
					        var myobj = eval('(' + data + ')');
					    } catch (Error) {
					        $("#flow_Shadow").hide();
					        $("#flow_Error").show();
					        $("#flow_Error")
									.append(
											"<div id='flow_Errordiv'>Data conversion failed, wrong page format!!</br>Please<a href='javascript:createPersonFlow();'class='pagecolor'>refresh the page</a></div>");
						//alert("数据转换失败,格式不正确，请刷新!");
						return;
					    }
					    if (myobj == undefined) {
					        $("#flow_Shadow").hide();
					        $("#flow_Error").show();
					        $("#flow_Error")
									.append(
											"<div id='flow_Errordiv'>Data accessing failed!!</br>Please<a href='javascript:createPersonFlow();'class='pagecolor'>refresh the page</a></div>");
						//alert("未获取到数据！请刷新");
						return;
					    };

                            var table = $("#CustListTable");// 获取表格对象
					        rowData = [];
					    	rowData[0] = '<label  onmousemove="tablemove(this,event)" onmouseout="tableout()">' + itemdata["strDeviceName"] + '</label>';
							rowData[1] = itemdata["realDeviceCount"];
							rowData[2] = '<input type="text" name="'+itemdata["strDataGuid"]+'"value="'+ myobj["Sales"] +'" readonly="true" disabled/>';
							rowData[3] = '<input type="text" name="'+itemdata["strDataGuid"]+'"value="'+ myobj["Orders"] +'" readonly="true" disabled/>';
							rowData[4] = '<label  onmousemove="tablemove(this,event)" onmouseout="tableout()">' + 'Time' + '</label>';
							FillTableRow(table, iRow, rowData);
							iRow++;
					});
}

function CustListTable_AJAX() {

	$("#CustListTable_Error").hide();
	$("#CustListTable_Errordiv").remove();
	$("#CustListTable_Shadow").show();

	// alert($("#CustListTable").height());

	var table = $("#CustListTable");// 获取表格对象
	EmptyTableItemDom(table);// 清空表
	ClearTableText(table);// 清除之前的数据
	// ClearInputText();//清除详细表单数据
	// 清除绑定的数据
	for ( var i = 0; i < pageSize; i++)
		SetColDataAttr($("#devlist" + i));
	$("#CustListTable tr").removeClass("tdClickColor");// 移除其他颜色
     
	var iMaxRow = GetMaxRow(table);
	if (iMaxRow === undefined)
		iMaxRow = pageSize;
	var beginIndex = GetTableBeginIndex(table);// 得到起始分页索引

	var param = [];
	param["beginIndex"] = encodeURI(beginIndex);
	param["endIndex"] = encodeURI(beginIndex + iMaxRow);
	param["proguid"] = encodeURI(getcookievalue("UserProGuid"));

	param["strFromTable"] = encodeURI("device_cust");
	var devname = $("#queryDeviceName").val();
	if (devname != undefined && devname != null && devname != ""
			&& devname != "Device name") {
		param["devicename"] = encodeURI(devname);
	}

	param["random"] = newGuid();
	var url = "/servlet/VirtualDeviceListServlet" + GetURLParam(param);
	$
			.get(
					url,
					{
						Action : "get"
					},
					function(data, textStatus) {
						if (textStatus != "success") {
							$("#CustListTable_Shadow").hide();
							$("#CustListTable_Error").show();
							$("#CustListTable_Error")
									.append(
											"<div id='CustListTable_Errordiv'>Error!!</br>Please<a href='javascript:CustListTable_AJAX();'class='pagecolor'>refresh the page</a></div>");
						//alert("请求错误,请刷新");
						return;
						}
						if (data === "ERROR") {
							$("#CustListTable_Shadow").hide();
							$("#CustListTable_Error").show();
							$("#CustListTable_Error")
									.append(
											"<div id='CustListTable_Errordiv'>Background support run error!!</br>Please<a href='javascript:CustListTable_AJAX();'class='pagecolor'>refresh the page</a></div>");
						//alert("后台发生错误,请刷新");
						return;
						}
						try {
							var myobj = eval('(' + data + ')');
						} catch (Error) {
							$("#CustListTable_Shadow").hide();
							$("#CustListTable_Error").show();
							$("#CustListTable_Error")
									.append(
											"<div id='CustListTable_Errordiv'>Data conversion failed, wrong page format!!</br>Please<a href='javascript:CustListTable_AJAX();'class='pagecolor'>refresh the page</a></div>");
						//alert("数据转换失败,格式不正确，请刷新!");
						return;
						}
						if (myobj == undefined) {
							$("#CustListTable_Shadow").hide();
							$("#CustListTable_Error").show();
							$("#CustListTable_Error")
									.append(
											"<div id='CustListTable_Errordiv'>Data accessing failed!!</br>Please<a href='javascript:CustListTable_AJAX();'class='pagecolor'>refresh the page</a></div>");
						//alert("未获取到数据！请刷新");
						return;
						}

						var Table = $("#CustListTable");
                        			var itemCountNode = myobj["itemCount"];

						if (itemCountNode != undefined) {
							ChangePageCount(Table, itemCountNode);// 将当前页以及总页数保存在页面中
						}
						iRow = 0;
						// 将查询到的一页数据填充至表格
						for ( var i in myobj["deviceList"]) {
							if (iRow >= iMaxRow)
								break;
							var item = myobj["deviceList"][i];

							if (item["isSalesDevice"] == "\u0000" || item["isSalesDevice"] == undefined || item["isSalesDevice"] == null)
							    continue;

							//绑定guid,dataguid和来自哪张表
							if (item["strGuid"] != undefined
									&& item["strGuid"] != null)
								SetColDataAttr($("#devlist" + i),
										item["strGuid"],item["strDataGuid"],
										item["strFromTable"]);
                                        
                            salesQuery(item);
						}
						$("#CustListTable_Shadow").hide();
					});

}

function queryDevTable() {
	$("#PageInput").val("1");
	$("#CustListTable").data("beginIndex", 0);// 清除之前的数据
	CustListTable_AJAX();
}

function onTimePicked() {
    iRow = 0;
    SetPageCtrlTable('#CustListTable', CustListTable_AJAX);
}

$(function () {

    var currentDateTime = new Date();
    //	currentDateTime.format('yyyy-MM-dd hh:mm:ss');
    $("#nowTime").val(currentDateTime.format('yyyy-MM-dd'));

    InsertCustNullRow($("#CustListTable"), pageSize, tableCol);// 插入10条空数据

	var shadowCSS = [];
	shadowCSS["width"] = $("#CustListTable").width();
	shadowCSS["height"] = $("#CustListTable").height();
	//	alert($("#PageCtrl").height());
	$("#detailarticle").css('height', $("#listarticle").height());

	$("#CustListTable_Shadow").css(shadowCSS);
	$("#CustListTable_Error").css(shadowCSS);
	$("#CustListTable_Error").hide();
	$("#CustListTable_Shadow").hide();

	var table = $("#CustListTable");
	SetTableAttr(table, true, pageSize, tableCol);
	SetPageCtrlTable("#CustListTable", CustListTable_AJAX);
	CustListTable_AJAX();

	// 单击table的某一行变色
	$("#CustListTable tr td").bind("click", function() {
		$("#CustListTable tr").removeClass("tdClickColor");// 移除其他颜色
			$(this).parent().addClass("tdClickColor");// 当前点击的变色
			//$("#modifyBtn").html("修改");
			//    $("#cancelBtn").hide();
	});

	//$("#ownProject").ready(function() {
	//	CustListTable_AJAX();
	//	//若在下拉前已经点击过某条详情，必须清除掉隐藏的数据和其他表单数据
	//		$("#deviceGuid").val("");
	//		$("#deviceType").val("");
	//		ClearInputText();
	//		$("#detailOwnProject").val($(this).val());//select同步
	//		//		if ($(this).val() == "-1") {
	//		//			//未选择所属项目	
	//		//		} else {
	//		//			//已选择某个项目则始终不可用
	//		//			$("#detailOwnProject").addClass("inputDisabled");
	//		//			$("#detailOwnProject").attr("disabled", true);
	//		//		}
	//});

	//$("#detailOwnProject").change(function() {
	//	$("#alternativeDevice").empty();//内容清空
	//		$("#alreadyDevice").empty();
	//		addLoadDeviceListType("alternativeDevice", "alreadyDevice");
	//	});

	//LoadProjectType("detailOwnProject");
	//$("#detailOwnProject").val("-1");

	//	DeviceListTable_AJAX();
});
function InsertCustNullRow(tableObj, rowInsertCount, colInsertCount) {
	var tbody = tableObj.find("tbody").eq(0);
	for ( var k = 0; k < rowInsertCount; k++) {
		var row = $("<tr id='devlist" + k + "'></tr>");

		for ( var i = 0; i < colInsertCount; i++) {
			if (i == 0) {
				row.append($("<td class='hide'>&nbsp;</td>"));
				continue;
			}
			row.append($("<td align='center' class='hide'>&nbsp;</td>"));
		}
		tbody.append(row);
	}
}



//{'deviceList': 
//    [
//    {'isSalesDevice': '\x01', 'strDataGuid': '484979f2df3811e3acfb000c291df26c', 'strDeviceName': 'fdsf', 'realDeviceCount': 0, 'strGuid': '4848f748df3811e3acfb000c291df26c', 'strFromTable': 'device_cust'},
//    {'isSalesDevice': '\x01', 'strDataGuid': '75f63ed2df2211e3acfb000c291df26c', 'strDeviceName': 'agh64h', 'realDeviceCount': 0, 'strGuid': '75f63a90df2211e3acfb000c291df26c', 'strFromTable': 'device_cust'},
//    {'isSalesDevice': '\x01', 'strDataGuid': '6f8a3adadf2211e3acfb000c291df26c', 'strDeviceName': '\xe9\x98\xbf\xe5\x87\xa1\xe8\xbe\xbe\xe7\xac\xa6\xe5\x90\x88', 'realDeviceCount': 0, 'strGuid': '6f8a310cdf2211e3acfb000c291df26c', 'strFromTable': 'device_cust'}, 
//    {'isSalesDevice': '\x01', 'strDataGuid': '6a866f72df2211e3acfb000c291df26c', 'strDeviceName': '7775667\xe8\xa6\x81\xe5\x9b\x9e\xe5\xae\xb6', 'realDeviceCount': 0, 'strGuid': '6a866752df2211e3acfb000c291df26c', 'strFromTable': 'device_cust'},
//    {'isSalesDevice': '\x01', 'strDataGuid': '64ec09a0df2211e3acfb000c291df26c', 'strDeviceName': '\xe6\x8a\xa5\xe5\x91\x8a\xe5\x8f\x91\xe5\xb8\x83\xe7\x9a\x84', 'realDeviceCount': 0, 'strGuid': '64ec03a6df2211e3acfb000c291df26c', 'strFromTable': 'device_cust'}, 
//    {'isSalesDevice': '\x01', 'strDataGuid': '5f78db74df2211e3acfb000c291df26c', 'strDeviceName': '111111', 'realDeviceCount': 0, 'strGuid': '5f78d520df2211e3acfb000c291df26c', 'strFromTable': 'device_cust'}, 
//    {'isSalesDevice': '\x01', 'strDataGuid': '59eb35d0df2211e3acfb000c291df26c', 'strDeviceName': '\xe7\x88\xb1\xe7\x88\xb1\xe7\x88\xb1', 'realDeviceCount': 0, 'strGuid': '59eb173adf2211e3acfb000c291df26c', 'strFromTable': 'device_cust'}, 
//    {'isSalesDevice': '\x01', 'strDataGuid': '5491d378df2211e3acfb000c291df26c', 'strDeviceName': '\xe5\x8f\x91\xe5\x91\x86\xe5\x8f\x91', 'realDeviceCount': 0, 'strGuid': '54914606df2211e3acfb000c291df26c', 'strFromTable': 'device_cust'}], 'itemCount': 12L}
