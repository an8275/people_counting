$(function () {	    
		var myobj;
        var param = [];
        param["proguid"] = encodeURI(getcookievalue("UserProGuid"));
        param["random"] = newGuid();
        param["device_type"] = "device_cust";
        var url = "../../servlet/GetDeviceTypeServlet" + GetURLParam(param);
		//alert(url);
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
                myobj = eval('(' + data + ')');
           } catch (Error) {
                return;
           }
           if (myobj == undefined) {
                return;
           }
        });
			$("#BtnMoreArea").hide();
            var selectList = "";
            var selectWidth = $("#selectList").width();
            var selectHeight = $("#selectList").height();
			selectList += "<div  style='width:200px;height:40px;float:left;overflow:hidden;'>"+"<label style='float:left;'>Entrance:</label><input  id='checkall'   type='checkbox' style='margin-top:13px;margin-left:5px;float:left;'/><label style='margin-left:2px;float:left;'>Select All</lable></div>";
			//selectList+="<input  id='checkall'   type='checkbox' style='margin-top:13px;float:left;'/>";
            //alert(myobj.length);
			
			var vir=0
            for (var i = 0; i < myobj.length; i++) {
				//alert(myobj[i]["name"]);
				if (myobj[i]["isvirtual"] != "\u0000"){    
                    //选择区域，虚拟设备
					vir++;
                    if (i == 0) {
                        selectList += "<div id='i'   title='"+ myobj[i]["name"]+"' style='width:100px;height:40px;float:left;overflow:hidden;'>" + "<input  id='checkbox' type='checkbox' style='margin-top:13px;float:left;' value='" + myobj[i]["guid"] + "' name='"+myobj[i]["name"]+"' />" + "<label style='margin-left:2px;'>" + myobj[i]["name"] +
                        "</label><br></div>";

                    }
                    else {
                        selectList += "<div title='"+ myobj[i]["name"]+"' style='width:100px;height:40px;float:left;overflow:hidden;'>" + "<input id='checkbox' type='checkbox'        style='margin-top:13px;float:left;'  value='" + myobj[i]["guid"] + "' name='"+myobj[i]["name"]+"'/>" + "<label style='margin-left:2px;'>" + myobj[i]["name"]+
                        "</label><br></div>";

						
                    }
				}
            }
            if((vir * 100+60 )> selectWidth)
            {

                $("#BtnMoreArea").show();
            }
            $("#BtnMoreArea").click(function () {
                if ($("#BtnMoreArea").html() == "更多") {
                    $("#selectList").css("height", selectHeight * (Math.round(((vir+1) / ( selectWidth / 100)+0.5))));
                    $("#BtnMoreArea").html("收起");
                }
                else {
                    $("#selectList").css("height", selectHeight);
                    $("#BtnMoreArea").html("更多");
                }
            });

         
            $("#selectList").html(selectList);
 });


