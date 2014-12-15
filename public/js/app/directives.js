easy.directive('highlight',function () {

		var dirObj = {

			restrict: "C",
			//scope:{},
			transclude: true,
			template:'<div ng-transclude> 	</div> 	<div style = "position:relative; text-color:black; top:-80px;width:400px;right:-2000px;z-index:10;background-color:red;padding:10px;opacity:1.0" ng-show = "show"> </div>',
			template:'<div ng-transclude> 	</div> ',

			link : function (scope , element , arg) {

				scope.show = "false";
				element.on('mouseenter',function (e) {
					
						scope.show = "true";
						scope.$apply();

					
				});

				element.on('mouseleave',function (e) {
					
						scope.show = "false";
						scope.$apply();
				});


				element.on ('click', function (e) {

						scope.scrollToSelected(element[0].className);
						scope.$apply();
				});


			 

				
			}
		};

		return dirObj;
});


easy.directive('glyphicon-chevron-up',function () {

		var dirObj = {

			restrict: "C",
			//scope:{},

			

			link : function (scope , element , arg) {

				scope.show = "false";
				element.on('mouseenter',function (e) {
					
						scope.show = "true";
						scope.$apply();

					
				});

				element.on('mouseleave',function (e) {
					
						scope.show = "false";
						scope.$apply();
				});


				element.on ('click', function (e) {

						scope.scrollToSelected(element[0].className);
						scope.$apply();
				});


			 

				
			}
		};

		return dirObj;
});


easy.filter('spaces', function () {
    return function(text) {
        return text.replace(/_/g, ' ');
    }
})


