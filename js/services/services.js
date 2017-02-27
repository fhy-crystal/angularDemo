define(['angular'], function(angular) {
	var services = angular.module('services', []);

	services.factory('httpService', ['$http', '$rootScope', '$cookies', '$q', function($http, $rootScope, $cookies, $q){
		var baseUrl = "http://172.16.10.246:8900/dlicense/v1/";
		return {
			http: function(url, dataObj, header) {
				showDiv();
				$rootScope.globals = $cookies.getObject('globals');
				var headerData = {};
				if ($rootScope.globals != null) {
					headerData = {
						'ReqUserSession' : $rootScope.globals.loginSession,
						'ReqUserId' : $rootScope.globals.userid,
						'ReqType': 'manage'
					};
					//如果存在groupId、groupType,则添加到header中
					if($rootScope.globals.groupId && $rootScope.globals.groupId != "undefined"){
						headerData.ManageGroupId = $rootScope.globals.groupId;
					}
					if ($rootScope.globals.groupType && $rootScope.globals.groupType != "undefined") {
						headerData.ManageGroupType = $rootScope.globals.groupType;
					}
				}
				if (header) {
					jQuery.extend(headerData, header);
				}
				var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
				$http({
					method : 'get',
					url : baseUrl + url,
					params : dataObj,
					cache : false,
					headers : headerData
				}).
				success(function(data, status, headers, config) {
					hideDiv();
					deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
				}).
				error(function(data, status, headers, config) {
					hideDiv(); 
					deferred.reject(data); // 声明执行失败，即服务器返回错误
				});
				return deferred.promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
			},
			httpJson: function(url, dataObj, header) {
				showDiv();
				$rootScope.globals = $cookies.getObject('globals');
				var headerData = {};
				if ($rootScope.globals != null) {
					headerData = {
						'ReqUserSession' : $rootScope.globals.loginSession,
						'ReqUserId' : $rootScope.globals.userid,
						'ReqType': 'manage'
					};
					//如果存在groupId、groupType,则添加到header中
					if($rootScope.globals.groupId && $rootScope.globals.groupId != "undefined"){
						headerData.ManageGroupId = $rootScope.globals.groupId;
					}
					if ($rootScope.globals.groupType && $rootScope.globals.groupType != "undefined") {
						headerData.ManageGroupType = $rootScope.globals.groupType;
					}
				}
				if (header) {
					jQuery.extend(headerData, header);
				};
				var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
				$http({
					method : 'post',
					url : baseUrl + url,
					data : dataObj,
					cache : false,
					headers : headerData
				}).
				success(function(data, status, headers, config) {
					hideDiv();
					deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
				}).
				error(function(data, status, headers, config) {
					hideDiv();
					deferred.reject(data); // 声明执行失败，即服务器返回错误
				});
				return deferred.promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
			},
			httpFile: function(url, dataObj, header){
				showDiv();
				$rootScope.globals = $cookies.getObject('globals');
				var headerData = {};
				if ($rootScope.globals != null) {
					headerData = {
						'ReqUserSession' : $rootScope.globals.loginSession,
						'ReqUserId' : $rootScope.globals.userid,
						'ReqType': 'manage'
					};
					//如果存在groupId、groupType,则添加到header中
					if($rootScope.globals.groupId && $rootScope.globals.groupId != "undefined"){
						headerData.ManageGroupId = $rootScope.globals.groupId;
					}
					if ($rootScope.globals.groupType && $rootScope.globals.groupType != "undefined") {
						headerData.ManageGroupType = $rootScope.globals.groupType;
					}
				}
				if (header) {
					jQuery.extend(headerData, header);
				}
				var httpObj = {
						method: 'post',
						url : baseUrl + url,
						data: dataObj,
						headers: headerData,
						transformRequest: function(data) {
						var formData = new FormData();
						formData.append('file', data.file);
						return formData;
					}
				};
				var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
				$http(httpObj).
				success(function(data, status, headers, config) {
					hideDiv();
					deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
				}).
				error(function(data, status, headers, config) {
					hideDiv();
					deferred.reject(data); // 声明执行失败，即服务器返回错误
				});
				return deferred.promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
			}
		}
	}]);

	services.factory( 'Msg',['$timeout',function ( $timeout ) {
		return function (data, times) {
			var msg='';
			if (angular.isObject(data)) {
				msg = data.msg;
			} else if (angular.isString(data)) {
				msg = data;
			} else {
				$.each(data.data, function(i, n){
					msg = n;
					$('#'+i).focus();
				});
			}
			$(".alert > span").html(msg);
			$(".alert > span").css('color', 'red');
			$(".alert").css('visibility', 'visible');
			$(".alert").show();
			if(times!=0 && times!=null){
				$timeout(function() {
					$(".alert").css('visibility','hidden');
					$(".alert").hide();
				}, times);
			}
			return true;
		}
	}]);

	return services;
})