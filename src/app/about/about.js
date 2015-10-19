angular.module( 'orderCloud' )

	.config( AboutConfig )
	.controller( 'AboutCtrl', AboutController )

;

function AboutConfig( $stateProvider ) {
	$stateProvider
		.state( 'base.about', {
			url: '/about',
			templateUrl:'about/templates/about.tpl.html',
			controller:'AboutCtrl',
			controllerAs: 'about'
		})
}

function AboutController($sce ) {
	var vm = this;

	$('#owl-carousel').owlCarousel({
    margin:10,
    responsiveClass:true,
    responsive:{
        0:{
            items:1,
            nav:true,
            rtl:true
        },
        600:{
            items:3,
            nav:true,
            rtl:true
        },
        1000:{
            items:3,
            nav:true,
            loop:true,
            rtl:true
        }
    }
})
	vm.config = {
				preload: "none",
				sources: [
					{src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"), type: "video/mp4"},
					{src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.webm"), type: "video/webm"},
					{src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.ogg"), type: "video/ogg"}
				],
				theme: {
					url: "about.less"
				},
				plugins: {
					 poster: "http://www.videogular.com/assets/images/videogular.png",
					controls: {
						autoHide: true,
						autoHideTime: 5000
					}
				}
			};

}
