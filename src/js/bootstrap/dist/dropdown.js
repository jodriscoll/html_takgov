/*!
 * Bootstrap dropdown.js v5.0.0-alpha2 (https://getbootstrap.com/)
 * Copyright 2011-2020 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? module.exports = factory(
      require('./dom/data.js'),
      require('./dom/event-handler.js'),
      require('./dom/manipulator.js'),
      require('popper.js'),
      require('./dom/selector-engine.js')
    )
    : typeof define === 'function' && define.amd
      ? define([
        './dom/data.js',
        './dom/event-handler.js',
        './dom/manipulator.js',
        'popper.js',
        './dom/selector-engine.js',
      ], factory)
      : (global = typeof globalThis !== 'undefined' ? globalThis : global || self,
      global.Dropdown = factory(
        global.Data,
        global.EventHandler,
        global.Manipulator,
        global.Popper,
        global.SelectorEngine
      ));
}(this, (Data, EventHandler, Manipulator, Popper, SelectorEngine) => {

  function _interopDefaultLegacy(e) {
    return e && typeof e === 'object' && 'default' in e ? e : { default: e };
  }

  const Data__default = /* #__PURE__ */ _interopDefaultLegacy(Data);
  const EventHandler__default = /* #__PURE__ */ _interopDefaultLegacy(EventHandler);
  const Manipulator__default = /* #__PURE__ */ _interopDefaultLegacy(Manipulator);
  const Popper__default = /* #__PURE__ */ _interopDefaultLegacy(Popper);
  const SelectorEngine__default = /* #__PURE__ */ _interopDefaultLegacy(SelectorEngine);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.0-alpha2): util/index.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

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

  const noop = function noop() {
    return function () {};
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

  const NAME = 'dropdown';
  const VERSION = '5.0.0-alpha2';
  const DATA_KEY = 'bs.dropdown';
  const EVENT_KEY = `.${DATA_KEY}`;
  const DATA_API_KEY = '.data-api';
  const ESCAPE_KEY = 'Escape';
  const SPACE_KEY = 'Space';
  const TAB_KEY = 'Tab';
  const ARROW_UP_KEY = 'ArrowUp';
  const ARROW_DOWN_KEY = 'ArrowDown';
  const RIGHT_MOUSE_BUTTON = 2; // MouseEvent.button value for the secondary button, usually the right button

  const REGEXP_KEYDOWN = new RegExp(`${ARROW_UP_KEY}|${ARROW_DOWN_KEY}|${ESCAPE_KEY}`);
  const EVENT_HIDE = `hide${EVENT_KEY}`;
  const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
  const EVENT_SHOW = `show${EVENT_KEY}`;
  const EVENT_SHOWN = `shown${EVENT_KEY}`;
  const EVENT_CLICK = `click${EVENT_KEY}`;
  const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
  const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY}${DATA_API_KEY}`;
  const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY}${DATA_API_KEY}`;
  const CLASS_NAME_DISABLED = 'disabled';
  const CLASS_NAME_SHOW = 'show';
  const CLASS_NAME_DROPUP = 'dropup';
  const CLASS_NAME_DROPRIGHT = 'dropright';
  const CLASS_NAME_DROPLEFT = 'dropleft';
  const CLASS_NAME_MENURIGHT = 'dropdown-menu-right';
  const CLASS_NAME_NAVBAR = 'navbar';
  const CLASS_NAME_POSITION_STATIC = 'position-static';
  const SELECTOR_DATA_TOGGLE = '[data-toggle="dropdown"]';
  const SELECTOR_FORM_CHILD = '.dropdown form';
  const SELECTOR_MENU = '.dropdown-menu';
  const SELECTOR_NAVBAR_NAV = '.navbar-nav';
  const SELECTOR_VISIBLE_ITEMS = '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)';
  const PLACEMENT_TOP = 'top-start';
  const PLACEMENT_TOPEND = 'top-end';
  const PLACEMENT_BOTTOM = 'bottom-start';
  const PLACEMENT_BOTTOMEND = 'bottom-end';
  const PLACEMENT_RIGHT = 'right-start';
  const PLACEMENT_LEFT = 'left-start';
  const Default = {
    offset: 0,
    flip: true,
    boundary: 'scrollParent',
    reference: 'toggle',
    display: 'dynamic',
    popperConfig: null,
  };
  const DefaultType = {
    offset: '(number|string|function)',
    flip: 'boolean',
    boundary: '(string|element)',
    reference: '(string|element)',
    display: 'string',
    popperConfig: '(null|object)',
  };
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  const Dropdown = /* #__PURE__ */ (function () {
    function Dropdown(element, config) {
      this._element = element;
      this._popper = null;
      this._config = this._getConfig(config);
      this._menu = this._getMenuElement();
      this._inNavbar = this._detectNavbar();

      this._addEventListeners();

      Data__default.default.setData(element, DATA_KEY, this);
    } // Getters

    const _proto = Dropdown.prototype;

    // Public
    _proto.toggle = function toggle() {
      if (this._element.disabled || this._element.classList.contains(CLASS_NAME_DISABLED)) {
        return;
      }

      const isActive = this._element.classList.contains(CLASS_NAME_SHOW);

      Dropdown.clearMenus();

      if (isActive) {
        return;
      }

      this.show();
    };

    _proto.show = function show() {
      if (
        this._element.disabled ||
        this._element.classList.contains(CLASS_NAME_DISABLED) ||
        this._menu.classList.contains(CLASS_NAME_SHOW)
      ) {
        return;
      }

      const parent = Dropdown.getParentFromElement(this._element);
      const relatedTarget = {
        relatedTarget: this._element,
      };
      const showEvent = EventHandler__default.default.trigger(
        this._element,
        EVENT_SHOW,
        relatedTarget
      );

      if (showEvent.defaultPrevented) {
        return;
      } // Disable totally Popper.js for Dropdown in Navbar

      if (!this._inNavbar) {
        if (typeof Popper__default.default === 'undefined') {
          throw new TypeError('Bootstrap\'s dropdowns require Popper.js (https://popper.js.org)');
        }

        let referenceElement = this._element;

        if (this._config.reference === 'parent') {
          referenceElement = parent;
        } else if (isElement(this._config.reference)) {
          referenceElement = this._config.reference; // Check if it's jQuery element

          if (typeof this._config.reference.jquery !== 'undefined') {
            referenceElement = this._config.reference[0];
          }
        } // If boundary is not `scrollParent`, then set position to `static`
        // to allow the menu to "escape" the scroll parent's boundaries
        // https://github.com/twbs/bootstrap/issues/24251

        if (this._config.boundary !== 'scrollParent') {
          parent.classList.add(CLASS_NAME_POSITION_STATIC);
        }

        this._popper = new Popper__default.default(
          referenceElement,
          this._menu,
          this._getPopperConfig()
        );
      } // If this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html

      if ('ontouchstart' in document.documentElement && !parent.closest(SELECTOR_NAVBAR_NAV)) {
        let _ref;

        (_ref = []).concat.apply(_ref, document.body.children).forEach((elem) => {
          return EventHandler__default.default.on(elem, 'mouseover', null, noop());
        });
      }

      this._element.focus();

      this._element.setAttribute('aria-expanded', true);

      Manipulator__default.default.toggleClass(this._menu, CLASS_NAME_SHOW);
      Manipulator__default.default.toggleClass(this._element, CLASS_NAME_SHOW);
      EventHandler__default.default.trigger(parent, EVENT_SHOWN, relatedTarget);
    };

    _proto.hide = function hide() {
      if (
        this._element.disabled ||
        this._element.classList.contains(CLASS_NAME_DISABLED) ||
        !this._menu.classList.contains(CLASS_NAME_SHOW)
      ) {
        return;
      }

      const parent = Dropdown.getParentFromElement(this._element);
      const relatedTarget = {
        relatedTarget: this._element,
      };
      const hideEvent = EventHandler__default.default.trigger(parent, EVENT_HIDE, relatedTarget);

      if (hideEvent.defaultPrevented) {
        return;
      }

      if (this._popper) {
        this._popper.destroy();
      }

      Manipulator__default.default.toggleClass(this._menu, CLASS_NAME_SHOW);
      Manipulator__default.default.toggleClass(this._element, CLASS_NAME_SHOW);
      EventHandler__default.default.trigger(parent, EVENT_HIDDEN, relatedTarget);
    };

    _proto.dispose = function dispose() {
      Data__default.default.removeData(this._element, DATA_KEY);
      EventHandler__default.default.off(this._element, EVENT_KEY);
      this._element = null;
      this._menu = null;

      if (this._popper) {
        this._popper.destroy();

        this._popper = null;
      }
    };

    _proto.update = function update() {
      this._inNavbar = this._detectNavbar();

      if (this._popper) {
        this._popper.scheduleUpdate();
      }
    }; // Private

    _proto._addEventListeners = function _addEventListeners() {
      const _this = this;

      EventHandler__default.default.on(this._element, EVENT_CLICK, (event) => {
        event.preventDefault();
        event.stopPropagation();

        _this.toggle();
      });
    };

    _proto._getConfig = function _getConfig(config) {
      config = {

        ...this.constructor.Default,
        ...Manipulator__default.default.getDataAttributes(this._element),
        ...config
      };
      typeCheckConfig(NAME, config, this.constructor.DefaultType);
      return config;
    };

    _proto._getMenuElement = function _getMenuElement() {
      return SelectorEngine__default.default.next(this._element, SELECTOR_MENU)[0];
    };

    _proto._getPlacement = function _getPlacement() {
      const parentDropdown = this._element.parentNode;
      let placement = PLACEMENT_BOTTOM; // Handle dropup

      if (parentDropdown.classList.contains(CLASS_NAME_DROPUP)) {
        placement = PLACEMENT_TOP;

        if (this._menu.classList.contains(CLASS_NAME_MENURIGHT)) {
          placement = PLACEMENT_TOPEND;
        }
      } else if (parentDropdown.classList.contains(CLASS_NAME_DROPRIGHT)) {
        placement = PLACEMENT_RIGHT;
      } else if (parentDropdown.classList.contains(CLASS_NAME_DROPLEFT)) {
        placement = PLACEMENT_LEFT;
      } else if (this._menu.classList.contains(CLASS_NAME_MENURIGHT)) {
        placement = PLACEMENT_BOTTOMEND;
      }

      return placement;
    };

    _proto._detectNavbar = function _detectNavbar() {
      return Boolean(this._element.closest(`.${CLASS_NAME_NAVBAR}`));
    };

    _proto._getOffset = function _getOffset() {
      const _this2 = this;

      const offset = {};

      if (typeof this._config.offset === 'function') {
        offset.fn = function (data) {
          data.offsets = {

            ...data.offsets,
            ..._this2._config.offset(data.offsets, _this2._element) || {}
          };
          return data;
        };
      } else {
        offset.offset = this._config.offset;
      }

      return offset;
    };

    _proto._getPopperConfig = function _getPopperConfig() {
      const popperConfig = {
        placement: this._getPlacement(),
        modifiers: {
          offset: this._getOffset(),
          flip: {
            enabled: this._config.flip,
          },
          preventOverflow: {
            boundariesElement: this._config.boundary,
          },
        },
      }; // Disable Popper.js if we have a static display

      if (this._config.display === 'static') {
        popperConfig.modifiers.applyStyle = {
          enabled: false,
        };
      }

      return { ...popperConfig, ...this._config.popperConfig };
    }; // Static

    Dropdown.dropdownInterface = function dropdownInterface(element, config) {
      let data = Data__default.default.getData(element, DATA_KEY);

      const _config = typeof config === 'object' ? config : null;

      if (!data) {
        data = new Dropdown(element, _config);
      }

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config]();
      }
    };

    Dropdown.jQueryInterface = function jQueryInterface(config) {
      return this.each(function () {
        Dropdown.dropdownInterface(this, config);
      });
    };

    Dropdown.clearMenus = function clearMenus(event) {
      if (
        event &&
        (event.button === RIGHT_MOUSE_BUTTON || (event.type === 'keyup' && event.key !== TAB_KEY))
      ) {
        return;
      }

      const toggles = SelectorEngine__default.default.find(SELECTOR_DATA_TOGGLE);

      for (let i = 0, len = toggles.length; i < len; i++) {
        const parent = Dropdown.getParentFromElement(toggles[i]);
        const context = Data__default.default.getData(toggles[i], DATA_KEY);
        const relatedTarget = {
          relatedTarget: toggles[i],
        };

        if (event && event.type === 'click') {
          relatedTarget.clickEvent = event;
        }

        if (!context) {
          continue;
        }

        const dropdownMenu = context._menu;

        if (!toggles[i].classList.contains(CLASS_NAME_SHOW)) {
          continue;
        }

        if (
          event &&
          ((event.type === 'click' && /input|textarea/i.test(event.target.tagName)) ||
            (event.type === 'keyup' && event.key === TAB_KEY)) &&
          dropdownMenu.contains(event.target)
        ) {
          continue;
        }

        const hideEvent = EventHandler__default.default.trigger(parent, EVENT_HIDE, relatedTarget);

        if (hideEvent.defaultPrevented) {
          continue;
        } // If this is a touch-enabled device we remove the extra
        // empty mouseover listeners we added for iOS support

        if ('ontouchstart' in document.documentElement) {
          var _ref2;

          (_ref2 = []).concat.apply(_ref2, document.body.children).forEach((elem) => {
            return EventHandler__default.default.off(elem, 'mouseover', null, noop());
          });
        }

        toggles[i].setAttribute('aria-expanded', 'false');

        if (context._popper) {
          context._popper.destroy();
        }

        dropdownMenu.classList.remove(CLASS_NAME_SHOW);
        toggles[i].classList.remove(CLASS_NAME_SHOW);
        EventHandler__default.default.trigger(parent, EVENT_HIDDEN, relatedTarget);
      }
    };

    Dropdown.getParentFromElement = function getParentFromElement(element) {
      return getElementFromSelector(element) || element.parentNode;
    };

    Dropdown.dataApiKeydownHandler = function dataApiKeydownHandler(event) {
      // If not input/textarea:
      //  - And not a key in REGEXP_KEYDOWN => not a dropdown command
      // If input/textarea:
      //  - If space key => not a dropdown command
      //  - If key is other than escape
      //    - If key is not up or down => not a dropdown command
      //    - If trigger inside the menu => not a dropdown command
      if (
        /input|textarea/i.test(event.target.tagName)
          ? event.key === SPACE_KEY ||
            (event.key !== ESCAPE_KEY &&
              ((event.key !== ARROW_DOWN_KEY && event.key !== ARROW_UP_KEY) ||
                event.target.closest(SELECTOR_MENU)))
          : !REGEXP_KEYDOWN.test(event.key)
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (this.disabled || this.classList.contains(CLASS_NAME_DISABLED)) {
        return;
      }

      const parent = Dropdown.getParentFromElement(this);
      const isActive = this.classList.contains(CLASS_NAME_SHOW);

      if (event.key === ESCAPE_KEY) {
        const button = this.matches(SELECTOR_DATA_TOGGLE)
          ? this
          : SelectorEngine__default.default.prev(this, SELECTOR_DATA_TOGGLE)[0];
        button.focus();
        Dropdown.clearMenus();
        return;
      }

      if (!isActive || event.key === SPACE_KEY) {
        Dropdown.clearMenus();
        return;
      }

      const items = SelectorEngine__default.default
        .find(SELECTOR_VISIBLE_ITEMS, parent)
        .filter(isVisible);

      if (!items.length) {
        return;
      }

      let index = items.indexOf(event.target);

      if (event.key === ARROW_UP_KEY && index > 0) {
        // Up
        index--;
      }

      if (event.key === ARROW_DOWN_KEY && index < items.length - 1) {
        // Down
        index++;
      } // index is -1 if the first keydown is an ArrowUp

      index = index === -1 ? 0 : index;
      items[index].focus();
    };

    Dropdown.getInstance = function getInstance(element) {
      return Data__default.default.getData(element, DATA_KEY);
    };

    _createClass(Dropdown, null, [
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
      {
        key: 'DefaultType',
        get: function get() {
          return DefaultType;
        },
      },
    ]);

    return Dropdown;
  }());
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  EventHandler__default.default.on(
    document,
    EVENT_KEYDOWN_DATA_API,
    SELECTOR_DATA_TOGGLE,
    Dropdown.dataApiKeydownHandler
  );
  EventHandler__default.default.on(
    document,
    EVENT_KEYDOWN_DATA_API,
    SELECTOR_MENU,
    Dropdown.dataApiKeydownHandler
  );
  EventHandler__default.default.on(document, EVENT_CLICK_DATA_API, Dropdown.clearMenus);
  EventHandler__default.default.on(document, EVENT_KEYUP_DATA_API, Dropdown.clearMenus);
  EventHandler__default.default.on(
    document,
    EVENT_CLICK_DATA_API,
    SELECTOR_DATA_TOGGLE,
    function (event) {
      event.preventDefault();
      event.stopPropagation();
      Dropdown.dropdownInterface(this, 'toggle');
    }
  );
  EventHandler__default.default.on(
    document,
    EVENT_CLICK_DATA_API,
    SELECTOR_FORM_CHILD,
    (e) => {
      return e.stopPropagation();
    }
  );
  const $ = getjQuery();
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .dropdown to jQuery only if jQuery is present
   */

  /* istanbul ignore if */

  if ($) {
    const JQUERY_NO_CONFLICT = $.fn[NAME];
    $.fn[NAME] = Dropdown.jQueryInterface;
    $.fn[NAME].Constructor = Dropdown;

    $.fn[NAME].noConflict = function () {
      $.fn[NAME] = JQUERY_NO_CONFLICT;
      return Dropdown.jQueryInterface;
    };
  }

  return Dropdown;
}));
// # sourceMappingURL=dropdown.js.map
