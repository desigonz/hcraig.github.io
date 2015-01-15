/*
Item Name : Sticky Footer 
Author URI : http://codecanyon.net/user/Pixelworkshop
Item URI : http://codecanyon.net/item/sticky-footer/168476
Version : 2.1
*/


(function($){



	function stickyFooterOver(){
		
		var footerDropUp = $('.footer_dropup',this);
	
		if(hoverIntentEffect === 'hover_fade'){
			$(footerDropUp).fadeIn(hoverIntentShow);
				$(this).hover(function() {
					$(footerDropUp).fadeOut(hoverIntentHide);
				});
		}
		else if(hoverIntentEffect === 'hover_slide'){
			$(footerDropUp).slideDown(hoverIntentShow);
				$(this).hover(function() {
					$(footerDropUp).slideUp(hoverIntentHide);
				});
		}
		else if(hoverIntentEffect === 'hover_toggle'){
			$(footerDropUp).animate({height: 'toggle', width: 'toggle', opacity: 'toggle'}, hoverIntentShow);
				$(this).hover(function() {
					$(footerDropUp).hide(hoverIntentHide);
				});
		}
		else if(hoverIntentEffect === 'click_fade'){
			$(this).click(function() {
				$(footerDropUp).fadeIn(hoverIntentShow); 
				$(this).hover(function() {
					$(footerDropUp).fadeOut(hoverIntentHide);
				});
			});
		}
		else if(hoverIntentEffect === 'click_slide'){
			$(this).click(function() {
				$(footerDropUp).slideDown(hoverIntentShow); 
				$(this).hover(function() {
					$(footerDropUp).slideUp(hoverIntentHide);
				});
			});
		}
		else if(hoverIntentEffect === 'click_toggle'){
			$(this).click(function() {
				$(footerDropUp).show(hoverIntentShow); 
				$(this).hover(function() {
					$(footerDropUp).hide(hoverIntentHide);
				});
			});
		}
	
	}
	
	
	function stickyFooterOut(){
		
		var footerDropUp = $('.footer_dropup',this);
		$(footerDropUp).hide();
		
	}
	
	
	function stickyFooterClickOutside(){
		
		$(document).click(function(){
			$('#footer').children('li').removeClass('active');
			$('.footer_dropup').hide(0);
		});
		
		$('#footer').click(function(event){
			event.stopPropagation();
		});
		
	}


	function opacityElements() { // Chaging opacity of the social icons on mouse hover and mouse out
		
		$('#social ul li, .tooltip').css({"opacity": 0.5}).hover(function() { 
			$(this).stop().animate({"opacity": 0.95}); 
		},function() { 
			$(this).stop().animate({"opacity": 0.5}); 
		});
		
	}	



	$.fn.stickyFooter = function(options){


		var options = $.extend({
			dropup_speed_show : 300, // Time (in milliseconds) to show a drop down
			dropup_speed_hide : 200, // Time (in milliseconds) to hide a drop down
			dropup_speed_delay : 200, // Time (in milliseconds) before showing a drop down
			footer_effect : 'hover_fade', // Drop down effect, choose between 'hover_fade', 'hover_slide', 'click_fade', 'click_slide', 'open_close_fade', 'open_close_slide'
			footer_click_outside : 0, // Clicks outside the drop down close it (1 = true, 0 = false)
			showhidefooter : 'hide', // Footer can be hidden when the page loads
			hide_speed : 1000, // Time to hide the footer (in milliseconds) if the 'showhidefooter' option is set to 'hide'
			hide_delay : 2000 // Time before hiding the footer (in milliseconds) if the 'showhidefooter' option is set to 'hide'
		}, options);


		return this.each(function() {
			
			
			var	stickyFooter = $(this),
				stickyFooterItem = $(stickyFooter).children('li'),
				stickyFooterDropUp = $(stickyFooterItem).children('.footer_dropup');
	
			$('.footer_dropup').css('left', 'auto').hide();
			
			opacityElements();

			if(options.footer_click_outside === 1){
				stickyFooterClickOutside();
			}
			
	
			if (Modernizr.touch){
				
				$(stickyFooterItem).bind('touchstart', function() {
					
					var $this = $(this);
					$this.siblings().removeClass('active').end().toggleClass('active');
					$this.siblings().find(stickyFooterDropUp).hide(0);
					$this.find(stickyFooterDropUp)
						.delay(options.dropup_speed_delay)
						.show(0)
						.click(function(event){
							event.stopPropagation();
						});
					
				});
					
			}


			else if (options.footer_effect === 'hover_fade' || options.footer_effect === 'hover_slide' || options.footer_effect === 'hover_toggle' || options.footer_effect === 'click_fade' || options.footer_effect === 'click_slide' || options.footer_effect === 'click_toggle'){
				
				hoverIntentEffect = options.footer_effect;
				hoverIntentShow = options.dropup_speed_show;
				hoverIntentHide = options.dropup_speed_hide;
				// HoverIntent Configuration
				var hoverIntentConfig = {
					sensitivity: 2, // number = sensitivity threshold (must be 1 or higher)
					interval: 100, // number = milliseconds for onMouseOver polling interval
					over: stickyFooterOver, // function = onMouseOver callback (REQUIRED)
					timeout: 200, // number = milliseconds delay before onMouseOut
					out: stickyFooterOut // function = onMouseOut callback (REQUIRED)
				};
				
				$(stickyFooterItem).hoverIntent(hoverIntentConfig);
	
			}


			else if (options.footer_effect == 'open_close_fade'){
		
				$(stickyFooterItem).unbind('mouseenter mouseleave');
		
				$(stickyFooterItem).click(function() {
										
					var $this = $(this);
					$this.siblings().removeClass('active').end().toggleClass('active');
					$this.siblings().find(stickyFooterDropUp).fadeOut(options.dropup_speed_hide);
					$this.find(stickyFooterDropUp)
						.delay(options.dropup_speed_delay)
						.fadeToggle(options.dropup_speed_show)
						.click(function(event){
							event.stopPropagation();
					});
					
				});
		
			}
	
			else if (options.footer_effect === 'open_close_slide') {
		
				$(stickyFooterItem).unbind('mouseenter mouseleave');
		
				$(stickyFooterItem).click(function() {
					
					var $this = $(this);
					$this.siblings().removeClass('active').end().toggleClass('active');
					$this.siblings().find(stickyFooterDropUp).slideUp(options.dropup_speed_hide);
					$this.find(stickyFooterDropUp)
						.delay(options.dropup_speed_delay)
						.slideToggle(options.dropup_speed_show)
						.click(function(event){
							event.stopPropagation();
						});
					
				});
									
			}
		
			else if (options.footer_effect === 'open_close_toggle') {
		
				$(stickyFooterItem).unbind('mouseenter mouseleave');
		
				$(stickyFooterItem).click(function() {
					
					var $this = $(this);
					$this.siblings().removeClass('active').end().toggleClass('active');
					$this.siblings().find(stickyFooterDropUp).hide(options.dropup_speed_hide);
					$this.find(stickyFooterDropUp)
						.delay(options.dropup_speed_delay)
						.toggle(options.dropup_speed_show)
						.click(function(event){
							event.stopPropagation();
						});
					
				});
									
			}


			if( options.showhidefooter == 'hide' ) { // Option to hide the footer when the page loads
				$(stickyFooter).stop().delay(options.hide_delay).slideToggle(options.hide_speed);
				$('#footer_trigger').toggleClass("trigger_active");
			} else if( options.showhidefooter == 'show' ) {
				$(stickyFooter).stop().hide().fadeIn(300);
			}
			
			$('#footer_trigger').click(function() { // Hiding and showing the footer when clicking on the trigger
				$(stickyFooter).slideToggle(400);
				$('#footer_trigger').toggleClass("trigger_active");
				return false;
			});
			
			
		}); // End each

		
	};

	
	
})(jQuery);

