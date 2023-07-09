/*!
 * Bootstrap popover.js v5.0.0-alpha2 (https://getbootstrap.com/)
 * Copyright 2011-2020 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? module.exports = factory(
      require('./dom/data.js'),
      require('./dom/selector-engine.js'),
      require('./tooltip.js')
    )
    : typeof define === 'function' && define.amd
      ? define(['./dom/data.js', './dom/selector-engine.js', './tooltip.js'], factory)
      : (global = typeof globalThis !== 'undefined' ? globalThis : global || self,
      global.Popover = factory(global.Data, global.SelectorEngine, global.Tooltip));
}(this, (Data, SelectorEngine, Tooltip) => {

  function _interopDefaultLegacy(e) {
    return e && typeof e === 'object' && 'default' in e ? e : { default: e };
  }

  const Data__default = /* #__PURE__ */ _interopDefaultLegacy(Data);
  const SelectorEngine__default = /* #__PURE__ */ _interopDefaultLegacy(SelectorEngine);
  const Tooltip__default = /* #__PURE__ */ _interopDefaultLegacy(Tooltip);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.0-alpha2): util/index.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

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

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

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
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'popover';
  const VERSION = '5.0.0-alpha2';
  const DATA_KEY = 'bs.popover';
  const EVENT_KEY = `.${DATA_KEY}`;
  const CLASS_PREFIX = 'bs-popover';
  const BSCLS_PREFIX_REGEX = new RegExp(`(^|\\s)${CLASS_PREFIX}\\S+`, 'g');

  const Default = {
    ...Tooltip__default.default.Default,
    placement: 'right',
    trigger: 'click',
    content: '',
    template:
      '<div class="popover" role="tooltip">' +
      '<div class="popover-arrow"></div>' +
      '<h3 class="popover-header"></h3>' +
      '<div class="popover-body"></div></div>',
  };

  const DefaultType = { ...Tooltip__default.default.DefaultType, content: '(string|element|function)', };

  const Event = {
    HIDE: `hide${EVENT_KEY}`,
    HIDDEN: `hidden${EVENT_KEY}`,
    SHOW: `show${EVENT_KEY}`,
    SHOWN: `shown${EVENT_KEY}`,
    INSERTED: `inserted${EVENT_KEY}`,
    CLICK: `click${EVENT_KEY}`,
    FOCUSIN: `focusin${EVENT_KEY}`,
    FOCUSOUT: `focusout${EVENT_KEY}`,
    MOUSEENTER: `mouseenter${EVENT_KEY}`,
    MOUSELEAVE: `mouseleave${EVENT_KEY}`,
  };
  const CLASS_NAME_FADE = 'fade';
  const CLASS_NAME_SHOW = 'show';
  const SELECTOR_TITLE = '.popover-header';
  const SELECTOR_CONTENT = '.popover-body';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  const Popover = /* #__PURE__ */ (function (_Tooltip) {
    _inheritsLoose(Popover, _Tooltip);

    function Popover() {
      return _Tooltip.apply(this, arguments) || this;
    }

    const _proto = Popover.prototype;

    // Overrides
    _proto.isWithContent = function isWithContent() {
      return this.getTitle() || this._getContent();
    };

    _proto.setContent = function setContent() {
      const tip = this.getTipElement(); // we use append for html objects to maintain js events

      this.setElementContent(
        SelectorEngine__default.default.findOne(SELECTOR_TITLE, tip),
        this.getTitle()
      );

      let content = this._getContent();

      if (typeof content === 'function') {
        content = content.call(this.element);
      }

      this.setElementContent(
        SelectorEngine__default.default.findOne(SELECTOR_CONTENT, tip),
        content
      );
      tip.classList.remove(CLASS_NAME_FADE, CLASS_NAME_SHOW);
    }; // Private

    _proto._addAttachmentClass = function _addAttachmentClass(attachment) {
      this.getTipElement().classList.add(`${CLASS_PREFIX}-${attachment}`);
    };

    _proto._getContent = function _getContent() {
      return this.element.getAttribute('data-content') || this.config.content;
    };

    _proto._cleanTipClass = function _cleanTipClass() {
      const tip = this.getTipElement();
      const tabClass = tip.getAttribute('class').match(BSCLS_PREFIX_REGEX);

      if (tabClass !== null && tabClass.length > 0) {
        tabClass
          .map((token) => {
            return token.trim();
          })
          .forEach((tClass) => {
            return tip.classList.remove(tClass);
          });
      }
    }; // Static

    Popover.jQueryInterface = function jQueryInterface(config) {
      return this.each(function () {
        let data = Data__default.default.getData(this, DATA_KEY);

        const _config = typeof config === 'object' ? config : null;

        if (!data && /dispose|hide/.test(config)) {
          return;
        }

        if (!data) {
          data = new Popover(this, _config);
          Data__default.default.setData(this, DATA_KEY, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }

          data[config]();
        }
      });
    };

    Popover.getInstance = function getInstance(element) {
      return Data__default.default.getData(element, DATA_KEY);
    };

    _createClass(Popover, null, [
      {
        key: 'VERSION',
        // Getters
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
        key: 'NAME',
        get: function get() {
          return NAME;
        },
      },
      {
        key: 'DATA_KEY',
        get: function get() {
          return DATA_KEY;
        },
      },
      {
        key: 'Event',
        get: function get() {
          return Event;
        },
      },
      {
        key: 'EVENT_KEY',
        get: function get() {
          return EVENT_KEY;
        },
      },
      {
        key: 'DefaultType',
        get: function get() {
          return DefaultType;
        },
      },
    ]);

    return Popover;
  }(Tooltip__default.default));

  const $ = getjQuery();
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  /* istanbul ignore if */

  if ($) {
    const JQUERY_NO_CONFLICT = $.fn[NAME];
    $.fn[NAME] = Popover.jQueryInterface;
    $.fn[NAME].Constructor = Popover;

    $.fn[NAME].noConflict = function () {
      $.fn[NAME] = JQUERY_NO_CONFLICT;
      return Popover.jQueryInterface;
    };
  }

  return Popover;
}));
// # sourceMappingURL=popover.js.map
