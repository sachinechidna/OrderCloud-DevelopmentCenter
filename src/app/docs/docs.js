angular.module( 'orderCloud' )

	.config( DocsConfig )
	.controller( 'DocsCtrl', DocsController )

;

function DocsConfig( $stateProvider ) {
	$stateProvider
		.state( 'base.docs', {
			url: '/docs',
			templateUrl:'docs/templates/docs.tpl.html',
			controller:'DocsCtrl',
			controllerAs: 'docs'
		})
}

function DocsController( ) {
	var vm = this;

}
