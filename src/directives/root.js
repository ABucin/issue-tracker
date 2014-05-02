app.directive('ticket', function ($rootScope) {

	function templateFunction(tElem, tAttr) {
		var type = "task";
		if (tAttr.task === undefined) {
			type = "bug";
		}
		return "<div class='ticket ticket-code ticket-" + type + "'  data-toggle='modal' data-target='#ticket-preview-modal' >{{ticket.code}}<span class='ticket-title'>{{ticket.title}}</span></div>"
	}

	return {
		restrict: 'E',
		link: function (scope, element, attr) {
			if (scope.ticket.username !== $rootScope.username) {
				element.css({
					"background-color": "#3F424B"
				});
			}
			element.on('click', function (event) {
				scope.isEditing = true;
				// display the clicked ticket data in the modal
				if (scope.ticket.type === "task") {
					if (scope.updatedTask.code === null || scope.ticket.code !== scope.updatedTask.code) {
						angular.copy(scope.ticket, scope.updatedTask);
					}
				} else {
					if (scope.updatedBug.code === null || scope.ticket.code !== scope.updatedBug.code) {
						angular.copy(scope.ticket, scope.updatedBug);
					}
				}
			});
		},
		replace: true,
		template: templateFunction
	};
});

app.directive('secured', function ($rootScope, $location) {
	return {
		restrict: 'A',
		link: function (scope, element, attr) {
			if ($rootScope.auth === false) {
				$location.path('/login');
			}
		}
	};
});

app.directive('collapsibleIcon', function () {
	return {
		restrict: 'A',
		link: function (scope, element, attr) {
			element.on('click', function (event) {
				if (element.hasClass("fa-minus") && element.parent().parent().parent().children().hasClass('collapse')) {
					element.toggleClass("fa-minus", false);
					element.toggleClass("fa-plus", true);
				} else {
					element.toggleClass("fa-minus", true);
					element.toggleClass("fa-plus", false);
				}
			});
		}
	};
});
