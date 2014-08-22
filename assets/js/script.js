// Generated by CoffeeScript 1.7.1

/*
--------------------------------------------
     Begin script.coffee
--------------------------------------------
 */

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $(function() {
    return window.pubSub = $({});
  });


  /*
  --------------------------------------------
       Begin _codeship.coffee
  --------------------------------------------
   */

  $(function() {
    window.Codeship = (function() {
      function Codeship() {}

      return Codeship;

    })();
    return Codeship.Util = (function() {
      function Util() {}

      Util.generateId = function() {
        var s4;
        s4 = function() {
          return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        };
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
      };

      return Util;

    })();
  });


  /*
  --------------------------------------------
       Begin _ui.coffee
  --------------------------------------------
   */

  $(function() {
    return Codeship.Ui = (function() {
      function Ui() {}

      return Ui;

    })();
  });


  /*
  --------------------------------------------
       Begin _ui.preperator.coffee
  --------------------------------------------
   */

  $(function() {
    Codeship.Ui.Preperator = (function() {
      function Preperator() {
        this.setHeightForBloxs = __bind(this.setHeightForBloxs, this);
        this.bloxs = $('[data-ui-component="blox"]');
        this.setHeightForBloxs();
      }

      Preperator.prototype.setHeightForBloxs = function() {
        var self, targetHeight;
        self = this;
        targetHeight = 0;
        self.bloxs.each(function() {
          var targetHeightFactor;
          targetHeightFactor = $(this).data('ui-blox-height');
          targetHeight = $('.pageHeader .contentWrapper').outerWidth() / targetHeightFactor;
          targetHeight -= Number.parseInt($('.blox').first().css('border-top-width'));
          return $('.blox', this).css('height', targetHeight + "px");
        });
        return $(window).on('resize', function() {
          return self.setHeightForBloxs();
        });
      };

      return Preperator;

    })();
    return new Codeship.Ui.Preperator;
  });


  /*
  --------------------------------------------
       Begin _ui.scroll.coffee
  --------------------------------------------
   */

  $(function() {
    Codeship.Ui.Scroll = (function() {
      function Scroll() {
        this.setHeaderEffect = __bind(this.setHeaderEffect, this);
        this.watchResizeEvent = __bind(this.watchResizeEvent, this);
        this.scrollTop = window.pageYOffset;
        this.viewportHeight = $(window).height();
        this.setScrollEventHandler();
        this.watchResizeEvent();
        this.setScrollToEvents();
        if (!Modernizr.touch) {
          this.setParallaxEffect();
          this.setHeaderEffect();
        }
      }

      Scroll.prototype.setScrollEventHandler = function() {
        if (Modernizr.touch) {
          return this.scrollEvent = "touchmove";
        } else {
          return this.scrollEvent = "scroll";
        }
      };

      Scroll.prototype.watchResizeEvent = function() {
        var self;
        self = this;
        return $(window).resize(function() {
          return self.viewportHeight = $(window).height();
        });
      };

      Scroll.prototype.setHeaderEffect = function() {
        var direction, offset, self, tippingPoint;
        self = this;
        self.header = $('.pageHeader');
        self.headerHeight = self.header.outerHeight();
        tippingPoint = 0;
        offset = 0;
        direction = 'down';
        return $(window).on(self.scrollEvent, function() {
          var newDirection, newOffset, st;
          st = window.pageYOffset;
          if (st > self.viewportHeight / 4) {
            if (st > self.scrollTop) {
              newDirection = 'down';
            } else {
              newDirection = 'up';
            }
            if (newDirection !== direction) {
              direction = newDirection;
              if (newDirection === 'down') {
                tippingPoint = st + offset;
              }
              if (newDirection === 'up') {
                tippingPoint = st;
              }
            }
            if (direction === 'up') {
              newOffset = (self.headerHeight * -1) + (tippingPoint - st);
              if (newOffset > 0) {
                newOffset = 0;
              }
            }
            if (direction === 'down') {
              newOffset = (tippingPoint - st) / 4;
              if (newOffset < (self.headerHeight * -1)) {
                newOffset = self.headerHeight * -1;
              }
            }
            if (st <= self.viewportHeight / 4) {
              newOffset = 0;
            }
            offset = newOffset;
            self.header.css({
              transform: "translateY(" + newOffset + "px)"
            });
          }
          return self.scrollTop = st;
        });
      };

      Scroll.prototype.setParallaxEffect = function() {
        return $(window).on(this.scrollEvent, function() {
          var scroll, slowScroll;
          scroll = window.pageYOffset;
          slowScroll = scroll / 2;
          return $('.parallax').css({
            transform: "translateY(" + slowScroll * -1 + "px)"
          });
        });
      };

      Scroll.prototype.setScrollToEvents = function() {
        return $('[data-ui-component="scrollTo"]').on('click', function(e) {
          var target;
          target = $(this).attr('href');
          return $(target).velocity('scroll', {
            duration: 500,
            easing: "easeInSine"
          });
        });
      };

      return Scroll;

    })();
    return new Codeship.Ui.Scroll;
  });


  /*
  --------------------------------------------
       Begin _ui.slider.coffee
  --------------------------------------------
   */

  $(function() {
    Codeship.Ui.Slider = (function() {
      function Slider() {
        this.sliders = $('[data-ui-component="slider"]');
        this.length = this.sliders.length;
        this.init();
      }

      Slider.prototype.init = function() {
        return this.sliders.each(function(index, element) {
          return new Codeship.Ui.Slider.Renderer(element);
        });
      };

      return Slider;

    })();
    Codeship.Ui.Slider.Renderer = (function() {
      function Renderer(slider) {
        this.slider = slider;
        this.bindEventHandlers = __bind(this.bindEventHandlers, this);
        this.jumpToSlide = __bind(this.jumpToSlide, this);
        this.getPreviousSlide = __bind(this.getPreviousSlide, this);
        this.getNextSlide = __bind(this.getNextSlide, this);
        this.slider = $(this.slider);
        this.slides = this.slider.find('[data-ui-slide]');
        this.bindEventHandlers();
        this.autoMoveSlides();
      }

      Renderer.prototype.prepareSlides = function() {
        var slidesArray;
        slidesArray = [];
        this.slides.each(function(index) {
          slidesArray.push($(this).data('ui-slide'));
          if (index === 0) {
            return $(this).addClass('is-active');
          } else {
            return $(this).hide();
          }
        });
        this.markActiveSlide(slidesArray[0]);
        this.slidesArray = slidesArray;
        return this.slider.css({
          minHeight: this.slider.outerHeight()
        });
      };

      Renderer.prototype.getNextSlide = function() {
        var currentIndex, currentKey, currentSlide, nextSlide, self;
        self = this;
        currentSlide = this.slider.find('ul').find('.is-active');
        currentKey = $(currentSlide).data('ui-slide');
        currentIndex = this.slidesArray.indexOf(currentKey);
        if (currentIndex + 1 === this.slidesArray.length) {
          nextSlide = this.slidesArray[0];
        } else {
          nextSlide = this.slidesArray[currentIndex + 1];
        }
        return $(currentSlide).velocity('stop').velocity("transition.slideLeftBigOut", 300, function() {
          self.markActiveSlide(nextSlide);
          $(currentSlide).removeClass('is-active');
          return $('[data-ui-slide="' + nextSlide + '"]').addClass('is-active').velocity("transition.slideRightBigIn", 300);
        });
      };

      Renderer.prototype.getPreviousSlide = function() {
        var currentIndex, currentKey, currentSlide, nextSlide, self;
        self = this;
        currentSlide = this.slider.find('ul').find('.is-active');
        currentKey = $(currentSlide).data('ui-slide');
        currentIndex = this.slidesArray.indexOf(currentKey);
        if (currentIndex === 0) {
          nextSlide = this.slidesArray[this.slidesArray.length - 1];
        } else {
          nextSlide = this.slidesArray[currentIndex - 1];
        }
        return $(currentSlide).velocity('stop').velocity("transition.slideRightBigOut", 300, function() {
          self.markActiveSlide(nextSlide);
          $(currentSlide).removeClass('is-active');
          return $('[data-ui-slide="' + nextSlide + '"]').addClass('is-active').velocity("transition.slideLeftBigIn", 300);
        });
      };

      Renderer.prototype.jumpToSlide = function(slide) {
        var currentSlide, self;
        self = this;
        currentSlide = this.slider.find('ul').find('.is-active');
        return $(currentSlide).velocity('stop').velocity("transition.shrinkOut", 300, function() {
          self.markActiveSlide(slide);
          $(currentSlide).removeClass('is-active');
          $('[data-ui-slide="' + slide + '"]').addClass('is-active').velocity("transition.expandIn", 300);
          return self.autoMoveSlides();
        });
      };

      Renderer.prototype.autoMoveSlides = function() {
        var timeout;
        if (this.sliderInterval) {
          window.clearInterval(this.sliderInterval);
        }
        timeout = this.slider.data('ui-slider-auto');
        if (typeof timeout === 'number') {
          return this.sliderInterval = window.setInterval(this.getNextSlide, timeout);
        }
      };

      Renderer.prototype.markActiveSlide = function(slide) {
        $('[data-ui-slider-set].is-active').removeClass('is-active');
        return $('[data-ui-slider-set="' + slide + '"]').addClass('is-active');
      };

      Renderer.prototype.bindEventHandlers = function() {
        var next, prev, self;
        self = this;
        this.prepareSlides();
        next = this.slider.find('.is-sliderNext');
        prev = this.slider.find('.is-sliderPrev');
        if (this.slides.length > 1) {
          $(next).on('click', function(e) {
            return self.getNextSlide();
          });
          $(prev).on('click', function(e) {
            return self.getPreviousSlide();
          });
          $('[data-ui-slider-set]').on('click', function(e) {
            e.preventDefault();
            return self.jumpToSlide($(this).data('ui-slider-set'));
          });
          return;
        } else {
          $(next).remove();
          $(prev).hide();
          return;
        }
      };

      return Renderer;

    })();
    return new Codeship.Ui.Slider;
  });


  /*
  --------------------------------------------
       Begin _ui.watcher.coffee
  --------------------------------------------
   */

  $(function() {
    Codeship.Ui.Watcher = (function() {
      function Watcher() {
        this.init = __bind(this.init, this);
        this.init();
      }

      Watcher.prototype.init = function() {
        if ($('[data-watch="input"]').length > 0) {
          return this._watchInputs($('[data-watch="input"]'));
        }
      };

      Watcher.prototype._watchInputs = function($elems) {
        $elems.each(function() {
          if ($(this).find('input').val() !== '') {
            return $(this).addClass('has-content');
          }
        });
        $('input', '[data-watch="input"]').on('focus', function() {
          return $(this).parent().addClass('has-focus');
        });
        return $('input', '[data-watch="input"]').on('blur', function() {
          if ($(this).val().trim() !== '') {
            $(this).parent().addClass('has-content');
          } else {
            $(this).parent().removeClass('has-content');
          }
          return $(this).parent().removeClass('has-focus');
        });
      };

      return Watcher;

    })();
    return new Codeship.Ui.Watcher;
  });

}).call(this);