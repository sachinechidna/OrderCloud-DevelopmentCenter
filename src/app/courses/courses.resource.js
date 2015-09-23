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
			Description: 'A real-world, interactive introduction to help you get started using OrderCloud',
			Difficulty: 'Beginner',
			Classes: ['create-buyer', 'create-buyer-user', 'api-access', 'get-me']
		},
		{
			ID: 'user-prod-access',
			Name: 'View Products as a Buyer User',
			Description: 'Tackle the challenge of making a product accessible to a buyer-user',
			Difficulty: 'Novice',
			Classes: ['prod-crud', 'price-sched-crud', 'prod-assignments', 'category-crud', 'category-assignment', 'get-products-as-user']
		}
	];

	return service;
}