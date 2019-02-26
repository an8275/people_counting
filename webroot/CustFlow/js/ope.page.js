//关联pagectrl和table
function SetPageCtrlTable(tableid, call_ajax_func) {
	var tableObj = $(tableid);
	if (tableObj === undefined)
		return;
	tableObj.data("call_ajax", call_ajax_func);
	var pageTable = tableObj.next("table");//获取到的是分页的那个表
//	var pageTable=tableObj.find("tfoot").eq(0);
	if (pageTable === undefined)
		return;

	pageTable.data("tableid", tableid);

	var toppage = pageTable.find("#TopPage");
	if (toppage !== undefined) {
		toppage.data("tableid", tableid);
	}

	var PreviousPage = pageTable.find("#PreviousPage");
	if (PreviousPage !== undefined) {
		PreviousPage.data("tableid", tableid);
	}

	var PageInput = pageTable.find("#PageInput");
	if (PageInput !== undefined) {
		PageInput.data("tableid", tableid);
	}

	var NextPage = pageTable.find("#NextPage");
	if (NextPage !== undefined) {
		NextPage.data("tableid", tableid);
	}

	var BottomPage = pageTable.find("#BottomPage");
	if (BottomPage !== undefined) {
		BottomPage.data("tableid", tableid);
	}
	pageTable.find("#PageInput").val("1");//初始值为1
}

//首页
function OnClick_TopPage(obj) {
	//alert("首页");
	var tableid = $(obj).data("tableid");
//alert(tableid);
	if (tableid === undefined)
		return;

	var tableObj = $(tableid);
	if (tableObj === undefined)
		return;
	var beginIndex = tableObj.data("beginIndex");
	if (beginIndex === 0)
		return;

	var beginIndex = 0;
	tableObj.data("beginIndex", beginIndex);
	$("#PageInput").val("1");
	//$("#PageInput2").val("1");

	CallTableAjax(tableid);
}

// 上一页
function OnClick_PreviousPage(obj) {
	//alert("上页");
	//alert(obj);
	var tableid = $(obj).data("tableid");
	if (tableid === undefined)
		return;

	var tableObj = $(tableid);//显示信息的表FaceTable
	if (tableObj === undefined)
		return;

	var beginIndex = tableObj.data("beginIndex");
	if (beginIndex === undefined)
		return;
	if (beginIndex === 0)
		return;
	var rowmax = GetMaxRow(tableObj);
	beginIndex -= rowmax;
	if (beginIndex < 0)//保证不小于0
		beginIndex = 0;
	tableObj.data("beginIndex", beginIndex);

	var Table = $("#PageInput");

	CallTableAjax(tableid);
	$("#PageInput").val(Math.ceil((beginIndex + 1) / rowmax));
	//$("#Text1").val(Math.ceil((beginIndex+1) / rowmax));
}

//下一页
function OnClick_NextPage(obj) {
	//alert("下页");
    var tableid = $(obj).data("tableid");

	if (tableid === undefined)
		return;

	var tableObj = $(tableid);
	if (tableObj === undefined)
		return;

	var beginIndex = tableObj.data("beginIndex");
	//alert("beginIndex:"+beginIndex);
	//alert($(obj).data("tableid"));
	if (beginIndex === undefined)
		return;
	var rowmax = GetMaxRow(tableObj);
	if (rowmax === undefined)
		rowmax = 10;
	beginIndex += rowmax;
	var itemCount = GetTableItemCount(tableObj);
	//alert("itemCount:"+itemCount);
	//alert("beginIndex:"+beginIndex);
	//    alert("asd"+itemCount);
	if (itemCount != undefined && beginIndex >=itemCount)//保证不大于总记录数
		// beginIndex -= 10;
		return;

	tableObj.data("beginIndex", beginIndex);
	
	CallTableAjax(tableid);
	//alert("beginIndex:"+beginIndex);
	//alert("rowmax:"+rowmax);
	//alert(Math.ceil((beginIndex + 1) / rowmax));
	$("#PageInput").val(Math.ceil((beginIndex + 1) / rowmax));
	//$("#Text1").val(Math.ceil((beginIndex+1) / rowmax));
}

//最后一页
function OnClick_BottomPage(obj) {
	//alert("末页");
	var tableid = $(obj).data("tableid");
	if (tableid === undefined) {
		return;
	}

	var tableObj = $(tableid);
	if (tableObj === undefined)
		return;

	var itemCount = tableObj.data("itemCount");
	if (itemCount === undefined)
		return;
	var rowmax = GetMaxRow(tableObj);
	if (rowmax === undefined)
		rowmax = 10;
	//	if (itemCount <= 10)
	//		return;
	if (itemCount <= rowmax)
		return;
	var beginIndex = tableObj.data("beginIndex");

	var iTmp = itemCount % rowmax;
	if (iTmp == 0) {
		if (beginIndex === itemCount - rowmax)
			return;
		beginIndex = itemCount - rowmax;
	} else {
		if (beginIndex === itemCount - iTmp)
			return;
		beginIndex = itemCount - iTmp;
	}

	//    var beginIndex=( itemCount%10 ==0 ? (itemCount - 10 ):(Math.floor(itemCount / 10)  *10));

	tableObj.data("beginIndex", beginIndex);

	CallTableAjax(tableid);
	$("#PageInput").val(Math.ceil((beginIndex + 1) / rowmax));
	//$("#PageInput2").val(Math.ceil((beginIndex+1) / rowmax));
}

function ChangePageCount(tableObj, itemCount) {//修改页数值
	if (tableObj === undefined)
		return;

	tableObj.data("itemCount", itemCount);

	var div = tableObj.parents("div");
	if (div === undefined)
		return;

	var pageTable = div.find("#PageCtrl");
	if (pageTable === undefined)
		return;

	var span = pageTable.find("#PageCount");
//	alert(span.innerHTML);
	if (span === undefined)
		return;

	var rowmax = GetMaxRow(tableObj);
	var pageCount = 1;
	if (itemCount != null && itemCount != 0 && rowmax != null && rowmax != 0) {
		pageCount = Math.ceil(itemCount / rowmax);//计算总页数
	}
	span.get(0).innerHTML = "(1-" + pageCount + ")";
//	alert("itemCount:" + itemCount);
//	alert("rowmax:" + rowmax);

}

function getEnter(obj, evt) {
	//alert("enter");
	if (evt.keyCode == 13) {
		var tableid = $(obj).data("tableid");
		if (tableid === undefined)
			return;
		//alert(tableid);输出结果为#FaceTable
		var tableObj = $(tableid);
		if (tableObj === undefined)
			return;
		var iPageIndex = checkmath(obj) - 1;//判断是否为数字
		//		var beginIndex = iPageIndex * 10;
		var rowmax = GetMaxRow(tableObj);
		if (rowmax === undefined)
		rowmax = 10;
		var beginIndex = iPageIndex * rowmax;
		var itemCount = tableObj.data("itemCount");
		//        alert(itemCount);
		if (beginIndex > itemCount || iPageIndex == -1) {
			alert("Please enter a valid page number!");
			$("#PageInput").val("");
			//$("#Text1").val("");
			return;
		}
		tableObj.data("beginIndex", beginIndex);
		CallTableAjax(tableid);
	}
}

function CallTableAjax(tableid) {
    var call_ajax = $(tableid).data("call_ajax");
	if (call_ajax === undefined)
		return;
	call_ajax();
}

function GetTableBeginIndex(tableObj) {
	if (tableObj === undefined)
		return;
	var beginIndex = tableObj.data("beginIndex");
	if (beginIndex === undefined) {
		beginIndex = 0;
		tableObj.data("beginIndex", beginIndex);
	}
	return beginIndex;
}

function GetTableItemCount(tableObj) {
	if (tableObj === undefined)
		return;
	var beginIndex = tableObj.data("itemCount");
	if (beginIndex === undefined) {
		beginIndex = 0;
		tableObj.data("itemCount", beginIndex);
	}
	return beginIndex;
}

function checkmath(input) {
	input.value = input.value.replace(/\D/g, '');
	return input.value;
}
