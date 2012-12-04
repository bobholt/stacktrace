/*global require, requirejs*/
// Require.js allows us to configure shortcut alias

try {

require.config({
  shim: {
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'cookie': {
			deps: ['jquery'],
			exports: 'cookie'
    },
    'history': {
			exports: 'history'
    },
    'jscrollpane': {
			deps: ['jquery', 'mousewheel'],
			exports: 'jscrollpane'
    },
    'leaflet': {
			exports: 'L'
    },
    'mousewheel': {
			deps: ['jquery'],
			exports: 'mousewheel'
    },
    'pubsub': {
			deps: ['jquery'],
			exports: 'pubsub'
    },
    'wax': {
			deps: ['leaflet'],
			exports: 'wax'
    }
  },

  paths: {
		// Extended Aura Libraries
    core:					'ext/mediator',
    perms:				'ext/permissions',
    sandbox:			'ext/facade',

    // Core Aura Libraries
    aura_core:		'aura/mediator',
    aura_perms:		'aura/permissions',
    aura_sandbox: 'aura/facade',

    // Plugins and Libraries
    backbone:			'ext/lib/backbone',
    superview:		'ext/lib/superview',
    jquery:				'aura/lib/jquery.min',
    underscore:		'aura/lib/lodash.min',
    leaflet:			'widgets/map/libs/leaflet.min',
    wax:					'widgets/map/libs/wax.leaf.min',
    jquery_ui:		'ext/lib/jquery-ui.min',
    common:				'ext/lib/common',
    cookie:				'ext/lib/jquery.cookie',
    pubsub:				'ext/lib/jquery.tinypubsub.min',
    history:			'ext/lib/history',
    jscrollpane:	'widgets/mainmenu/libs/jScrollPane',
    mousewheel:		'widgets/mainmenu/libs/jquery.mousewheel',

		mainmenuMain:							"widgets/mainmenu/main",
		commentreplyMain:					"widgets/commentreply/main",
		commentreplyModule:				"widgets/commentreply/module",
		footerMain:								"widgets/footer/main",
		footerModule:							"widgets/footer/module",
		mainmenuModule:						"widgets/mainmenu/module",
		mapMain:									"widgets/map/main",
		mapModule:								"widgets/map/module",
		mapcontrolMain:						"widgets/mapcontrol/main",
		mapcontrolModule:					"widgets/mapcontrol/module",
		maptourMain:							"widgets/maptour/main",
		maptourModule:						"widgets/maptour/module",
		maptourmanagerMain:				"widgets/maptourmanager/main",
		maptourmanagerModule:			"widgets/maptourmanager/module",
		mediacarousellargeMain:		"widgets/mediacarousellarge/main",
		mediacarousellargeModule:	"widgets/mediacarousellarge/module",
		mediacarouselsmallMain:		"widgets/mediacarouselsmall/main",
		mediacarouselsmallModule:	"widgets/mediacarouselsmall/module",
		videomodalMain:						"widgets/videomodal/main",
		videomodalModule:					"widgets/videomodal/module"

  }

});


// Adds Object.create() for quick object extension
if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}


// Starts main modules
requirejs(['sandbox'], function (sandbox) {

	// Set application base url
	sandbox.baseUrl = REAP.baseUrl;

	// Start Main Menu Widget used on every page
	sandbox.publish('mainmenu');

	// Start Footer Widget used on every page
	sandbox.publish('footer');

	// Front Page Code
	if ($('body').hasClass('front')) {

		// Start Map Widget
		sandbox.publish('map');

		// Start Map Tour Widget
		sandbox.publish('maptour');

		// Start Map Control Panel Widget
		sandbox.publish('mapcontrol');

		// Start Map Tour Manager Widget
		sandbox.publish('maptourmanager');

		//On the home page, we're going to add an additional footer link
		// Remove class 'last' from the existing item
		$('.region-footer ul.menu li.last').removeClass('last');

		// Add an additional item
		$('.region-footer ul.menu').append(

			// Create the <li>
			$('<li />').addClass('leaf').addClass('last').append(

				// Create and append the link
				$('<a />').text('Take Tour').attr('href', '#').on('click', function(e){

					e.preventDefault();

					// Start the tour again
					sandbox.pub('starttour');

				})

			)

		);

	// Inner Page Code
	} else {

		if (window.location.pathname.indexOf('/about-reap') >= 0) {
			sandbox.publish('videomodal');
		}

		if ($('body').is('.node-type-initiative') && REAP.media.length > 0) {
			sandbox.publish('mediacarousellarge');
		}

		if ($('body').is('.node-type-team') && REAP.media.length > 0) {
			sandbox.publish('mediacarouselsmall');
		}

		$('#comments .comment-reply a').on('click', function(e){
			e.preventDefault();
			sandbox.publish('commentreply', $(this).parents('ul'), this.href);
		});

		// if ($('#comments .comment-reply').length > 0) {
			// sandbox.publish('commentreply');
		// }
	}

	// Global event handlers from non-widget to widget

	$('body').on('click', '.videoThumbnail', function(e){
		e.preventDefault();
		sandbox.pub('modalVideo');
	});

});

} catch (ex) {

	new _GI.Error(ex);

}