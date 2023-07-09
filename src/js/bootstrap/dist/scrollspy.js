/*!
 * Bootstrap scrollspy.js v5.0.0-alpha2 (https://getbootstrap.com/)
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
      global.ScrollSpy = factory(
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
  const MAX_UID = 1000000;

  const toType = function toType(obj) {
    if (obj === null || obj === undefined) {
      return String(obj);
    }

    return {}.toString
      .call(obj)
      .match(/\s([a-z]+)/i)[1]
      .toLowerCase();
  };
  /**
   * --------------------------------------------------------------------------
   * Public Util Api
   * --------------------------------------------------------------------------
   */

  const getUID = function getUID(prefix) {
    do {
      prefix += Math.floor(Math.random() * MAX_UID);
    } while (document.getElementById(prefix));

    return prefix;
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

  const isElement = function isElement(obj) {
    return (obj[0] || obj).nodeType;
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

  const NAME = 'scrollspy';
  const VERSION = '5.0.0-alpha2';
  const DATA_KEY = 'bs.scrollspy';
  const EVENT_KEY = `.${DATA_KEY}`;
  const DATA_API_KEY = '.data-api';
  const Default = {
    offset: 10,
    method: 'auto',
    target: '',
  };
  const DefaultType = {
    offset: 'number',
    method: 'string',
    target: '(string|element)',
  };
  const EVENT_ACTIVATE = `activate${EVENT_KEY}`;
  const EVENT_SCROLL = `scroll${EVENT_KEY}`;
  const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`;
  const CLASS_NAME_DROPDOWN_ITEM = 'dropdown-item';
  const CLASS_NAME_ACTIVE = 'active';
  const SELECTOR_DATA_SPY = '[data-spy="scroll"]';
  const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group';
  const SELECTOR_NAV_LINKS = '.nav-link';
  const SELECTOR_NAV_ITEMS = '.nav-item';
  const SELECTOR_LIST_ITEMS = '.list-group-item';
  const SELECTOR_DROPDOWN = '.dropdown';
  const SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle';
  const METHOD_OFFSET = 'offset';
  const METHOD_POSITION = 'position';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  const ScrollSpy = /* #__PURE__ */ (function () {
    function ScrollSpy(element, config) {
      const _this = this;

      this._element = element;
      this._scrollElement = element.tagName === 'BODY' ? window : element;
      this._config = this._getConfig(config);
      this._selector =
        `${this._config.target
        } ${
          SELECTOR_NAV_LINKS
        }, ${
          this._config.target
        } ${
          SELECTOR_LIST_ITEMS
        }, ${
          this._config.target
        } .${
          CLASS_NAME_DROPDOWN_ITEM}`;
      this._offsets = [];
      this._targets = [];
      this._activeTarget = null;
      this._scrollHeight = 0;
      EventHandler__default.default.on(this._scrollElement, EVENT_SCROLL, (event) => {
        return _this._process(event);
      });
      this.refresh();

      this._process();

      Data__default.default.setData(element, DATA_KEY, this);
    } // Getters

    const _proto = ScrollSpy.prototype;

    // Public
    _proto.refresh = function refresh() {
      const _this2 = this;

      const autoMethod =
        this._scrollElement === this._scrollElement.window ? METHOD_OFFSET : METHOD_POSITION;
      const offsetMethod = this._config.method === 'auto' ? autoMethod : this._config.method;
      const offsetBase = offsetMethod === METHOD_POSITION ? this._getScrollTop() : 0;
      this._offsets = [];
      this._targets = [];
      this._scrollHeight = this._getScrollHeight();
      const targets = SelectorEngine__default.default.find(this._selector);
      targets
        .map((element) => {
          const targetSelector = getSelectorFromElement(element);
          const target = targetSelector
            ? SelectorEngine__default.default.findOne(targetSelector)
            : null;

          if (target) {
            const targetBCR = target.getBoundingClientRect();

            if (targetBCR.width || targetBCR.height) {
              return [
                Manipulator__default.default[offsetMethod](target).top + offsetBase,
                targetSelector,
              ];
            }
          }

          return null;
        })
        .filter((item) => {
          return item;
        })
        .sort((a, b) => {
          return a[0] - b[0];
        })
        .forEach((item) => {
          _this2._offsets.push(item[0]);

          _this2._targets.push(item[1]);
        });
    };

    _proto.dispose = function dispose() {
      Data__default.default.removeData(this._element, DATA_KEY);
      EventHandler__default.default.off(this._scrollElement, EVENT_KEY);
      this._element = null;
      this._scrollElement = null;
      this._config = null;
      this._selector = null;
      this._offsets = null;
      this._targets = null;
      this._activeTarget = null;
      this._scrollHeight = null;
    }; // Private

    _proto._getConfig = function _getConfig(config) {
      config = { ...Default, ...typeof config === 'object' && config ? config : {} };

      if (typeof config.target !== 'string' && isElement(config.target)) {
        let id = config.target.id;

        if (!id) {
          id = getUID(NAME);
          config.target.id = id;
        }

        config.target = `#${id}`;
      }

      typeCheckConfig(NAME, config, DefaultType);
      return config;
    };

    _proto._getScrollTop = function _getScrollTop() {
      return this._scrollElement === window
        ? this._scrollElement.pageYOffset
        : this._scrollElement.scrollTop;
    };

    _proto._getScrollHeight = function _getScrollHeight() {
      return (
        this._scrollElement.scrollHeight ||
        Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
      );
    };

    _proto._getOffsetHeight = function _getOffsetHeight() {
      return this._scrollElement === window
        ? window.innerHeight
        : this._scrollElement.getBoundingClientRect().height;
    };

    _proto._process = function _process() {
      const scrollTop = this._getScrollTop() + this._config.offset;

      const scrollHeight = this._getScrollHeight();

      const maxScroll = this._config.offset + scrollHeight - this._getOffsetHeight();

      if (this._scrollHeight !== scrollHeight) {
        this.refresh();
      }

      if (scrollTop >= maxScroll) {
        const target = this._targets[this._targets.length - 1];

        if (this._activeTarget !== target) {
          this._activate(target);
        }

        return;
      }

      if (this._activeTarget && scrollTop < this._offsets[0] && this._offsets[0] > 0) {
        this._activeTarget = null;

        this._clear();

        return;
      }

      for (let i = this._offsets.length; i--;) {
        const isActiveTarget =
          this._activeTarget !== this._targets[i] &&
          scrollTop >= this._offsets[i] &&
          (typeof this._offsets[i + 1] === 'undefined' || scrollTop < this._offsets[i + 1]);

        if (isActiveTarget) {
          this._activate(this._targets[i]);
        }
      }
    };

    _proto._activate = function _activate(target) {
      this._activeTarget = target;

      this._clear();

      const queries = this._selector.split(',').map((selector) => {
        return `${selector}[data-target="${target}"],${selector}[href="${target}"]`;
      });

      const link = SelectorEngine__default.default.findOne(queries.join(','));

      if (link.classList.contains(CLASS_NAME_DROPDOWN_ITEM)) {
        SelectorEngine__default.default
          .findOne(SELECTOR_DROPDOWN_TOGGLE, link.closest(SELECTOR_DROPDOWN))
          .classList.add(CLASS_NAME_ACTIVE);
        link.classList.add(CLASS_NAME_ACTIVE);
      } else {
        // Set triggered link as active
        link.classList.add(CLASS_NAME_ACTIVE);
        SelectorEngine__default.default
          .parents(link, SELECTOR_NAV_LIST_GROUP)
          .forEach((listGroup) => {
            // Set triggered links parents as active
            // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor
            SelectorEngine__default.default
              .prev(listGroup, `${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`)
              .forEach((item) => {
                return item.classList.add(CLASS_NAME_ACTIVE);
              }); // Handle special case when .nav-link is inside .nav-item

            SelectorEngine__default.default
              .prev(listGroup, SELECTOR_NAV_ITEMS)
              .forEach((navItem) => {
                SelectorEngine__default.default
                  .children(navItem, SELECTOR_NAV_LINKS)
                  .forEach((item) => {
                    return item.classList.add(CLASS_NAME_ACTIVE);
                  });
              });
          });
      }

      EventHandler__default.default.trigger(this._scrollElement, EVENT_ACTIVATE, {
        relatedTarget: target,
      });
    };

    _proto._clear = function _clear() {
      SelectorEngine__default.default
        .find(this._selector)
        .filter((node) => {
          return node.classList.contains(CLASS_NAME_ACTIVE);
        })
        .forEach((node) => {
          return node.classList.remove(CLASS_NAME_ACTIVE);
        });
    }; // Static

    ScrollSpy.jQueryInterface = function jQueryInterface(config) {
      return this.each(function () {
        let data = Data__default.default.getData(this, DATA_KEY);

        const _config = typeof config === 'object' && config;

        if (!data) {
          data = new ScrollSpy(this, _config);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }

          data[config]();
        }
      });
    };

    ScrollSpy.getInstance = function getInstance(element) {
      return Data__default.default.getData(element, DATA_KEY);
    };

    _createClass(ScrollSpy, null, [
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

    return ScrollSpy;
  }());
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  EventHandler__default.default.on(window, EVENT_LOAD_DATA_API, () => {
    SelectorEngine__default.default.find(SELECTOR_DATA_SPY).forEach((spy) => {
      return new ScrollSpy(spy, Manipulator__default.default.getDataAttributes(spy));
    });
  });
  const $ = getjQuery();
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  /* istanbul ignore if */

  if ($) {
    const JQUERY_NO_CONFLICT = $.fn[NAME];
    $.fn[NAME] = ScrollSpy.jQueryInterface;
    $.fn[NAME].Constructor = ScrollSpy;

    $.fn[NAME].noConflict = function () {
      $.fn[NAME] = JQUERY_NO_CONFLICT;
      return ScrollSpy.jQueryInterface;
    };
  }

  return ScrollSpy;
}));
// # sourceMappingURL=scrollspy.js.map
