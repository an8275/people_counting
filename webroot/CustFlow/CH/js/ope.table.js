function SetTableAttr(tableObj, bIsHead, rowMax, colCount) {
	if (tableObj === undefined)
		return;
	if (bIsHead === undefined)
		tableObj.data("IsHead", false);
	else
		tableObj.data("IsHead", bIsHead);
	if (rowMax === undefined)
		tableObj.removeData("rowMax");
	else
		tableObj.data("rowMax", rowMax);

	if (colCount === undefined)
		tableObj.removeData("colCount");
	else
		tableObj.data("colCount", colCount);
}

function IsHaveHead(tableObj) {
	if (tableObj === undefined)
		return false;
	return tableObj.data("IsHead");
}

function GetMaxRow(tableObj) {
	if (tableObj === undefined)
		return undefined;
	return tableObj.data("rowMax");
}

//通过head,算出列个数
function GetTableColNum(tableObj) {
	{ // 如果有配置，则用配置的
		var colCount = tableObj.data("colCount");
		if (colCount != undefined)
			return colCount;
	}

	var colCount = 0;
	var tabHead = tableObj.find("tr:first");
	if (tabHead != undefined) {
		var arrCol = tabHead.find("th");
		colCount = tabHead.find("th").length;
	}
	if (colCount != undefined)
		return colCount;
	return 0;
}

//得到Table行数
function GetTableRowNum(tableObj) {
	var tabHead = tableObj.find("tr");
	var rowNum = tabHead.length;
	if (rowNum != undefined) {
		if (IsHaveHead(tableObj))
			return (rowNum - 1);
		return rowNum;
	}

	return 0;
}

//在表最后，insert指定行数
function InsertTableRow(tableObj, rowInsertCount) {
	var colCount = GetTableColNum(tableObj);
	for ( var k = 0; k < rowInsertCount; k++) {
		var row = $("<tr></tr>");
		for ( var i = 0; i < colCount; i++) {
			row.append($("<td>&nbsp;</td>"));
		}
		//tableObj.append(row);

		var rowInsert = undefined;
		var rowCount = GetTableRowNum(tableObj);
		if (rowCount > 0) {
			if (IsHaveHead(tableObj))
				rowInsert = tableObj.find("tr").eq(rowCount);//找到最后一行
			else
				rowInsert = tableObj.find("tr").eq(rowCount - 1);
		}

		if (rowInsert != undefined) {
			rowInsert.after(row);//插入到最后一行后面
		} else {
			tableObj.append(row);//插入新的一行tr至表首
		}
	}
}

//填充表第row行数据,如果table没有此行，则insert到有此行为止
//rowIndex 从0开始
function FillTableRow(tableObj, rowIndex, arrData) {
	var rowCount = GetTableRowNum(tableObj);
	//alert("rowCount1:" + rowCount);
	//alert("rowIndex:" + rowIndex);
	//alert("arrData:" + arrData);

	if (rowIndex >= rowCount) {
		//alert("enter1");
		InsertTableRow(tableObj, (rowIndex - rowCount + 1)); //大于表格行数的数据
	}

	//alert("enter2");
	if (IsHaveHead(tableObj))
		rowIndex++;

	//alert("enter3");
	var row = tableObj.find("tr").eq(rowIndex);
	if (row === undefined) {
		alert("FillTableRow err");
	}

	//alert("enter4");
	var index = 0;
	var arrCol = row.find("td").get();

	//alert("enter5");
	for ( var i = 0; i < arrCol.length; i++) {
		if (arrData[i] != undefined)
			arrCol[i].innerHTML = arrData[i];
	}
}


//将table表数据清空
function EmptyTableItemDom(tableObj) {
	var colCount = GetTableColNum(tableObj);
	var rowCount = GetTableRowNum(tableObj);
	for ( var row = 0; row < rowCount; row++) {
		for ( var col = 0; col < colCount; col++) {
			var item = GetTableItemDom(tableObj, row, col);
			if (item != undefined)
				item.empty();
		}
	}
}

//将table表数据清空
function ClearTableText(tableObj) {
	var colCount = GetTableColNum(tableObj);
	var clearTextArr = [];
	{
		for ( var i = 0; i < colCount; i++)
			clearTextArr[i] = "&nbsp";
	}

	var rowCount = GetTableRowNum(tableObj);
	for ( var i = 0; i < rowCount; i++)
		FillTableRow(tableObj, i, clearTextArr);//填充空格
}

//删除table一行
//rowIndex 从0开始
function RemoveTableRow(tableObj, rowIndex) {
	if (IsHaveHead(tableObj))
		rowIndex++;
	var row = tableObj.find("tr").eq(rowIndex);
	if (row === undefined) {
		alert("FillTableRow err");
	}
	row.remove();
}

//得到JQuery封装的某行对象
function GetTableRowDom(tableObj, rowIndex) {
	if (IsHaveHead(tableObj))
		rowIndex++;
	var row = tableObj.find("tr").eq(rowIndex);
	return row;
}

//得到JQuery封装的某个item对象
function GetTableItemDom(tableObj, rowIndex, colIndex) {
	if (IsHaveHead(tableObj))
		rowIndex++;
	var row = tableObj.find("tr").eq(rowIndex);
	if (row === undefined) {
		return undefined;
	}
	var col = row.find("td").eq(colIndex);
	return col;
}
function SetColDataAttr(colObj, guid, dataguid,other) {//将数据绑定至表中的每行数据
	if (colObj === undefined)
		return;
	if (guid === undefined)
		colObj.removeData("guid");
	else
		colObj.data("guid", guid);
	if (dataguid === undefined)
		colObj.removeData("dataguid");
	else
		colObj.data("dataguid", dataguid);
	if(other==undefined)
		colObj.removeData("other");
	else
		colObj.data("other",other);
}
//FF只有e.pageX,e.pageY,Chrome两者皆有,ie9及以上两者都有,ie9以下只有e.x,jquery方式只有pageX.
function tablemove(label, e) {
    //alert(e.x);
	//alert(e.pageX+"-"+e.pageY);
	//alert(label.innerHTML);left:10px; top:30px;
	var xZ = e.x ? e.x : e.pageX;
	var yZ = e.y ? e.y : e.pageY;
	var shadowCSS = [];
	shadowCSS["left"] = xZ;
	shadowCSS["top"] = yZ - 20;
	shadowCSS["color"] = "#000";
	shadowCSS["background"] = "#eee";
	$("#tempdiv").css(shadowCSS);
	//	        alert(label.innerHTML);
	document.getElementById("tempdiv").innerHTML = "&nbsp;&nbsp;"
			+ label.innerHTML + "&nbsp;&nbsp;";
	//	        $("#tempdiv").val("Asdasd");
	$("#tempdiv").show();
}
function bulbmove(div, e) {
	//    alert($(div).find("label").html());
	var shadowCSS = [];
	var xZ = e.x ? e.x : e.pageX;
	var yZ = e.y ? e.y : e.pageY;
	shadowCSS["left"] = xZ;
	shadowCSS["top"] = yZ - 20;
	shadowCSS["color"] = "#000";
	shadowCSS["background"] = "#eee";
	$("#tempdiv").css(shadowCSS);
	//	        alert($(div).find("label").html());
	document.getElementById("tempdiv").innerHTML = "&nbsp;&nbsp;"
			+ $(div).find("label").html() + "&nbsp;&nbsp;";
	//	        $("#tempdiv").val("Asdasd");
	$("#tempdiv").show();
}

function tableout() {
	$("#tempdiv").hide();
}

function SetNextIndexData(obj, guid, index) {
	if (obj === undefined)
		return;
	if (guid === undefined)
		obj.removeData("guid");
	else
		obj.data("guid", guid);
	
	if (index === undefined)
		obj.removeData("index");
	else {
		obj.data("index", index);
	}
}

