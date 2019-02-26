function SeeProDetail(obj) {

	var objParentTrId = $(obj).parent().attr("id");
	//		alert(objParentTrId);
	if (objParentTrId === undefined)
		return;
	var guid = $("#" + objParentTrId).data("guid");
	//	alert(guid);
	if (guid === undefined || guid === null)
		return;

	$("#ProjectDetailTable_Shadow").show();
	$("#ProjectDetailTable_Error").hide();
	$("#ProjectDetailTable_Errordiv").remove();

	ClearInputText();
	$("#modifyBtn").html("Modify");
	proInputStatusChangeReadOnly(true);//所有数据只读不可写
	$("#projectGuid").val(guid);

	var param = [];
	param["Guid"] = encodeURI(guid);
	param["random"] = newGuid();

	var url = "/servlet/ProDetailServlet" + GetURLParam(param);
	//	alert(url);
	PostDetailServlet(url);

	$("#modifyBtn").show();
	$("#addBtn").show();
	$("#cancelBtn").hide();
}
//点击详细信息时报错了刷新执行操作
function seeProDetailRefresh() {
	var guid = $("#projectGuid").val();
	if (guid === undefined || guid === null)
		return;
	$("#ProjectDetailTable_Shadow").show();
	$("#ProjectDetailTable_Error").hide();
	$("#ProjectDetailTable_Errordiv").remove();
	ClearInputText();
	$("#projectGuid").val(guid);
	$("#modifyBtn").html("Modify");
	proInputStatusChangeReadOnly(true);//所有数据只读不可写

	var param = [];
	param["Guid"] = encodeURI(guid);
	param["random"] = newGuid();

	var url = "/servlet/ProDetailServlet" + GetURLParam(param);
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
						$("#ProjectDetailTable_Shadow").hide();
						$("#ProjectDetailTable_Error").show();
						$("#ProjectDetailTable_Error")
								.append(
										"<div id='ProjectDetailTable_Errordiv'>Error!!</br>Please<a href='javascript:seeProDetailRefresh();'class='pagecolor'>refresh the page</a></div>");
						//alert("请求错误,请刷新");
						return;
					}
					//data = "ERROR";
					if (data === "ERROR") {
						$("#ProjectDetailTable_Shadow").hide();
						$("#ProjectDetailTable_Error").show();
						$("#ProjectDetailTable_Error")
								.append(
										"<div id='ProjectDetailTable_Errordiv'>Background support run error!!</br>Please<a href='javascript:seeProDetailRefresh();'class='pagecolor'>refresh the page</a></div>");
						//alert("后台发生错误,请刷新");
						return;
					}
					try {
						var myobj = eval('(' + data + ')');
					} catch (Error) {
						$("#ProjectDetailTable_Shadow").hide();
						$("#ProjectDetailTable_Error").show();
						$("#ProjectDetailTable_Error")
								.append(
										"<div id='ProjectDetailTable_Errordiv'>Data conversion failed, wrong page format!!</br>Please<a href='javascript:seeProDetailRefresh();'class='pagecolor'>refresh the page</a></div>");
						//alert("数据转换失败,格式不正确，请刷新!");
						return;
					}
					if (myobj == undefined) {
						$("#ProjectDetailTable_Shadow").hide();
						$("#ProjectDetailTable_Error").show();
						$("#ProjectDetailTable_Error")
								.append(
										"<div id='ProjectDetailTable_Errordiv'>Data accessing failed!!</br>Please<a href='javascript:seeProDetailRefresh();'class='pagecolor'>refresh the page</a></div>");
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
					$("#ProjectDetailTable_Shadow").hide();
				});
}
//更改Input的只读属性
function proInputStatusChangeReadOnly(flag) {
	//$("#id").attr("readonly","readonly");    
	//添加readonly属性 
	// $("#ID").attr({ readonly: 'true' });
	//$("#id").removeAttr("readonly");    //去除readonly属性
	//	alert(flag);
	if (flag === undefined || flag == null)
		return;
	$("#ProjectDetailTable input").attr( {
		readonly : flag
	});

	$("#ProjectDetailTable textarea").attr( {
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
		$("#ProjectDetailTable input").addClass("inputDisabled");
		$("#ProjectDetailTable textarea").addClass("inputDisabled");

	} else {
		$("#ProjectDetailTable input").removeClass("inputDisabled");
		$("#ProjectDetailTable textarea").removeClass("inputDisabled");
	}
	$("#addTime").addClass("inputDisabled");
}

//清空右边详细信息的数据
function ClearInputText() {
	$("#projectName").val("");
	$("#projectDetailInfo").val("");
	$("#responsiblePerson").val("");
	$("#projectDescription").val("");
	$("#addTime").val("");
}
function ClickAddBtn() {
	$("#ProjectDetailTable_Shadow").hide();
	$("#ProjectDetailTable_Error").hide();
	ClearInputText();
	$("#projectGuid").val("");
	$("#responsiblePerson").val("highlight");
	proInputStatusChangeReadOnly(false);
	$("#modifyBtn").html("Save");
	$("#addBtn").hide();
	$("#cancelBtn").show();
}

//点击取消所触发的事件（如果是新建，取消就是清空所有值，如果是修改，取消就是还原默认值）
function ClickCancel() {
	$("#ProjectDetailTable_Shadow").hide();
	$("#ProjectDetailTable_Error").hide();

	$("#cancelBtn").hide();
	$("#addBtn").show();

	ClearInputText();
	var param = [];
	param["Guid"] = encodeURI($("#projectGuid").val());
	param["random"] = newGuid();
	var url = "/servlet/ProDetailServlet" + GetURLParam(param);
	ClearInputText();
	PostDetailServlet(url);

	InputDisabledCss(true);
	$("#modifyBtn").html("Modify");

}
//录入信息和GUID等信息
function ModifyProjectChange() {
    //alert("修改");
    $("#addBtn").hide();
	var projectGuid = $("#projectGuid").val();//已经点击了查看详细链接

	if ($("#modifyBtn").html() == "Modify") {
		if (projectGuid === undefined || projectGuid === null
				|| projectGuid === "") {
			alert("Item to be modified is null,Please select fist！");
			return;
		}
		proInputStatusChangeReadOnly(false);//所有数据可写
		$("#addTime").attr("disabled", false);
		$("#addTime").removeClass("inputDisabled");//只有在修改时纳入时间可用

		$("#modifyBtn").html("Save");
		$("#cancelBtn").show();
	} else if ($("#modifyBtn").html() == "Save") {
		if (!confirm("Do you want to save this information?？")) {
			return;
		}
		var strName = $("#projectName").val();
		if (strName == undefined || strName == null || strName == "") {
			alert("You didn't fill the project name，Add failure！");
			return;
		}
		
		var param = [];
		param["guid"] = projectGuid;
		param["projectName"] = encodeURI(strName);
		param["projectDescription"] = encodeURI($("#projectDescription").val());
		param["addTime"] = encodeURI($("#addTime").val());
		param["responsiblePerson"] = encodeURI($("#responsiblePerson").val());
		param["projectDetailInfo"] = encodeURI($("#projectDetailInfo").val());
		param["random"] = newGuid();
		//	$("#ProjectDetailTable_Errordiv").remove();
		$("#ProjectDetailTable_Shadow").show();
		var url = "/servlet/AddProjectServlet" + GetURLParam(param);
        
		//alert(url);
		$.get(url, {
			Action : "get"
		}, function(data, textStatus) {
			//			alert(textStatus);
							//alert(data);
				if (textStatus != "success") {
					$("#ProjectDetailTable_Shadow").hide();
					//					$("#ProjectDetailTable_Error").show();
				//					$("#ProjectDetailTable_Error").append("<div id='ProjectDetailTable_Errordiv'>请求错误!操作失败!</br>请<a href='javascript:seeProDetailRefresh();'class='pagecolor'>刷新</a></div>");
				alert("Request error, save failed!");
				return;
			}
			//			alert(data);
			if (data === "SUCCESS") {
				$("#ProjectDetailTable_Shadow").hide();
				alert("Save successful!");
				$("#modifyBtn").html("Modify");
				$("#addBtn").show();
				$("#cancelBtn").hide();
				proInputStatusChangeReadOnly(true);//所有数据可读不可写

				//若有查询条件，添加后要清除
				$("#queryProjectName").val("");
				//如果是新增，则需要刷新数据库
				ProjectListTable_AJAX();
				window.location.reload();
			} else {
				$("#ProjectDetailTable_Shadow").hide();
				if (data === "UNIQUEERROR") {
					alert("Background run error, device UID is not unique, save failed!");
				} else if (data === "UNIQUENAMEERROR") {
					alert("Add failure: the same project name!");
				} else {
                    alert("Background run error,save failed.!");
                }
				return;
			}
		});
	}
}

$(function() {
	var shadowCSS = [];
	shadowCSS["width"] = $("#ProjectDetailTable").width();
	shadowCSS["height"] = $("#ProjectDetailTable").height();
	$("#ProjectDetailTable_Shadow").css(shadowCSS);
	$("#ProjectDetailTable_Error").css(shadowCSS);
	$("#ProjectDetailTable_Shadow").hide();
	$("#ProjectDetailTable_Error").hide();

	$("#cancelBtn").hide();
	//默认点击只读不可用
	InputDisabledCss(true);
});
