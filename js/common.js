//等待圈出现
function showDiv(){
	$("#showDiv").css("display", "block");
}

//等待圈消失
function hideDiv(){
	$("#showDiv").css("display", "none");
}


/**
 * 跳转到指定页面
 * @param	{[type]} Func 处理当前页码的函数
 */
function jumpPage(Func, id){
	var pageIndex = $("#pageIndex").val();
	var totalPage = parseInt($("#totalPage").html());
	//判断当前页
	if(!pageIndex || pageIndex <= 0) {
		alert("请输入正确的页码");
	} else if(pageIndex > totalPage) {
		alert("请输入正确的页码");
	} else {
		if (id) {
			Func(pageIndex - 1, id);
		} else {
			Func(pageIndex - 1);
		}
	}
	pageIndex = '';
}

/**
 * 跳转到前一页
 * @param	{[type]} Func 处理当前页码的函数
 */
function getBeforePage(Func, id) {
	//判断当前页
	var currentPage = parseInt($("#currentPage").html());
	if(currentPage > 1) {
		if (id) {
			Func(currentPage - 2, id);
		} else {
			Func(currentPage - 2);
		}
	}
}

/**
 * 跳转到后一页
 * @param	{[type]} Func 处理当前页码的函数
 */
function getAfterPage(Func, id) {
	var currentPage = parseInt($("#currentPage").html());
	var totalPage =$("#totalPage").html();
	//判断当前页
	if(currentPage <= totalPage) {
		if (id) {
			Func(currentPage, id);
		} else {
			Func(currentPage);
		}
	}
}

//分页处理
var pageInfo = {
	currentPage : 1,
	pageCount : 10
};

/**
 * 显示页数和总页数
 * @param	{[type]} total	 总个数
 * @param	{[type]} pageNum 总页数
 */
function dealWithPage(total, pageNum){
	//当前第几页
	var currentPage = parseInt($("#currentPage").html());
	//如果传入总页数
	if (pageNum) {
		//判断是否第一页
		if (pageNum == 1) {
			$("#totalPage").html(pageNum);
			$('#afterPage').attr('disabled',true);
			$('#beforePage').attr('disabled',true);
			$('#pageIndex').attr('disabled',true);
			$('#jumpBtn').attr('disabled',true);
		} else {
			//设置按钮可点击
			$('#beforePage').attr('disabled',false);
			$('#afterPage').attr('disabled',false);
			$('#pageIndex').attr('disabled',false);
			$('#jumpBtn').attr('disabled',false);
			//判断是否第一页
			if(currentPage <= 1) {
				$('#beforePage').attr('disabled',true);
			}
		}
	} else {
		//如果传入总个数
		var pageTotal = total;
		if(!total || total == 0) {
			//总条数赋值
			pageTotal = 0;
			$("#currentPage").html = 0;
			$("#totalPage").html = 0;
			//按钮不可点击
			clickEnable();
		} else {
			//判断数据
			if(pageTotal > pageInfo.pageCount) {
				//设置按钮可点击
				$('#beforePage').attr('disabled',false);
				$('#afterPage').attr('disabled',false);
				$('#pageIndex').attr('disabled',false);
				$('#jumpBtn').attr('disabled',false);
				//判断是否第一页
				if(currentPage <= 1) {
					$('#beforePage').attr('disabled',true);
				}
			} else {
				//按钮不可点击
				clickEnable();
			}
			//总页数
			var totalPage = parseInt(pageTotal / pageInfo.pageCount) + (pageTotal % pageInfo.pageCount > 0 ? 1 : 0);
			$("#totalPage").html(totalPage);
			//判断是否第一页
			if(currentPage == totalPage) {
				$('#afterPage').attr('disabled',true);
			}
		}
	}
};

//设置不可点击
function clickEnable(){
	//按钮不可点击
	$('#beforePage').attr('disabled',true);
	$('#afterPage').attr('disabled',true);
	$('#pageIndex').attr('disabled',true);
	$('#jumpBtn').attr('disabled',true);
};