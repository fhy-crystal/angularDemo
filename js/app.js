define([
	'jquery', 
	'angular', 
	'angular_route', 
	'ngCookies', 
	'encryption',
	'async',
	'bootstrap_min',
	'common',
	'country',
	'baiduAPI',
	'./controllers/index',
	'./directives/index',
	'./filters/index',
	'./services/index'
	], function(jquery, angular, angular_route, ngCookies, encryption) {
		var app = angular.module('app', [
			'ngCookies',
			'ui.router',
			'services', 
			'directives', 
			'filters', 
			'controllers'
		]);

		app.run(['$rootScope', '$state', '$stateParams', '$location', '$cookies', function($rootScope, $state, $stateParams, $location, $cookies){
			// It's very handy to add references to $state and $stateParams to the $rootScope
			// so that you can access them from any scope within your applications.For example,
			// <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
			// to active whenever 'contacts.list' or one of its decendents is active.
			$rootScope.$state = $state;
			$rootScope.$stateParams = $stateParams;
			$rootScope.globals = $cookies.getObject('globals');

			$rootScope.$on("$locationChangeStart", function (event, next, current) {
				//登录页面 清除cookie
				if($location.url() == '/login') {
					$cookies.remove();
					$rootScope.globals = null;
				}

				if ($rootScope.globals == null) {
					if ($location.url() == '/register' || $location.url() == '/retrieve') {

					} else {
						//判断为未登录用户，则跳转到登录界面
						if (next.templateUrl == "login.html") {
							//当前为登录界面不需要进行路径跳转
							console.debug("用户未登录");
						} else {
							//当前不是登录界面，要跳转到登录界面
							$state.go('login');
						}
					}
				}
			});

		}]);

		app.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
			$urlRouterProvider.otherwise('login');
			$stateProvider
				// 登录
				.state('login', {
					url: '/login',
					views: {
						'mainheader@': {},
						'maincontent': {
							templateUrl: 'login.html',
							controller: 'loginController'
						},
						'footer@': {}
					}
				})
				// 父级页面
				.state('lifesystem', {
					url: '/lifesystem',
					views: {
						'mainheader@': {
							templateUrl: 'header.html',
							controller: 'headerController'
						},
						'maincontent': {
							templateUrl: 'menu.html',
							controller: 'menuController'
						},
						'footer@': {}
					}
				})
				// 订阅
				.state('lifesystem.subscribe', {
					url: '/subscribe',
					templateUrl: 'page_subscribe/history.html',
					controller: 'subController'
					
				})
				// 订单
				.state('lifesystem.order', {
					url: '/orderList',
					templateUrl: 'page_order/orderList.html',
					controller: 'orderController'
				})
				// 数据统计
				.state('lifesystem.data', {
					url: '/dataStatistics',
					templateUrl: 'page_data/map.html',
					controller: 'dataController'
				})
		}])

		return app;
})