function SeeDevDetail(obj) {

	var objParentTrId = $(obj).parent().attr("id");
	//		alert(objParentTrId);
	if (objParentTrId === undefined)
		return;
	var guid = $("#" + objParentTrId).data("guid");
	//	alert(guid);
	if (guid === undefined || guid === null)
		return;
	var dataguid = $("#" + objParentTrId).data("dataguid");
	if (dataguid === undefined || dataguid === null)
		return;
	//var fromtable = $("#" + objParentTrId).data("other");
    //alert(fromtable);
	//if (fromtable === undefined || fromtable === null)
	//	return;
	$("#DeviceDetailTable_Shadow").show();
	$("#DeviceDetailTable_Error").hide();
	$("#DeviceDetailTable_Errordiv").remove();

	ClearInputText();
	$("#modifyBtn").html("Modify");
	devInputStatusChangeReadOnly(true);//所有数据只读不可写
	$("#deviceGuid").val(guid);
	//$("#deviceType").val(fromtable);
	$("#isProjectDevice").val(dataguid);

	var param = [];
	param["Guid"] = encodeURI(guid);
	param["FromTable"] = encodeURI($("#deviceType").val());
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
	$("#modifyBtn").html("Modify");
	devInputStatusChangeReadOnly(true);//所有数据只读不可写

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
										"<div id='DeviceDetailTable_Errordiv'>Error!!</br>Please<a href='javascript:seeDevDetailRefresh();'class='pagecolor'>refresh the page</a></div>");
						//alert("请求错误,请刷新");
						return;
					}
					//data = "ERROR";
					if (data === "ERROR") {
						$("#DeviceDetailTable_Shadow").hide();
						$("#DeviceDetailTable_Error").show();
						$("#DeviceDetailTable_Error")
								.append(
										"<div id='DeviceDetailTable_Errordiv'>Background support run error!!</br>Please<a href='javascript:seeDevDetailRefresh();'class='pagecolor'>refresh the page</a></div>");
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
										"<div id='DeviceDetailTable_Errordiv'>Data conversion failed, wrong page format!!</br>Please<a href='javascript:seeDevDetailRefresh();'class='pagecolor'>refresh the page</a></div>");
						//alert("数据转换失败,格式不正确，请刷新!");
						return;
					}
					if (myobj == undefined) {
						$("#DeviceDetailTable_Shadow").hide();
						$("#DeviceDetailTable_Error").show();
						$("#DeviceDetailTable_Error")
								.append(
										"<div id='DeviceDetailTable_Errordiv'>Data accessing failed!!</br>Please<a href='javascript:seeDevDetailRefresh();'class='pagecolor'>refresh the page</a></div>");
						//alert("未获取到数据！请刷新");
						return;
					}

					for ( var i in myobj) {
						var id = "#" + i;
						var dom = $(id);
						if (myobj[i] != undefined && dom != undefined)
							dom.val(myobj[i]);
					}
					if (myobj["isProject"]) {
					    $("#isProjectDevice").attr("checked", true);
					}
					if (myobj["isSalesDevice"] == "\u0001") {
					    $("#isSalesDevice").attr("checked", true);
					}
					LoadDeviceListType("alternativeDevice", "alreadyDevice");

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

	$("#alreadyDevice").attr("disabled", flag);
	$("#alternativeDevice").attr("disabled", flag);

	$("#addTime").attr("disabled", true);
	$("#isProjectDevice").attr("disabled", flag);
	$("#isSalesDevice").attr("disabled", flag);
	//$("#isSexDevice").attr("disabled", flag);

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
		$("#alreadyDevice").addClass("inputDisabled");
		$("#alternativeDevice").addClass("inputDisabled");
		$("#DeviceDetailTable textarea").addClass("inputDisabled");

	} else {
		$("#DeviceDetailTable input").removeClass("inputDisabled");
		$("#alreadyDevice").removeClass("inputDisabled");
		$("#alternativeDevice").removeClass("inputDisabled");
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
//清空右边详细信息的数据
function ClearInputText() {
	$("#deviceName").val("");
	$("#deviceDescription").val("");
	$("#deviceDetailInfo").val("");
	$("#alternativeDevice").empty();//内容清空
	$("#alreadyDevice").empty();
	$("#isProjectDevice").attr("checked", false);
    //$("#isSexDevice").attr("checked", false);
    $("#isSalesDevice").attr("checked", false);
	$("#addTime").val("");
}
function ClickAddBtn() {
	var ownProject = $("#detailOwnProject").val();
	if (ownProject == "-1") {
		alert("Please select the subordinated item first！");
		return;
	}
    $("#cancelBtn").show();
    $("#addBtn").hide();
	$("#DeviceDetailTable_Shadow").hide();
	$("#DeviceDetailTable_Error").hide();
	ClearInputText();
	$("#deviceGuid").val("");
	//$("#deviceType").val("device_cust");
	$("#isProjectDevice").val("");
	//$("#isSexDevice").val("");
    $("#isSalesDevice").val("");
	devInputStatusChangeReadOnly(false);

	addLoadDeviceListType("alternativeDevice", "alreadyDevice");
	
	$("#modifyBtn").html("Save");
}

//点击取消所触发的事件（如果是新建，取消就是清空所有值，如果是修改，取消就是还原默认值）
function ClickCancel() {
    $("#cancelBtn").hide();
    $("#addBtn").show();

	$("#DeviceDetailTable_Shadow").hide();
	$("#DeviceDetailTable_Error").hide();
	//if ($("#modifyBtn").html() == "保存") {
	//	if ($("#deviceGuid").val() == undefined
	//			|| $("#deviceGuid").val() == null
	//			|| $("#deviceGuid").val() == "") {
	//		//alert("新增取消");
	//		ClickAddBtn();
    //	} else {

	ClearInputText();
	var param = [];
	if ($("#deviceGuid").val() != "") {
	    param["Guid"] = encodeURI($("#deviceGuid").val());
	    param["FromTable"] = encodeURI($("#deviceType").val());
	    param["random"] = newGuid();
	    var url = "/servlet/DevDetailServlet" + GetURLParam(param);
	    PostDetailServlet(url);
	}
	InputDisabledCss(true);
	$("#modifyBtn").html("Modify");
			//alert("修改取消");
	//	}
	//}
}
//录入信息和GUID等信息
function ModifyDeviceChange() {
    //alert("修改");
    $("#addBtn").hide();
    $("#cancelBtn").show();

	var deviceGuid = $("#deviceGuid").val();//已经点击了查看详细链接
	if ($("#modifyBtn").html() == "Modify") {
		if (deviceGuid === undefined || deviceGuid === null
				|| deviceGuid === "") {
		    alert("Items to be modified are null！");
        $("#addBtn").show();
        $("#cancelBtn").hide();
			return;
		}
		devInputStatusChangeReadOnly(false);//所有数据可写

		$("#addTime").attr("disabled", false);
		$("#addTime").removeClass("inputDisabled");//只有在修改时纳入时间可用

		//alert($("#modifyBtn").html());
		//alert(deviceGuid);
		$("#modifyBtn").html("Save");
	} else if ($("#modifyBtn").html() == "Save") {
		if (!confirm("Do you want to save this information?")) {
			return;
		}
		var strName = $("#deviceName").val();
		if (strName == undefined || strName == null || strName == "") {
			alert("You didn't fill the device name，Save failed！");
			return;
		}
		var ownProject = $("#detailOwnProject").val();
		if (ownProject == "-1") {
			alert("Please select the subordinated item first,Save failed！");
			return;
		}
		var param = [];
		param["guid"] = deviceGuid;
		param["deviceName"] = encodeURI(strName);
		param["FromTable"] = encodeURI($("#deviceType").val());

		var alreadyDeviceArr = '';
		$("#alreadyDevice option").each(function() {
			alreadyDeviceArr += $(this).val() + ',';
		});
		if (alreadyDeviceArr != '') {
			alreadyDeviceArr = alreadyDeviceArr.substr(0,
					alreadyDeviceArr.length - 1);//去掉,
		}
		param["ownProject"] = encodeURI(getcookievalue("UserProGuid"));
		param["alreadyDevice"] = encodeURI(alreadyDeviceArr);
		param["deviceDescription"] = encodeURI($("#deviceDescription").val());
		param["deviceDetailInfo"] = encodeURI($("#deviceDetailInfo").val());

		if ($("#isProjectDevice").attr("checked") == true
				|| $("#isProjectDevice").attr("checked") == 'checked')
			param["isProjectDevice"] = true;
		else
		    param["isProjectDevice"] = false;

                        //是否添加销售数据
		if ($("isSalesDevice").attr("checked") == true
                || $("#isSalesDevice").attr("checked") == 'checked')
		    param["isSalesDevice"] = true;
		else
		    param["isSalesDevice"] = false;

		param["addTime"] = encodeURI($("#addTime").val());
		param["random"] = newGuid();
		//	$("#DeviceDetailTable_Errordiv").remove();
		$("#DeviceDetailTable_Shadow").show();
		var url = "/servlet/AddVirtualDeviceServlet" + GetURLParam(param);
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
				alert("Request error, save failed!");
				return;
			}
			//			alert(data);
			if (data === "SUCCESS") {
				$("#DeviceDetailTable_Shadow").hide();
				alert("Save successful!");
				$("#modifyBtn").html("Modify");
				$("#addBtn").show();
                $("#cancelBtn").hide();
				devInputStatusChangeReadOnly(true);//所有数据可读不可写

				//若有查询条件，添加后要清除
				$("#queryDeviceName").val("");
				$("#ownProject").val($("#detailOwnProject").val());

				//如果是新增，则需要刷新数据库
				DeviceListTable_AJAX();
			} else {
				$("#DeviceDetailTable_Shadow").hide();
				if (data === "UNIQUEERROR") {
					alert("Background run error, device UID is not unique, save failed!");
				} else if (data === "UNIQUENAMEERROR") {
					alert("Background run error,Device name is not unique , save failed!");
				} else {
                    alert("Background run error,save failed!");
                }
				return;
			}
		});
	}
}
//动态加载所有的可添加备选设备列表以及**虚拟设备已经添加的所有设备
function LoadDeviceListType(LstLeftId, LstRightId) {
	var ListLeft = $("#" + LstLeftId);
	var param = [];
	//	param["proguid"] = Request.QueryString("proguid");

	param["proguid"] = encodeURI(getcookievalue("UserProGuid"));
    param["strFromTable"] = encodeURI("device_cust");
	var ListRight = $("#" + LstRightId);
	param["virtualguid"] = $("#isProjectDevice").val();
	param["random"] = newGuid();

	var url = "/servlet/GetRightLeftDeviceServlet" + GetURLParam(param);
	$.get(url, {
		Action : "get"
	}, function(data, textStatus) {
		if (textStatus != "success") {
			return;
		}
		if (data === "ERROR") {
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
		//根据返回的数组创建options
			for ( var i in myobj["alternativeDevice"]) {
				//			List.add(new Option(myobj[i]["guid"], myobj[i]["name"]));
			if (myobj["alternativeDevice"][i]["isvirtual"] == "\u0001")
			       ListLeft.append("<option value="
					+ myobj["alternativeDevice"][i]["guid"] + ">"
					+ myobj["alternativeDevice"][i]["name"] +"->>>-Area" + "</option>");
                        else
			ListLeft.append("<option value="
					+ myobj["alternativeDevice"][i]["guid"] + ">"
					+ myobj["alternativeDevice"][i]["name"] + "</option>");
		}
		for ( var i in myobj["alreadyDevice"]) {
			if (myobj["alreadyDevice"][i]["isvirtual"] == "\u0001")
			       ListLeft.append("<option value="
					+ myobj["alreadyDevice"][i]["guid"] + ">"
					+ myobj["alreadyDevice"][i]["name"] +"->>>-Area" + "</option>");
			else
				ListRight.append("<option value="
					+ myobj["alreadyDevice"][i]["guid"] + ">"
					+ myobj["alreadyDevice"][i]["name"] + "</option>");
			//从所有可选设备中去除已选设备
			$(
					"#" + LstLeftId + " option[value='"
							+ myobj["alreadyDevice"][i]["guid"] + "']")
					.remove();
		}
		//同时限制自己不能选自己为虚拟设备，否则会死循环，循环计算包含多少个真实设备时

	});

}
//新建的特殊情况
function addLoadDeviceListType(LstLeftId, LstRightId) {
	var ListLeft = $("#" + LstLeftId);
	var param = [];
	//	param["proguid"] = Request.QueryString("proguid");

	param["proguid"] = encodeURI(getcookievalue("UserProGuid"));
    param["strFromTable"] = encodeURI("device_cust");
	var ListRight = $("#" + LstRightId);
	param["virtualguid"] = $("#isProjectDevice").val();

	param["random"] = newGuid();

	var url = "/servlet/GetRightLeftDeviceServlet" + GetURLParam(param);
	$.get(url, {
		Action : "get"
	}, function(data, textStatus) {
		if (textStatus != "success") {
			return;
		}
		if (data === "ERROR") {
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
		//根据返回的数组创建options
			for ( var i in myobj["alternativeDevice"]) {
				//			List.add(new Option(myobj[i]["guid"], myobj[i]["name"]));

			if (myobj["alternativeDevice"][i]["isvirtual"] == "\u0001")
			       ListLeft.append("<option value="
					+ myobj["alternativeDevice"][i]["guid"] + ">"
					+ myobj["alternativeDevice"][i]["name"] +"->>>-区域" + "</option>");
                        else
			ListLeft.append("<option value="
					+ myobj["alternativeDevice"][i]["guid"] + ">"
					+ myobj["alternativeDevice"][i]["name"] + "</option>");
		}
	});

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
    $("#deviceType").val("device_cust");
	//默认点击只读不可用
	InputDisabledCss(true);

	$("#toRightImg").bind("click", function() {
		leftAddToRight("alternativeDevice", "alreadyDevice");
	});
	$("#toLeftImg").bind("click", function() {
		rightAddToLeft("alternativeDevice", "alreadyDevice");
		;
	});

	//绑定勾选项目设备事件
	$("#DeviceDetailTable :checkbox").click(function() {
		//				alert($(this).val());
			//				if ($(this).attr("checked") == true
			//						|| $(this).attr("checked") == 'checked') {
			//					alert("已选");
			//				} 
		});
});
