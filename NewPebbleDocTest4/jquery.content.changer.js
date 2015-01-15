/*
 * jQuery Animated Content Changer, jquery.content.changer.js
 * Copyright (c) 2011, Johan Bergman
 */
(function($) {
	
	$.fn.contentChanger = function(settings){
		var config = {
				'animationDuration': 400,
				'animationMode': 'move',
				'changeableClassName': 'changeable',
				'defaultClassName': 'default',
				'preserveSizeClassName': 'pz',
				'triggerAttribute': 'data-activates',
				'triggerClassName': 'trigger',
				'triggerEventType': 'click',
				'triggerScope': ''
		};
		
		if (settings){$.extend(config, settings);}
		
		return this.each(function() {
			
			// Variables
			var container = $(this);
			var triggerScope = $((config.triggerScope === '' ? this : config.triggerScope)).find('*');
			var triggers = triggerScope.filter('[' + config.triggerAttribute + ']').filter('.' + config.triggerClassName);
			var animating = false;
			
			// Initially hide all but default elements
			var nonDefaults = container.find('.' + config.changeableClassName).not('.' + config.defaultClassName);
			nonDefaults.hide();
			
			// Watch for events
			triggers.bind(config.triggerEventType, function() {
				
				// Main function, called when triggers recieve triggerEventType
				
				if (animating) {
					return false;
				} animating = true;
				
				// Getting elements in appropriate jQuery objects
				var triggerElement = $(this);
				var trigger = triggerElement.attr(config.triggerAttribute);
				
				var untouched = container.find('*').not('.' + config.changeableClassName)
					.add(container.find('.' + trigger).filter(':visible'))
					.add(container.find('*').not('.' + trigger).filter(':hidden'));
				var toShow = container.find('.' + trigger)
					.not(untouched);
				var toHide = container.find('*')
					.not('.' + trigger)
					.not(untouched);
				
				var toMove = untouched.filter(':visible');
				
				toShow = toShow.not(toHide);
				toHide = toHide.not(toShow);
				
				if (toShow.length === 0 && toHide.length === 0) {
					animating = false;
					return false;
				}
				
				var containers = toMove.find('*').parentsUntil(container).add(container).filter(':visible');
				var preserveSizeContainers = container.find('.' + config.preserveSizeClassName);
				var unaffectedContainers = $([]);
				containers.each(function() {
					// If container has only static content, add it
					var $this = $(this);
					if ($this.find(toShow.add(toHide)).length === 0) {
						unaffectedContainers = unaffectedContainers.add($this);
					}
				});
				
				var elements = {
						'container': container,
						'toMove': toMove,
						'toShow': toShow,
						'toHide': toHide,
						'untouched': untouched,
						'containers': containers,
						'unaffectedContainers': unaffectedContainers,
						'preserveSizeContainers': preserveSizeContainers
				};
				
				switch (config.animationMode) {
				case 'none':
					toggle(elements, config, function() {
						animating = false;
					});
					break;
					
				case 'fade':
					fade(elements, config, function() {
						animating = false;
					});
					break;
					
				case 'move':
					animate(elements, config, function() {
						animating = false;
					});
					break;
					
				default:
					animate(elements, config, function() {
						animating = false;
					});
					break;
				}
				
				return false;
			});
		});
		
	};
	
	// Toggle elements, without animation
	function toggle(elements, config, callback) {
		var toShow = elements.toShow;
		var toHide = elements.toHide;
		
		// Get original display value, that might be overridden by the default display: none
		originalDisplayValue(toShow, config.changeableClassName);
		
		toHide.hide();
		toShow.show();
		
		// Callback
		if ($.isFunction(callback)) {
			callback();
		}
	}
	
	// Fade out, resize and fade in again
	function fade(elements, config, callback) {
		
		var animationDuration = config.animationDuration;
		
		var container = elements.container;
		var toMove = elements.toMove;
		var toShow = elements.toShow;
		var toHide = elements.toHide;
		
		// Only work with direct children of the container
		var toFadeIn = container.children().filter(elements.toShow.add(toMove));
		var toFadeOut = container.children().filter(elements.toHide.add(toMove));
		
		// Get original display value, that might be overridden by the default display: none
		originalDisplayValue(toShow, config.changeableClassName);
		
		toHide.hide();
		toShow.show();
		var newHeight = container.height();
		toHide.show();
		toShow.hide();
		
		container.css({'height': container.height()});
		var count = toFadeOut.length;
		if (count > 0) {
			toFadeOut.fadeOut(animationDuration, function() {
				if (--count === 0) {
					toHide.hide();
					fadeStep2();
				}
			});
		}
		else {
			fadeStep2();
		}
		
		function fadeStep2() {
			var overflow = container.css('overflow');
			container.animate({'height': newHeight + 'px'}, animationDuration, function() {
				
				var count2 = toFadeIn.length;
				if (count2 > 0) {
					toShow.not(toFadeIn).show();
					toFadeIn.fadeIn(animationDuration, function() {
						if ($.browser.msie) {
							// Anti-aliasing fix for old IE
							$(this).get(0).style.removeAttribute('filter');
						}	
						if (--count2 === 0) {
							fadeStep3();
						}
					});
				}
				else {
					fadeStep3();
				}
			}).css('overflow', overflow);
		}
		
		function fadeStep3() {
			container.css({'height': 'auto'});
			
			// Callback
			if ($.isFunction(callback)) {
				callback();
			}
		}
	}
	
	// Fade out toHide, resize, animate toMove and fade in toShow
	function animate(elements, config, callback) {
		
		var animationDuration = config.animationDuration;
		
		var toMove = elements.toMove;
		var toShow = elements.toShow;
		var toHide = elements.toHide;
		var unaffectedContainers = elements.unaffectedContainers;
		var preserveSizeContainers = elements.preserveSizeContainers.not(unaffectedContainers);
		var containers = elements.containers.not(preserveSizeContainers).not(unaffectedContainers);
		
		// Don't need to move unaffectedContainers' content, since it is static
		toMove = toMove.not(unaffectedContainers.find('*'));
		
		// Save the original css
		toMove.add(toHide).each(function() {
			var $this = $(this);
			var originalCss = {
					'originalPositionType': $(this).css('position'),
					'originalPosition': {
						'top': ($this.css('top') !== 'auto' ? parseFloat($this.css('top'), 10) : 0),
						'left': ($this.css('left') !== 'auto' ? parseFloat($this.css('left'), 10) : 0)
					}
			};
			$this.data(originalCss);
			// Position must be relative both for containers and objects inside (not if container is unaffected)
			$this.css({'position': 'relative'});
			
			$this.data('oldPosition', $this.position());
		});
		
		// Get original display value, that might be overridden by the default display: none
		originalDisplayValue(toShow, config.changeableClassName);
		
		// Measurements before animation
		containers.each(function(i) {
			var $this = $(this);
			$this.data('oldHeight', $this.height());
			
			// Keep height of resizing stuff
			$this.css({'height': $this.height() + 'px'});
		});
		
		// Since fixed height on containers clips overflowing margin from children elements, the "jump" that might occur must be taken into account
		toMove.add(toHide).each(function(i) {
			var $this = $(this);
			var jumpedPosition = $.extend(true, {}, $this.data('oldPosition'));
			jumpedPosition.top -= $this.position().top;
			$this.data('jumpedPosition', jumpedPosition);
		});
		
		toHide.hide();
		
		// Measurements in the middle of animation
		toMove.each(function(i) {
			var $this = $(this);
			$this.data('middlePosition', $this.position());
		});
		
		// Reset height of resizing stuff
		containers.each(function() {
			$(this).css({'height': 'auto'});
		});
		
		toShow.show();
		
		// Measurements after animation
		containers.each(function(i) {
			var $this = $(this);
			$this.data('newHeight', $this.height());
		});
		
		toShow.each(function() {
			var $this = $(this);
			var originalCss = {
					'originalPositionType': $(this).css('position'),
					'originalPosition': {
						'top': ($this.css('top') !== 'auto' ? parseFloat($this.css('top'), 10) : 0),
						'left': ($this.css('left') !== 'auto' ? parseFloat($this.css('left'), 10) : 0)
					}
			};
			$this.data(originalCss);
			$this.css({'position': 'relative'});
			
			$this.data('oldPosition', $this.position());
		});
		
		// Set back to fixed heights for margin fix
		containers.each(function(i) {
			var $this = $(this);
			$this.css({'height': $this.data('newHeight') + 'px'});
		});
		
		// Again, margin overflow fix, but for toShow
		toShow.each(function(i) {
			var $this = $(this);
			var jumpedPosition = $.extend(true, {}, $this.data('oldPosition'));
			jumpedPosition.top -= $this.position().top;
			$this.data('jumpedPosition', jumpedPosition);
		});
		
		// Set back to old, but fixed, heights
		containers.each(function(i) {
			var $this = $(this);
			$this.css({'height': $this.data('oldHeight') + 'px'});
		});
		
		// It would make sense to put this above the "Set back to old heights", but since the containers change size and pushes the "flow" down,
		// they need to be in the calculation.
		toMove.each(function(i) {
			var $this = $(this);
			$this.data('newPosition', $this.position());
		});
		
		// Reset, finished measuring. Don't reset height of containers, since fixed height is needed for the animation.
		toHide.show();
		toShow.hide();
		
		// Apply fixed position before animation to prevent possible jump
		toMove.add(toHide).each(function() {
			var $this = $(this);
			$this.css({'top': $this.data('jumpedPosition').top + $this.data('originalPosition').top});
		});
		toMove.each(function() {
			var $this = $(this);
			var newPos = $.extend(true, {}, $this.data('newPosition'));
			newPos.top += $this.data('jumpedPosition').top;
			$this.data('newPosition', newPos);
		});
		
		
		// Animation begins
		var count = toHide.length;
		if (count > 0) {
			toHide.fadeOut(animationDuration, function() {
				if (--count === 0) {
					animateStep2();
				}
			});
		}
		else {
			animateStep2();
		}
		
		function animateStep2() {
			toMove.each(function(i) {
				var $this = $(this);
				$this.css({
					'top': ($this.data('oldPosition').top - $this.data('middlePosition').top + $this.data('originalPosition').top) + 'px',
					'left': ($this.data('oldPosition').left - $this.data('middlePosition').left + $this.data('originalPosition').left) + 'px'
				});
			});
			
			toMove.each(function(i) {
				var $this = $(this);
				$this.animate({
					'top': ($this.data('newPosition').top - $this.data('middlePosition').top + $this.data('originalPosition').top) + 'px',
					'left': ($this.data('newPosition').left - $this.data('middlePosition').left + $this.data('originalPosition').left) + 'px'
				}, animationDuration);
			});
			
			// Don't animate height of inline elements, will only make jQuery set display to inline-block
			var inlineElements = containers.filter(function() {
				return $(this).css('display') === 'inline';
			});
			var count2 = containers.not(inlineElements).length;
			containers.not(inlineElements).each(function(i) {
				var $this = $(this);
				var overflow = $this.css('overflow');
				$this.animate({'height': $this.data('newHeight') + 'px'},
						{duration: animationDuration, queue: false, complete: function() {
					if (--count2 === 0) {
						animateStep3();
					}
				}}).css('overflow', overflow);
			});
		};
		
		function animateStep3() {
			
			toMove.add(toHide).each(function() {
				var $this = $(this);
				$this.css({
					'top': $this.data('originalPosition').top + $this.data('jumpedPosition').top,
					'left': $this.data('originalPosition').left
				});
			});
			
			var count3 = toShow.length;
			if (count3 > 0) {
				// Apply fixed position before animation to prevent possible jump
				toShow.each(function() {
					var $this = $(this);
					$this.css({'top': $this.data('jumpedPosition').top});
				});
				toShow.fadeIn(animationDuration, function() {
					if ($.browser.msie) {
						// Anti-aliasing fix for old IE
						$(this).get(0).style.removeAttribute('filter');
					}
					if (--count3 === 0) {
						animateStep4();
					}
				});
			}
			else {
				animateStep4();
			}
		}
		
		function animateStep4() {
			// Reset css
			containers.each(function(i) {
				$(this).css({'height': 'auto'});
			});
			toMove.add(toHide).add(toShow).each(function() {
				var $this = $(this);
				$this.css({
					'position': $this.data('originalPositionType'),
					'top': $this.data('originalPosition').top,
					'left': $this.data('originalPosition').left
				});
			});
			
			// Callback
			if ($.isFunction(callback)) {
				callback();
			}
		}
		
	}
	
	function originalDisplayValue(elements, className) {
		elements.each(function() {
			var $this = $(this);
			var display = $this.removeClass(className).css('display');
			$this.addClass(className);
			$this.css({'display': display}).hide();
		});
	}
	
})(jQuery);
