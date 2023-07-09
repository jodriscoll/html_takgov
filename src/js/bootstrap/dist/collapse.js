/*!
 * Bootstrap collapse.js v5.0.0-alpha2 (https://getbootstrap.com/)
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
      global.Collapse = factory(
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

  const getSelectorFromElement = function getSelectorFromElement(element) {
    const selector = getSelector(element);

    if (selector) {
      return document.querySelector(selector) ? selector : null;
    }

    return null;
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

  const NAME = 'collapse';
  const VERSION = '5.0.0-alpha2';
  const DATA_KEY = 'bs.collapse';
  const EVENT_KEY = `.${DATA_KEY}`;
  const DATA_API_KEY = '.data-api';
  const Default = {
    toggle: true,
    parent: '',
  };
  const DefaultType = {
    toggle: 'boolean',
    parent: '(string|element)',
  };
  const EVENT_SHOW = `show${EVENT_KEY}`;
  const EVENT_SHOWN = `shown${EVENT_KEY}`;
  const EVENT_HIDE = `hide${EVENT_KEY}`;
  const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
  const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
  const CLASS_NAME_SHOW = 'show';
  const CLASS_NAME_COLLAPSE = 'collapse';
  const CLASS_NAME_COLLAPSING = 'collapsing';
  const CLASS_NAME_COLLAPSED = 'collapsed';
  const WIDTH = 'width';
  const HEIGHT = 'height';
  const SELECTOR_ACTIVES = '.show, .collapsing';
  const SELECTOR_DATA_TOGGLE = '[data-toggle="collapse"]';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  const Collapse = /* #__PURE__ */ (function () {
    function Collapse(element, config) {
      this._isTransitioning = false;
      this._element = element;
      this._config = this._getConfig(config);
      this._triggerArray = SelectorEngine__default.default.find(
        `${SELECTOR_DATA_TOGGLE
        }[href="#${
          element.id
        }"],${
          SELECTOR_DATA_TOGGLE}[data-target="#${element.id}"]`
      );
      const toggleList = SelectorEngine__default.default.find(SELECTOR_DATA_TOGGLE);

      for (let i = 0, len = toggleList.length; i < len; i++) {
        const elem = toggleList[i];
        const selector = getSelectorFromElement(elem);
        const filterElement = SelectorEngine__default.default
          .find(selector)
          .filter((foundElem) => {
            return foundElem === element;
          });

        if (selector !== null && filterElement.length) {
          this._selector = selector;

          this._triggerArray.push(elem);
        }
      }

      this._parent = this._config.parent ? this._getParent() : null;

      if (!this._config.parent) {
        this._addAriaAndCollapsedClass(this._element, this._triggerArray);
      }

      if (this._config.toggle) {
        this.toggle();
      }

      Data__default.default.setData(element, DATA_KEY, this);
    } // Getters

    const _proto = Collapse.prototype;

    // Public
    _proto.toggle = function toggle() {
      if (this._element.classList.contains(CLASS_NAME_SHOW)) {
        this.hide();
      } else {
        this.show();
      }
    };

    _proto.show = function show() {
      const _this = this;

      if (this._isTransitioning || this._element.classList.contains(CLASS_NAME_SHOW)) {
        return;
      }

      let actives;
      let activesData;

      if (this._parent) {
        actives = SelectorEngine__default.default
          .find(SELECTOR_ACTIVES, this._parent)
          .filter((elem) => {
            if (typeof _this._config.parent === 'string') {
              return elem.getAttribute('data-parent') === _this._config.parent;
            }

            return elem.classList.contains(CLASS_NAME_COLLAPSE);
          });

        if (actives.length === 0) {
          actives = null;
        }
      }

      const container = SelectorEngine__default.default.findOne(this._selector);

      if (actives) {
        const tempActiveData = actives.filter((elem) => {
          return container !== elem;
        });
        activesData = tempActiveData[0]
          ? Data__default.default.getData(tempActiveData[0], DATA_KEY)
          : null;

        if (activesData && activesData._isTransitioning) {
          return;
        }
      }

      const startEvent = EventHandler__default.default.trigger(this._element, EVENT_SHOW);

      if (startEvent.defaultPrevented) {
        return;
      }

      if (actives) {
        actives.forEach((elemActive) => {
          if (container !== elemActive) {
            Collapse.collapseInterface(elemActive, 'hide');
          }

          if (!activesData) {
            Data__default.default.setData(elemActive, DATA_KEY, null);
          }
        });
      }

      const dimension = this._getDimension();

      this._element.classList.remove(CLASS_NAME_COLLAPSE);

      this._element.classList.add(CLASS_NAME_COLLAPSING);

      this._element.style[dimension] = 0;

      if (this._triggerArray.length) {
        this._triggerArray.forEach((element) => {
          element.classList.remove(CLASS_NAME_COLLAPSED);
          element.setAttribute('aria-expanded', true);
        });
      }

      this.setTransitioning(true);

      const complete = function complete() {
        _this._element.classList.remove(CLASS_NAME_COLLAPSING);

        _this._element.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW);

        _this._element.style[dimension] = '';

        _this.setTransitioning(false);

        EventHandler__default.default.trigger(_this._element, EVENT_SHOWN);
      };

      const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
      const scrollSize = `scroll${capitalizedDimension}`;
      const transitionDuration = getTransitionDurationFromElement(this._element);
      EventHandler__default.default.one(this._element, TRANSITION_END, complete);
      emulateTransitionEnd(this._element, transitionDuration);
      this._element.style[dimension] = `${this._element[scrollSize]}px`;
    };

    _proto.hide = function hide() {
      const _this2 = this;

      if (this._isTransitioning || !this._element.classList.contains(CLASS_NAME_SHOW)) {
        return;
      }

      const startEvent = EventHandler__default.default.trigger(this._element, EVENT_HIDE);

      if (startEvent.defaultPrevented) {
        return;
      }

      const dimension = this._getDimension();

      this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`;
      reflow(this._element);

      this._element.classList.add(CLASS_NAME_COLLAPSING);

      this._element.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW);

      const triggerArrayLength = this._triggerArray.length;

      if (triggerArrayLength > 0) {
        for (let i = 0; i < triggerArrayLength; i++) {
          const trigger = this._triggerArray[i];
          const elem = getElementFromSelector(trigger);

          if (elem && !elem.classList.contains(CLASS_NAME_SHOW)) {
            trigger.classList.add(CLASS_NAME_COLLAPSED);
            trigger.setAttribute('aria-expanded', false);
          }
        }
      }

      this.setTransitioning(true);

      const complete = function complete() {
        _this2.setTransitioning(false);

        _this2._element.classList.remove(CLASS_NAME_COLLAPSING);

        _this2._element.classList.add(CLASS_NAME_COLLAPSE);

        EventHandler__default.default.trigger(_this2._element, EVENT_HIDDEN);
      };

      this._element.style[dimension] = '';
      const transitionDuration = getTransitionDurationFromElement(this._element);
      EventHandler__default.default.one(this._element, TRANSITION_END, complete);
      emulateTransitionEnd(this._element, transitionDuration);
    };

    _proto.setTransitioning = function setTransitioning(isTransitioning) {
      this._isTransitioning = isTransitioning;
    };

    _proto.dispose = function dispose() {
      Data__default.default.removeData(this._element, DATA_KEY);
      this._config = null;
      this._parent = null;
      this._element = null;
      this._triggerArray = null;
      this._isTransitioning = null;
    }; // Private

    _proto._getConfig = function _getConfig(config) {
      config = { ...Default, ...config };
      config.toggle = Boolean(config.toggle); // Coerce string values

      typeCheckConfig(NAME, config, DefaultType);
      return config;
    };

    _proto._getDimension = function _getDimension() {
      return this._element.classList.contains(WIDTH) ? WIDTH : HEIGHT;
    };

    _proto._getParent = function _getParent() {
      const _this3 = this;

      let parent = this._config.parent;

      if (isElement(parent)) {
        // it's a jQuery object
        if (typeof parent.jquery !== 'undefined' || typeof parent[0] !== 'undefined') {
          parent = parent[0];
        }
      } else {
        parent = SelectorEngine__default.default.findOne(parent);
      }

      const selector = `${SELECTOR_DATA_TOGGLE}[data-parent="${parent}"]`;
      SelectorEngine__default.default.find(selector, parent).forEach((element) => {
        const selected = getElementFromSelector(element);

        _this3._addAriaAndCollapsedClass(selected, [element]);
      });
      return parent;
    };

    _proto._addAriaAndCollapsedClass = function _addAriaAndCollapsedClass(element, triggerArray) {
      if (!element || !triggerArray.length) {
        return;
      }

      const isOpen = element.classList.contains(CLASS_NAME_SHOW);
      triggerArray.forEach((elem) => {
        if (isOpen) {
          elem.classList.remove(CLASS_NAME_COLLAPSED);
        } else {
          elem.classList.add(CLASS_NAME_COLLAPSED);
        }

        elem.setAttribute('aria-expanded', isOpen);
      });
    }; // Static

    Collapse.collapseInterface = function collapseInterface(element, config) {
      let data = Data__default.default.getData(element, DATA_KEY);

      const _config = {

        ...Default,
        ...Manipulator__default.default.getDataAttributes(element),
        ...typeof config === 'object' && config ? config : {}
      };

      if (!data && _config.toggle && typeof config === 'string' && /show|hide/.test(config)) {
        _config.toggle = false;
      }

      if (!data) {
        data = new Collapse(element, _config);
      }

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config]();
      }
    };

    Collapse.jQueryInterface = function jQueryInterface(config) {
      return this.each(function () {
        Collapse.collapseInterface(this, config);
      });
    };

    Collapse.getInstance = function getInstance(element) {
      return Data__default.default.getData(element, DATA_KEY);
    };

    _createClass(Collapse, null, [
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

    return Collapse;
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
      // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
      if (event.target.tagName === 'A') {
        event.preventDefault();
      }

      const triggerData = Manipulator__default.default.getDataAttributes(this);
      const selector = getSelectorFromElement(this);
      const selectorElements = SelectorEngine__default.default.find(selector);
      selectorElements.forEach((element) => {
        const data = Data__default.default.getData(element, DATA_KEY);
        let config;

        if (data) {
          // update parent attribute
          if (data._parent === null && typeof triggerData.parent === 'string') {
            data._config.parent = triggerData.parent;
            data._parent = data._getParent();
          }

          config = 'toggle';
        } else {
          config = triggerData;
        }

        Collapse.collapseInterface(element, config);
      });
    }
  );
  const $ = getjQuery();
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .collapse to jQuery only if jQuery is present
   */

  /* istanbul ignore if */

  if ($) {
    const JQUERY_NO_CONFLICT = $.fn[NAME];
    $.fn[NAME] = Collapse.jQueryInterface;
    $.fn[NAME].Constructor = Collapse;

    $.fn[NAME].noConflict = function () {
      $.fn[NAME] = JQUERY_NO_CONFLICT;
      return Collapse.jQueryInterface;
    };
  }

  return Collapse;
}));
// # sourceMappingURL=collapse.js.map
