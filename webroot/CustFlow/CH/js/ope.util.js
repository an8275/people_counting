Request = {
	QueryString : function(item) {
		var svalue = location.search.match(new RegExp("[\?\&]" + item
				+ "=([^\&]*)(\&?)", "i"));
		if (svalue === undefined)
			return undefined;
		return svalue ? svalue[1] : svalue;
	}
};//RegExp方法获取地址栏参数,不足就是每次只能选一个参数，.../test.html?str=123456 alert(QueryString('str'));

function getArgs() {
	var args = new Object();
	var query = location.search.substring(1); // Get query string
	var pairs = query.split("&"); // Break at ampersand
	for ( var i = 0; i < pairs.length; i++) {
		var pos = pairs[i].indexOf('='); // Look for "name=value"
		if (pos == -1)
			continue; // If not found, skip
		var argname = pairs[i].substring(0, pos); // Extract the name
		var value = pairs[i].substring(pos + 1); // Extract the value
		value = decodeURIComponent(value); // Decode it, if needed
		args[argname] = value; // Store as a property
	}
	return args; // Return the object
}
//alert(getArgs()['str']);或alert(getArgs().str);

// 返回url的参数部分
function GetURLParam(arr) {
	var text = "";
	if (arr === undefined)
		return text;
	for ( var i in arr) {
		if (arr[i] != undefined) {
			if (text.length > 0)
				text += "&";
			text += (i + "=" + arr[i]);
		}
	}
	if (text.length > 0)
		text = "?" + text;

	return text;
}
//生成GUID类似的随机数
function newGuid() {
	var guid = "";
	for ( var i = 1; i <= 32; i++) {
		var n = Math.floor(Math.random() * 16.0).toString(16);
		guid += n;
		if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
			guid += "-";
	}
	return guid;
}
//设置不可用时input底色变灰色（浏览器兼容）
function DateInputDisabledGrayCss() {
	//	alert($("#checkbox1").attr("checked"));
	//	alert($("#checkbox2").attr("checked"));
	if ($("#checkbox1").attr("checked") == true
			|| $("#checkbox1").attr("checked") == 'checked') {
		$("#startTime").attr("disabled", false);
		$("#startTime").removeClass("inputDisabled");
	} else {
		$("#startTime").val(new Date().format('yyyy-MM' + '-01'));
		$("#startTime").attr("disabled", true);
		$("#startTime").addClass("inputDisabled");
	}

	if ($("#checkbox2").attr("checked") == true
			|| $("#checkbox2").attr("checked") == 'checked') {
		$("#endTime").attr("disabled", false);
		$("#endTime").removeClass("inputDisabled");
	} else {
		$("#endTime").val(new Date().format('yyyy-MM-dd'));
		$("#endTime").attr("disabled", true);
		$("#endTime").addClass("inputDisabled");
	}

	if ($("#checkbox3").attr("checked") == true
        || $("#checkbox3").attr("checked") == 'checked') {
	    $("#startTimeGap").attr("disabled", false);
	    $("#startTimeGap").removeClass("inputDisabled");
	} else {
	    $("#startTimeGap").val(new Date().format('09:00:00'));
	    $("#startTimeGap").attr("disabled", true);
	    $("#startTimeGap").addClass("inputDisabled");
	}

	if ($("#checkbox4").attr("checked") == true
        || $("#checkbox4").attr("checked") == 'checked') {
	    $("#endTimeGap").attr("disabled", false);
	    $("#endTimeGap").removeClass("inputDisabled");
	} else {
	    $("#endTimeGap").val(new Date().format('21:00:00'));
	    $("#endTimeGap").attr("disabled", true);
	    $("#endTimeGap").addClass("inputDisabled");
	}
}

Date.prototype.format = function(format) {
	var o = {
		"M+" : this.getMonth() + 1, //month
		"d+" : this.getDate(), //day
		"h+" : this.getHours(), //hour
		"m+" : this.getMinutes(), //minute
		"s+" : this.getSeconds(), //second
		"q+" : Math.floor((this.getMonth() + 3) / 3), //quarter
		"S" : this.getMilliseconds()
	//millisecond
	}
	if (/(y+)/.test(format))
		format = format.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	for ( var k in o)
		if (new RegExp("(" + k + ")").test(format))
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
					: ("00" + o[k]).substr(("" + o[k]).length));
	return format;
}
/**Parses string formatted as YYYY-MM-DD to a Date object.
 * If the supplied string does not match the format, an
 * invalid Date (value NaN) is returned.
 * @param {string} dateStringInRange format YYYY-MM-DD, with year in
 * range of 0000-9999, inclusive.
 * @return {Date} Date object representing the string.
 */
function parseISO8601(dateStringInRange) {
	var isoExp = /^\s*(\d{4})-(\d\d)-(\d\d)\s*$/, date = new Date(NaN), month, parts = isoExp
			.exec(dateStringInRange);

	if (parts) {
		month = +parts[2];
		date.setFullYear(parts[1], month - 1, parts[3]);
		if (month != date.getMonth() + 1) {
			date.setTime(NaN);
		}
	}
	return date;
}
//浏览器即将关闭事件   
function CloseBrowse() {
	//用户点击浏览器右上角关闭按钮或是按alt+F4关闭   
	if (event.clientX > document.body.clientWidth && event.clientY < 0
			|| event.altKey) {
		if(confirm("确定关闭？"))
		pageclose();
	}

	//用户点击任务栏，右键关闭。s或是按alt+F4关闭   
	else if (event.clientY > document.body.clientHeight || event.altKey) {
		pageclose();
	}
	//其他情况为刷新      
	else {

	}
}
function pageclose() {
	var param = [];
	param["random"] = newGuid();
	var url = "servlet/CloseSessionServlet" + GetURLParam(param);
	//	alert(url);
	$.get(url, {
		Action : "post"
	}, function(data, textStatus) {
//		alert(data);
	});
}
//调用session.invalidate()每次关闭浏览器时销毁当前session
