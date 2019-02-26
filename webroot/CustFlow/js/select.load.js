//从所有可选设备中去除已选设备
function firstRemoveAlready(LstLeftId, LstRightId) {
	$("#" + LstRightId + " option").each(function() {
		//		alert($(this).val());
			$("#" + LstLeftId + " option[value='" + $(this).val() + "']")
					.remove();
		});
}
//加入到已选设备
function leftAddToRight(LstLeftId, LstRightId) {
	var leftArray = {};
	//	$("#" + LstLeftId).find("option:selected").text();//获取选择的text
	leftArray = $("#" + LstLeftId).val();//获取选择的value,多选以,分隔的数组

	for ( var i in leftArray) {
		//		alert(leftArray[i]);
		//先将左边的加入到右边
		$("#" + LstRightId).append(
				"<option value="
						+ leftArray[i]
						+ ">"
						+ $(
								"#" + LstLeftId + " option[value='"
										+ leftArray[i] + "']").text()
						+ "</option>");
		//然后删除左边的
		$("#" + LstLeftId + " option[value='" + leftArray[i] + "']").remove();
	}
	//新加入的程选中状态
	$("#" + LstRightId).val(leftArray);
}
//移除已选设备
function rightAddToLeft(LstLeftId, LstRightId) {
	var rightArray = {};
	rightArray = $("#" + LstRightId).val();

	for ( var i in rightArray) {
		//先将右边的加入到左边
		$("#" + LstLeftId).append(
				"<option value="
						+ rightArray[i]
						+ ">"
						+ $(
								"#" + LstRightId + " option[value='"
										+ rightArray[i] + "']").text()
						+ "</option>");
		//然后删除右边的
		$("#" + LstRightId + " option[value='" + rightArray[i] + "']").remove();
	}
	//新加入的程选中状态
	$("#" + LstLeftId).val(rightArray);
}
//动态加载设备列表(分真实虚拟)
function LoadVirtualType(LstId, proguid, device_type) {
    var List = $("#" + LstId);
    var param = [];
    param["proguid"] = encodeURI(proguid);
    param["random"] = newGuid();
    param["device_type"] = device_type;
    var url = "/servlet/GetDeviceTypeServlet" + GetURLParam(param);
    $.get(url, {
        Action: "get"
    }, function (data, textStatus) {
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
		for (var i in myobj) {

		    if (myobj[i]["isvirtual"] == "\u0000")
		        continue;
            var option = "<option value=" + myobj[i]["guid"] + " id=" + myobj[i]["guid"] + ">"
                    + myobj[i]["name"] + "</option>";
            List.append(option);
            SetSelectDeviceVirtual($("#" + myobj[i]["guid"]), myobj[i]["isvirtual"]);
            //				alert($("#"+myobj[i]["guid"]).data("isvirtual"));
        }
    });
}

//动态加载销售列表
function LoadSalesDevice(LstId, proguid,device_type) {

    var List = $("#" + LstId);
    var param = [];
    param["proguid"] = encodeURI(proguid);
    param["random"] = newGuid();
    param["device_type"] = device_type;
    var url = "/servlet/GetDeviceTypeServlet" + GetURLParam(param);
    $.get(url, {
        Action: "get"
    }, function (data, textStatus) {
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
		for (var i in myobj) {
		    if (myobj[i]["issale"] !== "\u0001" )
		        continue;
            var option = "<option value=" + myobj[i]["guid"] + " id=" + myobj[i]["guid"] + ">"
                    + myobj[i]["name"] + "</option>";
            List.append(option);
            SetSelectDeviceVirtual($("#" + myobj[i]["guid"]), myobj[i]["isvirtual"]);
            //				alert($("#"+myobj[i]["guid"]).data("isvirtual"));
        }
    });
}

//动态加载设备列表(不分真实虚拟)
function LoadDeviceType(LstId,proguid,device_type) {

	var List = $("#" + LstId);
	var param = [];
	param["proguid"] = encodeURI(proguid);
	param["random"] = newGuid();
	param["device_type"] = device_type;
	var url = "/servlet/GetDeviceTypeServlet" + GetURLParam(param);
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
		for (var i in myobj) {

				var option = "<option value=" + myobj[i]["guid"] + " id=" + myobj[i]["guid"] + ">"
						+ myobj[i]["name"] + "</option>";

				if (myobj[i]["isvirtual"] == "\u0001")
				    option = "<option value=" + myobj[i]["guid"] + " id=" + myobj[i]["guid"] + ">"
						+ myobj[i]["name"]+"->>>-Area" + "</option>";

				List.append(option);
				SetSelectDeviceVirtual($("#"+myobj[i]["guid"]), myobj[i]["isvirtual"]);
//				alert($("#"+myobj[i]["guid"]).data("isvirtual"));
			}
		});
}
function SetSelectDeviceVirtual(colObj, isvirtual) {
	if (colObj === undefined)
		return;
	if (isvirtual === undefined)
		colObj.removeData("isvirtual");
	else
		colObj.data("isvirtual", isvirtual);
}
//动态加载项目列表
function LoadProjectType(LstId) {
	var List = $("#" + LstId);
    var param = [];
	param["EN"] = 1;
	var url="/servlet/GetProjectTypeServlet"+ GetURLParam(param)
	List.load(url, function() {

	});
	//	List.append('<option value="' + incomeJson.catId + '" selected="selected">'
	//			+ str + '</option>');
}
//动态加载虚拟设备列表
function LoadVirtualDeviceType(LstId) {
	var List = $("#" + LstId);
	var param = [];
	param["proguid"] = getcookievalue("UserProGuid");
	param["random"] = newGuid();
	var url = "/servlet/GetVirtualDeviceTypeServlet" + GetURLParam(param);
	List.load(url, function() {

	});
}
//获取某个项目的项目设备
function LoadProjectDevice(proguid,device_type) {
	if (proguid == undefined) {
		return;
	}
	var param = [];
	param["proguid"] = encodeURI(proguid);
    param["device_type"] = device_type;
	param["random"] = newGuid();
	var url = "/servlet/GetProjectDeviceServlet" + GetURLParam(param);
	$.get(url, {
		Action : "get"
	}, function(data, textStatus) {
		if (textStatus != "success") {
			alert("Failed to get project device！");
			return;
		}
		if (data === "ERROR") {
			alert("Failed to get project device！");
			return;
		}
		try {
			var myobj = eval('(' + data + ')');
		} catch (Error) {
			alert("Failed to get project device！");
			return;
		}
		if (myobj == undefined) {
			alert("Failed to get project device！Please go to the virtual equipment page and select the counter device！");
			return;
		}

        if(device_type == "device_cust")
            $("#deviceGuid").val(myobj["guid"]);

        if(device_type == "device_age")
            $("#agedeviceGuid").val(myobj["guid"]);

        //alert($("#deviceGuid").val());
	//SetSelectDeviceVirtual($("#deviceGuid"), myobj["isvirtual"]);

	});
}
