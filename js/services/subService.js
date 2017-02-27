define(['./services'], function(services){

	services.factory('subService', ['httpService', function(httpService){
		return {
			// 获取历史操作列表
			getActionHis: function(params) {
				return httpService.httpJson('user/workformquery/queryhistory', params);
			}
		};
	}]);

	services.factory('commonList', [function(){
		return {
			actionInfo: [
				{
					key: 0,
					value: '创建订单'
				},{
					key: 1,
					value: '修改订单'
				},{
					key: 2,
					value: '删除订单'
				},{
					key: 3,
					value: '申请工单'
				},{
					key: 4,
					value: '审核通过工单'
				},{
					key: 5,
					value: '审核驳回工单'
				},{
					key: 6,
					value: '工单生成license成功'
				},{
					key: 7,
					value: '工单生成license失败'
				},{
					key: 8,
					value: '工单开始生产'
				},{
					key: 9,
					value: '工单全部装箱完毕'
				},
			]
		};
	}])


})