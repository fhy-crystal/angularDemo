define(['./controllers', '../services/services', '../services/loginService', '../directives/directives'], function(controllers){

	controllers.controller('loginController', ['$rootScope', '$scope', '$state', '$cookies', 'loginService', 'Msg',function($rootScope, $scope, $state, $cookies, loginService, Msg){
		// 全局cookie
		$rootScope.globals = {};
		// 全局变量
		var globalValue = {
			timeStamp: '',
			passwordkey: '4969fj#k23#',
			tokenKey: 'xgx3d*fe3478$ukx',
			sha1Password: '',
			postBody: '',
			header: '',
			md5Token: '',
			expireDate: ''
		};

		// 设置cookie有效值
		globalValue.expireDate = new Date();
		globalValue.expireDate.setDate(globalValue.expireDate.getDate() + 1); // 一天有效期
		// 点击登录
		$scope.login = function() {
			// 获取timestamp
			loginService.getTimeStamp().then(function(data) {
				if (data.status == 0) {
					globalValue.timeStamp = data.timestamp;
					loginMethod();
				} else {
					Msg(data.msg, 3000);
				}
			}, function(data) {
				Msg(data.msg, 3000);
			})
		}

		//enter键跳转
		$(".psw").keypress(function(event) {
			var e = event || window.event;
			if (e.which == 13) {
				$scope.login();
			}
		});

		// 登录的具体方法
		function loginMethod() {
			// 校验表单输入
			if (!$scope.phone) {
				Msg('请输入用户名', 3000);
				return false;
			} else if (!$scope.password) {
				Msg('请输入密码', 3000);
				return false;
			}

			// 加密
			globalValue.sha1Password = hex_sha1($scope.password + globalValue.passwordkey);

			globalValue.postBody = {
				'phone' : $scope.phone,
				'password' : globalValue.sha1Password
			};
			//取得md5加密之后的token
			globalValue.md5Token = hex_md5(JSON.stringify(globalValue.postBody) + globalValue.tokenKey);
			//取得head数据
			globalValue.header = {
				'timestamp' : globalValue.timestamp,
				'token' : globalValue.md5Token
			};

			loginService.login(globalValue.postBody, globalValue.header).then(function(data) {
				if (data.status == 0) {
					$rootScope.globals = {
						"nickname": data.nickname,
						"userid": data.userid,
						"loginSession": data.loginsession
					};
					$cookies.putObject('globals', $rootScope.globals, {'expires': globalValue.expireDate});
					hasGroupId();
				} else {
					Msg(data.msg, 1500);
				}
			}, function(data) {
				Msg(data.msg, 1500);
			})
		}

		// 是否有groupid
		function hasGroupId() {
			loginService.getGroupId().then(function(data) {
				if (data.status == 0) {
					$rootScope.globals.groupId = data.data.groupid;
					$rootScope.globals.groupType = data.data.grouptype;
					$cookies.putObject('globals', $rootScope.globals, {'expires': globalValue.expireDate});
					$state.go('lifesystem.subscribe');
				} else {
					Msg(data.msg, 1500);
				}
			}, function(data) {
				Msg(data.msg, 1500);
			})
		}
	}])
})