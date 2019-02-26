
//更改Input的只读属性
function devInputStatusChangeReadOnly(flag) {
    //$("#id").attr("readonly","readonly");    
    //添加readonly属性 
    // $("#ID").attr({ readonly: 'true' });
    //$("#id").removeAttr("readonly");    //去除readonly属性
    //	alert(flag);
    if (flag === undefined || flag == null)
        return;
    $("#CustListTable input").attr({
        readonly: flag
    });

    $("#CustListTable textarea").attr({
        readonly: flag
    });

    //$("#alreadyDevice").attr("disabled", flag);
    //$("#alternativeDevice").attr("disabled", flag);

   // $("#addTime").attr("disabled", true);
    //$("#isProjectDevice").attr("disabled", flag);

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
        $("#CustListTable input").addClass("inputDisabled");
        $("#alreadyDevice").addClass("inputDisabled");
        $("#alternativeDevice").addClass("inputDisabled");
        $("#CustListTable textarea").addClass("inputDisabled");

    } else {
        $("#CustListTable input").removeClass("inputDisabled");
        $("#alreadyDevice").removeClass("inputDisabled");
        $("#alternativeDevice").removeClass("inputDisabled");
        $("#CustListTable textarea").removeClass("inputDisabled");
    }
   // $("#addTime").addClass("inputDisabled");
}

//清空右边详细信息的数据
function ClearInputText() {
    $("#deviceName").val("");
    $("#deviceDescription").val("");
    $("#deviceDetailInfo").val("");
    $("#alternativeDevice").empty();//内容清空
    $("#alreadyDevice").empty();
    $("#isProjectDevice").attr("checked", false);
    $("#addTime").val("");
}
function ClickAddBtn() {
    var ownProject = $("#detailOwnProject").val();
    if (ownProject == "-1") {
        alert("Please select the subordinated item first！");
        return;
    }

    $("#CustListTable_Shadow").hide();
    $("#CustListTable_Error").hide();
    ClearInputText();
    $("#deviceGuid").val("");
    $("#deviceType").val("");
    $("#isProjectDevice").val("");
    devInputStatusChangeReadOnly(false);

    addLoadDeviceListType("alternativeDevice", "alreadyDevice");

    $("#modifyBtn").html("Save");
}

//点击取消所触发的事件（如果是新建，取消就是清空所有值，如果是修改，取消就是还原默认值）
function ClickCancel() {
    $("#CustListTable_Shadow").hide();
    $("#CustListTable_Error").hide();
    $("#cancelBtn").hide();
    $("#modifyBtn").html("Modify");
    InputDisabledCss(true);
    //if ($("#modifyBtn").html() == "保存") {
    //    if ($("#deviceGuid").val() == undefined
	//			|| $("#deviceGuid").val() == null
	//			|| $("#deviceGuid").val() == "") {
    //        //alert("新增取消");
    //        ClickAddBtn();
    //    } else {
    //        var param = [];
    //        param["Guid"] = encodeURI($("#deviceGuid").val());
    //        param["FromTable"] = encodeURI($("#deviceType").val());
    //        param["random"] = newGuid();
    //        var url = "/servlet/DevDetailServlet" + GetURLParam(param);
    //        ClearInputText();
    //        PostDetailServlet(url);
    //        //alert("修改取消");
    //    }
    //}
}

//录入信息和GUID等信息
function ModifyDeviceChange() {
    //alert("修改");

    if ($("#modifyBtn").html() == "Modify")
        $("#cancelBtn").show();
    else if ($("#modifyBtn").html() == "Submit")
        $("#cancelBtn").hide();

    if ($("#modifyBtn").html() == "Modify") {

        devInputStatusChangeReadOnly(false);//所有数据可写

        $("#CustListTable :text").attr("disabled", false);
        $("#CustListTable :text").attr("readonly", false);

        //$("#addTime").attr("disabled", false);
        //$("#addTime").removeClass("inputDisabled");//只有在修改时纳入时间可用

        $("#modifyBtn").html("Submit");
    } else if ($("#modifyBtn").html() == "Submit") {
        if (!confirm("Are you sure to save this message?？")) {
            return;
        }

        var vRowCount = $('#CustListTable :text').length / 2;

        var nFlag = 0;
        for (var i = 0; i < vRowCount; i++) {
            var param = [];
            param["deviceGuid"] = $('#CustListTable :text:eq(' + 2 * i + ')').attr('name');
            param["nowDate"] = encodeURI($("#nowTime").val());
            param["sales"] = encodeURI($('#CustListTable :text:eq(' + (2 * i) + ')').val());
            param["orders"] = encodeURI($('#CustListTable :text:eq(' + (2 * i + 1) + ')').val());
            param["random"] = newGuid();
            var url = "/servlet/CustSalesServlet" + GetURLParam(param);
            // alert(url);
            $.get(url, {
                Action: "get"
            }, function (data, textStatus) {
                //			alert(textStatus);
                //			alert(data);
                if (textStatus != "success") {
                    $("#CustListTable_Shadow").hide();
                    //					$("#CustListTable_Error").show();
                    //					$("#CustListTable_Error").append("<div id='CustListTable_Errordiv'>请求错误!操作失败!</br>请<a href='javascript:seeDevDetailRefresh();'class='pagecolor'>刷新</a></div>");
                    alert("Request error, submit failed!");
                    return;
                }

                if (data != "SUCCESS") {
                    nFlag = 1;
                }
            });
        }

        if (nFlag == 0) {
            $("#CustListTable_Shadow").hide();
            $("#modifyBtn").html("Modify");
            devInputStatusChangeReadOnly(true);//所有数据可读不可写
            //若有查询条件，添加后要清除
            //$("#queryDeviceName").val("");
            //$("#ownProject").val($("#detailOwnProject").val());
            //如果是新增，则需要刷新数据库
            //DeviceListTable_AJAX();
            alert("Submit successful!");
            $("#cancelBtn").hide();
        } else {
                $("#CustListTable_Shadow").hide();
                alert("Background support run error,Submit successful!");
                return;
            }
        }
    }

$(function () {
    $("#cancelBtn").hide();
    var shadowCSS = [];
    shadowCSS["width"] = $("#CustListTable").width();
    shadowCSS["height"] = $("#CustListTable").height();
    $("#CustListTable_Shadow").css(shadowCSS);
    $("#CustListTable_Error").css(shadowCSS);

    $("#CustListTable_Shadow").hide();
    $("#CustListTable_Error").hide();

    //默认点击只读不可用
    InputDisabledCss(true);

    //$("#toRightImg").bind("click", function () {
    //    leftAddToRight("alternativeDevice", "alreadyDevice");
    //});
    //$("#toLeftImg").bind("click", function () {
    //    rightAddToLeft("alternativeDevice", "alreadyDevice");
    //    ;
    //});

    //绑定勾选项目设备事件
    $("#CustListTable :checkbox").click(function () {
        //				alert($(this).val());
        //				if ($(this).attr("checked") == true
        //						|| $(this).attr("checked") == 'checked') {
        //					alert("已选");
        //				} 
    });
});
