/*!
 * Bootstrap carousel.js v5.0.0-alpha2 (https://getbootstrap.com/)
 * Copyright 2011-2020 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? module.exports = factory(
      require('./dom/data.js'),
      require('./dom/event-handler.js'),
      require('./dom/manipulator.js'),
      require('./dom/selector-engine.js')
    )
    : typeof define === 'function' && define.amd
      ? define([
        './dom/data.js',
        './dom/event-handler.js',
        './dom/manipulator.js',
        './dom/selector-engine.js',
      ], factory)
      : (global = typeof globalThis !== 'undefined' ? globalThis : global || self,
      global.Carousel = factory(
        global.Data,
        global.EventHandler,
        global.Manipulator,
        global.SelectorEngine
      ));
}(this, (Data, EventHandler, Manipulator, SelectorEngine) => {

  function _interopDefaultLegacy(e) {
    return e && typeof e === 'object' && 'default' in e ? e : { default: e };
  }

  const Data__default = /* #__PURE__ */ _interopDefaultLegacy(Data);
  const EventHandler__default = /* #__PURE__ */ _interopDefaultLegacy(EventHandler);
  const Manipulator__default = /* #__PURE__ */ _interopDefaultLegacy(Manipulator);
  const SelectorEngine__default = /* #__PURE__ */ _interopDefaultLegacy(SelectorEngine);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.0-alpha2): util/index.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  const MILLISECONDS_MULTIPLIER = 1000;
  const TRANSITION_END = 'transitionend'; // Shoutout AngusCroll (https://goo.gl/pxwQGp)

  const toType = function toType(obj) {
    if (obj === null || obj === undefined) {
      return String(obj);
    }

    return {}.toString
      .call(obj)
      .match(/\s([a-z]+)/i)[1]
      .toLowerCase();
  };

  const getSelector = function getSelector(element) {
    let selector = element.getAttribute('data-target');

    if (!selector || selector === '#') {
      const hrefAttr = element.getAttribute('href');
      selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : null;
    }

    return selector;
  };

  const getElementFromSelector = function getElementFromSelector(element) {
    const selector = getSelector(element);
    return selector ? document.querySelector(selector) : null;
  };

  const getTransitionDurationFromElement = function getTransitionDurationFromElement(element) {
    if (!element) {
      return 0;
    } // Get transition-duration of the element

    const _window$getComputedSt = window.getComputedStyle(element);
    let transitionDuration = _window$getComputedSt.transitionDuration;
    let transitionDelay = _window$getComputedSt.transitionDelay;

    const floatTransitionDuration = parseFloat(transitionDuration);
    const floatTransitionDelay = parseFloat(transitionDelay); // Return 0 if element or transition duration is not found

    if (!floatTransitionDuration && !floatTransitionDelay) {
      return 0;
    } // If multiple durations are defined, take the first

    transitionDuration = transitionDuration.split(',')[0];
    transitionDelay = transitionDelay.split(',')[0];
    return (parseFloat(transitionDuration) + parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
  };

  const triggerTransitionEnd = function triggerTransitionEnd(element) {
    element.dispatchEvent(new Event(TRANSITION_END));
  };

  const isElement = function isElement(obj) {
    return (obj[0] || obj).nodeType;
  };

  const emulateTransitionEnd = function emulateTransitionEnd(element, duration) {
    let called = false;
    const durationPadding = 5;
    const emulatedDuration = duration + durationPadding;

    function listener() {
      called = true;
      element.removeEventListener(TRANSITION_END, listener);
    }

    element.addEventListener(TRANSITION_END, listener);
    setTimeout(() => {
      if (!called) {
        triggerTransitionEnd(element);
      }
    }, emulatedDuration);
  };

  const typeCheckConfig = function typeCheckConfig(componentName, config, configTypes) {
    Object.keys(configTypes).forEach((property) => {
      const expectedTypes = configTypes[property];
      const value = config[property];
      const valueType = value && isElement(value) ? 'element' : toType(value);

      if (!new RegExp(expectedTypes).test(valueType)) {
        throw new Error(
          `${componentName.toUpperCase()
          }: ` +
            `Option "${property}" provided type "${valueType}" ` +
            `but expected type "${expectedTypes}".`
        );
      }
    });
  };

  const isVisible = function isVisible(element) {
    if (!element) {
      return false;
    }

    if (element.style && element.parentNode && element.parentNode.style) {
      const elementStyle = getComputedStyle(element);
      const parentNodeStyle = getComputedStyle(element.parentNode);
      return (
        elementStyle.display !== 'none' &&
        parentNodeStyle.display !== 'none' &&
        elementStyle.visibility !== 'hidden'
      );
    }

    return false;
  };

  const reflow = function reflow(element) {
    return element.offsetHeight;
  };

  const getjQuery = function getjQuery() {
    const _window = window;
    const jQuery = _window.jQuery;

    if (jQuery && !document.body.hasAttribute('data-no-jquery')) {
      return jQuery;
    }

    return null;
  };

  function _extends() {
    _extends =
      Object.assign ||
      function (target) {
        for (let i = 1; i < arguments.length; i++) {
          const source = arguments[i];
          for (const key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }
        return target;
      };
    return _extends.apply(this, arguments);
  }

  function _defineProperties(target, props) {
    for (let i = 0; i < props.length; i++) {
      const descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ('value' in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'carousel';
  const VERSION = '5.0.0-alpha2';
  const DATA_KEY = 'bs.carousel';
  const EVENT_KEY = `.${DATA_KEY}`;
  const DATA_API_KEY = '.data-api';
  const ARROW_LEFT_KEY = 'ArrowLeft';
  const ARROW_RIGHT_KEY = 'ArrowRight';
  const TOUCHEVENT_COMPAT_WAIT = 500; // Time for mouse compat events to fire after touch

  const SWIPE_THRESHOLD = 40;
  const Default = {
    interval: 5000,
    keyboard: true,
    slide: false,
    pause: 'hover',
    wrap: true,
    touch: true,
  };
  const DefaultType = {
    interval: '(number|boolean)',
    keyboard: 'boolean',
    slide: '(boolean|string)',
    pause: '(string|boolean)',
    wrap: 'boolean',
    touch: 'boolean',
  };
  const DIRECTION_NEXT = 'next';
  const DIRECTION_PREV = 'prev';
  const DIRECTION_LEFT = 'left';
  const DIRECTION_RIGHT = 'right';
  const EVENT_SLIDE = `slide${EVENT_KEY}`;
  const EVENT_SLID = `slid${EVENT_KEY}`;
  const EVENT_KEYDOWN = `keydown${EVENT_KEY}`;
  const EVENT_MOUSEENTER = `mouseenter${EVENT_KEY}`;
  const EVENT_MOUSELEAVE = `mouseleave${EVENT_KEY}`;
  const EVENT_TOUCHSTART = `touchstart${EVENT_KEY}`;
  const EVENT_TOUCHMOVE = `touchmove${EVENT_KEY}`;
  const EVENT_TOUCHEND = `touchend${EVENT_KEY}`;
  const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY}`;
  const EVENT_POINTERUP = `pointerup${EVENT_KEY}`;
  const EVENT_DRAG_START = `dragstart${EVENT_KEY}`;
  const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`;
  const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
  const CLASS_NAME_CAROUSEL = 'carousel';
  const CLASS_NAME_ACTIVE = 'active';
  const CLASS_NAME_SLIDE = 'slide';
  const CLASS_NAME_RIGHT = 'carousel-item-right';
  const CLASS_NAME_LEFT = 'carousel-item-left';
  const CLASS_NAME_NEXT = 'carousel-item-next';
  const CLASS_NAME_PREV = 'carousel-item-prev';
  const CLASS_NAME_POINTER_EVENT = 'pointer-event';
  const SELECTOR_ACTIVE = '.active';
  const SELECTOR_ACTIVE_ITEM = '.active.carousel-item';
  const SELECTOR_ITEM = '.carousel-item';
  const SELECTOR_ITEM_IMG = '.carousel-item img';
  const SELECTOR_NEXT_PREV = '.carousel-item-next, .carousel-item-prev';
  const SELECTOR_INDICATORS = '.carousel-indicators';
  const SELECTOR_DATA_SLIDE = '[data-slide], [data-slide-to]';
  const SELECTOR_DATA_RIDE = '[data-ride="carousel"]';
  const PointerType = {
    TOUCH: 'touch',
    PEN: 'pen',
  };
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  const Carousel = /* #__PURE__ */ (function () {
    function Carousel(element, config) {
      this._items = null;
      this._interval = null;
      this._activeElement = null;
      this._isPaused = false;
      this._isSliding = false;
      this.touchTimeout = null;
      this.touchStartX = 0;
      this.touchDeltaX = 0;
      this._config = this._getConfig(config);
      this._element = element;
      this._indicatorsElement = SelectorEngine__default.default.findOne(
        SELECTOR_INDICATORS,
        this._element
      );
      this._touchSupported =
        'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0;
      this._pointerEvent = Boolean(window.PointerEvent);

      this._addEventListeners();

      Data__default.default.setData(element, DATA_KEY, this);
    } // Getters

    const _proto = Carousel.prototype;

    // Public
    _proto.next = function next() {
      if (!this._isSliding) {
        this._slide(DIRECTION_NEXT);
      }
    };

    _proto.nextWhenVisible = function nextWhenVisible() {
      // Don't call next when the page isn't visible
      // or the carousel or its parent isn't visible
      if (!document.hidden && isVisible(this._element)) {
        this.next();
      }
    };

    _proto.prev = function prev() {
      if (!this._isSliding) {
        this._slide(DIRECTION_PREV);
      }
    };

    _proto.pause = function pause(event) {
      if (!event) {
        this._isPaused = true;
      }

      if (SelectorEngine__default.default.findOne(SELECTOR_NEXT_PREV, this._element)) {
        triggerTransitionEnd(this._element);
        this.cycle(true);
      }

      clearInterval(this._interval);
      this._interval = null;
    };

    _proto.cycle = function cycle(event) {
      if (!event) {
        this._isPaused = false;
      }

      if (this._interval) {
        clearInterval(this._interval);
        this._interval = null;
      }

      if (this._config && this._config.interval && !this._isPaused) {
        this._interval = setInterval(
          (document.visibilityState ? this.nextWhenVisible : this.next).bind(this),
          this._config.interval
        );
      }
    };

    _proto.to = function to(index) {
      const _this = this;

      this._activeElement = SelectorEngine__default.default.findOne(
        SELECTOR_ACTIVE_ITEM,
        this._element
      );

      const activeIndex = this._getItemIndex(this._activeElement);

      if (index > this._items.length - 1 || index < 0) {
        return;
      }

      if (this._isSliding) {
        EventHandler__default.default.one(this._element, EVENT_SLID, () => {
          return _this.to(index);
        });
        return;
      }

      if (activeIndex === index) {
        this.pause();
        this.cycle();
        return;
      }

      const direction = index > activeIndex ? DIRECTION_NEXT : DIRECTION_PREV;

      this._slide(direction, this._items[index]);
    };

    _proto.dispose = function dispose() {
      EventHandler__default.default.off(this._element, EVENT_KEY);
      Data__default.default.removeData(this._element, DATA_KEY);
      this._items = null;
      this._config = null;
      this._element = null;
      this._interval = null;
      this._isPaused = null;
      this._isSliding = null;
      this._activeElement = null;
      this._indicatorsElement = null;
    }; // Private

    _proto._getConfig = function _getConfig(config) {
      config = { ...Default, ...config };
      typeCheckConfig(NAME, config, DefaultType);
      return config;
    };

    _proto._handleSwipe = function _handleSwipe() {
      const absDeltax = Math.abs(this.touchDeltaX);

      if (absDeltax <= SWIPE_THRESHOLD) {
        return;
      }

      const direction = absDeltax / this.touchDeltaX;
      this.touchDeltaX = 0; // swipe left

      if (direction > 0) {
        this.prev();
      } // swipe right

      if (direction < 0) {
        this.next();
      }
    };

    _proto._addEventListeners = function _addEventListeners() {
      const _this2 = this;

      if (this._config.keyboard) {
        EventHandler__default.default.on(this._element, EVENT_KEYDOWN, (event) => {
          return _this2._keydown(event);
        });
      }

      if (this._config.pause === 'hover') {
        EventHandler__default.default.on(this._element, EVENT_MOUSEENTER, (event) => {
          return _this2.pause(event);
        });
        EventHandler__default.default.on(this._element, EVENT_MOUSELEAVE, (event) => {
          return _this2.cycle(event);
        });
      }

      if (this._config.touch && this._touchSupported) {
        this._addTouchEventListeners();
      }
    };

    _proto._addTouchEventListeners = function _addTouchEventListeners() {
      const _this3 = this;

      const start = function start(event) {
        if (_this3._pointerEvent && PointerType[event.pointerType.toUpperCase()]) {
          _this3.touchStartX = event.clientX;
        } else if (!_this3._pointerEvent) {
          _this3.touchStartX = event.touches[0].clientX;
        }
      };

      const move = function move(event) {
        // ensure swiping with one touch and not pinching
        if (event.touches && event.touches.length > 1) {
          _this3.touchDeltaX = 0;
        } else {
          _this3.touchDeltaX = event.touches[0].clientX - _this3.touchStartX;
        }
      };

      const end = function end(event) {
        if (_this3._pointerEvent && PointerType[event.pointerType.toUpperCase()]) {
          _this3.touchDeltaX = event.clientX - _this3.touchStartX;
        }

        _this3._handleSwipe();

        if (_this3._config.pause === 'hover') {
          // If it's a touch-enabled device, mouseenter/leave are fired as
          // part of the mouse compatibility events on first tap - the carousel
          // would stop cycling until user tapped out of it;
          // here, we listen for touchend, explicitly pause the carousel
          // (as if it's the second time we tap on it, mouseenter compat event
          // is NOT fired) and after a timeout (to allow for mouse compatibility
          // events to fire) we explicitly restart cycling
          _this3.pause();

          if (_this3.touchTimeout) {
            clearTimeout(_this3.touchTimeout);
          }

          _this3.touchTimeout = setTimeout((event) => {
            return _this3.cycle(event);
          }, TOUCHEVENT_COMPAT_WAIT + _this3._config.interval);
        }
      };

      SelectorEngine__default.default
        .find(SELECTOR_ITEM_IMG, this._element)
        .forEach((itemImg) => {
          EventHandler__default.default.on(itemImg, EVENT_DRAG_START, (e) => {
            return e.preventDefault();
          });
        });

      if (this._pointerEvent) {
        EventHandler__default.default.on(this._element, EVENT_POINTERDOWN, (event) => {
          return start(event);
        });
        EventHandler__default.default.on(this._element, EVENT_POINTERUP, (event) => {
          return end(event);
        });

        this._element.classList.add(CLASS_NAME_POINTER_EVENT);
      } else {
        EventHandler__default.default.on(this._element, EVENT_TOUCHSTART, (event) => {
          return start(event);
        });
        EventHandler__default.default.on(this._element, EVENT_TOUCHMOVE, (event) => {
          return move(event);
        });
        EventHandler__default.default.on(this._element, EVENT_TOUCHEND, (event) => {
          return end(event);
        });
      }
    };

    _proto._keydown = function _keydown(event) {
      if (/input|textarea/i.test(event.target.tagName)) {
        return;
      }

      switch (event.key) {
        case ARROW_LEFT_KEY:
          event.preventDefault();
          this.prev();
          break;

        case ARROW_RIGHT_KEY:
          event.preventDefault();
          this.next();
          break;
      }
    };

    _proto._getItemIndex = function _getItemIndex(element) {
      this._items =
        element && element.parentNode
          ? SelectorEngine__default.default.find(SELECTOR_ITEM, element.parentNode)
          : [];
      return this._items.indexOf(element);
    };

    _proto._getItemByDirection = function _getItemByDirection(direction, activeElement) {
      const isNextDirection = direction === DIRECTION_NEXT;
      const isPrevDirection = direction === DIRECTION_PREV;

      const activeIndex = this._getItemIndex(activeElement);

      const lastItemIndex = this._items.length - 1;
      const isGoingToWrap =
        (isPrevDirection && activeIndex === 0) ||
        (isNextDirection && activeIndex === lastItemIndex);

      if (isGoingToWrap && !this._config.wrap) {
        return activeElement;
      }

      const delta = direction === DIRECTION_PREV ? -1 : 1;
      const itemIndex = (activeIndex + delta) % this._items.length;
      return itemIndex === -1 ? this._items[this._items.length - 1] : this._items[itemIndex];
    };

    _proto._triggerSlideEvent = function _triggerSlideEvent(relatedTarget, eventDirectionName) {
      const targetIndex = this._getItemIndex(relatedTarget);

      const fromIndex = this._getItemIndex(
        SelectorEngine__default.default.findOne(SELECTOR_ACTIVE_ITEM, this._element)
      );

      return EventHandler__default.default.trigger(this._element, EVENT_SLIDE, {
        relatedTarget,
        direction: eventDirectionName,
        from: fromIndex,
        to: targetIndex,
      });
    };

    _proto._setActiveIndicatorElement = function _setActiveIndicatorElement(element) {
      if (this._indicatorsElement) {
        const indicators = SelectorEngine__default.default.find(
          SELECTOR_ACTIVE,
          this._indicatorsElement
        );

        for (let i = 0; i < indicators.length; i++) {
          indicators[i].classList.remove(CLASS_NAME_ACTIVE);
        }

        const nextIndicator = this._indicatorsElement.children[this._getItemIndex(element)];

        if (nextIndicator) {
          nextIndicator.classList.add(CLASS_NAME_ACTIVE);
        }
      }
    };

    _proto._slide = function _slide(direction, element) {
      const _this4 = this;

      const activeElement = SelectorEngine__default.default.findOne(
        SELECTOR_ACTIVE_ITEM,
        this._element
      );

      const activeElementIndex = this._getItemIndex(activeElement);

      const nextElement =
        element || (activeElement && this._getItemByDirection(direction, activeElement));

      const nextElementIndex = this._getItemIndex(nextElement);

      const isCycling = Boolean(this._interval);
      let directionalClassName;
      let orderClassName;
      let eventDirectionName;

      if (direction === DIRECTION_NEXT) {
        directionalClassName = CLASS_NAME_LEFT;
        orderClassName = CLASS_NAME_NEXT;
        eventDirectionName = DIRECTION_LEFT;
      } else {
        directionalClassName = CLASS_NAME_RIGHT;
        orderClassName = CLASS_NAME_PREV;
        eventDirectionName = DIRECTION_RIGHT;
      }

      if (nextElement && nextElement.classList.contains(CLASS_NAME_ACTIVE)) {
        this._isSliding = false;
        return;
      }

      const slideEvent = this._triggerSlideEvent(nextElement, eventDirectionName);

      if (slideEvent.defaultPrevented) {
        return;
      }

      if (!activeElement || !nextElement) {
        // Some weirdness is happening, so we bail
        return;
      }

      this._isSliding = true;

      if (isCycling) {
        this.pause();
      }

      this._setActiveIndicatorElement(nextElement);

      if (this._element.classList.contains(CLASS_NAME_SLIDE)) {
        nextElement.classList.add(orderClassName);
        reflow(nextElement);
        activeElement.classList.add(directionalClassName);
        nextElement.classList.add(directionalClassName);
        const nextElementInterval = parseInt(nextElement.getAttribute('data-interval'), 10);

        if (nextElementInterval) {
          this._config.defaultInterval = this._config.defaultInterval || this._config.interval;
          this._config.interval = nextElementInterval;
        } else {
          this._config.interval = this._config.defaultInterval || this._config.interval;
        }

        const transitionDuration = getTransitionDurationFromElement(activeElement);
        EventHandler__default.default.one(activeElement, TRANSITION_END, () => {
          nextElement.classList.remove(directionalClassName, orderClassName);
          nextElement.classList.add(CLASS_NAME_ACTIVE);
          activeElement.classList.remove(CLASS_NAME_ACTIVE, orderClassName, directionalClassName);
          _this4._isSliding = false;
          setTimeout(() => {
            EventHandler__default.default.trigger(_this4._element, EVENT_SLID, {
              relatedTarget: nextElement,
              direction: eventDirectionName,
              from: activeElementIndex,
              to: nextElementIndex,
            });
          }, 0);
        });
        emulateTransitionEnd(activeElement, transitionDuration);
      } else {
        activeElement.classList.remove(CLASS_NAME_ACTIVE);
        nextElement.classList.add(CLASS_NAME_ACTIVE);
        this._isSliding = false;
        EventHandler__default.default.trigger(this._element, EVENT_SLID, {
          relatedTarget: nextElement,
          direction: eventDirectionName,
          from: activeElementIndex,
          to: nextElementIndex,
        });
      }

      if (isCycling) {
        this.cycle();
      }
    }; // Static

    Carousel.carouselInterface = function carouselInterface(element, config) {
      let data = Data__default.default.getData(element, DATA_KEY);

      let _config = {

        ...Default,
        ...Manipulator__default.default.getDataAttributes(element)
      };

      if (typeof config === 'object') {
        _config = { ..._config, ...config };
      }

      const action = typeof config === 'string' ? config : _config.slide;

      if (!data) {
        data = new Carousel(element, _config);
      }

      if (typeof config === 'number') {
        data.to(config);
      } else if (typeof action === 'string') {
        if (typeof data[action] === 'undefined') {
          throw new TypeError(`No method named "${action}"`);
        }

        data[action]();
      } else if (_config.interval && _config.ride) {
        data.pause();
        data.cycle();
      }
    };

    Carousel.jQueryInterface = function jQueryInterface(config) {
      return this.each(function () {
        Carousel.carouselInterface(this, config);
      });
    };

    Carousel.dataApiClickHandler = function dataApiClickHandler(event) {
      const target = getElementFromSelector(this);

      if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) {
        return;
      }

      const config = {

        ...Manipulator__default.default.getDataAttributes(target),
        ...Manipulator__default.default.getDataAttributes(this)
      };

      const slideIndex = this.getAttribute('data-slide-to');

      if (slideIndex) {
        config.interval = false;
      }

      Carousel.carouselInterface(target, config);

      if (slideIndex) {
        Data__default.default.getData(target, DATA_KEY).to(slideIndex);
      }

      event.preventDefault();
    };

    Carousel.getInstance = function getInstance(element) {
      return Data__default.default.getData(element, DATA_KEY);
    };

    _createClass(Carousel, null, [
      {
        key: 'VERSION',
        get: function get() {
          return VERSION;
        },
      },
      {
        key: 'Default',
        get: function get() {
          return Default;
        },
      },
    ]);

    return Carousel;
  }());
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  EventHandler__default.default.on(
    document,
    EVENT_CLICK_DATA_API,
    SELECTOR_DATA_SLIDE,
    Carousel.dataApiClickHandler
  );
  EventHandler__default.default.on(window, EVENT_LOAD_DATA_API, () => {
    const carousels = SelectorEngine__default.default.find(SELECTOR_DATA_RIDE);

    for (let i = 0, len = carousels.length; i < len; i++) {
      Carousel.carouselInterface(
        carousels[i],
        Data__default.default.getData(carousels[i], DATA_KEY)
      );
    }
  });
  const $ = getjQuery();
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .carousel to jQuery only if jQuery is present
   */

  /* istanbul ignore if */

  if ($) {
    const JQUERY_NO_CONFLICT = $.fn[NAME];
    $.fn[NAME] = Carousel.jQueryInterface;
    $.fn[NAME].Constructor = Carousel;

    $.fn[NAME].noConflict = function () {
      $.fn[NAME] = JQUERY_NO_CONFLICT;
      return Carousel.jQueryInterface;
    };
  }

  return Carousel;
}));
// # sourceMappingURL=carousel.js.map
