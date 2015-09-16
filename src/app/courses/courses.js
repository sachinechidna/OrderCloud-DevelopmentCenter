angular.module( 'orderCloud' )

	.config( CoursesConfig )
	.controller( 'CoursesCtrl', CoursesController )
	.controller( 'CourseCtrl', CourseController )
	.controller( 'ClassCtrl', ClassController )

;

function CoursesConfig( $stateProvider, $httpProvider ) {
	$httpProvider.interceptors.push(function($rootScope) {
		return {
			'request': function(config) {
				$rootScope.$broadcast('event:requestSuccess', config);
				return config;
			},
			'requestError': function(rejection) {
				$rootScope.$broadcast('event:requestError', rejection);
				return rejection;
			},
			'response': function(response) {
				$rootScope.$broadcast('event:responseSuccess', response);
				return response;
			},
			'responseError': function(rejection) {
				$rootScope.$broadcast('event:responseError', rejection);
				return rejection;
			}
		};
	});

	$stateProvider
		.state( 'base.courses', {
			url: '/courses',
			templateUrl:'courses/templates/courses.tpl.html',
			controller:'CoursesCtrl',
			controllerAs: 'courses',
			data: {limitAccess:true},
			resolve: {
				CoursesList: function(Courses) {
					return Courses.List();
				}
			}
		})
		.state( 'base.course', {
			url: '/courses/:courseid',
			templateUrl:'courses/templates/course.tpl.html',
			controller:'CourseCtrl',
			controllerAs: 'course',
			data: {limitAccess:true},
			resolve: {
				SelectedCourse: function($stateParams, Courses) {
					return Courses.Get($stateParams.courseid);
				},
				ClassesList: function($q, Classes, SelectedCourse) {
					return Classes.Get(SelectedCourse.Classes);
				}
			}
		})
		.state( 'base.course.class', {
			url: '/:classid',
			templateUrl:'courses/templates/class.tpl.html',
			controller:'ClassCtrl',
			controllerAs: 'class',
			data: {limitAccess:true},
			resolve: {
				SelectedClass: function($stateParams, Underscore, ClassesList) {
					return Underscore.where(ClassesList, {ID:$stateParams.classid})[0];
				}
			}
		})
}

function CoursesController( CoursesList ) {
	var vm = this;
	vm.list = CoursesList;
}

function CourseController( SelectedCourse, ClassesList ) {
	var vm = this;
	vm.current = SelectedCourse;
	vm.classes = ClassesList;
}

function ClassController( $scope, $state, $injector, Underscore, Courses, SelectedCourse, SelectedClass ) {
	var vm = this;
	vm.current = SelectedClass;
	vm.requests = [];
	vm.responses = [];
	vm.responseErrors = [];
	vm.requestErrors = [];
	vm.classIndex = SelectedCourse.Classes.indexOf(vm.current.ID);
	vm.totalClasses = SelectedCourse.Classes.length;
	var nextClassID = (vm.classIndex + 1 < vm.totalClasses) ? SelectedCourse.Classes[vm.classIndex + 1] : null;
	var nextCourseID;
	if (!nextClassID) findNextCourseID();

	function findNextCourseID() {
		Courses.List().then(function(data) {
			var currentCourseIndex = data.indexOf(Underscore.where(data, {ID:SelectedCourse.ID})[0]);
			if (currentCourseIndex < data.length) {
				nextCourseID = data[currentCourseIndex + 1].ID;
			}
		})
	}

	vm.nextClass = function() {
		if (nextClassID) {
			console.log(nextClassID);
			$state.go('.', {classid: nextClassID})
		} else if(nextCourseID) {
			console.log(nextCourseID);
			$state.go('^', {courseid: nextCourseID})
		} else {
			$state.go('base.courses');
		}
	};

	vm.setMaxLines = function(editor) {
		editor.setOptions({
			maxLines:100
		});
	}

	if (SelectedClass.Interactive) {
		$scope.$on('event:requestSuccess', function(event, c) {
			if (vm.turnOnLog) {
				vm.requests.push(c);
			}
		});

		$scope.$on('event:responseSuccess', function(event, c) {
			if (vm.turnOnLog) {
				vm.responses.push(c);
				vm.success = true;
			}
		});

		$scope.$on('event:requestError', function(event, c) {
			if (vm.turnOnLog) {
				vm.requestErrors.push(c);
			}
		});

		$scope.$on('event:responseError', function(event, c) {
			if (vm.turnOnLog) {
				vm.responseErrors.push(c);
				vm.success = false;
			}
		});
	}


	vm.Execute = function() {
		vm.turnOnLog = true;

		var injectString = "";
		angular.forEach(vm.current.Dependencies, function(d) {
			injectString += 'var ' + d + ' = $injector.get("' + d + '");'
		});

		eval(injectString + vm.current.ScriptModel);


	};

}