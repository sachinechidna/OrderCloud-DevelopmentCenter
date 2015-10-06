angular.module( 'orderCloud' )

	.config( BaseConfig )
	.controller( 'BaseCtrl', BaseController )

;

function BaseConfig( $stateProvider ) {
	$stateProvider
		.state( 'base', {
			url: '',
			abstract: true,
			templateUrl:'base/templates/base.tpl.html',
			controller:'BaseCtrl',
			controllerAs: 'base',
			resolve: {
				CurrentUser: function($q, Auth, Me) {
					var deferred = $q.defer();
					Auth.IsAuthenticated()
						.then(function() {
							Me.Get()
								.then(function(currentUser) {
									deferred.resolve(currentUser);
								})
						})
						.catch(function() {
							deferred.resolve(null);
						});
					return deferred.promise;
				}
			}
		})
}

function BaseController( CurrentUser ) {
	var vm = this;
	vm.currentUser = CurrentUser;
	
	//Dummy JSON Data
	vm.DocMenu = [
	{
	"title":"how to's",
	"desc":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor "
	},
	{
	"title":"four51 glossary",
	"desc":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor "
	},
	{
	"title":"dev center",
	"desc":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor "
	},
	{
	"title":"app development",
	"desc":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor "
	},
	{
	"title":"theme development",
	"desc":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor "
	}
	];
	vm.selectedIndex = 0;
	vm.showSubMenu = function(indx){
	vm.selectedIndex = indx;
	}
	
	//Call Notification slide
	vm.showNotification = function($event){
		$('#notPanel').animate({right:'300px'});
		  $event.stopPropagation();
	}
	
	//Call Update slide
	vm.showUpdates = function($event){
		$('#updatePanel').animate({right:'300px'});
		 $event.stopPropagation();
	}
	
	//Call Search slide
	vm.showSearch = function($event){
		$('#searchPanel').animate({right:'300px'});
		 $event.stopPropagation();
	}
}
	//Dismiss All the slides on body click
	$('body').on('click', function(event){
		if(!$(event.target).parents('#notPanel').length  && event.target.id!='notPanel'){	
		$('#notPanel').animate({right:'0px'});
		}

		if(!$(event.target).parents('#updatePanel').length  && event.target.id!='notPanel'){	
		$('#updatePanel').animate({right:'0px'});
		}
		
		if(!$(event.target).parents('#searchPanel').length && event.target.id!='notPanel'){	
		$('#searchPanel').animate({right:'0px'});
		}
	});