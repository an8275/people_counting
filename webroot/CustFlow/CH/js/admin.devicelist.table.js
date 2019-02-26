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

	var devname = $("#queryDeviceName").val();
	if (devname != undefined && devname != null && devname != ""
			&& devname != "设备名称") {
		param["devicename"] = encodeURI(devname);
	}
	param["random"] = newGuid();
	var url = "/servlet/AdminDeviceListServlet" + GetURLParam(param);
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
							if (item["strGuid"] != undefined
									&& item["strGuid"] != null)
								SetColDataAttr($("#devlist" + i),
										item["strGuid"], '',
										item["strFromTable"]);
							// 应该绑定guid(必须的)
							if (item["state"] == "0") {
								rowData[0] = '<img alt="设备禁用" title="设备禁用" src="../images/ballyellow.png" />';
							} else if (item["state"] == "1") {
								rowData[0] = '<img alt="设备在线" title="设备在线" src="../images/ballgreen.png" />';
							} else if (item["state"] == "2") {
								rowData[0] = '<img alt="设备离线" title="设备离线" src="../images/ballblack.png" />';
							}
							rowData[0] += '<label  onmousemove="tablemove(this,event)" onmouseout="tableout()">' + item["strDeviceName"] + '</label>';
							if (item["deviceIp"] != undefined) {
								rowData[1] = '<label  onmousemove="tablemove(this,event)" onmouseout="tableout()">' + item["deviceIp"] + '</label>';
							} else {
								rowData[1] = undefined;
							}
							if (item["strFromTable"] == 'device_cust') {//暂时不管年龄属性设备
								if (item["isSign"]) {
									rowData[2] = '<a title="已注册,点击未注册" onclick="ChangeDeviceRegisterState(this,false);"><img src="../images/icn_op_reinstated.png" height="10px"/></a>';
								} else {
									rowData[2] = '<a title="未注册,点击注册" onclick="ChangeDeviceRegisterState(this,true);"><img src="../images/icn_op_disabled.png" height="10px"/></a>';
								}
								if (item["isUsable"]) {
									rowData[2] += '|<a title="此设备可用,点击禁用" onclick="ChangeDeviceUsableState(this,false);"><img src="../images/lock_small_unlocked.png" /></a>';
								} else {
									rowData[2] += '|<a title="此设备被禁用,点击恢复" onclick="ChangeDeviceUsableState(this,true);"><img src="../images/lock_small_locked.png" /></a>';
								}

								if (item["isConnect"]) {
									rowData[2] += '|<a title="远程连接,点击断开" onclick="ChangeDeviceConnectState(this,false)"><img src="../images/icn_op_remotemgmt.png" height="10px"/></a>';
								} else {
									rowData[2] += '|<a title="远程断开,点击连接" onclick="ChangeDeviceConnectState(this,true)"><img src="../images/icn_op_cancelremote.png" height="10px"/></a>';
								}
								rowData[2] += '|<a title="删除设备" onclick="DeleteDevice(this)"><img src="../images/cross.png" height="10px"/></a>';
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
//////////////////////////////////////////设备的禁用与恢复
function ChangeDeviceUsableState(obj, isUsable) {
	if (isUsable) {
		if (!confirm("当前设备已被禁用，确定要恢复此设备为可用状态？")) {
			return;
		}
	} else {
		if (!confirm("当前设备可用，确定要禁用此设备？")) {
			return;
		}
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
	param["isUsable"] = encodeURI(isUsable);
	param["random"] = newGuid();
	$("#DeviceListTable_Shadow").show();
	var url = "/servlet/ChangeDeviceUsableServlet" + GetURLParam(param);
	$.get(url, {
		Action : "get"
	}, function(data, textStatus) {
		if (textStatus != "success") {
			alert("请求错误！");
			$("#DeviceListTable_Shadow").hide();
			return;
		}

		if (data === "ERROR") {
			alert("后台发生错误！");
			$("#DeviceListTable_Shadow").hide();
			return;
		}
		try {
			var myobj = eval('(' + data + ')');
		} catch (Error) {
			alert("数据转换失败！");
			$("#DeviceListTable_Shadow").hide();
			return;
		}
		if (myobj == undefined) {
			alert("未获取到数据！");
			$("#DeviceListTable_Shadow").hide();
			return;
		}

		//修改此行==项目状态灯图标，操作图标，
			var firstTdImg = $(obj).parent().parent().children().first().find(
					"img");

			//更新状态灯
			if (myobj["state"] == "0") {
				firstTdImg.attr("src", "../images/ballyellow.png");
				firstTdImg.attr("alt", "设备禁用");
				firstTdImg.attr("title", "设备禁用");
			} else if (myobj["state"] == "1") {
				firstTdImg.attr("src", "../images/ballgreen.png");
				firstTdImg.attr("alt", "设备在线");
				firstTdImg.attr("title", "设备在线");

			} else if (myobj["state"] == "2") {
				firstTdImg.attr("src", "../images/ballblack.png");
				firstTdImg.attr("alt", "设备离线");
				firstTdImg.attr("title", "设备离线");
			}

			//更新操作图标
			if (isUsable) {
				$(obj).attr("title", "此设备可用,点击禁用");
				$(obj).attr("onclick", "ChangeDeviceUsableState(this,false)");
				$(obj).children().first().attr("src",
						"../images/lock_small_unlocked.png");
			} else {
				$(obj).attr("title", "此设备被禁用,点击恢复");
				$(obj).attr("onclick", "ChangeDeviceUsableState(this,true)");
				$(obj).children().first().attr("src",
						"../images/lock_small_locked.png");
			}

			$("#DeviceListTable_Shadow").hide();
			alert("操作成功！");
		});
}
///////////////////////////////////////////////设备注册与未注册
function ChangeDeviceRegisterState(obj, isRegister) {
	if (isRegister) {
		if (!confirm("当前设备未注册，确定要注册此设备？")) {
			return;
		}
	} else {
		if (!confirm("当前设备已注册，确定要将此设备修改为未注册？")) {
			return;
		}
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
	param["isRegister"] = encodeURI(isRegister);
	param["random"] = newGuid();
	$("#DeviceListTable_Shadow").show();
	var url = "/servlet/ChangeDeviceRegisterServlet" + GetURLParam(param);
	$
			.get(url, {
				Action : "get"
			}, function(data, textStatus) {
				if (textStatus != "success") {
					alert("请求错误！");
					$("#DeviceListTable_Shadow").hide();
					return;
				}

				if (data === "ERROR") {
					alert("后台发生错误！");
					$("#DeviceListTable_Shadow").hide();
					return;
				}
				try {
					var myobj = eval('(' + data + ')');
				} catch (Error) {
					alert("数据转换失败！");
					$("#DeviceListTable_Shadow").hide();
					return;
				}
				if (myobj == undefined) {
					alert("未获取到数据！");
					$("#DeviceListTable_Shadow").hide();
					return;
				}

				//修改此行==项目状态灯图标，操作图标，
					var firstTdImg = $(obj).parent().parent().children()
							.first().find("img");

					//更新状态灯
					if (myobj["state"] == "0") {
						firstTdImg.attr("src", "../images/ballyellow.png");
						firstTdImg.attr("alt", "设备禁用");
						firstTdImg.attr("title", "设备禁用");
					} else if (myobj["state"] == "1") {
						firstTdImg.attr("src", "../images/ballgreen.png");
						firstTdImg.attr("alt", "设备在线");
						firstTdImg.attr("title", "设备在线");

					} else if (myobj["state"] == "2") {
						firstTdImg.attr("src", "../images/ballblack.png");
						firstTdImg.attr("alt", "设备离线");
						firstTdImg.attr("title", "设备离线");
					}

					//更新操作图标
					if (isRegister) {
						$(obj).attr("title", "已注册,点击未注册");
						$(obj).attr("onclick",
								"ChangeDeviceRegisterState(this,false)");
						$(obj).children().first().attr("src",
								"../images/icn_op_reinstated.png");
					} else {
						$(obj).attr("title", "未注册,点击注册");
						$(obj).attr("onclick",
								"ChangeDeviceRegisterState(this,true)");
						$(obj).children().first().attr("src",
								"../images/icn_op_disabled.png");
					}

					$("#DeviceListTable_Shadow").hide();
					alert("操作成功！");
				});
}
////////////////////////////////////////////////////远程连接与断开
function ChangeDeviceConnectState(obj, isConnect) {
	var objParentTrId = $(obj).parent().parent().attr("id");
	if (objParentTrId === undefined)
		return;
	var guid = $("#" + objParentTrId).data("guid");
	if (guid === undefined || guid === "" || guid == null)
		return;

	if (isConnect) {
		if (!confirm("当前设备远程断开，确定将要远程连接此设备？")) {
			return;
		}
		//再询问是否强制断掉其他设备，让此台设备拥有远程权限
		var param = [];
		param["Guid"] = encodeURI(guid);
		param["random"] = newGuid();
		var url = "/servlet/DeviceConnectExistServlet" + GetURLParam(param);

		$.ajax( {
			async : false,//同步请求
			url : url,
			success : function(data, textStatus) {
				if (textStatus != "success") {
					return;
				}
				try {
					var myobj = eval('(' + data + ')');
				} catch (Error) {
					return;
				}
				if (myobj == undefined) {
					return;
				}
				if (myobj["deviceuuid"] != undefined
						&& myobj["deviceuuid"] != null
						&& myobj["deviceuuid"] != "") {
					if (!confirm("已有设备正在远程连接，是否仍要远程连接？选择确定强制断开正在连接的设备！")) {
						return;
					}
				}
				IsDeviceConnect(obj, guid, isConnect, myobj["deviceguid"]);
			},
			error : function() {
				//				alert("后台发生错误！");
		}
		});

	} else {
		//断开时直接断开
		if (!confirm("当前设备远程连接，确定将要断开此设备？")) {
			return;
		}
		IsDeviceConnect(obj, guid, isConnect);
	}

}
//由连接->断开  断开->连接
function IsDeviceConnect(obj, guid, isConnect,lastConDeviceGuid) {
	var param = [];
	param["Guid"] = encodeURI(guid);
	param["isConnect"] = encodeURI(isConnect);
	param["random"] = newGuid();
	$("#DeviceListTable_Shadow").show();
	var url = "/servlet/ChangeDeviceConnectServlet" + GetURLParam(param);
	$.get(url, {
		Action : "get"
	}, function(data, textStatus) {
		alert(data);
		if (textStatus != "success") {
			alert("请求错误！");
			$("#DeviceListTable_Shadow").hide();
			return;
		}

		if (data === "ERROR") {
			alert("后台发生错误！");
			$("#DeviceListTable_Shadow").hide();
			return;
		}

		//更新操作图标
			if (isConnect) {
				$(obj).attr("title", "远程连接,点击断开");
				$(obj).attr("onclick", "ChangeDeviceConnectState(this,false)");
				$(obj).children().first().attr("src",
						"../images/icn_op_remotemgmt.png");
			} else {
				$(obj).attr("title", "远程断开,点击连接");
				$(obj).attr("onclick", "ChangeDeviceConnectState(this,true)");
				$(obj).children().first().attr("src",
						"../images/icn_op_cancelremote.png");
			}

		    //如果是由断开->连接,而且是强制断开已有设备进行的连接,必须清除上一次连接设备的图标	
			if(lastConDeviceGuid!=undefined&&lastConDeviceGuid!=null&&lastConDeviceGuid!=""){
				//在列表中找到被强制断开的设备
			$("#DeviceListTable tbody tr").each(function(){
				if($(this).data("guid")==lastConDeviceGuid){
				 var lastTd= $(this).children().last();
				 var lastTdLastA=lastTd.children().last();
				lastTdLastA.attr("title", "远程断开,点击连接");
				lastTdLastA.attr("onclick", "ChangeDeviceConnectState(this,true)");
				lastTdLastA.children().first().attr("src",
						"../images/icn_op_cancelremote.png");
				}
			});
				
			}
			$("#DeviceListTable_Shadow").hide();
			alert("操作成功！");
		});
}
function DeleteDevice(obj) {
	var objParentTrId = $(obj).parent().parent().attr("id");
	if (objParentTrId === undefined)
		return;
	var guid = $("#" + objParentTrId).data("guid");
	if (guid === undefined || guid === "" || guid == null)
		return;

	if (!confirm("确定要删除该设备?")) {
		return;
	}
	//再询问是否强制断掉其他设备，让此台设备拥有远程权限
	var param = [];
	param["Guid"] = encodeURI(guid);
	param["random"] = newGuid();
	var url = "/servlet/DeleteDeviceServlet" + GetURLParam(param);

	$.ajax( {
		async : false,//同步请求
		url : url,
		success : function(data, textStatus) {
			if (textStatus != "success") {
				return;
			}
			try {
				var myobj = eval('(' + data + ')');
			} catch (Error) {
				return;
			}
			if (myobj == undefined) {
				return;
			}
			if (myobj["state"] =="success"){
				alert("Operate successful");
			}
		},
		error : function() {
			alert("Operate failure！");
	}
	});
    DeviceListTable_AJAX();
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
			$("#deviceType").val("");
			ClearInputText();
			$("#detailOwnProject").val($(this).val());//select同步
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