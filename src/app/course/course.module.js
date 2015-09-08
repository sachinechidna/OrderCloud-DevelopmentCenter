angular.module('orderCloud.course', [])
    .config(CourseConfig);


function CourseConfig($stateProvider) {
    $stateProvider
        .state('base.courses', {
            url: '/courses',
            templateUrl: 'course/templates/courses.tpl.html'
        })
        .state('base.course', {
            url: '/course/:courseID/:classID',
            templateUrl: 'course/templates/course.tpl.html',
            controller: 'courseCtrl',
            controllerAs: 'course'
        })


}