angular.module('orderCloud')
    .factory('CoursesService', CoursesService);

function CoursesService() {


    function getCourse(courseID) {
        var returnObj = {};
        courses.forEach(function(course) {
            if (course.ID == courseID) {
                returnObj = course;
            }
        });
        return returnObj;
    }

    function courseLevel(classes, classID) {
        var count = 1;
        var finalCount = -1;
        classes.forEach(function(c) {
            if (c == classID) {
                finalCount = count;
            }
            count += 1;
        });
        return finalCount;
    }

    function _setScope(courseID, classID) {
        var returnObj = {};
        var course = getCourse(courseID);
        if (course.Active) {
            returnObj = course;
            returnObj.ClassCount = course.Classes.length;
            returnObj.CourseLevel = courseLevel(course.Classes, classID);
            if (returnObj.CourseLevel == course.Classes.length) {
                returnObj.nextClass = course.Classes[returnObj.CourseLevel + 1];
            } else {
                returnObj.nextClass = null;
            }

        }

        return returnObj;



    }


    var courses =
        [
            {
                Name: "Getting Started",
                ID: "getting-started",
                Description: "Learn the basics of working with OrderCloud 3.0, such as learning about what makes a RESTful API, getting authenticated, and creating basic OrderCloud objects",
                Active: true,
                SkillLevel: "Beginner",
                Tags: [
                    "REST",
                    "Authentication",
                    "Beginner"
                ],
                Classes: [
                    "api-intro",
                    "auth-intro",
                    "create-buyer",
                    "create-product",
                    "create-category",
                    "create-user",
                    "create-usergroup"
                ]
            },
            {
                "Name": null
            }
        ];

    return {
        setScope: _setScope
    }
}
