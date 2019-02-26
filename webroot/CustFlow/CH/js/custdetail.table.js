function SeeCustDetail(obj) {

	var objParentTrId = $(obj).parent().attr("id");
	//		alert(objParentTrId);
	if (objParentTrId === undefined)
		return;
	var guid = $("#" + objParentTrId).data("guid");
	//	alert(guid);
	if (guid === undefined || guid === null)
		return;

	$("#CustDetailTable_Shadow").show();
	$("#CustDetailTable_Error").hide();
	$("#CustDetailTable_Errordiv").remove();

	ClearInputText();
	$("#modifyBtn").html("修改");
	custInputStatusChangeReadOnly(true);//所有数据只读不可写
	$("#custGuid").val(guid);

	var param = [];
	param["Guid"] = encodeURI(guid);
	param["random"] = newGuid();

	var url = "/servlet/CustDetailServlet" + GetURLParam(param);
	//alert(url);
	PostDetailServlet(url);

	$("#modifyBtn").show();
	$("#addBtn").show();
	$("#cancelBtn").hide();
}
//点击详细信息时报错了刷新执行操作
function seeCustDetailRefresh() {
	var guid = $("#custGuid").val();
	if (guid === undefined || guid === null)
		return;
	$("#CustDetailTable_Shadow").show();
	$("#CustDetailTable_Error").hide();
	$("#CustDetailTable_Errordiv").remove();
	ClearInputText();
	$("#custGuid").val(guid);
	$("#modifyBtn").html("修改");
	custInputStatusChangeReadOnly(true);//所有数据只读不可写

	var param = [];
	param["Guid"] = encodeURI(guid);
	param["random"] = newGuid();

	var url = "/servlet/CustDetailServlet" + GetURLParam(param);
	//alert(url);
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
						$("#CustDetailTable_Shadow").hide();
						$("#CustDetailTable_Error").show();
						$("#CustDetailTable_Error")
								.append(
										"<div id='CustDetailTable_Errordiv'>请求错误!!</br>请<a href='javascript:seeCustDetailRefresh();'class='pagecolor'>刷新</a></div>");
						//alert("请求错误,请刷新");
						return;
					}
					//data = "ERROR";
					if (data === "ERROR") {
						$("#CustDetailTable_Shadow").hide();
						$("#CustDetailTable_Error").show();
						$("#CustDetailTable_Error")
								.append(
										"<div id='CustDetailTable_Errordiv'>后台发生错误!!</br>请<a href='javascript:seeCustDetailRefresh();'class='pagecolor'>刷新</a></div>");
						//alert("后台发生错误,请刷新");
						return;
					}
					try {
						var myobj = eval('(' + data + ')');
					} catch (Error) {
						$("#CustDetailTable_Shadow").hide();
						$("#CustDetailTable_Error").show();
						$("#CustDetailTable_Error")
								.append(
										"<div id='CustDetailTable_Errordiv'>数据转换失败,格式不正确!!</br>请<a href='javascript:seeCustDetailRefresh();'class='pagecolor'>刷新</a></div>");
						//alert("数据转换失败,格式不正确，请刷新!");
						return;
					}
					if (myobj == undefined) {
						$("#CustDetailTable_Shadow").hide();
						$("#CustDetailTable_Error").show();
						$("#CustDetailTable_Error")
								.append(
										"<div id='CustDetailTable_Errordiv'>未获取到数据!!</br>请<a href='javascript:seeCustDetailRefresh();'class='pagecolor'>刷新</a></div>");
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
					$("#CustDetailTable_Shadow").hide();
				});
}
//更改Input的只读属性
function custInputStatusChangeReadOnly(flag) {
	//$("#id").attr("readonly","readonly");    
	//添加readonly属性 
	// $("#ID").attr({ readonly: 'true' });
	//$("#id").removeAttr("readonly");    //去除readonly属性
	//	alert(flag);
	if (flag === undefined || flag == null)
		return;
	$("#CustDetailTable input").attr( {
		readonly : flag
	});

	$("#CustDetailTable textarea").attr( {
		readonly : flag
	});

	$("#ownProject").attr("disabled", flag);

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
		$("#CustDetailTable input").addClass("inputDisabled");
		$("#ownProject").addClass("inputDisabled");
		$("#CustDetailTable textarea").addClass("inputDisabled");

	} else {
		$("#CustDetailTable input").removeClass("inputDisabled");
		$("#ownProject").removeClass("inputDisabled");
		$("#CustDetailTable textarea").removeClass("inputDisabled");
	}
	$("#addTime").addClass("inputDisabled");
}

//清空右边详细信息的数据
function ClearInputText() {
	$("#custName").val("");
	$("#custPwd").val("");
	$("#ownProject").val("-1");
	$("#responsiblePerson").val("");
	$("#custContact").val("");
	$("#custDetailInfo").val("");
	$("#custDescription").val("");
	$("#addTime").val("");
}
function ClickAddBtn() {
	$("#CustDetailTable_Shadow").hide();
	$("#CustDetailTable_Error").hide();
	ClearInputText();
	$("#custGuid").val("");
	$("#responsiblePerson").val("highlight");
	custInputStatusChangeReadOnly(false);
	$("#modifyBtn").html("保存");
	$("#addBtn").hide();
	$("#cancelBtn").show();
}

//点击取消所触发的事件（如果是新建，取消就是清空所有值，如果是修改，取消就是还原默认值）
function ClickCancel() {
    $("#cancelBtn").hide();
    $("#addBtn").show();

	ClearInputText();
	var param = [];
	if ($("#deviceGuid").val() != "") {
	    param["Guid"] = encodeURI($("#deviceGuid").val());
	    param["FromTable"] = encodeURI($("#deviceType").val());
	    param["random"] = newGuid();
	    var url = "/servlet/CustDetailServlet" + GetURLParam(param);
	    PostDetailServlet(url);
	}
	InputDisabledCss(true);
	$("#modifyBtn").html("修改");
}
//录入信息和GUID等信息
function ModifyCustChange() {
	//alert("修改");
	$("#addBtn").hide();
	var custGuid = $("#custGuid").val();//已经点击了查看详细链接
	if ($("#modifyBtn").html() == "修改") {
		if (custGuid === undefined || custGuid === null || custGuid === "") {
			alert("您没有选择要修改的条目，请先选择！");
			return;
		}
		custInputStatusChangeReadOnly(false);//所有数据可写

		$("#addTime").attr("disabled", false);
		$("#addTime").removeClass("inputDisabled");//只有在修改时纳入时间可用
		//alert($("#modifyBtn").html());
		//alert(custGuid);
		$("#modifyBtn").html("保存");
		$("#cancelBtn").show();
	} else if ($("#modifyBtn").html() == "保存") {
		if (!confirm("确定要保存这条信息？")) {
			return;
		}
		var strName = $("#custName").val();
		if (strName == undefined || strName == null || strName == "") {
			alert("您没有填写客户名，无法添加！");
			return;
		}
		//添加用户不能使用admin作为用户名
		if (strName.toLowerCase() =="admin") {
			alert("不能使用该用户名！");
			return;
		}
		var strPwd = $("#custPwd").val();
		if (strPwd == undefined || strPwd == null || strPwd == "") {
			alert("您没有填写密码，无法添加！");
			return;
		}
		if (strPwd == "**********") {
			strPwd = "";
		}

		var param = [];
		param["guid"] = custGuid;
		param["custName"] = encodeURI(strName);
		param["custPwd"] = encodeURI(strPwd);

		param["responsiblePerson"] = encodeURI($("#responsiblePerson").val());
		param["custDescription"] = encodeURI($("#custDescription").val());
		param["custContact"] = encodeURI($("#custContact").val());
		param["custDetailInfo"] = encodeURI($("#custDetailInfo").val());

		var ownCustProject = $("#ownProject").val();
		if (ownCustProject == "-1") {
			alert("未选择所属项目！");
			return;
		}
		param["ownProject"] = encodeURI(ownCustProject);
		param["addTime"] = encodeURI($("#addTime").val());
		param["random"] = newGuid();
		//	$("#CustDetailTable_Errordiv").remove();
		$("#CustDetailTable_Shadow").show();
		var url = "/servlet/AddCustServlet" + GetURLParam(param);
		//alert(url);
		$.get(url, {
			Action : "get"
		}, function(data, textStatus) {
			//			alert(textStatus);
				//			alert(data);
				if (textStatus != "success") {
					$("#CustDetailTable_Shadow").hide();
					//					$("#CustDetailTable_Error").show();
				//					$("#CustDetailTable_Error").append("<div id='CustDetailTable_Errordiv'>请求错误!操作失败!</br>请<a href='javascript:seeCustDetailRefresh();'class='pagecolor'>刷新</a></div>");
				alert("请求错误,保存失败!");
				return;
			}
			//			alert(data);
			if (data === "SUCCESS") {
				$("#CustDetailTable_Shadow").hide();
				alert("保存成功!");
				$("#modifyBtn").html("修改");
				custInputStatusChangeReadOnly(true);//所有数据可读不可写
				$("#modifyBtn").show();
				$("#addBtn").show();
				$("#cancelBtn").hide();

				//若有查询条件，添加后要清除
				$("#queryCustName").val("");
				//如果是新增，则需要刷新数据库
				CustListTable_AJAX();
			} else {
				$("#CustDetailTable_Shadow").hide();
				if (data === "UNIQUEERROR") {
					alert("后台发生错误,设备UID不唯一,保存失败!");
				} else if (data === "UNIQUENAMEERROR") {
					alert("新增失败: 客户名重复");
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
	shadowCSS["width"] = $("#CustDetailTable").width();
	shadowCSS["height"] = $("#CustDetailTable").height();

	$("#CustDetailTable_Shadow").css(shadowCSS);
	$("#CustDetailTable_Error").css(shadowCSS);

	$("#CustDetailTable_Shadow").hide();
	$("#CustDetailTable_Error").hide();

	LoadProjectType("ownProject");

	$("#ownProject").val("-1");
	$("#ownProject").change(function() {
		//添加所需要执行的操作代码 
		});

	$("#cancelBtn").hide();
	//默认点击只读不可用
	InputDisabledCss(true);
});
