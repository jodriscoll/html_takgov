/*!
 * Bootstrap alert.js v5.0.0-alpha2 (https://getbootstrap.com/)
 * Copyright 2011-2020 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? module.exports = factory(require('./dom/data.js'), require('./dom/event-handler.js'))
    : typeof define === 'function' && define.amd
      ? define(['./dom/data.js', './dom/event-handler.js'], factory)
      : (global = typeof globalThis !== 'undefined' ? globalThis : global || self,
      global.Alert = factory(global.Data, global.EventHandler));
}(this, (Data, EventHandler) => {

  function _interopDefaultLegacy(e) {
    return e && typeof e === 'object' && 'default' in e ? e : { default: e };
  }

  const Data__default = /* #__PURE__ */ _interopDefaultLegacy(Data);
  const EventHandler__default = /* #__PURE__ */ _interopDefaultLegacy(EventHandler);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.0-alpha2): util/index.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  const MILLISECONDS_MULTIPLIER = 1000;
  const TRANSITION_END = 'transitionend'; // Shoutout AngusCroll (https://goo.gl/pxwQGp)

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

  const getjQuery = function getjQuery() {
    const _window = window;
    const jQuery = _window.jQuery;

    if (jQuery && !document.body.hasAttribute('data-no-jquery')) {
      return jQuery;
    }

    return null;
  };

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

  const NAME = 'alert';
  const VERSION = '5.0.0-alpha2';
  const DATA_KEY = 'bs.alert';
  const EVENT_KEY = `.${DATA_KEY}`;
  const DATA_API_KEY = '.data-api';
  const SELECTOR_DISMISS = '[data-dismiss="alert"]';
  const EVENT_CLOSE = `close${EVENT_KEY}`;
  const EVENT_CLOSED = `closed${EVENT_KEY}`;
  const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
  const CLASSNAME_ALERT = 'alert';
  const CLASSNAME_FADE = 'fade';
  const CLASSNAME_SHOW = 'show';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  const Alert = /* #__PURE__ */ (function () {
    function Alert(element) {
      this._element = element;

      if (this._element) {
        Data__default.default.setData(element, DATA_KEY, this);
      }
    } // Getters

    const _proto = Alert.prototype;

    // Public
    _proto.close = function close(element) {
      const rootElement = element ? this._getRootElement(element) : this._element;

      const customEvent = this._triggerCloseEvent(rootElement);

      if (customEvent === null || customEvent.defaultPrevented) {
        return;
      }

      this._removeElement(rootElement);
    };

    _proto.dispose = function dispose() {
      Data__default.default.removeData(this._element, DATA_KEY);
      this._element = null;
    }; // Private

    _proto._getRootElement = function _getRootElement(element) {
      return getElementFromSelector(element) || element.closest(`.${CLASSNAME_ALERT}`);
    };

    _proto._triggerCloseEvent = function _triggerCloseEvent(element) {
      return EventHandler__default.default.trigger(element, EVENT_CLOSE);
    };

    _proto._removeElement = function _removeElement(element) {
      const _this = this;

      element.classList.remove(CLASSNAME_SHOW);

      if (!element.classList.contains(CLASSNAME_FADE)) {
        this._destroyElement(element);

        return;
      }

      const transitionDuration = getTransitionDurationFromElement(element);
      EventHandler__default.default.one(element, TRANSITION_END, () => {
        return _this._destroyElement(element);
      });
      emulateTransitionEnd(element, transitionDuration);
    };

    _proto._destroyElement = function _destroyElement(element) {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }

      EventHandler__default.default.trigger(element, EVENT_CLOSED);
    }; // Static

    Alert.jQueryInterface = function jQueryInterface(config) {
      return this.each(function () {
        let data = Data__default.default.getData(this, DATA_KEY);

        if (!data) {
          data = new Alert(this);
        }

        if (config === 'close') {
          data[config](this);
        }
      });
    };

    Alert.handleDismiss = function handleDismiss(alertInstance) {
      return function (event) {
        if (event) {
          event.preventDefault();
        }

        alertInstance.close(this);
      };
    };

    Alert.getInstance = function getInstance(element) {
      return Data__default.default.getData(element, DATA_KEY);
    };

    _createClass(Alert, null, [
      {
        key: 'VERSION',
        get: function get() {
          return VERSION;
        },
      },
    ]);

    return Alert;
  }());
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  EventHandler__default.default.on(
    document,
    EVENT_CLICK_DATA_API,
    SELECTOR_DISMISS,
    Alert.handleDismiss(new Alert())
  );
  const $ = getjQuery();
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .alert to jQuery only if jQuery is present
   */

  /* istanbul ignore if */

  if ($) {
    const JQUERY_NO_CONFLICT = $.fn[NAME];
    $.fn[NAME] = Alert.jQueryInterface;
    $.fn[NAME].Constructor = Alert;

    $.fn[NAME].noConflict = function () {
      $.fn[NAME] = JQUERY_NO_CONFLICT;
      return Alert.jQueryInterface;
    };
  }

  return Alert;
}));
// # sourceMappingURL=alert.js.map
