app.controller('TeamCtrl', ['$scope', '$rootScope', '$location', 'UserService', 'SecurityService',
	function ($scope, $rootScope, $location, UserService, SecurityService) {
		$scope.selectedTeamMember = {};
		$scope.unassignedUser = {};
		$scope.unassignedUsers = [];

		$scope.modalTemplates = [{
			url: 'views/modals/team/user-assign.html'
		}];

		$scope.templateUserAssignModal = $scope.modalTemplates[0];

		/**
		 * General page configuration.
		 */
		$scope.general = {
			roleIcon: {
				developer: "terminal",
				tester: "bug"
			}
		};

		/**
		 * Document loading configuration.
		 */
		angular.element(document).ready(function () {
			$scope.selectTeamMember(SecurityService.getAuthenticatedUser().key);
		});

		/**
		 * Selects a team member.
		 */
		$scope.selectTeamMember = function (userId) {
			UserService.getUser(userId)
				.then(function (response) {
					angular.copy(response[0], $scope.selectedTeamMember);
				});
		};

		/**
		 * Retrieves the users that are unassigned to any project.
		 */
		$scope.getUnassignedUsers = function () {
			$scope.unassignedUsers = [];
			UserService.getUnassignedUsers()
				.then(function (response) {
					for (var i in response) {
						$scope.unassignedUsers.push(response[i]);
					}
				});
		};

		/**
		 * Dismissses the modal responsible for user assignment to projects.
		 */
		$scope.dismissUserAssignmentModal = function () {
			$rootScope.submitted = false;
			$rootScope.general.errors = [];
			$('#user-assignment-modal').modal('hide');
		};

		var handleUpdateUser = function (response) {
			$rootScope.users = response;
			$rootScope.userTickets = [];
			$rootScope.tickets = {
				created: [],
				inProgress: [],
				testing: [],
				done: []
			};

			for (var i in response) {
				var tickets = $rootScope.users[i].tickets;

				for (var j in tickets) {
					var status = tickets[j].status;
					tickets[j].creator = $rootScope.users[i].username;
					$rootScope.userTickets.push(tickets[j]);
					$rootScope.tickets[status].push(tickets[j]);
				}
			}
		};

		/**
		 * Various project functions.
		 */
		$scope.project = {
			set: function (username, isValid) {
				$rootScope.submitted = true;
				$rootScope.general.errors = [];
				if (isValid) {
					$('#user-assignment-modal').modal('hide');
					UserService.updateUser(username, {
						project: $rootScope.project
					})
						.then(handleUpdateUser);
				}
			},
			unset: function (username, event) {
				event.preventDefault();
				event.stopPropagation();
				UserService.updateUser(username, {
					project: "unassigned"
				})
					.then(handleUpdateUser);
			}
		};

		/**
		 * Computes number of open tickets for selected user.
		 */
		$scope.getOpenTickets = function () {
			var openTickets = 0;
			for (var i in $rootScope.userTickets) {
				if ($rootScope.userTickets[i].owner === $scope.selectedTeamMember.username && $rootScope.userTickets[i].status !== 'done') {
					openTickets++;
				}
			}
			return openTickets;
		};

		/**
		 * Computes effort-estimation ratio for selected user.
		 */
		$scope.getEffortEstimationRatio = function () {
			var totalLoggedTime = 0.0,
				totalEstimatedTime = 0.0;
			for (var i in $rootScope.userTickets) {
				if ($rootScope.userTickets[i].owner === $scope.selectedTeamMember.username) {
					totalLoggedTime += $rootScope.userTickets[i].loggedTime;
					totalEstimatedTime += $rootScope.userTickets[i].estimatedTime;
				}
			}
			if (totalLoggedTime === totalEstimatedTime || totalEstimatedTime === 0.0) {
				return 1;
			}
			return (totalLoggedTime / totalEstimatedTime).toFixed(2);
		};

	}]);
