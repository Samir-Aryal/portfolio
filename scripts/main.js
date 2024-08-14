(function($) {

	'use strict';

	var isAnimating = false,
		defaultAnimationOut = 'fadeOut',
		defaultAnimationIn = 'fadeIn',
		sectionHeadingAnimationOut = '',
		sectionHeadingAnimationIn = '',
		sectionContentAnimationOut = '',
		sectionContentAnimationIn = '',
		nextSectionId = '',
		animationEnd;

	function animationEndEventName() {
		var i,
			el = document.createElement('div'),
			animations = {
				'animation': 'animationend',
				'oAnimation': 'oAnimationEnd',
				'MSAnimation': 'MSAnimationEnd',
				'mozAnimation': 'mozAnimationEnd',
				'WebkitAnimation': 'webkitAnimationEnd'
			};
		for (i in animations) {
			if (animations.hasOwnProperty(i) && el.style[i] !== undefined) {
				return animations[i];
			}
		}
	}

	function animateSections() {

		$('.section-in').removeClass('section-in').addClass('section-out');
		var $sectionHeadingOut = $('.section-out .section-heading'),
			$sectionContentOut = $('.section-out .section-content');
		if ($sectionHeadingOut.length) {
			sectionHeadingAnimationOut = $sectionHeadingOut.data('animation-out') || defaultAnimationOut;
			$sectionHeadingOut.addClass(sectionHeadingAnimationOut).removeClass(sectionHeadingAnimationIn);
		}
		sectionContentAnimationOut = $sectionContentOut.data('animation-out') || defaultAnimationOut;
		$sectionContentOut.addClass(sectionContentAnimationOut).removeClass(sectionContentAnimationIn);

		if ($(nextSectionId).length) {
			$(nextSectionId).addClass('section-in');
		} else {
			$('.section').eq(0).addClass('section-in');
		}
		var $sectionHeadingIn = $('.section-in .section-heading'),
			$sectionContentIn = $('.section-in .section-content');
		if ($sectionHeadingIn.length) {
			sectionHeadingAnimationIn = $sectionHeadingIn.data('animation-in') || defaultAnimationIn;
			$sectionHeadingIn.removeClass(sectionHeadingAnimationOut).addClass(sectionHeadingAnimationIn);
		}
		sectionContentAnimationIn = $sectionContentIn.data('animation-in') || defaultAnimationIn;
		$sectionContentIn.addClass(sectionContentAnimationIn);

		$('.nav-main a[href="' + nextSectionId + '"]').parent().addClass('active').siblings().removeClass('active');

	}

	function changeSections(e) {
		var sectionId = $(e.target).attr('href') || $(e.target).parent().attr('href');
		if (isAnimating || sectionId === location.hash) {
			return false;
		} else {
			isAnimating = true;
			nextSectionId = sectionId;
			location.hash = sectionId;
			animateSections();
		}
	}

	function checkUrlHash() {
		var hash = location.hash;
		if (hash.length && $('section' + hash).length) {
			nextSectionId = hash;
			animateSections();
		}
	}

	$(document).ready(function() {

		var $navLinks = $('.nav-main a').not('.external');
		animationEnd = animationEndEventName();

		$('.btn-site-loader-close').on('click', function() {
			$('.site-loader').fadeOut('slow');
		});

		/*=============================================>>>>>
		= TOGGLE MAIN NAVIGATION =
		===============================================>>>>>*/
		$('.btn-nav-toggle').on('click', function() {
			$('body').toggleClass('site-nav-visible');
		});

		/*=============================================>>>>>
		= TEXT EFFECTS =
		===============================================>>>>>*/
		$('.tlt').textillate({
			loop: true,
			minDisplayTime: 5000,
			in: {
				shuffle: true
			},
			out: {
				shuffle: true
			}
		});

		/*=============================================>>>>>
		= SLIDESHOW =
		===============================================>>>>>*/
		$('.swiper-container').each(function () {
			var	slider = $(this),
				sliderOptions = slider.data('slideshow-options'),
				defaultOptions = {
					prevButton: $('.swiper-button-prev', slider),
					nextButton: $('.swiper-button-next', slider),
					pagination: $('.swiper-pagination', slider),
					paginationClickable: true,
					loop: true,
					fade: {crossFade: true},
					autoplay: 10000,
					spaceBetween: 50
				};
			var mySwiper = new Swiper(slider, $.extend(defaultOptions, sliderOptions));
		});

		/*=============================================>>>>>
		= TABS =
		===============================================>>>>>*/
		$('.tabs').on('click', '.tabs-nav li', function(e){
			e.preventDefault();
			var tab = $('a', this).attr('href');
			$(this).addClass('active').siblings().removeClass('active').parents('.tabs').find(tab).addClass('active').siblings('.tabs-item').removeClass('active');
		});

		/*=============================================>>>>>
		= ACCORDION =
		===============================================>>>>>*/
		$('.accordion-item').each(function() {
			var $self = $(this);
			if ($self.hasClass('active')) {
				$self.find('.accordion-item-inner').slideToggle();
			}
		});

		$('.accordion').on('click', '.accordion-item-heading', function(){
			var $item = $(this).parent();
			$item.toggleClass('active').find('.accordion-item-inner').slideToggle();
			$item.siblings().removeClass('active').find('.accordion-item-inner').slideUp();
		});

		/*=============================================>>>>>
		= TOGGLES =
		===============================================>>>>>*/
		$('.toggle').on('click', '.toggle-heading', function(){
			var $item = $(this).parent();
			$item.toggleClass('active').find('.toggle-inner').slideToggle();
		});

		/*=============================================>>>>>
		= THUMBS GRID & FILTERING =
		===============================================>>>>>*/
		var wall = new Freewall('.thumbs');
		wall.reset({
			selector: '.thumbs-item',
			gutterY: 0,
			gutterX: 0,
			animate: true,
			cellW: function(width) {
				var cellWidth = width / 4;
				return cellWidth;
			},
			cellH: 'auto',
			onResize: function() {
				wall.refresh();
			}
		});

		wall.fitWidth();

		wall.container.find('.thumbs-item img').load(function() {
			wall.refresh();
		});

		$('.thumbs-filter li').on('click', function() {
			var self = $(this),
				group = self.data('group');
			self.addClass('active').siblings().removeClass('active');
			if (group) {
				wall.filter(group);
			} else {
				wall.unFilter();
			}
		});

		/*=============================================>>>>>
		= PROGRESS BARS =
		===============================================>>>>>*/
		var progressElems = document.querySelectorAll('.progress');
		Array.prototype.forEach.call(progressElems, function (el, i) {
			var progressVal = el.getAttribute('data-progress'),
				progress;
			if ($(el).hasClass('progress-line')) {
				progress = new ProgressBar.Line(progressElems[i], {
					strokeWidth: 5,
					easing: 'easeInOut',
					trailWidth: 5,
					text: {
						value: '0',
						style: {
						}
					},
					svgStyle: {width: '100%', height: '100%'},
					step: function(state, bar) {
						bar.setText((bar.value() * 100).toFixed(0) + '%');
					}
				});
			} else {
				progress = new ProgressBar.Circle(progressElems[i], {
					strokeWidth: 5,
					easing: 'easeInOut',
					trailWidth: 5,
					text: {
						value: '0'
					},
					step: function(state, bar) {
						bar.setText((bar.value() * 100).toFixed(0) + '%');
					}
				});
			}
			$(el).bind('inview', function(event, isInView) {
				if (isInView) {
					if (!$(el).hasClass('active')) {
						progress.animate(progressVal / 100);
						$(el).addClass('active');
					}
				}
			});
		});

		/*=============================================>>>>>
		= COUNTERS =
		===============================================>>>>>*/
		$('.counter').each(function() {
			var $el = $(this),
				$valEl = $el.find('.counter-value'),
				counterVal = $el.data('counter-value');
			$el.bind('inview', function(event, isInView) {
				if (isInView) {
					if ($valEl.text() <= 0) {
						jQuery({someValue: 0}).animate({someValue: counterVal}, {
							duration: 2000,
							easing: 'swing',
							step: function() {
								$valEl.text(Math.ceil(this.someValue));
							}
						});
					}
				}
			});
		});

		/*=============================================>>>>>
		= TWEETS =
		===============================================>>>>>*/
		var tweetsId = 'tweets',
		tweetsEl = document.getElementById(tweetsId);
		if (tweetsEl) {
			var tweetsConfig = {
				'profile': {screenName: tweetsEl.getAttribute('data-username')},
				'domId': tweetsId,
				'maxTweets': 3,
				'showInteraction': false,
				'showTime': false
			};
			twitterFetcher.fetch(tweetsConfig);
		}

		/*=============================================>>>>>
		= MAP =
		===============================================>>>>>*/
		var mapEl = document.getElementById('map');
		if (mapEl) {

			L.TileLayer.Grayscale = L.TileLayer.extend({
				options: {
					quotaRed: 21,
					quotaGreen: 71,
					quotaBlue: 8,
					quotaDividerTune: 0,
					quotaDivider: function() {
						return this.quotaRed + this.quotaGreen + this.quotaBlue + this.quotaDividerTune;
					}
				},

				initialize: function (url, options) {
					options = options || {};
					options.crossOrigin = true;
					L.TileLayer.prototype.initialize.call(this, url, options);

					this.on('tileload', function(e) {
						this._makeGrayscale(e.tile);
					});
				},

				_createTile: function () {
					var tile = L.TileLayer.prototype._createTile.call(this);
					tile.crossOrigin = 'Anonymous';
					return tile;
				},

				_makeGrayscale: function (img) {
					if (img.getAttribute('data-grayscaled')) {
						return;
					}

					img.crossOrigin = '';
					var canvas = document.createElement('canvas');
					canvas.width = img.width;
					canvas.height = img.height;
					var ctx = canvas.getContext('2d');
					ctx.drawImage(img, 0, 0);

					var imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
					var pix = imgd.data;
					for (var i = 0, n = pix.length; i < n; i += 4) {
									pix[i] = pix[i + 1] = pix[i + 2] = (this.options.quotaRed * pix[i] + this.options.quotaGreen * pix[i + 1] + this.options.quotaBlue * pix[i + 2]) / this.options.quotaDivider();
					}
					ctx.putImageData(imgd, 0, 0);
					img.setAttribute('data-grayscaled', true);
					img.src = canvas.toDataURL();
				}
			});

			L.tileLayer.grayscale = function (url, options) {
				return new L.TileLayer.Grayscale(url, options);
			};

			var lat = mapEl.getAttribute('data-latitude');
			var lng = mapEl.getAttribute('data-longitude');
			var map = L.map(mapEl, {
				center: [lat, lng],
				zoom: 18,
				'zoomControl': false
			});
			var icon = L.icon({
				iconUrl: 'images/map-marker.png',
				iconSize: [100, 106],
				iconAnchor: [100, 106]
			});

			var zoomControl = L.control.zoom({
				position: 'topright'
			});
			map.addControl(zoomControl);

			L.tileLayer.grayscale('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
			L.marker([lat, lng], {icon: icon}).addTo(map);

		}

		/*=============================================>>>>>
		= POPUPS =
		===============================================>>>>>*/
		$('.btn-popup').magnificPopup({
			mainClass: 'indivo',
			removalDelay: 300
		});

		$('.btn-lightbox').magnificPopup({
			type: 'image',
			mainClass: 'indivo',
			removalDelay: 300
		});

		$('.gallery').each(function() {
			$(this).magnificPopup({
				delegate: 'a',
				type: 'image',
				mainClass: 'indivo',
				gallery: {
					enabled: true
				},
				removalDelay: 300
			});
		});

		/*=============================================>>>>>
		= FORM ELEMENTS STYLING =
		===============================================>>>>>*/
		$('select, input[type="checkbox"], input[type="radio"], input[type="file"], input[type="number"]').styler({
			filePlaceholder: 'No file selected',
			fileBrowse: 'Browse…'
		});

		/*=============================================>>>>>
		= FORM VALIDATION =
		===============================================>>>>>*/
		$('form').each( function() {
			$(this).validate();
		});

		/*=============================================>>>>>
		= FORM SUBMIT =
		===============================================>>>>>*/
		$('.form-contact').submit(function(e){
			e.preventDefault();
			var $form = $(this),
				$submit = $form.find('[type="submit"]');
			if( $form.valid() ){
				var dataString = $form.serialize();
				$submit.after('<div class="loader"><div></div><div></div><div></div></div>');
				$.ajax({
					type: $form.attr('method'),
					url: $form.attr('action'),
					data: dataString,
					success: function() {
						$submit.parent().after('<div class="message message-success">Your message was sent successfully!</div>');
					},
					error: function() {
						$submit.parent().after('<div class="message message-error">Your message wasn\'t sent, please try again.</div>');
					},
					complete: function() {
						$form.find('.loader').remove();
						$form.find('.message').fadeIn();
						setTimeout(function() {
							$form.find('.message').fadeOut(function() {
								$(this).remove();
							});
						}, 5000);
					}
				});
			}
		});

		/*=============================================>>>>>
		= MEDIA QUERIES =
		===============================================>>>>>*/
		function handleWidthChange(mqlVal) {
			if (mqlVal.matches) {

				$navLinks.off('click');
				$('.btn-section').off('click');

				if ($('.site-content').hasClass('sections')) {

					$navLinks.on('click', function(e) {
						e.preventDefault();
						var target = $(this).attr('href'),
							targetOffset = $(target).offset(),
							offset = $('.site-header').height();
						$('html,body').animate({scrollTop: (targetOffset.top - offset)}, 500);
						$('body').removeClass('site-nav-visible');
					});

				}

			} else {

				if ($('.site-content').hasClass('sections')) {

					checkUrlHash();

					$('.section-heading, .section-content').addClass('animated');

					$('.section-content').on(animationEnd, function(e) {
						if ($(e.target).parent().hasClass('section-out') && $(e.target).hasClass('section-content')) {
							console.log('Section "' + $(e.target).parent().attr('id') + '" out.' );
							$(e.target).parents('.section').removeClass('section-out');
							$(e.target).removeClass(sectionContentAnimationOut).siblings('.section-heading').removeClass(sectionHeadingAnimationOut);
						}
					});

					$('.section-content').on(animationEnd, function(e) {
						if ($(e.target).parent().hasClass('section-in') && $(e.target).hasClass('section-content')) {
							console.log('Section "' + $(e.target).parent().attr('id') + '" in.' );
							isAnimating = false;
						}
					});

					$navLinks.on('click', function(e) {
						e.preventDefault();
						changeSections(e);
					});
					$('.btn-section').on('click', function(e) {
						e.preventDefault();
						changeSections(e);
					});

				}

			}
		}

		if (window.matchMedia) {
			var mql = window.matchMedia('(max-width: 1279px)');
			mql.addListener(handleWidthChange);
			handleWidthChange(mql);
		}

	});

	$(window).load(function() {

		$('.site-loader').delay(1000).fadeOut('slow');

	});

})(jQuery);
