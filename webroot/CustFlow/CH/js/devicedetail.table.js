function SeeDevDetail(obj) {

	var objParentTrId = $(obj).parent().attr("id");
	//		alert(objParentTrId);
	if (objParentTrId === undefined)
		return;
	var guid = $("#" + objParentTrId).data("guid");
	//	alert(guid);
	if (guid === undefined || guid === null)
		return;

	var fromtable = $("#" + objParentTrId).data("other");
	if (fromtable === undefined || fromtable === null)
		return;

	$("#DeviceDetailTable_Shadow").show();
	$("#DeviceDetailTable_Error").hide();
	$("#DeviceDetailTable_Errordiv").remove();

	ClearInputText();
	$("#modifyBtn").html("修改");
	devInputStatusChangeReadOnly(true);//所有数据只读不可写
	selectDisabledReadOnly("ownDeviceType", true);

	$("#deviceGuid").val(guid);
	$("#deviceType").val(fromtable);
	$("#ownDeviceType").val(fromtable);

	$("#modifyBtn").html("修改");
	$("#addBtn").show();
	$("#cancelBtn").hide();

	var param = [];
	param["Guid"] = encodeURI(guid);
	param["FromTable"] = encodeURI(fromtable);
	param["random"] = newGuid();

	var url = "/servlet/DevDetailServlet" + GetURLParam(param);
	//alert(url);
	PostDetailServlet(url);
}
//点击详细信息时报错了刷新执行操作
function seeDevDetailRefresh() {
	var guid = $("#deviceGuid").val();
	if (guid === undefined || guid === null)
		return;
	$("#DeviceDetailTable_Shadow").show();
	$("#DeviceDetailTable_Error").hide();
	$("#DeviceDetailTable_Errordiv").remove();
	ClearInputText();
	$("#modifyBtn").html("修改");
	devInputStatusChangeReadOnly(true);//所有数据只读不可写
	selectDisabledReadOnly("ownDeviceType", true);

	var param = [];
	param["Guid"] = encodeURI(guid);
	param["FromTable"] = encodeURI($("#deviceType").val());
	param["random"] = newGuid();

	var url = "/servlet/DevDetailServlet" + GetURLParam(param);
	//	alert(url);
	PostDetailServlet(url);
}
function PostDetailServlet(url) {
	$
			.get(url,
					{
						Action : "get"
					},
					function(data, textStatus) {
						//						alert(textStatus);
					if (textStatus != "success") {
						$("#DeviceDetailTable_Shadow").hide();
						$("#DeviceDetailTable_Error").show();
						$("#DeviceDetailTable_Error")
								.append(
										"<div id='DeviceDetailTable_Errordiv'>请求错误!!</br>请<a href='javascript:seeDevDetailRefresh();'class='pagecolor'>刷新</a></div>");
						//alert("请求错误,请刷新");
						return;
					}
					//data = "ERROR";
					if (data === "ERROR") {
						$("#DeviceDetailTable_Shadow").hide();
						$("#DeviceDetailTable_Error").show();
						$("#DeviceDetailTable_Error")
								.append(
										"<div id='DeviceDetailTable_Errordiv'>后台发生错误!!</br>请<a href='javascript:seeDevDetailRefresh();'class='pagecolor'>刷新</a></div>");
						//alert("后台发生错误,请刷新");
						return;
					}
					try {
						var myobj = eval('(' + data + ')');
					} catch (Error) {
						$("#DeviceDetailTable_Shadow").hide();
						$("#DeviceDetailTable_Error").show();
						$("#DeviceDetailTable_Error")
								.append(
										"<div id='DeviceDetailTable_Errordiv'>数据转换失败,格式不正确!!</br>请<a href='javascript:seeDevDetailRefresh();'class='pagecolor'>刷新</a></div>");
						//alert("数据转换失败,格式不正确，请刷新!");
						return;
					}
					if (myobj == undefined) {
						$("#DeviceDetailTable_Shadow").hide();
						$("#DeviceDetailTable_Error").show();
						$("#DeviceDetailTable_Error")
								.append(
										"<div id='DeviceDetailTable_Errordiv'>未获取到数据!!</br>请<a href='javascript:seeDevDetailRefresh();'class='pagecolor'>刷新</a></div>");
						//alert("未获取到数据！请刷新");
						return;
					}

					for ( var i in myobj) {
						//								alert("i:" + i);
						var id = "#" + i;
						var dom = $(id);
						if (myobj[i] != undefined && dom != undefined)
							dom.val(myobj[i]);
					}
					$("#DeviceDetailTable_Shadow").hide();
				});
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
	$("#DeviceDetailTable input").attr( {
		readonly : flag
	});

	$("#DeviceDetailTable textarea").attr( {
		readonly : flag
	});

	$("#addTime").attr("disabled", true);

	//设置不可用时input底色变灰色（浏览器兼容）
	InputDisabledCss(flag);
	//设置input框可用：
	//1.$("#input").attr("disabled",true) 
	//2.$("#input").removeAttr("disabled") 
	//3.$("#input").attr("disabled","")
	//设置input框不可用：
	//1.$("#input").attr("disabled",false)
	//2.$("#input").attr("disabled","disabled")
}
//设置不可用时input底色变灰色（浏览器兼容）
function InputDisabledCss(flag) {
	if (flag === undefined || flag == null)
		return;
	if (flag) {
		$("#DeviceDetailTable input").addClass("inputDisabled");
		$("#DeviceDetailTable textarea").addClass("inputDisabled");

	} else {
		$("#DeviceDetailTable input").removeClass("inputDisabled");
		$("#DeviceDetailTable textarea").removeClass("inputDisabled");
	}
	$("#addTime").addClass("inputDisabled");
}
//单独控制设备类型，修改时也不可用，只有在添加时可用
function selectDisabledReadOnly(selectId, isReadOnly) {
	if (isReadOnly === undefined || isReadOnly == null)
		return;
	$("#" + selectId).attr("disabled", isReadOnly);
	if (isReadOnly) {
		$("#" + selectId).addClass("inputDisabled");
	} else {
		$("#" + selectId).removeClass("inputDisabled");
	}

}
//单独控制设备DataGuid只有在修改时可用
function dataGuidDisabledReadOnly(selectId, isReadOnly) {
	if (isReadOnly === undefined || isReadOnly == null)
		return;
	$("#" + selectId).attr( {
		readonly : isReadOnly
	});
	if (isReadOnly) {
		$("#" + selectId).addClass("inputDisabled");
	} else {
		$("#" + selectId).removeClass("inputDisabled");
	}

}

//清空右边详细信息的数据
function ClearInputText() {
	$("#deviceName").val("");
	$("#ownDeviceType").val("");
	$("#deviceDetailInfo").val("");
	$("#deviceDescription").val("");
	$("#dataGUID").val("");
	$("#deviceUUID").val("");
	$("#addTime").val("");

	$("#deviceGuid").val("");
	$("#deviceType").val("");
}
function ClickAddBtn() {

	var ownProject = $("#detailOwnProject").val();
	if (ownProject == "-1") {
		alert("请先选择所属项目,无法添加！");
		return;
	}

	$("#cancelBtn").show();
	$("#addBtn").hide();

	$("#DeviceDetailTable_Shadow").hide();
	$("#DeviceDetailTable_Error").hide();
	ClearInputText();

	devInputStatusChangeReadOnly(false);
	selectDisabledReadOnly("ownDeviceType", false);
	dataGuidDisabledReadOnly("dataGUID", true);
	$("#modifyBtn").html("保存");
}

//点击取消所触发的事件（如果是新建，取消就是清空所有值，如果是修改，取消就是还原默认值）
function ClickCancel() {

    $("#cancelBtn").hide();
    $("#addBtn").show();

    $("#DeviceDetailTable_Shadow").hide();
    $("#DeviceDetailTable_Error").hide();

    ClearInputText();
    devInputStatusChangeReadOnly(false);//所有数据可写
    selectDisabledReadOnly("ownDeviceType", true);
    InputDisabledCss(true);
    $("#modifyBtn").html("修改");
}
//录入信息和GUID等信息
function ModifyDeviceChange() {
    //alert("修改");
    $("#addBtn").hide();
    $("#cancelBtn").show();

	var deviceGuid = $("#deviceGuid").val();//已经点击了查看详细链接
	if ($("#modifyBtn").html() == "修改") {
		if (deviceGuid === undefined || deviceGuid === null
				|| deviceGuid === "") {
			alert("您没有选择要修改的条目，请先选择！");
			return;
		}
		devInputStatusChangeReadOnly(false);//所有数据可写
		$("#dataGUID").attr({
		    readonly: true
		});
		$("#dataGUID").addClass("inputDisabled");
		selectDisabledReadOnly("ownDeviceType", true);

		$("#addTime").attr("disabled", false);
		$("#addTime").removeClass("inputDisabled");//只有在修改时纳入时间可用
		//alert($("#modifyBtn").html());
		//alert(deviceGuid);
		$("#modifyBtn").html("保存");
	} else if ($("#modifyBtn").html() == "保存") {
		if (!confirm("确定要保存这条信息？")) {
			return;
		}
		var strName = $("#deviceName").val();
		if (strName == undefined || strName == null || strName == "") {
			alert("您没有填写设备名，无法保存！");
			return;
		}
		var ownProject = $("#detailOwnProject").val();
		if (ownProject == "-1") {
			alert("请先选择所属项目,无法保存！");
			return;
		}

		var deviceUUID = $("#deviceUUID").val();
		if (deviceUUID === undefined || deviceUUID === null
				|| deviceUUID === "") {
		    alert("您没有填写设备UUID，无法保存！");
		    return;
		}

		var param = [];
		param["guid"] = deviceGuid;
		param["deviceName"] = encodeURI(strName);
		param["ownDeviceType"] = encodeURI($("#ownDeviceType").val());
		param["dataGUID"] = encodeURI($("#dataGUID").val());
		param["deviceUUID"] = encodeURI(deviceUUID);
		param["deviceDescription"] = encodeURI($("#deviceDescription").val());
		param["deviceDetailInfo"] = encodeURI($("#deviceDetailInfo").val());
		param["ownProject"] = encodeURI(ownProject);

		param["addTime"] = encodeURI($("#addTime").val());
		param["random"] = newGuid();
		//	$("#DeviceDetailTable_Errordiv").remove();
		$("#DeviceDetailTable_Shadow").show();
		var url = "/servlet/AddDeviceServlet" + GetURLParam(param);
		//alert(url);
		$.get(url, {
			Action : "get"
		}, function(data, textStatus) {
			//			alert(textStatus);
				//			alert(data);
				if (textStatus != "success") {
					$("#DeviceDetailTable_Shadow").hide();
					//					$("#DeviceDetailTable_Error").show();
				//					$("#DeviceDetailTable_Error").append("<div id='DeviceDetailTable_Errordiv'>请求错误!操作失败!</br>请<a href='javascript:seeDevDetailRefresh();'class='pagecolor'>刷新</a></div>");
				alert("请求错误,保存失败!");
				return;
			}
						//alert(data);
			if (data === "SUCCESS") {
				$("#DeviceDetailTable_Shadow").hide();
				alert("保存成功!");
				$("#modifyBtn").html("修改");
				$("#addBtn").show();
				$("#cancelBtn").hide();
				ClearInputText();
				devInputStatusChangeReadOnly(true);//所有数据可读不可写
				selectDisabledReadOnly("ownDeviceType", true);

				//若有查询条件，添加后要清除
				$("#queryDeviceName").val("");
				$("#ownProject").val($("#detailOwnProject").val());
				//如果是新增，则需要刷新数据库
				DeviceListTable_AJAX();
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
}

$(function() {
	var shadowCSS = [];
	shadowCSS["width"] = $("#DeviceDetailTable").width();
	shadowCSS["height"] = $("#DeviceDetailTable").height();
	$("#DeviceDetailTable_Shadow").css(shadowCSS);
	$("#DeviceDetailTable_Error").css(shadowCSS);

	$("#DeviceDetailTable_Shadow").hide();
	$("#DeviceDetailTable_Error").hide();

	$("#cancelBtn").hide();
	//默认点击只读不可用
	InputDisabledCss(true);
});
