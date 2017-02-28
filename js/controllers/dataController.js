define(['./controllers', '../services/services', '../services/orderService', '../directives/directives', 'async!baiduAPI'], function(controllers){

	controllers.controller('dataController', [function(){
		var map = new BMap.Map("map", {minZoom:4,maxZoom:5});      // 创建Map实例, 设置地图允许的最小/大级别
		map.centerAndZoom(new BMap.Point(116.404, 39.915), 5);     // 初始化地图,设置中心点坐标和地图级别
		map.enableScrollWheelZoom();                            //启用滚轮放大缩小
		if (document.createElement('canvas').getContext) {
			var mapStyle = {
				features: ["road", "building","water","land"],//隐藏地图上的poi
				style : "dark"  //设置地图风格为高端黑
			};
			map.setMapStyle(mapStyle);

			var BW            = 0,    //canvas width
				BH            = 0,    //canvas height
				ctx           = null,
				stars         = [],   //存储所有星星对象的数组
				timer         = null, //定时器
				timeLine      = null, //时间轴对象
				rs            = [],   //最新的结果
				isNowTimeData = false, //是否显示当前时间的定位情况
				py            = null, //偏移
				gridWidth     = 10000,//网格的大小
				isOverlay     = true,//是否叠加
				//gridWidth   = 1,//网格的大小
				country       = [{name: 'Canada', num: 40},
								{name: 'Germany', num: 1000},
								{name: 'Japan', num: 1000},
								{name: 'Australia', num: 1000},
								{name: 'South Korea', num: 1000},
								{name: 'North Korea', num: 1000},
								{name: 'Thailand', num: 1000},
								{name: 'China', num: 1000},
								{name: 'Brazil', num: 1000},
								{name: 'Russia', num: 1000},
								{name: 'Mexico', num: 1000},
								{name: 'Poland', num: 1000}], //国家
				city          = [{name: '杭州', num: 15},
								{name: '上海', num: 4000},
								{name: '重庆', num: 2000},
								{name: '南昌', num: 2000},
								{name: '武汉', num: 2000},
								{name: '郑州', num: 2000},
								{name: '北京', num: 2000},
								{name: '广州', num: 2000},
								{name: '深圳', num: 2000},
								{name: '成都', num: 2000},
								{name: '合肥', num: 2000},
								{name: '西安', num: 2000},
								{name: '南京', num: 2000},
								{name: '天津', num: 2000},
								{name: '青海', num: 2000},
								{name: '青岛', num: 2000},
								{name: '济南', num: 2000},
								{name: '三亚', num: 2000},
								{name: '珠海', num: 2000}];//城市
				cityArray     = [],
				countrys      = [],
				canvas        = null; //偏移

			function Star(options){
				this.init(options);
			}

			Star.prototype.init = function(options) {
				this.x   = ~~(options.x);
				this.y   = ~~(options.y);
				this.name = options.name;
				this.initSize(options.size);

				if (~~(0.5 + Math.random() * 7) == 1) {
					this.size = 0;
				} else {
					this.size = this.maxSize;
				}
			}

			Star.prototype.initSize = function(size) {
				var size = ~~(size);
				// this.maxSize = size/100;
				this.maxSize = size > 8 ? 8 : size;
			}

			Star.prototype.render = function(i) {
				var p = this;

				if(p.x < 0 || p.y <0 || p.x > BW || p.y > BH) {
					return;
				}

				ctx.beginPath();
				var gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
				gradient.addColorStop(0, "rgba(7,120,249,1)");
				gradient.addColorStop(1, "rgba(7,120,249,0.3)");
				ctx.fillStyle = gradient;
				ctx.font = "14px Microsoft Yahei";
				ctx.fillText(p.name, p.x+p.size, p.y, 800);
				ctx.arc(p.x, p.y, p.size, Math.PI*2, false);
				ctx.fill();
				if (~~(0.5 + Math.random() * 7) == 1) {
					p.size = 0;
				} else {
					p.size = p.maxSize;
				}
			}

			function render(){
				renderAction();
				setTimeout(render, 180);
			}

			function renderAction() {
				ctx.clearRect(0, 0, BW, BH);
				ctx.globalCompositeOperation = "lighter";
				for(var i = 0, len = stars.length; i < len; ++i){
					if (stars[i]) {
						stars[i].render(i);
					}
				}
			}


			// 复杂的自定义覆盖物
			function ComplexCustomOverlay(point){
			  this._point = point;
			}
			ComplexCustomOverlay.prototype = new BMap.Overlay();
			ComplexCustomOverlay.prototype.initialize = function(map){
				this._map = map;
				canvas = this.canvas = document.createElement("canvas");
				canvas.style.cssText = "position:absolute;right:0;top:0;";
				ctx = canvas.getContext("2d");
				var size = map.getSize();
				canvas.width = BW = size.width;
				canvas.height = BH = size.height;
				map.getPanes().labelPane.appendChild(canvas);
				return this.canvas;
			}
			ComplexCustomOverlay.prototype.draw = function(){
				var map = this._map;
				var bounds = map.getBounds();
				var sw = bounds.getSouthWest();
				var ne = bounds.getNorthEast();
				var pixel = map.pointToOverlayPixel(new BMap.Point(sw.lng, ne.lat));
				py = pixel;
				if (cityArray.length > 0 && countrys.length > 0) {
					showStars();
				}
			}
			var myCompOverlay = new ComplexCustomOverlay(new BMap.Point(116.407845,39.914101));
			map.addOverlay(myCompOverlay);

			// var project = map.getMapType().getProjection();//实例化后可进行墨卡托坐标与百度坐标转换
			// var bounds = map.getBounds();
			// var sw = bounds.getSouthWest();
			// var ne = bounds.getNorthEast();
			// sw = project.lngLatToPoint(new BMap.Point(sw.lng, sw.lat));
			// ne = project.lngLatToPoint(new BMap.Point(ne.lng, ne.lat));

			// //左上角墨卡托坐标点
			// var original = {
			// 	x : sw.x,
			// 	y : ne.y
			// }

			
			//遍历国家，获取经纬度
			function getCountry(){
				for (var i = 0; i < country.length; i++) {
					var countryItem = country[i];
					for (var j = 0; j < countryArray.length; j++) {
						if(countryItem.name == countryArray[j].name){
							countrys.push({
								lng : countryArray[j].longitude,
								lat : countryArray[j].latitude,
								size : countryItem.num,
								name : countryItem.name
							});
							break;
						}
					}
				}
				setTimeout(showStars, 1000);
			}
			getCountry();
			bdGEO();
			
			//将城市转换成经纬度
			function bdGEO(){
				var myGeo = new BMap.Geocoder(); 
				for (var i = 0; i < city.length; i++) {
					var cityItem = city[i];
					(function(arg){
						myGeo.getPoint(arg.name, function(point){ //对指定的地址进行解析。如果地址定位成功，则以地址所在的坐标点Point为参数调用回调函数。否则，回调函数的参数为null。city为地址所在的城市名，例如“北京市”
							if (point) {
								var address = new BMap.Point(point.lng, point.lat);
								var obj = {
									lng : address.lng,
									lat : address.lat,
									size : arg.num,
									name : arg.name
								};
								cityArray.push(obj);
							}
						});
					})(cityItem);
				}
			}
			

			//显示星星
			function showStars() {
				stars.length = 0;
				var arr = countrys.concat(cityArray);// 将城市与国家合并
				for (var i = 0, len = arr.length; i < len; i++) {
					var point = new BMap.Point(arr[i].lng, arr[i].lat);
					var px = map.pointToOverlayPixel(point); // 根据地理坐标获取对应的覆盖物容器的坐标
					//create all stars
					var s = new Star({
						x: px.x - py.x, 
						y: px.y - py.y,
						size: arr[i].size,
						name : arr[i].name
					});
					stars.push(s);
				}
				canvas.style.left = py.x + "px";
				canvas.style.top = py.y + "px";
				renderAction();
			}
			render();
		} else {
			alert('请在chrome、safari、IE8+以上浏览器查看本示例');
		}
	}])
})