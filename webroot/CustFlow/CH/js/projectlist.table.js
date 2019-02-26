function ProjectListTable_AJAX() {
	$("#ProjectListTable_Error").hide();
	$("#ProjectListTable_Errordiv").remove();
	$("#ProjectListTable_Shadow").show();
	// alert($("#ProjectListTable").height());

	var table = $("#ProjectListTable");// 获取表格对象
	EmptyTableItemDom(table);// 清空表
	ClearTableText(table);// 清除之前的数据
	// ClearInputText();//清除详细表单数据
	// 清除绑定的数据
	for ( var i = 0; i < 10; i++)
		SetColDataAttr($("#prolist" + i));
	$("#ProjectListTable tr").removeClass("tdClickColor");// 移除其他颜色

	var iMaxRow = GetMaxRow(table);
	if (iMaxRow === undefined)
		iMaxRow = 10;
	var beginIndex = GetTableBeginIndex(table);// 得到起始分页索引

	var param = [];
	param["beginIndex"] = encodeURI(beginIndex);
	param["endIndex"] = encodeURI(beginIndex + iMaxRow);
	param["proguid"] = Request.QueryString("proguid");
	var proname = $("#queryProjectName").val();
	if (proname != undefined && proname != null && proname != ""
			&& proname != "项目名称") {
		param["projectname"] = encodeURI(proname);
	}
	param["random"] = newGuid();
	var url = "/servlet/ProjectListServlet" + GetURLParam(param);
	$
			.get(
					url,
					{
						Action : "get"
					},
					function(data, textStatus) {
						if (textStatus != "success") {
							$("#ProjectListTable_Shadow").hide();
							$("#ProjectListTable_Error").show();
							$("#ProjectListTable_Error")
									.append(
											"<div id='ProjectListTable_Errordiv'>请求错误</br>请<a href='javascript:ProjectListTable_AJAX();'class='pagecolor'>刷新</a></div>");
							return;
						}
						if (data === "ERROR") {
							$("#ProjectListTable_Shadow").hide();
							$("#ProjectListTable_Error").show();
							$("#ProjectListTable_Error")
									.append(
											"<div id='ProjectListTable_Errordiv'>后台发生错误</br>请<a href='javascript:ProjectListTable_AJAX();'class='pagecolor'>刷新</a></div>");
							return;
						}
						try {
							var myobj = eval('(' + data + ')');
						} catch (Error) {
							$("#ProjectListTable_Shadow").hide();
							$("#ProjectListTable_Error").show();
							$("#ProjectListTable_Error")
									.append(
											"<div id='ProjectListTable_Errordiv'>数据转换失败,格式不正确</br>请<a href='javascript:ProjectListTable_AJAX();'class='pagecolor'>刷新</a></div>");
							return;
						}
						if (myobj == undefined) {
							$("#ProjectListTable_Shadow").hide();
							$("#ProjectListTable_Error").show();
							$("#ProjectListTable_Error")
									.append(
											"<div id='ProjectListTable_Errordiv'>未获取到数据</br>请<a href='javascript:ProjectListTable_AJAX();'class='pagecolor'>刷新</a></div>");
							return;
						}
						var Table = $("#ProjectListTable");
						var itemCountNode = myobj["itemCount"];

						if (itemCountNode != undefined) {
							ChangePageCount(Table, itemCountNode);// 将当前页以及总页数保存在页面中
						}
						var iRow = 0;
						// 将查询到的一页数据填充至表格
						for ( var i in myobj["projectList"]) {
							if (iRow >= iMaxRow)
								break;
							var item = myobj["projectList"][i];

							var rowData = [];
							if (item["strGuid"] != undefined
									&& item["strGuid"] != null)
								SetColDataAttr($("#prolist" + i),
										item["strGuid"]);

							// 应该绑定guid(必须的)
							if (item["projectStatus"] == "0") {
								rowData[0] = '<img alt="项目已禁用" title="项目已禁用" src="../images/ballyellow.png" />';
							} else if (item["projectStatus"] == "1") {
								rowData[0] = '<img alt="有设备在线" title="有设备在线" src="../images/ballgreen.png" />';
							} else if (item["projectStatus"] == "2") {
								rowData[0] = '<img alt="无设备在线" title="无设备在线" src="../images/ballblack.png" />';
							}
							rowData[0] += '<label  onmousemove="tablemove(this,event)" onmouseout="tableout()">' + item["strProjectName"] + '</label>';
							if (item["strProjectDescription"] != undefined) {
								rowData[1] = '<label  onmousemove="tablemove(this,event)" onmouseout="tableout()">' + item["strProjectDescription"] + '</label>';
							} else {
								rowData[1] = undefined;
							}

							if (item["isUsable"] == "0") {
								rowData[2] = '<a title="此项目被禁用,点击恢复" onclick="ChangeProjectState(this,true);"><img src="../images/lock_small_locked.png" /></a>';
							} else {
								rowData[2] = '<a title="此项目可用,点击禁用" onclick="ChangeProjectState(this,false);"><img src="../images/lock_small_unlocked.png" /></a>';
							}

							FillTableRow(table, iRow, rowData);
							iRow++;
						}
						$("#ProjectListTable_Shadow").hide();
					});

}
function queryProTable() {
	$("#PageInput").val("1");
	$("#ProjectListTable").data("beginIndex", 0);// 清除之前的数据
	ProjectListTable_AJAX();
}
function ChangeProjectState(obj, isUsable) {
	if (isUsable) {
		if (!confirm("当前项目已被禁用，确定要恢复此项目为可用状态？")) {
			return;
		}
	} else {
		if (!confirm("当前项目可用，确定要禁用此项目？")) {
			return;
		}
	}

	var objParentTrId = $(obj).parent().parent().attr("id");
	//alert(objParentTrId);
	if (objParentTrId === undefined)
		return;
	var guid = $("#" + objParentTrId).data("guid");
	if (guid === undefined || guid === "" || guid == null)
		return;
	//alert(guid);

	var param = [];
	param["Guid"] = encodeURI(guid);
	param["isUsable"] = encodeURI(isUsable);
	param["random"] = newGuid();
	$("#ProjectListTable_Shadow").show();
	var url = "/servlet/ChangeProjectStateServlet" + GetURLParam(param);
	$
			.get(url, {
				Action : "get"
			}, function(data, textStatus) {
				if (textStatus != "success") {
					alert("请求错误！");
					$("#ProjectListTable_Shadow").hide();
					return;
				}

				if (data === "ERROR") {
					alert("后台发生错误！");
					$("#ProjectListTable_Shadow").hide();
					return;
				}
				try {
					var myobj = eval('(' + data + ')');
				} catch (Error) {
					alert("数据转换失败！");
					$("#ProjectListTable_Shadow").hide();
					return;
				}
				if (myobj == undefined) {
					alert("未获取到数据！");
					$("#ProjectListTable_Shadow").hide();
					return;
				}

				//修改此行==项目状态灯图标，操作图标，
                var firstTdImg = $(obj).parent().parent().children()
                        .first().find("img");

                //更新状态灯
                if (myobj["projectStatus"] == "0") {
                    firstTdImg.attr("src", "../images/ballyellow.png");
                    firstTdImg.attr("alt", "项目已禁用");
                    firstTdImg.attr("title", "项目已禁用");
                } else if (myobj["projectStatus"] == "1") {
                    firstTdImg.attr("src", "../images/ballgreen.png");
                    firstTdImg.attr("alt", "有设备在线");
                    firstTdImg.attr("title", "有设备在线");

                } else if (myobj["projectStatus"] == "2") {
                    firstTdImg.attr("src", "../images/ballblack.png");
                    firstTdImg.attr("alt", "无设备在线");
                    firstTdImg.attr("title", "无设备在线");
                }

                //更新操作图标
                if (myobj["isUsable"] == "0") {
                    $(obj)
                            .parent()
                            .html(
                                    '<a title="此项目被禁用,点击恢复" onclick="ChangeProjectState(this,true);"><img src="../images/lock_small_locked.png" /></a>');
                } else {
                    $(obj)
                            .parent()
                            .html(
                                    '<a title="此项目可用,点击禁用" onclick="ChangeProjectState(this,false);"><img src="../images/lock_small_unlocked.png" /></a>');
                }

                $("#ProjectListTable_Shadow").hide();
                alert("操作成功！");
            });
}
$(function() {
	InsertProjectNullRow($("#ProjectListTable"), 10, 3);// 插入10条空数据

	var shadowCSS = [];
	shadowCSS["width"] = $("#ProjectListTable").width();
	shadowCSS["height"] = $("#ProjectListTable").height();

	$("#detailarticle").css('height', $("#listarticle").height());

	$("#ProjectListTable_Shadow").css(shadowCSS);
	$("#ProjectListTable_Error").css(shadowCSS);
	$("#ProjectListTable_Error").hide();
	$("#ProjectListTable_Shadow").show();

	var table = $("#ProjectListTable");
	SetTableAttr(table, true, 10, 3);

	SetPageCtrlTable("#ProjectListTable", ProjectListTable_AJAX);
	ProjectListTable_AJAX();

	// 单击table的某一行变色
	$("#ProjectListTable tr td").bind("click", function() {
		$("#ProjectListTable tr").removeClass("tdClickColor");// 移除其他颜色
			$(this).parent().addClass("tdClickColor");// 当前点击的变色
			SeeProDetail(this);
		});
	// 移动至td的某个对象字变色
	$("#ProjectListTable tr td").bind("mouseover", function() {
		$(this).addClass("tdMouseOver");
	});
	$("#ProjectListTable tr td").bind("mouseout", function() {
		$(this).removeClass("tdMouseOver");
	});

});
function InsertProjectNullRow(tableObj, rowInsertCount, colInsertCount) {
	var tbody = tableObj.find("tbody").eq(0);
	for ( var k = 0; k < rowInsertCount; k++) {
		var row = $("<tr id='prolist" + k + "'></tr>");
		for ( var i = 0; i < colInsertCount; i++) {
			if (i == 0) {
				row.append($("<td class='hide'>&nbsp;</td>"));
				continue;
			}
			row.append($("<td align='center' class='hide'>&nbsp;</td>"));
		}
		tbody.append(row);
	}
}
