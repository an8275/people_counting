function DeviceListTable_AJAX() {
	$("#DeviceListTable_Error").hide();
	$("#DeviceListTable_Errordiv").remove();
	$("#DeviceListTable_Shadow").show();
	// alert($("#DeviceListTable").height());

	var table = $("#DeviceListTable");// 获取表格对象
	EmptyTableItemDom(table);// 清空表
	ClearTableText(table);// 清除之前的数据
	// ClearInputText();//清除详细表单数据
	// 清除绑定的数据
	for ( var i = 0; i < 10; i++)
		SetColDataAttr($("#devlist" + i));
	$("#DeviceListTable tr").removeClass("tdClickColor");// 移除其他颜色

	var iMaxRow = GetMaxRow(table);
	if (iMaxRow === undefined)
		iMaxRow = 10;
	var beginIndex = GetTableBeginIndex(table);// 得到起始分页索引

	var param = [];
	param["beginIndex"] = encodeURI(beginIndex);
	param["endIndex"] = encodeURI(beginIndex + iMaxRow);
	//	param["proguid"] = Request.QueryString("proguid");
	param["proguid"] = getcookievalue("UserProGuid");

	var devname = $("#queryDeviceName").val();
	if (devname != undefined && devname != null && devname != ""
			&& devname != "Device Name") {
		param["devicename"] = encodeURI(devname);
	}
	param["random"] = newGuid();
	var url = "/servlet/UserDeviceListServlet" + GetURLParam(param);
	$
			.get(
					url,
					{
						Action : "get"
					},
					function(data, textStatus) {
						if (textStatus != "success") {
							$("#DeviceListTable_Shadow").hide();
							$("#DeviceListTable_Error").show();
							$("#DeviceListTable_Error")
									.append(
											"<div id='DeviceListTable_Errordiv'>Error!!</br>Please<a href='javascript:DeviceListTable_AJAX();'class='pagecolor'>refresh the page</a></div>");
						//alert("请求错误,请刷新");
						return;
						}
						if (data === "ERROR") {
							$("#DeviceListTable_Shadow").hide();
							$("#DeviceListTable_Error").show();
							$("#DeviceListTable_Error")
									.append(
											"<div id='DeviceListTable_Errordiv'>Background support run error!!</br>Please<a href='javascript:DeviceListTable_AJAX();'class='pagecolor'>refresh the page</a></div>");
						//alert("后台发生错误,请刷新");
						return;
						}
						try {
							var myobj = eval('(' + data + ')');
						} catch (Error) {
							$("#DeviceListTable_Shadow").hide();
							$("#DeviceListTable_Error").show();
							$("#DeviceListTable_Error")
									.append(
											"<div id='DeviceListTable_Errordiv'>Data conversion failed, wrong page format!!</br>Please<a href='javascript:DeviceListTable_AJAX();'class='pagecolor'>refresh the page</a></div>");
						//alert("数据转换失败,格式不正确，请刷新!");
						return;
						}
						if (myobj == undefined) {
							$("#DeviceListTable_Shadow").hide();
							$("#DeviceListTable_Error").show();
							$("#DeviceListTable_Error")
									.append(
											"<div id='DeviceListTable_Errordiv'>Data accessing failed!!</br>Please<a href='javascript:DeviceListTable_AJAX();'class='pagecolor'>refresh the page</a></div>");
						//alert("未获取到数据！请刷新");
						return;
						}
                        //alert(data);
						var Table = $("#DeviceListTable");
						var itemCountNode = myobj["itemCount"];

						if (itemCountNode != undefined) {
							ChangePageCount(Table, itemCountNode);// 将当前页以及总页数保存在页面中
						}
						var iRow = 0;
						// 将查询到的一页数据填充至表格
						for ( var i in myobj["deviceList"]) {
							if (iRow >= iMaxRow)
								break;
							var item = myobj["deviceList"][i];
							var rowData = [];
							if (item["strGuid"] != undefined
									&& item["strGuid"] != null)
								SetColDataAttr($("#devlist" + i),
										item["strGuid"], '',
										item["strFromTable"]);
							// 应该绑定guid(必须的)
							if (item["state"] == "0") {
								rowData[0] = '<img alt="Device forbidden" title="Device forbidden" src="../images/ballyellow.png" />';
							} else if (item["state"] == "1") {
								rowData[0] = '<img alt="Device online" title="Device online" src="../images/ballgreen.png" />';
							} else if (item["state"] == "2") {
								rowData[0] = '<img alt="Device offline" title="Device offline" src="../images/ballblack.png" />';
							}
							rowData[0] += '<label  onmousemove="tablemove(this,event)" onmouseout="tableout()">' + item["strDeviceName"] + '</label>';
							if (item["deviceIp"] != undefined) {
							    rowData[1] = '<label  onmousemove="tablemove(this,event)" onmouseout="tableout()">' + item["deviceIp"] + '</label>';
							} else {
								rowData[1] = undefined;
							}

							if (item["lastTime"] != undefined) {
                                rowData[2] = '<label  onmousemove="tablemove(this,event)" onmouseout="tableout()">' + item["lastTime"] + '</label>';
							} else {
								rowData[2] = undefined;
                            }

							FillTableRow(table, iRow, rowData);
							iRow++;
						}
						$("#DeviceListTable_Shadow").hide();
					});

}
function queryDevTable() {
	$("#PageInput").val("1");
	$("#DeviceListTable").data("beginIndex", 0);// 清除之前的数据
	DeviceListTable_AJAX();
}

$(function() {

	InsertDeviceNullRow($("#DeviceListTable"), 10, 3);// 插入10条空数据

	var shadowCSS = [];
	shadowCSS["width"] = $("#DeviceListTable").width();
	shadowCSS["height"] = $("#DeviceListTable").height();
	//	alert($("#PageCtrl").height());
	$("#detailarticle").css('height', $("#listarticle").height());

	$("#DeviceListTable_Shadow").css(shadowCSS);
	$("#DeviceListTable_Error").css(shadowCSS);
	$("#DeviceListTable_Error").hide();
	$("#DeviceListTable_Shadow").show();

	var table = $("#DeviceListTable");
	SetTableAttr(table, true, 10, 3);

	SetPageCtrlTable("#DeviceListTable", DeviceListTable_AJAX);
	DeviceListTable_AJAX();

	// 单击table的某一行变色
	$("#DeviceListTable tr td").bind("click", function() {
		$("#DeviceListTable tr").removeClass("tdClickColor");// 移除其他颜色
			$(this).parent().addClass("tdClickColor");// 当前点击的变色
			SeeDevDetail(this);
		});

});
function InsertDeviceNullRow(tableObj, rowInsertCount, colInsertCount) {
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