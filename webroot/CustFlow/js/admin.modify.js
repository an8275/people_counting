function Cancel(){
	changePwdDisplayStatus(false);
	$("#BtnModify").html("Modify Password");
	$("#AdminPwd").val("******");
	$("#newAdminPwd").val('')
	$("#confirmAdminPwd").val('');
}
function ModifyPwd() {
	if ($("#BtnModify").html() == "Modify Password") {
		changePwdDisplayStatus(true);
		custInputStatusChangeReadOnly(false);
		$("#newAdminPwd").val('')
		$("#confirmAdminPwd").val('');
		$("#BtnModify").html("Save");
	} else {
		//如果是保存
		
		var AdminPwd = $("#AdminPwd").val();
		var newAdminPwd = $("#newAdminPwd").val();
		var confirmAdminPwd = $("#confirmAdminPwd").val();

		if (AdminPwd == undefined || AdminPwd == null || AdminPwd == "" || AdminPwd=="******")
		{
			//密码不能为空或者******初始值
			alert("You didn't fill the password");
			return;
		}
		if (newAdminPwd == undefined || newAdminPwd == null || newAdminPwd == "" )
		{
			//新密码不能为空
			alert("You didn't fill the new password");
			return;
		}
		if (confirmAdminPwd == undefined || confirmAdminPwd == null || confirmAdminPwd == "" )
		{
			//确认密码不能为空
			alert("You didn't fill the confirm password");
			return;
		}
		
		if (newAdminPwd == confirmAdminPwd) 
		{//新密码和确认密码相等，提交
			postModifyPwd(AdminPwd, newAdminPwd);
		} else {
			alert("The new password and confirmed password are different！");
			//清空值
			$("#newAdminPwd").val("");
			$("#confirmAdminPwd").val("");
			return;
		}
	}
}
function postModifyPwd(pwd,newpwd) {
	var param = [];
	param["AdminPwd"] = encodeURI(pwd);
	param["newAdminPwd"] = encodeURI(newpwd);
	param["random"] = newGuid();

	$("#CustDetailTable_Shadow").show();
	var url = "/servlet/ModifyAdminPwdServlet" + GetURLParam(param);
	$.get(url, {
		Action : "get"
	}, function(data, textStatus) {
		if (textStatus != "success") {
			$("#CustDetailTable_Shadow").hide();
			alert("Request error, save failed!");
			return;
		}
		if (data === "SUCCESS") {
			$("#CustDetailTable_Shadow").hide();
			alert("Save successful!");
			$("#BtnModify").html("Modify Password");
			$("#AdminPwd").val("******");
			changePwdDisplayStatus(false);
			custInputStatusChangeReadOnly(true);//所有数据可读不可写
	
			//重新登录
		}else if (data === "PWDERROR"){
			$("#CustDetailTable_Shadow").hide();
	        alert("Save Failed!Wrong Old Password");
			return;
		}else {
			$("#CustDetailTable_Shadow").hide();
	        alert("Save Failed!");
			return;
		}
	});

}
function changePwdDisplayStatus(isDisplay) {
	if (isDisplay === undefined || isDisplay == null)
		return;
	var strNewPwd = $("#CustDetailTable tr").get(2);
	var strConfirmNewPwd = $("#CustDetailTable tr").get(3);

	if (isDisplay) {
		$('#AdminPwd').attr("disabled",false);
		strNewPwd.style.display = "";
		strConfirmNewPwd.style.display = "";
	} else {
		$('#AdminPwd').attr("disabled",true);
		strNewPwd.style.display = "none";
		strConfirmNewPwd.style.display = "none";
	}
}
//更改Input的只读属性
function custInputStatusChangeReadOnly(isRead) {
	if (isRead === undefined || isRead == null)
		return;
	$("#custName").attr( {
		readonly : isRead
	});
	InputDisabledCss(isRead);

}
//设置不可用时input底色变灰色（浏览器兼容）
function InputDisabledCss(isDisabled) {
	if (isDisabled === undefined || isDisabled == null)
		return;
	if (isDisabled) {
		$("#custName").addClass("inputDisabled");
	} else {
		$("#custName").removeClass("inputDisabled");
	}
}

$(function() {

	var shadowCSS = [];
	shadowCSS["width"] = $("#CustDetailTable").width();
	shadowCSS["height"] = $("#CustDetailTable").height();

	$("#CustDetailTable_Shadow").hide();
	$("#CustDetailTable_Error").hide();

	$("#CustDetailTable_Shadow").css(shadowCSS);
	$("#CustDetailTable_Error").css(shadowCSS);

})
