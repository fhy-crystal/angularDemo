require.config({
	paths: {
		'jquery':'./libs/jquery-1.9.1.min',
		'angular': './libs/angular-1.5.8.min',
		'angular_route': './libs/angular-ui-router.min',
		'ngCookies':'./libs/angular-cookies-1.6.1.min',
		'domReady': './libs/domReady', // RequireJS加载模块速度很快，很有可能在页面DOM Ready之前脚本已经加载完毕
		'bootstrap_min':'./libs/bootstrap-3.3.7.min',
		'encryption': './libs/encryption', // 加密处理文件
		'common': './common', // 通用方法
		'country': './country' // 各国家城市的经纬度
	},
	// 不符合AMD（asynchronous module definition）异步模块定义, 如果要加载它们的话，必须先定义它们的特征
	shim: {
		'angular': {
			exports: 'angular'
		},
		'ngCookies':{
			deps: ['angular'] // 表明该模块的依赖性
			// exports:'ngCookies' // 输出的变量名,表明这个模块外部调用时的名称
		},
		'angular_route': {
			deps: ['angular']
		},
		'bootstrap_min': {
			deps: ['jquery']
		},
		'common':{
			deps:['jquery']
		}
	},

	deps: [
		'./demoStart' // 一旦require.js被定义，这些依赖就已加载
	],
	urlArgs: "bust=" + (new Date()).getTime()
})