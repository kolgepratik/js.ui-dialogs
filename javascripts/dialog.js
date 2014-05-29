(
	function( $ ) {
		var settings = {			
			dialog: {
				defaults: {
					fixedDialog: true,
					closeButton: true, 
					closeOnEscape: true,
					closeOnBlur: true,
					fixed: { width: 800, height: 400, title: { height: 30 }, controls: { height: 50 } },
					dynamic: { width: 60, height: 60, title: { height: 10 }, controls: { height: 15 } }
				},
				minZIndex: 5,
				activeDialogs: new Array()	
			}
		};
		
		/**
		* This variable holds all methods supported by this plugin. 
		*/
		var methods = {
						
			init: function(options) {
				return this.each(function() {
					var $element = $(this);
					
					var elementID = $element[0].id;
					
					options = $.extend({}, settings.dialog.defaults, options);
					
					settings.dialog[elementID] = options ? options : {};
					
					if(options.fixedDialog) {
						$.extend(options, settings.dialog.defaults.fixed);
					} else {
						$.extend(options, settings.dialog.defaults.dynamic);
					}
					
                    $element.addClass('dialog-dialog');
                    
					$element.css(helpers.dialog.getCSSForDialog(options));
					
					var $dialogContainer = $('<div></div>', { 'id': 'dialogContainer_' + elementID, 'class': 'dialog-container' });
					$element.wrap($dialogContainer);					
					
					if(options.fixedDialog) {
						$element.find('.dialog-title').css('height', settings.dialog.defaults.fixed.title.height + 'px');
						$element.find('.dialog-controls').css('height', settings.dialog.defaults.fixed.controls.height + 'px');
					} else {
						$element.find('.dialog-title').css('height', settings.dialog.defaults.dynamic.title.height + '%');
						$element.find('.dialog-controls').css('height', settings.dialog.defaults.dynamic.controls.height + '%');
					}
					
					if(options.closeButton) {
						var $closeButton = $('<div></div>', { 'class': 'dialog-closeButton', 'title': 'Close', 'dialog-box-id': elementID });
						$closeButton.on('click.dialog', function() {
							$('#' + $(this).attr('dialog-box-id')).trigger('dialog-close');
						});
						$element.append($closeButton);
					}
					
					if(options.closeOnEscape) {
						$(window).off('keyup.dialog');
						$(window).on('keyup.dialog', function(event) {
							if(event.which === 27) {
								if(settings.dialog[settings.dialog.activeDialogs[settings.dialog.activeDialogs.length - 1]].closeOnEscape) {
									$('#' + settings.dialog.activeDialogs[settings.dialog.activeDialogs.length - 1]).trigger('dialog-close');
									event.stopPropagation();
								}
							}
						});
					}
					
					if(options.closeOnBlur) {
						$('#dialogContainer_' + elementID).on('click.dialog', function(event) {
							if(settings.dialog[settings.dialog.activeDialogs[settings.dialog.activeDialogs.length - 1]].closeOnBlur) {
								$('#' + settings.dialog.activeDialogs[settings.dialog.activeDialogs.length - 1]).trigger('dialog-close');
								event.stopPropagation();
							}
						});
						
						$element.on('click.dialog', function(event) {
							event.stopPropagation();
						});
					}
					
					$element.on('dialog-open.dialog', function() {
						settings.dialog.activeDialogs.push(this.id);
						var options = $.extend({ factor: (settings.dialog.activeDialogs.length * 10) }, settings.dialog[this.id]);
						$element.css(helpers.dialog.getCSSForDialog(options));
						$('#dialogContainer_' + this.id).css('z-index', (settings.dialog.minZIndex + settings.dialog.activeDialogs.length)).show();
					});
					
					$element.on('dialog-close.dialog', function() {						
						var elementID = this.id;
						settings.dialog.activeDialogs = $.grep(settings.dialog.activeDialogs, function(e, i) {
							return (e === elementID);
						}, true);
						$('#dialogContainer_' + this.id).hide();
					});
					
					$element.trigger('dialog-open');
					$element.trigger('dialog-close');
				});
			}
		};
		
		var helpers = {
			dialog: {
				getCSSForDialog: function(options) {
					var customCssStyles = {};
					
					var fixedDialog = false;
					if(options.fixedDialog) {
						fixedDialog = true;
					} 
					
					if(options.width) {
						if(fixedDialog) {
							customCssStyles['width'] = options.width + 'px';
							customCssStyles['margin-left'] = ((options.width/2) * (-1)) + (options.factor) + 'px';
						} else {
							customCssStyles['width'] = options.width + '%';
						}
					} else {
						if(fixedDialog) {
							customCssStyles['width'] = options.width + 'px';
							customCssStyles['margin-left'] = ((options.width/2) * (-1) + (options.factor));
						} else {
							customCssStyles['width'] = options.width + '%';
						}
					}
					
					if(options.height) {
						if(fixedDialog) {
							customCssStyles['height'] = options.height + 'px';
							customCssStyles['margin-top'] = ((options.height/2) * (-1) + (options.factor));
						} else {
							customCssStyles['height'] = options.height + '%';
						}
					} else {
						if(fixedDialog) {
							customCssStyles['height'] = options.height + 'px';
							customCssStyles['margin-top'] = ((options.height/2) * (-1) + (options.factor));
						} else {
							customCssStyles['height'] = options.height + '%';
						}
					}
					
					if(fixedDialog) {
						customCssStyles['left'] = '50%';
						customCssStyles['top'] = '50%';
					} else {
						customCssStyles['left'] = ((100 - options.width)/2) + (options.factor / 5) + '%';
						customCssStyles['top'] = ((100 - options.height)/2) + (options.factor / 5) + '%';
					}
					
					return customCssStyles;
				}
			}	
		};
		
		/**
		* This is where calls from pages come. Calls requested functions appropriately. 
		*/ 
		$.fn.dialog = function( method ) {
			// If the method parameter is present, then call the method, else call the default method i.e. init. 
			if( methods[method] ) {
				return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
			} else if ( !method || typeof method === 'object' ) {
				return methods.init.apply(this, arguments); 
			} else {
				$.error('Method ' + method + ' does not exist on jQuery.dialog');
			}
		}; 
	}
) (jQuery) ;