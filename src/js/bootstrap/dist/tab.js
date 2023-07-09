/*!
 * Bootstrap tab.js v5.0.0-alpha2 (https://getbootstrap.com/)
 * Copyright 2011-2020 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? module.exports = factory(
      require('./dom/data.js'),
      require('./dom/event-handler.js'),
      require('./dom/selector-engine.js')
    )
    : typeof define === 'function' && define.amd
      ? define(['./dom/data.js', './dom/event-handler.js', './dom/selector-engine.js'], factory)
      : (global = typeof globalThis !== 'undefined' ? globalThis : global || self,
      global.Tab = factory(global.Data, global.EventHandler, global.SelectorEngine));
}(this, (Data, EventHandler, SelectorEngine) => {

  function _interopDefaultLegacy(e) {
    return e && typeof e === 'object' && 'default' in e ? e : { default: e };
  }

  const Data__default = /* #__PURE__ */ _interopDefaultLegacy(Data);
  const EventHandler__default = /* #__PURE__ */ _interopDefaultLegacy(EventHandler);
  const SelectorEngine__default = /* #__PURE__ */ _interopDefaultLegacy(SelectorEngine);

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

  const NAME = 'tab';
  const VERSION = '5.0.0-alpha2';
  const DATA_KEY = 'bs.tab';
  const EVENT_KEY = `.${DATA_KEY}`;
  const DATA_API_KEY = '.data-api';
  const EVENT_HIDE = `hide${EVENT_KEY}`;
  const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
  const EVENT_SHOW = `show${EVENT_KEY}`;
  const EVENT_SHOWN = `shown${EVENT_KEY}`;
  const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
  const CLASS_NAME_DROPDOWN_MENU = 'dropdown-menu';
  const CLASS_NAME_ACTIVE = 'active';
  const CLASS_NAME_DISABLED = 'disabled';
  const CLASS_NAME_FADE = 'fade';
  const CLASS_NAME_SHOW = 'show';
  const SELECTOR_DROPDOWN = '.dropdown';
  const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group';
  const SELECTOR_ACTIVE = '.active';
  const SELECTOR_ACTIVE_UL = ':scope > li > .active';
  const SELECTOR_DATA_TOGGLE = '[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]';
  const SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle';
  const SELECTOR_DROPDOWN_ACTIVE_CHILD = ':scope > .dropdown-menu .active';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  const Tab = /* #__PURE__ */ (function () {
    function Tab(element) {
      this._element = element;
      Data__default.default.setData(this._element, DATA_KEY, this);
    } // Getters

    const _proto = Tab.prototype;

    // Public
    _proto.show = function show() {
      const _this = this;

      if (
        (this._element.parentNode &&
          this._element.parentNode.nodeType === Node.ELEMENT_NODE &&
          this._element.classList.contains(CLASS_NAME_ACTIVE)) ||
        this._element.classList.contains(CLASS_NAME_DISABLED)
      ) {
        return;
      }

      let previous;
      const target = getElementFromSelector(this._element);

      const listElement = this._element.closest(SELECTOR_NAV_LIST_GROUP);

      if (listElement) {
        const itemSelector =
          listElement.nodeName === 'UL' || listElement.nodeName === 'OL'
            ? SELECTOR_ACTIVE_UL
            : SELECTOR_ACTIVE;
        previous = SelectorEngine__default.default.find(itemSelector, listElement);
        previous = previous[previous.length - 1];
      }

      let hideEvent = null;

      if (previous) {
        hideEvent = EventHandler__default.default.trigger(previous, EVENT_HIDE, {
          relatedTarget: this._element,
        });
      }

      const showEvent = EventHandler__default.default.trigger(this._element, EVENT_SHOW, {
        relatedTarget: previous,
      });

      if (showEvent.defaultPrevented || (hideEvent !== null && hideEvent.defaultPrevented)) {
        return;
      }

      this._activate(this._element, listElement);

      const complete = function complete() {
        EventHandler__default.default.trigger(previous, EVENT_HIDDEN, {
          relatedTarget: _this._element,
        });
        EventHandler__default.default.trigger(_this._element, EVENT_SHOWN, {
          relatedTarget: previous,
        });
      };

      if (target) {
        this._activate(target, target.parentNode, complete);
      } else {
        complete();
      }
    };

    _proto.dispose = function dispose() {
      Data__default.default.removeData(this._element, DATA_KEY);
      this._element = null;
    }; // Private

    _proto._activate = function _activate(element, container, callback) {
      const _this2 = this;

      const activeElements =
        container && (container.nodeName === 'UL' || container.nodeName === 'OL')
          ? SelectorEngine__default.default.find(SELECTOR_ACTIVE_UL, container)
          : SelectorEngine__default.default.children(container, SELECTOR_ACTIVE);
      const active = activeElements[0];
      const isTransitioning = callback && active && active.classList.contains(CLASS_NAME_FADE);

      const complete = function complete() {
        return _this2._transitionComplete(element, active, callback);
      };

      if (active && isTransitioning) {
        const transitionDuration = getTransitionDurationFromElement(active);
        active.classList.remove(CLASS_NAME_SHOW);
        EventHandler__default.default.one(active, TRANSITION_END, complete);
        emulateTransitionEnd(active, transitionDuration);
      } else {
        complete();
      }
    };

    _proto._transitionComplete = function _transitionComplete(element, active, callback) {
      if (active) {
        active.classList.remove(CLASS_NAME_ACTIVE);
        const dropdownChild = SelectorEngine__default.default.findOne(
          SELECTOR_DROPDOWN_ACTIVE_CHILD,
          active.parentNode
        );

        if (dropdownChild) {
          dropdownChild.classList.remove(CLASS_NAME_ACTIVE);
        }

        if (active.getAttribute('role') === 'tab') {
          active.setAttribute('aria-selected', false);
        }
      }

      element.classList.add(CLASS_NAME_ACTIVE);

      if (element.getAttribute('role') === 'tab') {
        element.setAttribute('aria-selected', true);
      }

      reflow(element);

      if (element.classList.contains(CLASS_NAME_FADE)) {
        element.classList.add(CLASS_NAME_SHOW);
      }

      if (element.parentNode && element.parentNode.classList.contains(CLASS_NAME_DROPDOWN_MENU)) {
        const dropdownElement = element.closest(SELECTOR_DROPDOWN);

        if (dropdownElement) {
          SelectorEngine__default.default
            .find(SELECTOR_DROPDOWN_TOGGLE)
            .forEach((dropdown) => {
              return dropdown.classList.add(CLASS_NAME_ACTIVE);
            });
        }

        element.setAttribute('aria-expanded', true);
      }

      if (callback) {
        callback();
      }
    }; // Static

    Tab.jQueryInterface = function jQueryInterface(config) {
      return this.each(function () {
        const data = Data__default.default.getData(this, DATA_KEY) || new Tab(this);

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }

          data[config]();
        }
      });
    };

    Tab.getInstance = function getInstance(element) {
      return Data__default.default.getData(element, DATA_KEY);
    };

    _createClass(Tab, null, [
      {
        key: 'VERSION',
        get: function get() {
          return VERSION;
        },
      },
    ]);

    return Tab;
  }());
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  EventHandler__default.default.on(
    document,
    EVENT_CLICK_DATA_API,
    SELECTOR_DATA_TOGGLE,
    function (event) {
      event.preventDefault();
      const data = Data__default.default.getData(this, DATA_KEY) || new Tab(this);
      data.show();
    }
  );
  const $ = getjQuery();
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .tab to jQuery only if jQuery is present
   */

  /* istanbul ignore if */

  if ($) {
    const JQUERY_NO_CONFLICT = $.fn[NAME];
    $.fn[NAME] = Tab.jQueryInterface;
    $.fn[NAME].Constructor = Tab;

    $.fn[NAME].noConflict = function () {
      $.fn[NAME] = JQUERY_NO_CONFLICT;
      return Tab.jQueryInterface;
    };
  }

  return Tab;
}));
// # sourceMappingURL=tab.js.map
