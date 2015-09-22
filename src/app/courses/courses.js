angular.module( 'orderCloud' )

	.config( CoursesConfig )
	.controller( 'CoursesCtrl', CoursesController )
	.controller( 'CourseCtrl', CourseController )
	.controller( 'ClassCtrl', ClassController )
	.factory( 'ClassSvc', ClassService )

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

function ClassController( $scope, $state, $injector, Underscore, ClassSvc, Courses, SelectedCourse, SelectedClass ) {
	var vm = this;
	vm.current = SelectedClass;
	vm.requests = [];
	vm.responses = [];
	vm.allResponses = [];
	vm.responseErrors = [];
	vm.requestErrors = [];
	vm.openRequestCount = 0;
	vm.docs = {};
	vm.classIndex = SelectedCourse.Classes.indexOf(vm.current.ID);
	vm.totalClasses = SelectedCourse.Classes.length;
	var nextClassID = (vm.classIndex + 1 < vm.totalClasses) ? SelectedCourse.Classes[vm.classIndex + 1] : null;
	var nextCourseID;
	if (!nextClassID) findNextCourseID();

	$scope.$watch(function() {
		return vm.openRequestCount;
	}, function (n, o) {
		var allowNextOnSuccess = Underscore.where(vm.current.ScriptModels.Scripts, {Title: vm.current.ActiveScript})[0].NextOnSuccess;
		console.log(allowNextOnSuccess);
		if (n == 0 && vm.turnOnLog && allowNextOnSuccess) {
			vm.responseFailure = false;
			angular.forEach(vm.allResponses, function(data) {
				if (data.status > 399) {
					vm.responseFailure = true;
				}
			});
			if (!vm.responseFailure) {
				vm.responseSuccess = true;
			}
		}
		else {
			if (vm.turnOnLog) {
				console.log('not yet');
			}
		}
	});


	function findNextCourseID() {
		Courses.List().then(function(data) {
			var currentCourseIndex = data.indexOf(Underscore.where(data, {ID:SelectedCourse.ID})[0]);
			if (currentCourseIndex < data.length) {
				nextCourseID = data[currentCourseIndex + 1].ID;
			}
		})
	}

	vm.activeScriptFn = function(scriptTitle) {
		vm.current.ActiveScript = Underscore.where(vm.current.ScriptModels.Scripts, {Title: scriptTitle})[0].Title;
	};

	function setActiveScript() {
		var activeScriptTitle = '';
		if (vm.current.Interactive) {
			if (vm.current.ScriptModels.Scripts.length > 1) {
				activeScriptTitle = Underscore.where(vm.current.ScriptModels.Scripts, {ListOrder: 1})[0].Title;
			} else {
				activeScriptTitle = vm.current.ScriptModels.Scripts[0].Title;
			}
			vm.activeScriptFn(activeScriptTitle);
		}

	};
	setActiveScript();
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
	};



	if (SelectedClass.Interactive) {
		$scope.$on('event:requestSuccess', function() {
			if (vm.turnOnLog) {
				vm.openRequestCount += 1;
			}
		});

		$scope.$on('event:responseSuccess', function(event, c) {
			if (vm.turnOnLog) {
				if (c.config.url.indexOf('docs/') == -1) {
					vm.responses.push(c);
					vm.allResponses.push(c);
					vm.success = true;
				}
				vm.openRequestCount -= 1;
			}
		});
		$scope.$on('event:responseError', function(event, c) {
			if (vm.turnOnLog) {
				if (c.config.url.indexOf('docs/') == -1) {
					vm.responseErrors.push(c);
					vm.allResponses.push(c);
					vm.success = false;
				}
				vm.openRequestCount -= 1;
			}
		});
	}


	vm.Execute = function() {

		vm.allResponses = [];

		vm.turnOnLog = true;
		var fullScript = '';
		if (vm.current.ScriptModels.Meta.ExecuteAll) {
			fullScript = '';
			var orderedScripts = Underscore.chain(vm.current.ScriptModels.Scripts)
				.filter(function(script){return !script.Disable;})
				.sortBy(function(script){return script.ExecuteOrder;})
				.value();
			angular.forEach(orderedScripts, function(script) {
				fullScript += script.Model;
			})
		} else {
			var currentScript = Underscore.where(vm.current.ScriptModels.Scripts, {Title: vm.current.ActiveScript})[0];
			if (!currentScript.Disable) {
				fullScript = currentScript.Model;
			} else {
				fullScript = null;
			}
		}


		if (fullScript) {
			var injectString = "";
			angular.forEach(vm.current.Dependencies, function(d) {
				injectString += 'var ' + d + ' = injector.get("' + d + '");'
			});

			var ex = new Function("injector", injectString + fullScript);
			ex($injector);
		} else {
			vm.consoleMessage = 'script is not executable';
		}

	};
	angular.forEach(vm.current.ClassMethods, function(method) {
		ClassSvc.getDocs(method, function(svc, mtd, doc) {
			if (!vm.docs[svc]) {
				vm.docs[svc] = {};
				vm.docs[svc][mtd] = doc;
			} else {
				vm.docs[svc][mtd] = doc;
			}
		});
	});

}

function ClassService($resource, apiurl) {
	var service = {
		getDocs: _getDocs
	};
	function _getDocs(target, cb) {
		var targetSplit = target.split('.');
		var serviceName = targetSplit[0];
		var methodName = targetSplit[1];
		$resource( apiurl + '/v1/docs/' + serviceName ).get().$promise
			.then(function(data) {
				angular.forEach(data.Endpoints, function(ep) {
					if (ep.ID == methodName) {
						cb(serviceName, methodName, ep);
					}
				});
			})
	}



	return service;
}
