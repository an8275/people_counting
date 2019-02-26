function selfCustDetail() {

	var guid = getcookievalue("LoginUserGuid");
	//	alert(guid);
	if (guid === undefined || guid === null)
		return;

	$("#CustDetailTable_Shadow").show();
	$("#CustDetailTable_Error").hide();
	$("#CustDetailTable_Errordiv").remove();

	ClearInputText();
	custInputStatusChangeReadOnly(true);//所有数据只读不可写
	$("#custGuid").val(guid);

	var param = [];
	param["Guid"] = encodeURI(guid);
	param["random"] = newGuid();

	var url = "/servlet/CustDetailServlet" + GetURLParam(param);
	//alert(url);
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
										"<div id='CustDetailTable_Errordiv'>Error!!</br>Please<a href='javascript:selfCustDetail();'class='pagecolor'>refresh the page</a></div>");
						//alert("请求错误,请刷新");
						return;
					}
					//data = "ERROR";
					if (data === "ERROR") {
						$("#CustDetailTable_Shadow").hide();
						$("#CustDetailTable_Error").show();
						$("#CustDetailTable_Error")
								.append(
										"<div id='CustDetailTable_Errordiv'>Background support run error!!</br>Please<a href='javascript:selfCustDetail();'class='pagecolor'>refresh the page</a></div>");
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
										"<div id='CustDetailTable_Errordiv'>Data conversion failed, wrong page format!!</br>Please<a href='javascript:selfCustDetail();'class='pagecolor'>refresh the page</a></div>");
						//alert("数据转换失败,格式不正确，请刷新!");
						return;
					}
					if (myobj == undefined) {
						$("#CustDetailTable_Shadow").hide();
						$("#CustDetailTable_Error").show();
						$("#CustDetailTable_Error")
								.append(
										"<div id='CustDetailTable_Errordiv'>Data accessing failed!!</br>Please<a href='javascript:selfCustDetail();'class='pagecolor'>refresh the page</a></div>");
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

function ModifyStartEndTime() {
    if ($("#ModifyStartEndTimeBtn").html() == "Reset Opening Time") {
        $("#startTimeGap").attr('disabled', false);
        $("#endTimeGap").attr('disabled', false);
        $("#ModifyStartEndTimeBtn").html("Save");
    } else {
        //如果是保存
        var custName = $("#custName").val();
        //时间不能为空
        var custStartTime = $("#startTimeGap").val();
        var custEndTime = $("#endTimeGap").val();

        if (custStartTime === undefined || custEndTime === undefined ||
              custStartTime === null || custEndTime === null ||
              custStartTime === "" || custEndTime === "") {
            alert("Opening time can not be null！");
			$("#startTimeGap").attr('disabled', true);
			$("#endTimeGap").attr('disabled', true);
			$("#ModifyStartEndTimeBtn").html("Reset Opening Time");
            return;
        }
        //新密码为空，确认密码为空，不修改密码！直接提交
        postModifyStartEndTime($("#custGuid").val(), custName);

    }
}
function postModifyStartEndTime(guid, name) {
	var param = [];
	param["guid"] = encodeURI(guid);
	param["custName"] = encodeURI(name);

    param["startTimeGap"] = encodeURI($("#startTimeGap").val());
    param["endTimeGap"] = encodeURI($("#endTimeGap").val());
	param["random"] = newGuid();

	$("#CustDetailTable_Shadow").show();
	var url = "/servlet/ModifyStartEndTimeCustServlet" + GetURLParam(param);
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
			$("#ModifyStartEndTimeBtn").html("Reset opening time");
			$("#startTimeGap").attr('disabled', true);
			$("#endTimeGap").attr('disabled', true);
			//changePwdDisplayStatus(false);
			//custInputStatusChangeReadOnly(true);//所有数据可读不可写

			//重新登录
		} else {
			$("#CustDetailTable_Shadow").hide();
            alert("Request error, save failed!");
			return;
		}
	});

}

function ModifyPwd() {
	if ($("#BtnModify").html() == "Modify Password") {
		changePwdDisplayStatus(true);
		custInputStatusChangeReadOnly(false);
		$("#BtnModify").html("Save");
	} else {
		//如果是保存

		//用户名不能为空
		var custName = $("#custName").val();
		if (custName === undefined || custName === null || custName === "") {
			alert("Username can not be null！");
			return;
		}

		//密码修改的话，那么确认密码不能为空，并且，确认密码必须等于新密码
		var newCustPwd = $("#newCustPwd").val();
		var confirmCustPwd = $("#confirmCustPwd").val();

		if (newCustPwd != undefined && newCustPwd != null && newCustPwd != "") {
			if (confirmCustPwd === undefined || confirmCustPwd === null//新密码不为空，确认密码为空
					|| confirmCustPwd === "") {
				alert("Confirmed password can not be null！");
				return;
			} else {//新密码不为空，确认密码不为空
				if (newCustPwd == confirmCustPwd) {//新密码和确认密码相等，提交
					postModifyPwd($("#custGuid").val(), custName,
							confirmCustPwd);
				} else {
					alert("The new password and confirmed password are different！");
					//清空值
					$("#newCustPwd").val("");
					$("#confirmCustPwd").val("");
					return;
				}

			}
		} else {//新密码为空，确认密码不为空
			if (confirmCustPwd != undefined && confirmCustPwd != null
					&& confirmCustPwd != "") {
				alert("The new password can not be null！");
				return;

			} else {
			    //新密码为空，确认密码为空，不修改密码！直接提交
			    //postModifyPwd($("#custGuid").val(), custName);
			    $("#CustDetailTable_Shadow").hide();
			    $("#BtnModify").html("Modify Password");
			    changePwdDisplayStatus(false);
			    custInputStatusChangeReadOnly(true);//所有数据可读不可写
			}
		}
	}
}
function postModifyPwd(guid, name, pwd) {
	var param = [];
	param["guid"] = encodeURI(guid);
	param["custName"] = encodeURI(name);
	param["custPwd"] = encodeURI(pwd);
	param["random"] = newGuid();

	$("#CustDetailTable_Shadow").show();
	var url = "/servlet/ModifyPwdCustServlet" + GetURLParam(param);
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
			changePwdDisplayStatus(false);
			custInputStatusChangeReadOnly(true);//所有数据可读不可写

			//重新登录
		} else {
			$("#CustDetailTable_Shadow").hide();
            alert("Background support run error, save PWD failed!");
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
		strNewPwd.style.display = "";
		strConfirmNewPwd.style.display = "";
	} else {
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
//清空右边详细信息的数据
function ClearInputText() {
	$("#custName").val("");
	$("#custPwd").val("");
	$("#newCustPwd").val("");
	$("#confirmCustPwd").val("");
	$("#ownProject").val("-1");
	$("#responsiblePerson").val("");
	$("#addTime").val("");
}
function currencytypecancel(){
	if(getcookievalue("CurrencyType")!=undefined&&getcookievalue("CurrencyType")!=null&&getcookievalue("CurrencyType")!=""){
		$("#currencytype").val(getcookievalue("CurrencyType"));
	}else{
		$("#currencytype").val("USD");
	}
	$("#CancelCurrencytypeBtn").css('display','none'); 
	$("#currencytype").attr('disabled', true);
	$("#select").attr('disabled', true);
	$("#ModifyCurrencytypeBtn").html("Modify CurrencyType");
}
function datachange(){
	$("#currencytype").val($("#select").find("option:selected").text());
}
function ModifyCurrencyType(){
	if($("#ModifyCurrencytypeBtn").html()=="Modify CurrencyType"){
		$("#CancelCurrencytypeBtn").css('display',''); 
		$("#currencytype").attr('disabled', false);
		$("#select").attr('disabled', false);
		$("#ModifyCurrencytypeBtn").html("Save");
	}else{
		var currencytype=$("#currencytype").val();
		if (currencytype === undefined || currencytype == null||currencytype==""){
			if(getcookievalue("CurrencyType")!=undefined&&getcookievalue("CurrencyType")!=null&&getcookievalue("CurrencyType")!=""){
				$("#currencytype").val(getcookievalue("CurrencyType"));
			}else{
				$("#currencytype").val("USD");
			}
			$("#CancelCurrencytypeBtn").css('display','none'); 
			$("#currencytype").attr('disabled', true);
			$("#select").attr('disabled', true);
			$("#ModifyCurrencytypeBtn").html("Modify CurrencyType");
			return;
		}else{
			//上传
			postModifycurrencytype($("#custGuid").val(), $("#custName").val(),currencytype);
		}
	}
}
function postModifycurrencytype(guid,name,currencytype) {
	var param = [];
	param["guid"] = encodeURI(guid);
	param["custName"] = encodeURI(name);
	param["currencytype"] = encodeURI(currencytype);
	param["random"] = newGuid();

	$("#CustDetailTable_Shadow").show();
	var url = "/servlet/ModifyCurrencyTypeServlet" + GetURLParam(param);
	$.get(url, {
		Action : "get"
	}, function(data, textStatus) {
		if (textStatus != "success") {
			$("#CustDetailTable_Shadow").hide();
			alert("Request error, save failed!");
		}
		if (data === "SUCCESS") {
			$("#CustDetailTable_Shadow").hide();
			alert("Save successful!");
			setcookievalue("CurrencyType", currencytype);
			location.reload();
		} else {
			$("#CustDetailTable_Shadow").hide();
            alert("Request error, save failed!");
			return;
		}
	});
	if(getcookievalue("CurrencyType")!=undefined&&getcookievalue("CurrencyType")!=null&&getcookievalue("CurrencyType")!=""){
		$("#currencytype").val(getcookievalue("CurrencyType"));
	}else{
		$("#currencytype").val("USD");
	}
	$("#CancelCurrencytypeBtn").css('display','none'); 
	$("#currencytype").attr('disabled', true);
	$("#select").attr('disabled', true);
	$("#ModifyCurrencytypeBtn").html("Modify CurrencyType");

}
$(function() {
//	LoadProjectType("ownProject");避免又去查一次
    if(getcookievalue("UserProject")=="上海昊亿实业有限公司"){
	   $("#ownProject").append("<option value="+getcookievalue("UserProGuid")+">Highilght Manufacturing Corp.Ltd</option>");
	}else{
	   $("#ownProject").append("<option value="+getcookievalue("UserProGuid")+">"+getcookievalue("UserProject")+"</option>");
	}
	$("#currencytype").val(currencytype);
	/* if(getcookievalue("CurrencyType")!=undefined&&getcookievalue("CurrencyType")!=null&&getcookievalue("CurrencyType")!=""){
		$("#currencytype").val(getcookievalue("CurrencyType"));
	}else{
		$("#currencytype").val("USD");
	}
	$("#currencytype").attr("disabled","disabled"); */

	var shadowCSS = [];
	shadowCSS["width"] = $("#CustDetailTable").width();
	shadowCSS["height"] = $("#CustDetailTable").height();

	$("#CustDetailTable_Shadow").hide();
	$("#CustDetailTable_Error").hide();

	$("#CustDetailTable_Shadow").css(shadowCSS);
	$("#CustDetailTable_Error").css(shadowCSS);

	selfCustDetail();

})
