define(['./controllers', '../services/services', '../services/subService', '../directives/directives'], function(controllers){

	controllers.controller('subController', ['$rootScope', '$scope', '$state', '$cookies', 'subService', 'Msg', 'commonList', function($rootScope, $scope, $state, $cookies, subService, Msg, commonList){
		$scope.commonList = commonList;
		// 获取历史列表
		getHistoryList(0);
		function getHistoryList(pageIndex) {
			var postBody = {
				'start': pageIndex * 10,
				'len': 10,
			};
			subService.getActionHis(postBody).then(function(data) {
				if (data.status == 0) {
					if (data.result && data.result.length > 0) {
						$("#pager").show();
						$("#currentPage").html(pageIndex + 1);
						dealWithPage(data.totalnum);
						$scope.historyList = data.result;
					} else {
						$scope.historyList = [];
						Msg('无数据', 1500);
					}
				} else {
					Msg(data.msg, 1500);
				}
			}, function(data) {
				Msg(data.msg, 1500);
			})
		}

		// 前一页
		$scope.beforePage = function() {
			getBeforePage(getHistoryList);
		}
		// 后一页
		$scope.afterPage = function() {
			getAfterPage(getHistoryList);
		}
		// 跳转
		$scope.jumpPage = function() {
			jumpPage(getHistoryList);
		}
		// 输入页码enter跳转
		$("#pageIndex").keypress(function(event) {
			var e = event || window.event;
			if (e.which == 13) {
				$scope.jumpPage();
			}
		});
	}])
})