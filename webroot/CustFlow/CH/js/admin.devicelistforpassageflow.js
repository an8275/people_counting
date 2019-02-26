var pageSize=12;
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
	for ( var i = 0; i < pageSize; i++)
		SetColDataAttr($("#devlist" + i));
	$("#DeviceListTable tr").removeClass("tdClickColor");// 移除其他颜色

	var ownProject = $("#ownProject").val();
	if (ownProject == "-1") {
		alert("请先选择所属项目！");
		$("#DeviceListTable_Shadow").hide();
		return;
	}
	var iMaxRow = GetMaxRow(table);
	if (iMaxRow === undefined)
		iMaxRow = pageSize;
	var beginIndex = GetTableBeginIndex(table);// 得到起始分页索引

	var param = [];
	param["beginIndex"] = encodeURI(beginIndex);
	param["endIndex"] = encodeURI(beginIndex + iMaxRow);
	param["proguid"] = encodeURI(ownProject);

	param["strFromTable"] = encodeURI("device_cust");

	var devname = $("#queryDeviceName").val();
	if (devname != undefined && devname != null && devname != ""
			&& devname != "区域名称") {
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
							$("#DeviceListTable_Shadow").hide();
							$("#DeviceListTable_Error").show();
							$("#DeviceListTable_Error")
									.append(
											"<div id='DeviceListTable_Errordiv'>请求错误</br>请<a href='javascript:DeviceListTable_AJAX();'class='pagecolor'>刷新</a></div>");
							return;
						}
						if (data === "ERROR") {
							$("#DeviceListTable_Shadow").hide();
							$("#DeviceListTable_Error").show();
							$("#DeviceListTable_Error")
									.append(
											"<div id='DeviceListTable_Errordiv'>后台发生错误</br>请<a href='javascript:DeviceListTable_AJAX();'class='pagecolor'>刷新</a></div>");
							return;
						}
						try {
							var myobj = eval('(' + data + ')');
						} catch (Error) {
							$("#DeviceListTable_Shadow").hide();
							$("#DeviceListTable_Error").show();
							$("#DeviceListTable_Error")
									.append(
											"<div id='DeviceListTable_Errordiv'>数据转换失败,格式不正确</br>请<a href='javascript:DeviceListTable_AJAX();'class='pagecolor'>刷新</a></div>");
							return;
						}
						if (myobj == undefined) {
							$("#DeviceListTable_Shadow").hide();
							$("#DeviceListTable_Error").show();
							$("#DeviceListTable_Error")
									.append(
											"<div id='DeviceListTable_Errordiv'>未获取到数据</br>请<a href='javascript:DeviceListTable_AJAX();'class='pagecolor'>刷新</a></div>");
							return;
						}
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
							//绑定guid,dataguid和来自哪张表
							if (item["strGuid"] != undefined
									&& item["strGuid"] != null)
								SetColDataAttr($("#devlist" + i),
										item["strGuid"],item["strDataGuid"],
										"device_cust");
							// 应该绑定guid(必须的)
							rowData[0] = '<label  onmousemove="tablemove(this,event)" onmouseout="tableout()">' + item["strDeviceName"] + '</label>';
							rowData[1] = item["realDeviceCount"];
							rowData[2] = "<a title='点击删除' onclick='DeleteOneVirtual(this);'><img src='../images/cross.png' alt='点击删除' /> </a>";
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
function DeleteOneVirtual(obj) {
	if (!confirm("确定要删除这条信息?删除后将不可恢复！")) {
		return;
	}
	var objParentTrId = $(obj).parent().parent().attr("id");
	//alert(objParentTrId);
	if (objParentTrId === undefined)
		return;
	var guid = $("#" + objParentTrId).data("guid");
	if (guid === undefined || guid === "" || guid == null)
		return;
	//alert(guid);
	var fromtable = $("#" + objParentTrId).data("other");
	if (fromtable === undefined || fromtable === null)
		return;

	var param = [];
	param["Guid"] = encodeURI(guid);
	param["FromTable"] = encodeURI(fromtable);
	param["random"] = newGuid();
	$("#DeviceDetailTable_Shadow").show();
	var url = "/servlet/DelVirtualDeviceServlet" + GetURLParam(param);
	$.get(url, {
		Action : "get"
	}, function(data, textStatus) {
		if (textStatus != "success") {
			$("#DeviceDetailTable_Shadow").hide();
			return;
		}
		if (data === "SUCCESS") {
			alert("删除成功！");
			//			ClearInputText();
			DeviceListTable_AJAX();
			$("#DeviceDetailTable_Shadow").hide();
		} else {
			$("#DeviceDetailTable_Shadow").hide();
            if (data === "UNIQUEERROR") {
                alert("后台发生错误,设备UID不唯一,保存失败!");
            } else if (data === "UNIQUENAMEERROR") {
                alert("后台发生错误,设备名称项目内不唯一,保存失败!");
            } else {
                alert("后台发生错误,保存失败!");
            }
			return;
		}

	});
}
$(function() {

	InsertDeviceNullRow($("#DeviceListTable"), pageSize, 3);// 插入10条空数据

	var shadowCSS = [];
	shadowCSS["width"] = $("#DeviceListTable").width();
	shadowCSS["height"] = $("#DeviceListTable").height();
	//	alert($("#PageCtrl").height());
	$("#detailarticle").css('height', $("#listarticle").height());

	$("#DeviceListTable_Shadow").css(shadowCSS);
	$("#DeviceListTable_Error").css(shadowCSS);
	$("#DeviceListTable_Error").hide();
	$("#DeviceListTable_Shadow").hide();

	var table = $("#DeviceListTable");
	SetTableAttr(table, true, pageSize, 3);

	SetPageCtrlTable("#DeviceListTable", DeviceListTable_AJAX);

	// 单击table的某一行变色
	$("#DeviceListTable tr td").bind("click", function() {
		$("#DeviceListTable tr").removeClass("tdClickColor");// 移除其他颜色
			$(this).parent().addClass("tdClickColor");// 当前点击的变色
			SeeDevDetail(this);
		});

	LoadProjectType("ownProject");

	$("#ownProject").val("-1");

	$("#ownProject").change(function() {
	    DeviceListTable_AJAX();
		//若在下拉前已经点击过某条详情，必须清除掉隐藏的数据和其他表单数据
			$("#deviceGuid").val("");
			//$("#deviceType").val("");
			ClearInputText();
			$("#detailOwnProject").val($(this).val());//select同步
			//		if ($(this).val() == "-1") {
			//			//未选择所属项目	
			//		} else {
			//			//已选择某个项目则始终不可用
			//			$("#detailOwnProject").addClass("inputDisabled");
			//			$("#detailOwnProject").attr("disabled", true);
			//		}
		});
	$("#detailOwnProject").change(function() {
		$("#alternativeDevice").empty();//内容清空
			$("#alreadyDevice").empty();
			addLoadDeviceListType("alternativeDevice", "alreadyDevice");
		});

	LoadProjectType("detailOwnProject");
	$("#detailOwnProject").val("-1");

	//	DeviceListTable_AJAX();
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
