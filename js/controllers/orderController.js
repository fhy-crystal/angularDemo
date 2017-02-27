define(['./controllers', '../services/services', '../services/orderService', '../directives/directives'], function(controllers){

	controllers.controller('orderController', ['$rootScope', '$scope', '$state', '$cookies', 'Msg', 'orderService', function($rootScope, $scope, $state, $cookies, Msg, orderService){
		$scope.factoryList = []; // 代工厂列表
		$scope.salesList = []; // 销售列表
		$scope.mtagList = []; // mtag列表
		$scope.itermCodeList = []; // 物料编码列表
		$scope.isShowWorkform = false; // 默认隐藏工单信息
		// 获取历史列表
		getOrderList(0);
		function getOrderList(pageIndex, searchKey) {
			var postBody = {
				'start': pageIndex * 10,
				'len': 10,
				'value': searchKey
			};
			orderService.getOrderList(postBody).then(function(data) {
				if (data.status == 0) {
					if (data.result && data.result.length > 0) {
						$("#pager").show();
						$("#currentPage").html(pageIndex + 1);
						dealWithPage(data.totalnum);
						$scope.orderList = data.result;
					} else {
						$scope.orderList = [];
						Msg('无数据', 1500);
					}
				} else {
					Msg(data.msg, 1500);
				}
			}, function(data) {
				Msg(data.msg, 1500);
			})
		}

		// 搜索
		$scope.search = function() {
			getOrderList(0, $scope.searchKey);
		}
		
		// 监视输入框输入情况
		$scope.$watch('searchKey', function() {
			$scope.search();
		})

		// 前一页
		$scope.beforePage = function() {
			getBeforePage(getOrderList);
		}
		// 后一页
		$scope.afterPage = function() {
			getAfterPage(getOrderList);
		}
		// 跳转
		$scope.jumpPage = function() {
			jumpPage(getOrderList);
		}
		// 输入页码enter跳转
		$("#pageIndex").keypress(function(event) {
			var e = event || window.event;
			if (e.which == 13) {
				$scope.jumpPage();
			}
		});


		// 点击添加订单
		$scope.addOrder = function() {
			// 清空表单内容
			$scope.itermcode = '';
			$scope.orderNum = '';
			$scope.factory = '';
			$scope.sales = '';
			$scope.orderNo = '';
			// 查询代工厂列表
			if ($scope.factoryList.length <= 0) {
				getFactoryList();
			}
			// 查询销售列表
			if ($scope.salesList.length <= 0) {
				getSalesList();
			}
			// 查询mtag列表
			if ($scope.mtagList.length <= 0) {
				getMtagList();
			}
		}

		// 点击选择物料编码
		$scope.selectProduct = function() {
			// 获取物料编码列表
			if ($scope.itermCodeList.length <= 0) {
				getItermCodeList()
			}
		}

		// 提交选择的物料编码
		$scope.codeSubmit = function() {
			var itermcode = [];
			for (var i = 0; i < $scope.itermCodeList.length; i++) {
				if ($scope.itermCodeList[i].status) {
					itermcode.push($scope.itermCodeList[i].itermcode);
				}
			}
			if (itermcode.length != 1) {
				Msg("请选择一个产品", 1500);
			} else {
				$scope.itermcode = itermcode[0];
				$("#proCancel").click();
			}
		}

		/**
		 * 获取代工厂列表
		 * @param  {[type]} setValue 需要设置的factoryid
		 * @param  {[type]} ngModel  设置到哪个ng-model上
		 */
		function getFactoryList(setValue, ngModel) {
			orderService.getFactoryList().then(function(data) {
				if (data.status == 0) {
					if (data.data && data.data.length > 0) {
						$scope.factoryList = data.data;
						// 判断是否需要设置值
						if (setValue) {
							for (var i = 0; i < data.data.length; i++) {
								if (setValue == data.data[i].oemfactoryid) {
									$scope[ngModel] = data.data[i];
								}
							}
						}
					}
				} else {
					Msg(data.msg, 1500);
				}
			}, function(data) {
				Msg(data.msg, 1500);
			})
		}

		/**
		 * 获取销售列表
		 * @param  {[type]} setValue 需要设置的salesid
		 * @param  {[type]} ngModel  设置到哪个ng-model上
		 */
		function getSalesList(setValue, ngModel) {
			var postBody = {
				'rolename': 'SALES'
			};
			orderService.getSalesList(postBody).then(function(data) {
				if (data.status == 0) {
					if (data.userlist && data.userlist.length > 0) {
						$scope.salesList = data.userlist;
						// 判断是否需要设置值
						if (setValue) {
							for (var i = 0; i < data.userlist.length; i++) {
								if (setValue == data.userlist[i].AccountInfo.userid) {
									$scope[ngModel] = data.userlist[i].AccountInfo;
								}
							}
						}
					}
				} else {
					Msg(data.msg, 1500);
				}
			}, function(data) {
				Msg(data.msg, 1500);
			})
		}

		/**
		 * 获取mtag列表
		 * @param  {[type]} setValue 需要设置的mtag值
		 * @param  {[type]} ngModel 设置到哪个ng-model上
		 */
		function getMtagList(setValue, ngModel) {
			$scope.mtagList = [];
			orderService.getMtagList().then(function(data) {
				if (data.status == 0) {
					if (data.mtaglist && data.mtaglist.length > 0) {
						for (var i = 0; i < data.mtaglist.length; i++) {
							$scope.mtagList.push({
								'mtag': data.mtaglist[i],
								'status': false
							});
						}
						// 判断是否需要设置值
						if (ngModel) {
							if (setValue) {
								for (var j = 0; j < setValue.length; j++) {
									for (var k in $scope.mtagList) {
										if (setValue[j] == $scope.mtagList[k].mtag) {
											$scope.mtagList[k].status = true;
										}
									}
								}
							}
							$scope[ngModel] = $scope.mtagList;
						}
					}
				} else {
					Msg(data.msg, 1500);
				}
			}, function(data) {
				Msg(data.msg, 1500);
			})
		}

		// 获取物料编码列表
		function getItermCodeList() {
			orderService.getItermCodeList().then(function(data) {
				if (data.status == 0) {
					if (data.data && data.data.length > 0) {
						$scope.itermCodeList = data.data;
						for (var i = 0; i < $scope.itermCodeList.length; i++) {
							$scope.itermCodeList[i].status = false;
						}
					}
				} else {
					Msg(data.msg, 1500);
				}
			}, function(data) {
				Msg(data.msg, 1500);
			})
		}



		// 提交添加的订单
		$scope.add_submit = function() {
			var mtaglist = [];
			for (var i = 0; i < $scope.mtagList.length; i++) {
				if ($scope.mtagList[i].status) {
					mtaglist.push($scope.mtagList[i].mtag);
				}
			}
			var postBody = {
				"productid": "",
				"itermcode": $scope.itermcode,
				"ordernum": $scope.orderNum,
				"oemfactoryid": $scope.factory.oemfactoryid,
				"factoryname": $scope.factory.oemfactoryname,
				"salesuserid": $scope.sales.userid,
				"salesusername": $scope.sales.nickname,
				"orderid": $scope.orderNo,
				"mtaglist": mtaglist
			};
			// 检测表单输入情况
			if (!postBody.itermcode) {
				alert("请选择物料编码");
				return false;
			} else if (!postBody.ordernum) {
				alert("请输入数量");
				return false;
			} else if (!postBody.orderid) {
				alert("请输入订单号");
				return false;
			}
			orderService.submitOrder(postBody).then(function(data) {
				if (data.status == 0) {
					Msg('添加成功', 1500);
					$("#add_cancel").click();
					// 重新获取列表
					getOrderList(0);
				} else {
					Msg(data.msg, 1500);
				}
			}, function(data) {
				Msg(data.msg, 1500);
			})
		}


		// 点击删除订单
		$scope.passDelInfo = function(id) {
			$scope.delId = id;
		}
		// 确定删除
		$scope.confirmDelete = function() {
			var postBody = {
				'orderid': $scope.delId
			};
			orderService.deleteOrder(postBody).then(function(data) {
				if (data.status == 0) {
					Msg('删除成功', 1500);
					$("#delCancel").click();
					// 重新获取列表
					getOrderList(0);
					$scope.delId = '';
				} else {
					Msg(data.msg, 1500);
				}
			}, function(data) {
				Msg(data.msg, 1500);
			})
		}

		// 点击编辑订单
		$scope.passDetailInfo = function(id) {
			var postBody = {
				'orderid': id
			};
			orderService.orderDetail(postBody).then(function(data) {
				if (data.status == 0) {
					$scope.orderEditInfo = data.result;
					// 获取代工厂列表并赋值
					getFactoryList($scope.orderEditInfo.oemfactoryid, 'orderEditFactory');
					// 获取销售列表并赋值
					getSalesList($scope.orderEditInfo.salesuserid, 'orderEditSales');
					// 获取mtag列表并赋值
					getMtagList($scope.orderEditInfo.mtaglist, 'orderEditMtag');
					if ($scope.orderEditInfo.licensereqid) {
						$scope.isShowWorkform = true;
					} else {
						$scope.isShowWorkform = false;
					}
				} else {
					Msg(data.msg, 1500);
				}
			}, function(data) {
				Msg(data.msg, 1500);
			})
		}

		// 保存编辑的订单
		$scope.update_submit = function() {
			var mtaglist = [];
			for (var i = 0; i < $scope.orderEditMtag.length; i++) {
				if ($scope.orderEditMtag[i].status) {
					mtaglist.push($scope.orderEditMtag[i].mtag);
				}
			}
			var postBody = {
				"productid": "",
				"itermcode": $scope.orderEditInfo.itermcode,
				"ordernum": $scope.orderEditInfo.ordernum,
				"oemfactoryid": $scope.orderEditFactory.oemfactoryid,
				"factoryname": $scope.orderEditFactory.oemfactoryname,
				"salesuserid": $scope.orderEditSales.userid,
				"salesusername": $scope.orderEditSales.nickname,
				"orderid": $scope.orderEditInfo.orderid,
				"mtaglist": mtaglist
			};
			orderService.updateOrder(postBody).then(function(data) {
				if (data.status == 0) {
					Msg('更新成功', 1500);
					$("#update_cancel").click();
					// 重新获取列表
					getOrderList(0);
				} else {
					Msg(data.msg, 1500);
				}
			}, function(data) {
				Msg(data.msg, 1500);
			})
		}

	}])
})