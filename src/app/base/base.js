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
	
	vm.showNotification = function($event){
		$('#notPanel').animate({right:'300px'});
		  $event.stopPropagation();
	}
	
	vm.showUpdates = function($event){
		$('#updatePanel').animate({right:'300px'});
		 $event.stopPropagation();
	}
	
	vm.showSearch = function($event){
		$('#searchPanel').animate({right:'300px'});
		 $event.stopPropagation();
	}
}

$('body').on('click', function(event){
    if(event.target.id!="#notPanel"){	
	$('#notPanel').animate({right:'0px'});
	}
	
	if(event.target.id!="#updatePanel"){	
	$('#updatePanel').animate({right:'0px'});
	}
	
	if(event.target.id!="#searchPanel"){	
	$('#searchPanel').animate({right:'0px'});
	}
});




$(document).ready(function(){
/* 	$('#doc-nav').hover(function(){
	$(this).find('.dropDownMenu').toggle();
	}); */
	
/* 	$('#userName').hover(function(){
	$(this).find('.dropDownLogin').toggle();
	}); */
	
/* 	$('.repIcon').hover(function(){
	$(this).find('.dropDownRep').toggle();
	}); */
	
/* 	$('.notIcon').click(function(event){
	$('#notPanel').animate({right:'300px'});
	event.stopPropagation();
	}); */
	
/* 	$('.updatesIcon').click(function(event){
	$('#updatePanel').animate({right:'300px'});
	event.stopPropagation();
	}); */
	
/* 	$('.searchIcon').click(function(event){
	$('#searchPanel').animate({right:'300px'});
	event.stopPropagation();
	}); */
	
/* $(document).click(function(event) {
    if(event.target.id!="#notPanel"){	
	$('#notPanel').animate({right:'0px'});
	}
	
	if(event.target.id!="#updatePanel"){	
	$('#updatePanel').animate({right:'0px'});
	}
	
	if(event.target.id!="#searchPanel"){	
	$('#searchPanel').animate({right:'0px'});
	}
});  */

$("#notPanel, #updatePanel, #searchPanel").click(function (event) {
  event.stopPropagation();
});

/* $(".menuNav li").hover(function(){
	$(".menuNav li").removeClass('active');
	$(this).addClass('active');
}); */

});





