define(['angular'], function(angular) {
	var directives = angular.module('directives', []);
	directives.directive('alertBar', ['$parse', function($parse) {
		return {
			restrict: 'A',
			template: '<div class="alert alert-warning alert-bar">\
			<button type="button" class="close" ng-click="hideAlert()">x</button>\
			<strong style="color:red">提示：</strong><span></span></div>',
			link: function(scope, elem, attrs) {
				var alertMessageAttr = attrs['alertmessage'];
				scope.errorMessage = null;

				scope.$watch(alertMessageAttr, function(newVal) {
					scope.errorMessage = newVal;
				});
				scope.hideAlert = function() {
					$('.alert').hide();
				};
			}
		}
	}])

	directives.directive('bsTimepicker', function() {
		return {
			restrict: 'EA',
			link: function(scope, ele, attrs, ctrl) {
				var datetimepicker = $(ele).datetimepicker({
					format: 'yyyy-mm-dd hh:ii:ss',
					weekStart: 1,
					todayBtn:  1,
					autoclose: 1,
					todayHighlight: 1,
					startView: 2,
					forceParse: 0,
					// showMeridian: 1 //PM
				})
			}
		}
	})
	return directives;
})