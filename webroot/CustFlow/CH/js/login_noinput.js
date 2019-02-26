function login2() {
	var username="ddbwg";
	var userpwd ="ddbwg";
	var userCookie = $("#userCookie").attr("checked");

	var param = [];
	param["username"] = encodeURI(username);
	param["userpwd"] = encodeURI(userpwd);

	param["userCookie"] = encodeURI(userCookie);
	param["random"] = newGuid();

	delCookie("UserProject");
	delCookie("UserProGuid");
	delCookie("LoginUserGuid");
	delCookie("startTimeGap");
	delCookie("endTimeGap");

	var url = "/servlet/LoginServlet" + GetURLParam(param);
	$.get(url, {
		Action : "get"
	}, function(data, textStatus) {
			if (textStatus != "success") {
				$("#errDiv").html("请求错误！");
				return;
			}
			//alert(data);
			if (data === "ERROR") {
				$("#errDiv").html("后台发生错误！登录失败！");
				return;
			}
			try {
				var myobj = eval('(' + data + ')');
			} catch (Error) {
				$("#errDiv").html("格式转化错误！登录失败！");
				return;
			}
			if (myobj == undefined) {
				$("#errDiv").html("未获取到数据！登录失败！");
				return;
			}
			if (myobj["isSuccess"]) {

				if (myobj["isAdmin"]) {
				    location.replace("./admin/itempersonflow.html");
				} else {
				    location.replace("./user/index.html");

				    if (param["username"] == "lx-test" || param["username"] == "zlmd") {
				        location.replace("./user/lxindex.html");
				    }
					
					setcookievalue("UserProject", myobj["proName"]);
					setcookievalue("UserProGuid", myobj["proGuid"]);

					if (myobj["startTimeGap"] == "" || myobj["startTimeGap"] == null || myobj["startTimeGap"] == undefined)
					    setcookievalue("startTimeGap", "00:00:00");
					else
					    setcookievalue("startTimeGap", myobj["startTimeGap"]);


					if (myobj["endTimeGap"] == ""|| myobj["endTimeGap"] == null || myobj["endTimeGap"] == undefined)
					    setcookievalue("endTimeGap", "23:59:59");
					else
					    setcookievalue("endTimeGap", myobj["endTimeGap"]);
				}
				setcookievalue("Remeber", userCookie);
				setcookievalue("LoginUser", username);//利用浏览器cookie保存全局的登录用户名
				setcookievalue("LoginUserGuid", myobj["userGuid"]);
                //开关店时间
				return;
			} else {
				if(myobj["userGuid"]==undefined||myobj["userGuid"]==""){
					alert("用户名或密码错误，登录失败！");
				}
				else{
					alert("所属项目已被禁用，登录失败！");
				}
				
				$("#username").val("");
				$("#userpwd").val("");
                location.replace("./login.html");
				return;
			}

		});
}
$(function() {

	var loginUser = getcookievalue("LoginUser");
	var cookieState = getcookievalue("Remeber");


})

/////////////////////////////////////////////////////////////////////
//Cookie操作
//获取cookie的值
function getcookievalue(sname) {
	var svalue = "";
	var sname = sname + "=";
	if (document.cookie.length > 0) {
		offset = document.cookie.indexOf(sname);
		if (offset != -1) {
			offset += sname.length;
			end = document.cookie.indexOf(";", offset);
			if (end == -1)
				end = document.cookie.length;
			svalue = unescape(document.cookie.substring(offset, end))
		}
	}
	return svalue;
}
//添加cookie
function setcookievalue(sname, svalue) {
	var expire = "";
	expire = new Date((new Date()).getTime() + 31536000);
	expire = "; expires=" + expire.toGMTString();
	document.cookie = sname + "=" + escape(svalue) + expire;
}
//删除cookies 
function delCookie(name) {
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval = getcookievalue(name);
	if (cval != null)
		document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
	//	alert("删除成功！");
}