(function() {
  var def,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice;

  def = (function(_this) {
    return function(factory) {
      if (typeof define === 'function' && define.amd) {
        return define(['jquery'], function(jQuery) {
          return this.reactdi = factory(jQuery);
        });
      } else if (typeof exports === 'object') {
        return module.exports = factory(require('jquery'));
      } else {
        return _this.reactdi = factory(_this.jQuery);
      }
    };
  })(this);

  def(function($) {
    var Binding, ScrollController, UNDEF, monoscroll, setDefault;
    ScrollController = (function() {
      function ScrollController(opts) {
        this.handleScroll = __bind(this.handleScroll, this);
        var _ref, _ref1;
        this.ignoreScroll = false;
        this.$el = $((_ref = opts != null ? opts.el : void 0) != null ? _ref : 'body');
        this.$frame = $((_ref1 = opts != null ? opts.frame : void 0) != null ? _ref1 : (function(_this) {
          return function() {
            if (_this.$el[0].tagName === 'BODY') {
              return window;
            } else {
              return _this.$el.parent();
            }
          };
        })(this)());
      }

      ScrollController.prototype.handleScroll = function(event) {
        var normalizedScrollPos, scrollTop, scrollableDistance;
        scrollTop = this.$frame.scrollTop();
        normalizedScrollPos = scrollTop / (this.$el.height() - this.$frame.height());
        scrollableDistance = this.target.el.scrollHeight - this.target.$el.height();
        return this.target.$el.scrollTop(normalizedScrollPos * scrollableDistance);
      };

      ScrollController.prototype.ignoreScrolling = function(scopedCallback) {
        var orig;
        orig = this.ignoreScroll;
        this.ignoreScroll = true;
        scopedCallback();
        return this.ignoreScroll = orig;
      };

      ScrollController.prototype.setTarget = function(el, opts) {
        var $target, controllerScrollHeight, frameHeight, targetFrameHeight, targetScrollHeight, _ref;
        this.releaseTarget();
        $target = $(el);
        this.target = {
          $el: $target,
          el: $target[0],
          info: {}
        };
        if ((_ref = opts != null ? opts.updateOverflow : void 0) != null ? _ref : true) {
          this.target.info.oldOverflow = this.target.$el.css('overflow');
          this.target.$el.css('overflow', 'hidden');
        }
        targetScrollHeight = this.target.el.scrollHeight;
        targetFrameHeight = this.target.$el.height();
        frameHeight = this.$frame.height();
        controllerScrollHeight = targetScrollHeight / targetFrameHeight * frameHeight;
        this.$el.height(controllerScrollHeight);
        this.ignoreScrolling((function(_this) {
          return function() {
            var normalizedScrollPos, scrollableDistance;
            scrollableDistance = _this.target.el.scrollHeight - _this.target.$el.height();
            normalizedScrollPos = _this.target.$el.scrollTop() / scrollableDistance;
            return _this.$frame.scrollTop(normalizedScrollPos * (frameHeight - controllerScrollHeight));
          };
        })(this));
        this.$frame.on('scroll', this.handleScroll);
        return new Binding({
          target: this.target,
          controller: this
        });
      };

      ScrollController.prototype.releaseTarget = function() {
        var val;
        if (!this.target) {
          return;
        }
        this.$frame.off('scroll', this.handleScroll);
        this.$el.css('height', 'auto');
        if (val = this.target.info.oldOverflow) {
          this.target.$el.css('overflow', val);
        }
        return this.target = null;
      };

      return ScrollController;

    })();
    UNDEF = {};
    setDefault = function(el, key, defaultFactory) {
      var value;
      value = $.data(el, key);
      if (value === UNDEF) {
        return void 0;
      }
      if (value != null) {
        return value;
      }
      value = typeof defaultFactory === 'function' ? defaultFactory() : defaultFactory;
      $.data(el, key, (value === void 0 ? UNDEF : value));
      return value;
    };
    Binding = (function() {
      function Binding(opts) {
        this.target = opts.target;
        this.controller = opts.controller;
      }

      Binding.prototype.release = function() {
        var _ref;
        if (((_ref = this.controller.target) != null ? _ref.el : void 0) === this.target.el) {
          return this.controller.releaseTarget();
        }
      };

      return Binding;

    })();
    monoscroll = function(target, opts) {
      var $controller, controller, newOpts, _ref;
      $controller = $((_ref = opts != null ? opts.controller : void 0) != null ? _ref : 'body');
      controller = setDefault($controller, 'monoscroll.controller', function() {
        return new ScrollController({
          el: $controller,
          frame: opts != null ? opts.frame : void 0
        });
      });
      newOpts = $.extend({}, opts);
      delete newOpts.controller;
      delete newOpts.frame;
      return controller.setTarget(target, newOpts);
    };
    return $.extend($.fn, {
      monoscroll: function() {
        var args, method, options, optionsOrMethod, plugin;
        optionsOrMethod = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        if (this.length > 1) {
          $.error("Can't use monoscroll on jQuery collection with more than one element.");
        }
        plugin = this.data('monoscroll.instance');
        if (typeof optionsOrMethod === 'string') {
          method = optionsOrMethod;
        }
        if (!method) {
          options = optionsOrMethod != null ? optionsOrMethod : {};
        }
        if (!plugin) {
          if (method) {
            $.error("You can't call the monoscroll method '" + method + "' without first initializing the plugin by calling monoscroll() on the jQuery object.");
          }
          plugin = monoscroll(this, options);
          this.data('monoscroll.instance', plugin);
        }
        if (method) {
          if (typeof plugin[method] !== 'function') {
            $.error("Method '" + method + "' does not exist on jQuery.monoscroll");
          }
          return plugin[method].apply(plugin, args);
        }
        return plugin;
      }
    });
  });

}).call(this);
