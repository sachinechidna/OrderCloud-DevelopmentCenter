angular.module( 'orderCloud' )

	.config( CoursesConfig )
	.controller( 'CoursesCtrl', CoursesController )
	.controller( 'CourseCtrl', CourseController )
	.controller( 'ClassCtrl', ClassController )

;

function CoursesConfig( $stateProvider ) {
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

function ClassController( $state, Underscore, Courses, SelectedCourse, SelectedClass ) {
	var vm = this;
	vm.current = SelectedClass;
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
	}
}