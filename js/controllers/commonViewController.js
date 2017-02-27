define(['./controllers'], function(controllers){

	controllers.controller('headerController', ['$scope', '$state', '$cookies', 'Msg', function($scope, $state, $cookies, Msg){
		// 退出登录
		$scope.loginOut = function () {
			$cookies.remove('globals');
			$state.go('login');
		}
		// 检测是否cookie是否过期
		var cookie = $cookies.getObject('globals');
		if (!cookie) {
			Msg("请重新登录", 1500);
			$state.go('login');
		}
	}])

	controllers.controller('menuController', ['$rootScope', '$scope', '$state', '$cookies', function($rootScope, $scope, $state, $cookies){
		// 退出登录
		$scope.loginOut = function () {
			$cookies.remove('globals');
			$state.go('login');
		}
		
	}])
})