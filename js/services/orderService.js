define(['./services'], function(services){

	services.factory('orderService', ['httpService', function(httpService){
		return {
			// 获取订单列表
			getOrderList: function(params) {
				return httpService.httpJson('user/workform/query', params);
			},

			// 获取代工厂列表
			getFactoryList: function() {
				return httpService.httpJson('manage/oemfactory/queryreal');
			},

			// 获取销售列表
			getSalesList: function(params) {
				return httpService.httpJson('manage/queryblmanageroleuserlist', params);
			},

			// 获取mtag列表
			getMtagList: function() {
				return httpService.httpJson('manage/getmtaglist');
			},

			// 获取物料编码列表
			getItermCodeList: function() {
				return httpService.httpJson('manage/querymanageproduct');
			},

			// 提交添加的订单
			submitOrder: function(params) {
				return httpService.httpJson('user/workformmodify/add', params);
			},

			// 删除订单
			deleteOrder: function(params) {
				return httpService.httpJson('user/workformmodify/delete', params);
			},

			// 获取订单详情
			orderDetail: function(params) {
				return httpService.httpJson('user/workformquery/detailinfobypid', params);
			},

			// 更新订单
			updateOrder: function(params) {
				return httpService.httpJson('user/workformmodify/update', params);
			}
		};
	}]);


})