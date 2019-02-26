function Login_AJAX() {
	var username = $("#username").val();
	if (username == "") {
		alert("请输入用户名!");
		$("#username").focus();
		return;
	}
	var userpwd = $("#userpwd").val();
	if (userpwd == "") {
		alert("请输入密码!");
		$("#userpwd").focus();
		return;
	}
	var userCookie = $("#userCookie").attr("checked");

	//	$('form').attr('action', 'servlet/LoginServlet');
	//	$('form').submit();

	var param = [];
	param["username"] = encodeURI(username);
	param["userpwd"] = encodeURI(userpwd);
	//alert($("#warnRank").val());
	param["userCookie"] = encodeURI(userCookie);
	param["random"] = newGuid();

	delCookie("UserProject");
	delCookie("UserProGuid");
	delCookie("LoginUserGuid");
	delCookie("startTimeGap");
	delCookie("endTimeGap");



	var url = "/servlet/LoginServlet" + GetURLParam(param);
	
	$.get(url, {
		Action : "get",
	}, function(data, textStatus) {
			if (textStatus != "success") {
				$("#errDiv").html("请求错误！");
				return;
			}
			//alert(data);
			//alert(textStatus);
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
					$("#errDiv").html("用户名或密码错误，登录失败！");
				}
				else{
					$("#errDiv").html("所属项目已被禁用，登录失败！");
				}
				
				$("#username").val("");
				$("#userpwd").val("");
				return;
			}

		});
}
function LogOut_AJAX2() {
	if (!confirm("确定要退出系统？")) {
		return;
	}
	var cookieState = getcookievalue("Remeber");
	//			alert(cookieState);

	if (cookieState == "false") {
		//				alert("不需要记住用户名");
		delCookie("LoginUser");
	}
	//			alert("删除reb");
	delCookie("Remeber");

	var url = "/servlet/LogOutServlet";
	window.location.href = url;

}
function LogOut_AJAX() {
	if (!confirm("确定要退出系统？")) {
		return;
	}
	var url = "/servlet/LogOutServlet";
	$.get(url, {
		Action : "get"
	}, function(data, textStatus) {
        alert(data);
		if (data === "SUCCESS") {
			var cookieState = getcookievalue("Remeber");
			//			alert(cookieState);

			if (cookieState == "false") {
				//			alert("不需要记住用户名");
			    delCookie("LoginUser");
		    }
		    //			alert("删除reb");
			delCookie("Remeber");
			delCookie("UserProject");
			delCookie("UserProGuid");
			delCookie("LoginUserGuid");
			//location.replace("login.html");
			window.location.href = "/CustFlow/CH/login.html";
		} else{
			alert("后台未知错误！请联系管理员！");
		}
	});
}

//页面加载时刷新一次，不能一直刷新
//String.prototype.queryString= function(name) {
//    var reg=new RegExp("[\?\&]" + name+ "=([^\&]+)","i"),r = this.match(reg);
//    return r!==null?unescape(r[1]):null;
//};
//    window.onload=function(){
//        var last=location.href.queryString("_v");
//        document.body.innerHTML+=last||"";
//        if(location.href.indexOf("?")==-1){
//            location.href=location.href+"?_v="+(new Date().getTime());
//        }else{
//            var now=new Date().getTime();
//            if(!last){
//                location.href=location.href+"&_v="+(new Date().getTime());
//            }else if(parseInt(last)<(now-1000)){
//                location.href=location.href.replace("_v="+last,"_v="+(new Date().getTime()));
//            }
//        }
//    };
function loginUserAdd() {
	var loginUser = getcookievalue("LoginUser");
	var loginProject = getcookievalue("UserProject");
	if (loginUser != undefined && loginUser != "") {
		$("#loginusername").html(loginUser);
		if (loginProject != undefined && loginProject != "") {
			$("#loginusername").after("(" + loginProject + ")");//有项目填充对应的项目
		}else{
			$("#loginusername").after("(管理员)");//否则是管理员
		}

	} else {
		location.replace("login.html");
	}
}
$(function() {
	//如果有logo就加载
	var path="../images/logo/"+getcookievalue("UserProGuid")+".png";
	$("#logo").attr('src',path);
	//	alert(getcookievalue("LoginUser"));
	$("#errDiv").html("");
	var loginUser = getcookievalue("LoginUser");
	var cookieState = getcookievalue("Remeber");
	if (loginUser != undefined && loginUser != "" && cookieState != undefined
			&& cookieState != "undefined") {
		$("#username").val(loginUser);
	}

	/*if (loginUser == "hysy") {
	    $(".site_title").html("<img style='margin-left:25px; padding:5px;' src='../images/hysylogo.png' height='50' width='120'>");

	    //var h3Count = $("h3").length;
	    //for (var i = 0; i < h3Count; i++) {
	    //    var cha = $("h3:eq(" + i + ")").text();
	    //    alert(cha);
	    //    alert(cha == "年龄性别统计");
	    //    if (cha == "年龄性别统计") {
	    //        alert("111");
	    //        $("h3:eq(" + i + ")").empty();
	    //    }
	    //}

	    $("h3:eq(" + 1 + ")").empty();
	    $("ul:eq(" + 1 + ")").empty();

	}*/

    $("#username").focus();

    $("#username").on('keyup', function(e) {
        if (e.which == 13 || e.keyCode == 13) {
            $("#userpwd").focus();
        }
    });

    $("#userpwd").on('keyup', function(e) {
        if (e.which == 13 || e.keyCode == 13) {
            Login_AJAX();
        }
    });


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
