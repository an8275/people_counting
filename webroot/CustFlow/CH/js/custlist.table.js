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
	for ( var i = 0; i < 10; i++)
		SetColDataAttr($("#custlist" + i));
	$("#CustListTable tr").removeClass("tdClickColor");// 移除其他颜色

	var iMaxRow = GetMaxRow(table);
	if (iMaxRow === undefined)
		iMaxRow = 10;
	var beginIndex = GetTableBeginIndex(table);// 得到起始分页索引

	var param = [];
	param["beginIndex"] = encodeURI(beginIndex);
	param["endIndex"] = encodeURI(beginIndex + iMaxRow);

	var custname = $("#queryCustName").val();
	if (custname != undefined && custname != null && custname != ""
			&& custname != "客户名称") {
		param["custname"] = encodeURI(custname);
	}
	param["random"] = newGuid();
	var url = "/servlet/CustListServlet" + GetURLParam(param);
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
											"<div id='CustListTable_Errordiv'>请求错误</br>请<a href='javascript:CustListTable_AJAX();'class='pagecolor'>刷新</a></div>");
							return;
						}
						if (data === "ERROR") {
							$("#CustListTable_Shadow").hide();
							$("#CustListTable_Error").show();
							$("#CustListTable_Error")
									.append(
											"<div id='CustListTable_Errordiv'>后台发生错误</br>请<a href='javascript:CustListTable_AJAX();'class='pagecolor'>刷新</a></div>");
							return;
						}
						try {
							var myobj = eval('(' + data + ')');
						} catch (Error) {
							$("#CustListTable_Shadow").hide();
							$("#CustListTable_Error").show();
							$("#CustListTable_Error")
									.append(
											"<div id='CustListTable_Errordiv'>数据转换失败,格式不正确</br>请<a href='javascript:CustListTable_AJAX();'class='pagecolor'>刷新</a></div>");
							return;
						}
						if (myobj == undefined) {
							$("#CustListTable_Shadow").hide();
							$("#CustListTable_Error").show();
							$("#CustListTable_Error")
									.append(
											"<div id='CustListTable_Errordiv'>未获取到数据</br>请<a href='javascript:CustListTable_AJAX();'class='pagecolor'>刷新</a></div>");
							return;
						}
						var Table = $("#CustListTable");
						var itemCountNode = myobj["itemCount"];

						if (itemCountNode != undefined) {
							ChangePageCount(Table, itemCountNode);// 将当前页以及总页数保存在页面中
						}
						var iRow = 0;
						// 将查询到的一页数据填充至表格
						for ( var i in myobj["custList"]) {
							if (iRow >= iMaxRow)
								break;
							var item = myobj["custList"][i];
							var rowData = [];
							if (item["strGuid"] != undefined
									&& item["strGuid"] != null)
								SetColDataAttr($("#custlist" + i),
										item["strGuid"]);
							// 应该绑定guid(必须的)
							rowData[0] = '<label  onmousemove="tablemove(this,event)" onmouseout="tableout()">'+ item["strCustName"]+'</label>';
							if (item["strCustDescription"] != undefined) {
								rowData[1] = '<label  onmousemove="tablemove(this,event)" onmouseout="tableout()">' + item["strCustDescription"] + '</label>';
							} else {
								rowData[1] = undefined;
							}
							rowData[2] = "<a title='点击删除' onclick='DeleteOneCust(this);'><img src='../images/cross.png' alt='点击删除' /> </a>";;
							FillTableRow(table, iRow, rowData);
							iRow++;
						}
						$("#CustListTable_Shadow").hide();
					});

}
function queryCustTable() {
	$("#PageInput").val("1");
	$("#CustListTable").data("beginIndex", 0);// 清除之前的数据
	CustListTable_AJAX();
}
function DeleteOneCust(obj) {
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
	var param = [];
	param["Guid"] = encodeURI(guid);
	param["random"] = newGuid();
	$("#CustDetailTable_Shadow").show();
	var url = "/servlet/DelCustServlet" + GetURLParam(param);
	$.get(url, {
		Action : "get"
	}, function(data, textStatus) {
		if (textStatus != "success") {
			$("#CustDetailTable_Shadow").hide();
			return;
		}
		if (data === "SUCCESS") {
			alert("删除成功！");
			ClearInputText();
			//						$(obj).parent().parent().remove();
			CustListTable_AJAX();
			$("#CustDetailTable_Shadow").hide();
		} else {
			$("#CustDetailTable_Shadow").hide();
			alert("后台发生错误,删除失败！");
			return;
		}

	});
}
$(function() {
	
	InsertDeviceNullRow($("#CustListTable"), 10, 3);// 插入10条空数据

	var shadowCSS = [];
	shadowCSS["width"] = $("#CustListTable").width();
	shadowCSS["height"] = $("#CustListTable").height();
	//	alert($("#PageCtrl").height());
	$("#detailarticle").css('height', $("#listarticle").height());

	$("#CustListTable_Shadow").css(shadowCSS);
	$("#CustListTable_Error").css(shadowCSS);
	$("#CustListTable_Error").hide();
	$("#CustListTable_Shadow").show();

	var table = $("#CustListTable");
	SetTableAttr(table, true, 10, 3);

	SetPageCtrlTable("#CustListTable", CustListTable_AJAX);
	CustListTable_AJAX();

	// 单击table的某一行变色
	$("#CustListTable tr td").bind("click", function() {
		$("#CustListTable tr").removeClass("tdClickColor");// 移除其他颜色
			$(this).parent().addClass("tdClickColor");// 当前点击的变色
			SeeCustDetail(this);
		});

});
function InsertDeviceNullRow(tableObj, rowInsertCount, colInsertCount) {
	var tbody = tableObj.find("tbody").eq(0);
	for ( var k = 0; k < rowInsertCount; k++) {
		var row = $("<tr id='custlist" + k + "'></tr>");

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
