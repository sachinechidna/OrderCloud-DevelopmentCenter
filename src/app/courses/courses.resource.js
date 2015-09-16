angular.module( 'orderCloud' )
	.factory( 'Courses', CoursesService )
;


function CoursesService($q, Underscore) {
	var service = {
		List: _list,
		Get: _get
	};

	function _list() {
		var d = $q.defer();
		d.resolve(courses);
		return d.promise;
	}

	function _get(courseID) {
		var d= $q.defer();
		d.resolve(Underscore.where(courses, {ID: courseID})[0]);
		return d.promise;
	}

	var courses = [
		{
			ID: 'intro',
			Name: 'Introduction',
			Description: 'Familiarize yourself with the OrderCloud RESTful API and the toolsets available for developing against it.',
			Difficulty: 'Beginner',
			Classes: ['api','ordercloud','tools','sdk']
		},
		{
			ID: 'basics',
			Name: 'The Basics',
			Description: 'A real-world, interactive example of Authentication and using the API for the first time.',
			Difficulty: 'Beginner',
			Classes: ['authentication', 'create-buyer', 'create-buyer-user', 'api-access', 'get-me']
		},
		{
			ID: 'products',
			Name: 'Products',
			Description: 'Some basic classes on creating different product configurations.',
			Difficulty: 'Novice',
			Classes: []
		}
	];

	return service;
}