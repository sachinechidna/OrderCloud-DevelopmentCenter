angular.module( 'orderCloud' )

	.filter('OCRoutingUrl', OCRoutingUrl)
;

function OCRoutingUrl() {
	return function(value) {
		return value.split('.io/')[1];
	}
}