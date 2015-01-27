/*
	pageAnimate WebPage Slider v1.1
	By Jesse MacLeod: http://JesseMacLeodWebDesign.com, http://CreativeWebsites.me
	User 'JesseMacLeod' on CodeCanyon.net
*/
(function($) {
  $.fn.pageAnimate = function(options) {
	  		/* Default settings */
			var settings = $.extend( {
				  'triggerType'          		: 'a',					/* The HTML element of each navigation trigger. You can use "button", "a", "span" or whatever you want. */
				  'appendTrigs'          		: true,					/* If true, the script will add navigation triggers to the nav. You should only set this to false if you already have manually added triggers. */
				  'destroyTrigLinks'     		: true,					/* If true, all hrefs in your manually added triggers (if you have any) will be removed. Having hrefs in your triggers can be useful if Javascript is disabled and the animation doesn't work - the user will be taken to another page. But you will want to remove them if Javascript is enabled so that the animation does work. */
				  'destroyManTrigs'      		: false,				/* If true, the script will destroy any manually added triggers in the HTML file. This is helpful if you have a set of triggers for when Javascript is disabled. */
				  'destroyNavManTrigs'   		: true,					/* If true, the script will destroy any manually added triggers that are in the nav. */
				  'addActiveClassToTrigger' 	: false,				/* If true, an active class (which is "pageAnimate_triggerActive") will be added to a trigger (even triggers not in the nav) when clicked. */
				  'addActiveClassToNavTrigger'  : true,					/* If true, an active class will be added to a trigger *that is inside the nav* when clicked. */
				  'addActiveToFirstNavTrigger'	: true,					/* If true, an active class will be added to every trigger inside the nav that links to the first slide, on page load. Of course, the active classes will be removed when another trigger is clicked. */
				  'transTime'            		: 900,					/* The transition time between each slide animation in milliseconds. 1000 = 1 second. */
				  'easing'               		: 'easeInOutExpo',		/* The easing setting used to transition each slide. Take a look in the jquery.easing.1.3.js file that you linked to your HTML document for more easings. You can use 'swing' and 'linear' without having to load the jquery.easing.1.3.js file. */
				  'viewingWindow'        		: $('#slider'),			/* This determines what will be the viewing window for the slider. You can use any element you want, but I have used the browser window here so that the slides appear full screen. */
				  'autoAdvance'					: false,				/* If true, the slider will automatically cycle through all slides over and over again. For this to work, the '.pageAnimate_nav' needs to have triggers to each slide (just set the 'appendTrigs' option to true). This is not desirable if you are using pageAnimate for its intended function, but if you want to use it as a slider, this might be optional. Also, the 'slideHash' setting must be set to false. */
				  'autoAdvanceTime'				: 5000,					/* The time taken in-between auto advance slides. */
				  'autoAdvanceHaltOnClick'		: true,					/* If true, the auto advance function will stop when the user manually clicks on a link to a slide. This will not work for links outside the .pageAnimate_nav. */
				  'slideHash'					: true					/* If true, you can give each slide a hash index. When someone types in the page URL with that hash index on the end, the pageAnimate will automatically advance to that slide. For example, http://mysite.com/mypage#slide2 might take the user to slide number 2. NOTE: if this setting is set to true, the auto advance function won't work. */	
				}, options);
    		return this.each(function() {
			
				/* Cache selectors in a variable for better performance */
				var $window = $(window),							/* The browser window */
					$slideContainer = $(".pageAnimate"),			/* The element that holds everything in the slider */
					$row = $(".pageAnimate").find(".row"),			/* Each row holds a specified amount of slides - all of them floated to the left */
					$slide = $(".pageAnimate").find(".slide"),		/* The slide */
					$nav = $(".pageAnimate_nav"),					/* This holds all the triggers that cause the slider to animate */
					$trigger = $(".pageAnimate_trigger");			/* Each trigger will cause a certain slide to be animate to when clicked */
					
				/* Add navigation triggers */				
				$slide.each(function(i, e) {	/* For each slide that exists... */
					
					/* Remove all manually added triggers */
					if (settings.destroyManTrigs === true) {	/* If you set the destroyManTrigs setting to true, all manually added triggers will be removed. */
						$(".pageAnimate_trigger" + i).remove();
					}
					else if (settings.destroyNavManTrigs === true) {	/* If you set the destroyManTrigs setting to true, manually added triggers *that are inside the nav* will be removed. */
						$(".pageAnimate_nav").find(".pageAnimate_trigger" + i).remove();
					}
					else {	/* If the setting is not set to true, nothing will happen. */
					}
					
					/* Add a nav trigger for each slide that exists - when clicked, these triggers cause the slider to navigate to that slide. */
					if (settings.appendTrigs === true) {
						$("<" + settings.triggerType + " class='pageAnimate_trigger pageAnimate_trigger" + i + "' title='" + (i + 1) + "'></" + settings.triggerType + ">").appendTo($nav);
						
					} else {
					}
				});
				
				/* When the page is loaded, add an active class to every trigger inside the nav that links to the first slide. They will be removed when another trigger is clicked, of course. */
				if (settings.addActiveToFirstNavTrigger === true) {
					$nav.find(".pageAnimate_trigger0").addClass("pageAnimate_triggerActive");
				}
				else {
				}
				
				/* Destroy hrefs of the trigger elements */
				if (settings.destroyTrigLinks === true) {
					$slide.each(function(i, evt) {	/* For each slide that exists... */
						$("a.pageAnimate_trigger, a.pageAnimate_trigger" + i).click(function(e) {	/* When the trigger is clicked... */
							if ( $(this).attr("href") ) {	/* If the trigger actually has an href... */
									e.preventDefault();	/* Prevent the href from being followed. */
							} else {	/* If there is no href, do nothing. */
							}
						});
                    });	
				} else {/* If you set the 'destroyTrigLinks' setting to false, do nothing. */
				}
				
				/* Main animation function */
				function animateSlider(){						
					
					var slideHeight = settings.viewingWindow.height(),	/* Set slide height and width to that of the viewing window (which is defined in the settings) so they appear to cover the viewing window. These settings override those in the CSS file. */
						slideWidth = settings.viewingWindow.width();
					
					$slide.width(slideWidth + "px").height(slideHeight + "px");	/* The width of each slide. Pretty self-explanatory. */
					
					$row.each(function(i, e) {	/* For each row that exists... */
						var $this = $(this),	/* Cache the 'this' object to optimize load time. */
							childrenSlideAmt = $this.children().length;	/* Get amount of children slides in each row. */
						
						$this.width(100 * childrenSlideAmt + "%");	/* Define how wide the row must be, according with the amount of slides in the row. */
					});
					
					
					$slide.each(function(i, e) {	/* For each slide that exists... */
							var $this = $(this),	/* Cache 'this' (which refers to the slide) */
								rowIndex = $this.parent($row).index(),	/* Get the index number for each parent row of each slide. Remember, all indexes start at 0, not 1. */
								slideIndex = $this.index();				/* Get the index number for each slide. */	
								
								$this.attr("data-index",i); /* Add an index number to each slide. */						
							
							/* Here, we are setting the co-ordinates that must be animated to in a given slider animation. IE doesn't like percentage values which is why extra browser detection code is required. */
							var userAgent = $.browser;	/* Find out what browser the user is using and cache it. */
							if ( userAgent.msie && userAgent.version.slice(0,1) < "9" ) {	/* If the browser is Microsoft Internet Explorer (msie) and is a version lower than 9... */
								var vertAnmtVal = slideHeight * rowIndex + "px",	/* Set the vertical and horizontal animate values (the amount a slide must animate to be shown) equal to that of the slideHeight (or slideWidth) multiplied by the row index (or slide index) we are currently on. */
									horizAnmtVal = slideWidth * slideIndex + "px";
							}
							else if ( userAgent.opera ) {	/* If vertAnmtVal and horizAnmtVal are percentage values, the Opera animation jumps badly when we are at the end of a row, or we are on a slide in the last row. You can change them to pixel values (as per the IE browser if statement above) with this browser specific else if statement - but when the window resizes, the slider won't automatically return to the slide we were just on. */
								var vertAnmtVal = 100 * rowIndex + "%",
									horizAnmtVal = 100 * slideIndex + "%";
							}
							else {	/* If the browser is not a MSIE browser lower than version 9... */
								var vertAnmtVal = 100 * rowIndex + "%",
									horizAnmtVal = 100 * slideIndex + "%";
							}
							
							/* Perform animation on trigger click */
							$(".pageAnimate_trigger" + i).click(function(e) {	/* When a trigger is clicked... You can substitute this line for the following code (increases performance, but means you cannot add any links to a slide outside of the navigation):   $nav.on('click', ".pageAnimate_trigger" + i, function(e) { */
								
								/* The animation */
								$slideContainer
									.stop(true, false)	/* Remove queued animations waiting to be run (the first value, which is 'true'), and do not finish the currently running animation if the trigger is clicked (the second value, which is 'false'). */
									.animate({top:"-" + vertAnmtVal, left:"-" + horizAnmtVal},settings.transTime,settings.easing)	/* Animate to the required co-ordinates over a set time and with a set easing. */
									.attr("data-slide",i);	/* Add the slide number that we're currently on to the container via the data attr. This is so we can reclick the nav trigger automatically when the window is resized. */
								/* Add an activeClass class to the slide we are currently viewing. */
								function addActiveClassToSlide(){
									$slide.removeClass("activeSlide");
									$("#pageAnimate_slide" + (i + 1) ).addClass("activeSlide");
								} addActiveClassToSlide();
								
								var currentSlide = $slideContainer.attr("data-slide");	/* Grab the slide number that we are currently on as per the data-slide attribute that is updated every time the animation occurs. */
								
								/* Add an active class to trigger element when clicked */
								if (settings.addActiveClassToTrigger === true) {	/* If the addActiveClassToTrigger setting was set to true... */
									$(".pageAnimate_trigger" + currentSlide).addClass("pageAnimate_triggerActive").siblings($trigger).removeClass("pageAnimate_triggerActive");	/* Add an active class to the trigger that was clicked and remove active classes from all other triggers. There is an easier way to do this by using '$(this)', but that won't compensate for external triggers being clicked. */
								}
								else if (settings.addActiveClassToNavTrigger === true) {	/* If the addActiveClassToNavTrigger setting was set to true... */
									$nav.find(".pageAnimate_trigger" + currentSlide).addClass("pageAnimate_triggerActive").siblings($trigger).removeClass("pageAnimate_triggerActive");	/* Add an active class to the trigger *inside the nav* that was clicked and remove active classes from all other triggers. */
								}
								else {
								}
								
							});
					});
				
				}animateSlider();
				
				$window.resize(function(e) {	/* On window resize... (IE8 doesn't recognize this when the user zooms in or out. If anyone knows why, let me know at contact@buildcreativewebsites.com) */
					var currentSlide = $slideContainer.attr("data-slide");	/* Return the slide number we are currently on as stored in the HTML data-slide attr. */
					$(".pageAnimate_trigger" + currentSlide).trigger('click',[true]).end().siblings().removeClass("pageAnimate_triggerActive");	/* When the window is resized, reclick the currently viewing slide's trigger, and remove active classes present in any other triggers. If this is not done, the slider won't be responsive in some browsers such as IE 7- (you may want to use browser detection to single out those browsers). */
					animateSlider();	/* Run the animation function which we defined earlier */
				});
						
				/* Auto advance between slides in a never ending cycle. This should only be used if the pageAnimate is intended for a conventional JS slider and not a webpage slider. */
				if (settings.autoAdvance === true) {
					$(document).ready(function(){
						var currentSlide = $(".pageAnimate").attr("data-slide"), /* Get the current slide we are on... */
							slideAmount = $(".slide").length, /* Get the amount of slides present. */
							timeOut = null;
							
						if (settings.autoAdvanceHaltOnClick === true) {
							/* Stop the autoAdvance function if a link in the pageAnimate_nav is manually clicked. */
						  $('.pageAnimate_trigger').click(function(e,simulated){
							   if(!simulated){
									clearTimeout(timeOut);
								}
							});
						} else {} /* If the autoAdvanceHaltOnClick setting is set to false, do nothing. */
						
						/* Begin autoAdvance */
						(function autoAdvance(){
							$('.pageAnimate_nav').find('.pageAnimate_trigger' + currentSlide).trigger('click',[true]); /* Find the trigger in the nav that will advance to the slide we are currently viewing when clicked. */
							
							if (slideAmount - 1 == currentSlide){ /* If the total number of slides - 1 equals the slide we are currently on, go back to the first slide. (1 is subtracted from the 'slideAmount' variable because everything is zero-based.) */
								currentSlide = 0; /* The current slide variable needs to be set to 0 for autoAdvance to return to the first slide. */
							} else {
								currentSlide++; /* Increment the currentSlide variable. */
							}
							timeOut = setTimeout(autoAdvance,settings.autoAdvanceTime);
						})();
					
					});
				}
				else { /* If you have set the autoAdvance setting to false, then do nothing. */
				}
				
				/* Add a URL hash for each slide. This makes each slide accesible from the URL bar. This feature will not work if the pageAnimate_nav is not created via this script (but it WILL work if the navigation panel is simply hidden via CSS with the 'display:none' property). */
				if (settings.slideHash === true) {	
					/* Set your hashes for each slide in the array below (be sure to remove the JavaScript comment slashes from the start and end of the block). Make sure there is one for each slide in the pageAnimate. For example, if you set hash[4] to '#contact', your site URL with #contact added to the end will make the slider go to slide number 5. */
					var hash = new Array();
						hash[0] = '#home';
						hash[1] = '#transition';
						hash[2] = '#compat';
						hash[3] = '#responsive';
						hash[4] = '#content';
						hash[5] = '#hassle';
						/* Keep adding new variables here if you have more slides. */
					
					/* When someone clicks on a navigation trigger, add its hash to the url */
					$(".pageAnimate_trigger").each(function(index, element){
						$(".pageAnimate_trigger" + index).click(function(e){
							location.hash = hash[index];
						});
					});
					
					/* The following function will be run everytime the window loads, and whenever the hash in the url changes. */
					function hashNav(){
						var urlHash = location.hash; /* Store location.hash in a variable. */
						
						/* If there is a hash appended onto the url that matches one of your predefined hashes, go to that slide. */
						$(".pageAnimate_trigger").each(function(index, element){
							if( urlHash == hash[index] ) {
								$(".pageAnimate_nav").find(".pageAnimate_trigger" + index).click();
							}
						});
					} hashNav();
						
					$(document).ready(function(){ /* When the document is ready, run the function.*/
						hashNav();
					});
					$(window).bind('hashchange', function(){ /* When someone manually changes the hash in the address bar, run the function. */
						hashNav();
					});
				}
				else{}
									
			});
  };
})(jQuery);