require.config({paths:{jquery:"./libs/jquery-1.9.1.min",angular:"./libs/angular-1.5.8.min",angular_route:"./libs/angular-ui-router.min",ngCookies:"./libs/angular-cookies-1.6.1.min",domReady:"./libs/domReady",bootstrap_min:"./libs/bootstrap-3.3.7.min",encryption:"./libs/encryption",common:"./common"},shim:{angular:{exports:"angular"},ngCookies:{deps:["angular"]},angular_route:{deps:["angular"]},common:{deps:["jquery"]}},deps:["./demoStart"],urlArgs:"bust="+(new Date).getTime()});