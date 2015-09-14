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
			controllerAs: 'docs',
			resolve: {
				Documentation: function(Docs) {
					return Docs.GetAll();
				}
			}
		})
}

function DocsController( Documentation ) {
	var vm = this;
	vm.content = Documentation;
	vm.setMaxLines = function(editor) {
		editor.setOptions({
			maxLines:100
		});
	}
}
