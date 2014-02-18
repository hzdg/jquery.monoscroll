def = (factory) =>
  if typeof define is 'function' && define.amd
    define ['jquery'], (jQuery) ->
      @reactdi = factory jQuery
  else if typeof exports is 'object'
    module.exports = factory require('jquery')
  else
    @reactdi = factory @jQuery

def ($) ->

  # A class that uses the provided element's scrollbar to control the scroll
  # position of other elements. It will set the height on the body element based
  # on the element currently being controlled.
  class ScrollController
    constructor: (opts) ->
      @ignoreScroll = false
      @$el = $ opts?.el ? 'body'
      @$frame = $ opts?.frame ? do =>
        if @$el[0].tagName is 'BODY' then window
        else @$el.parent()

    handleScroll: (event) =>
      scrollTop = @$frame.scrollTop()
      normalizedScrollPos = scrollTop / (@$el.height() - @$frame.height())
      scrollableDistance = @target.el.scrollHeight - @target.$el.height()
      @target.$el.scrollTop normalizedScrollPos * scrollableDistance

    # A context manager. Ignores scroll events dispatched during the scoped
    # callback. Usage:
    #
    #     @ignoreScrolling ->
    #       doSomething()
    ignoreScrolling: (scopedCallback) ->
      orig = @ignoreScroll
      @ignoreScroll = true
      scopedCallback()
      @ignoreScroll = orig

    setTarget: (el, opts) ->
      @releaseTarget()
      $target = $ el
      @target = $el: $target, el: $target[0], info: {}
      if opts?.updateOverflow ? true
        @target.info.oldOverflow = @target.$el.css 'overflow'
        @target.$el.css 'overflow', 'hidden'

      # Set the controller content's height such that
      # `controller.height() / frame.height() = target.height() / targetFrame.height()`
      targetScrollHeight = @target.el.scrollHeight
      targetFrameHeight = @target.$el.height()
      frameHeight = @$frame.height()
      controllerScrollHeight = targetScrollHeight / targetFrameHeight * frameHeight
      @$el.height controllerScrollHeight

      # Update the controller's scroll position to match the target's.
      @ignoreScrolling =>
        scrollableDistance = @target.el.scrollHeight - @target.$el.height()
        normalizedScrollPos = @target.$el.scrollTop() / scrollableDistance
        @$frame.scrollTop normalizedScrollPos * (frameHeight - controllerScrollHeight)

      @$frame.on 'scroll', @handleScroll

      this

    releaseTarget: ->
      return unless @target
      @$frame.off 'scroll', @handleScroll
      @target.$el.css 'overflow', val if val = @target.info.oldOverflow
      @target = null

  # A sentinel value used to represent `undefined` with `$.data`
  UNDEF = {}

  # Get the value stored with the provided key. If it's not set, use the
  # provided factory to get a value and set that. Returns the value.
  setDefault = (el, key, defaultFactory) ->
    value = $.data el, key
    return undefined if value is UNDEF
    return value if value?
    value = if typeof defaultFactory is 'function' then defaultFactory() else defaultFactory
    $.data el, key, (if value is undefined then UNDEF else value)
    value

  monoscroll = (target, opts) ->
    $controller = $ opts?.controller ? 'body'
    controller = setDefault $controller, 'monoscroll.controller', ->
      new ScrollController
        el: $controller
        frame: opts?.frame
    newOpts = $.extend {}, opts
    delete newOpts.controller
    delete newOpts.frame
    controller.setTarget target, newOpts
    null

  $.extend $.fn,
    monoscroll: (options) ->
      if this.length > 1
        $.error "Can't use monoscroll on jQuery collection with more than one element."
      monoscroll this, options
      this

  # This is a jQuery plugin so we don't want to return anything from our module.
  null
