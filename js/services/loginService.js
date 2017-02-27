define(['./services'],function(services){

	services.factory('loginService', ['httpService', function(httpService){
		return {
			// 获取时间戳
			getTimeStamp: function() {
				return httpService.httpJson('account/login/api');
			},
			// 登录
			login: function(params,header) {
				return httpService.httpJson('account/login/info', params, header);
			}, 
			// 查询是否有管理id
			getGroupId: function() {
				return httpService.httpJson('manage/userrole/queryuserrole');
			}
		};
	}]);


})