/*!
 * Bootstrap tooltip.js v5.0.0-alpha2 (https://getbootstrap.com/)
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
      global.Tooltip = factory(
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
  const MAX_UID = 1000000;
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

  const findShadowRoot = function findShadowRoot(element) {
    if (!document.documentElement.attachShadow) {
      return null;
    } // Can find the shadow root otherwise it'll return the document

    if (typeof element.getRootNode === 'function') {
      const root = element.getRootNode();
      return root instanceof ShadowRoot ? root : null;
    }

    if (element instanceof ShadowRoot) {
      return element;
    } // when we don't find a shadow root

    if (!element.parentNode) {
      return null;
    }

    return findShadowRoot(element.parentNode);
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

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.0-alpha2): util/sanitizer.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  const uriAttrs = [
    'background',
    'cite',
    'href',
    'itemtype',
    'longdesc',
    'poster',
    'src',
    'xlink:href',
  ];
  const ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;
  /**
   * A pattern that recognizes a commonly useful subset of URLs that are safe.
   *
   * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
   */

  const SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file):|[^#&/:?]*(?:[#/?]|$))/gi;
  /**
   * A pattern that matches safe data URLs. Only matches image, video and audio types.
   *
   * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
   */

  const DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i;

  const allowedAttribute = function allowedAttribute(attr, allowedAttributeList) {
    const attrName = attr.nodeName.toLowerCase();

    if (allowedAttributeList.indexOf(attrName) !== -1) {
      if (uriAttrs.indexOf(attrName) !== -1) {
        return Boolean(
          attr.nodeValue.match(SAFE_URL_PATTERN) || attr.nodeValue.match(DATA_URL_PATTERN)
        );
      }

      return true;
    }

    const regExp = allowedAttributeList.filter((attrRegex) => {
      return attrRegex instanceof RegExp;
    }); // Check if a regular expression validates the attribute.

    for (let i = 0, len = regExp.length; i < len; i++) {
      if (attrName.match(regExp[i])) {
        return true;
      }
    }

    return false;
  };

  const DefaultAllowlist = {
    // Global attributes allowed on any supplied element below.
    '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
    a: ['target', 'href', 'title', 'rel'],
    area: [],
    b: [],
    br: [],
    col: [],
    code: [],
    div: [],
    em: [],
    hr: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    i: [],
    img: ['src', 'srcset', 'alt', 'title', 'width', 'height'],
    li: [],
    ol: [],
    p: [],
    pre: [],
    s: [],
    small: [],
    span: [],
    sub: [],
    sup: [],
    strong: [],
    u: [],
    ul: [],
  };
  function sanitizeHtml(unsafeHtml, allowList, sanitizeFn) {
    let _ref;

    if (!unsafeHtml.length) {
      return unsafeHtml;
    }

    if (sanitizeFn && typeof sanitizeFn === 'function') {
      return sanitizeFn(unsafeHtml);
    }

    const domParser = new window.DOMParser();
    const createdDocument = domParser.parseFromString(unsafeHtml, 'text/html');
    const allowlistKeys = Object.keys(allowList);

    const elements = (_ref = []).concat.apply(_ref, createdDocument.body.querySelectorAll('*'));

    const _loop = function _loop(i, len) {
      let _ref2;

      const el = elements[i];
      const elName = el.nodeName.toLowerCase();

      if (allowlistKeys.indexOf(elName) === -1) {
        el.parentNode.removeChild(el);
        return 'continue';
      }

      const attributeList = (_ref2 = []).concat.apply(_ref2, el.attributes);

      const allowedAttributes = [].concat(allowList['*'] || [], allowList[elName] || []);
      attributeList.forEach((attr) => {
        if (!allowedAttribute(attr, allowedAttributes)) {
          el.removeAttribute(attr.nodeName);
        }
      });
    };

    for (let i = 0, len = elements.length; i < len; i++) {
      const _ret = _loop(i);

      if (_ret === 'continue') continue;
    }

    return createdDocument.body.innerHTML;
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

  const NAME = 'tooltip';
  const VERSION = '5.0.0-alpha2';
  const DATA_KEY = 'bs.tooltip';
  const EVENT_KEY = `.${DATA_KEY}`;
  const CLASS_PREFIX = 'bs-tooltip';
  const BSCLS_PREFIX_REGEX = new RegExp(`(^|\\s)${CLASS_PREFIX}\\S+`, 'g');
  const DISALLOWED_ATTRIBUTES = ['sanitize', 'allowList', 'sanitizeFn'];
  const DefaultType = {
    animation: 'boolean',
    template: 'string',
    title: '(string|element|function)',
    trigger: 'string',
    delay: '(number|object)',
    html: 'boolean',
    selector: '(string|boolean)',
    placement: '(string|function)',
    offset: '(number|string|function)',
    container: '(string|element|boolean)',
    fallbackPlacement: '(string|array)',
    boundary: '(string|element)',
    sanitize: 'boolean',
    sanitizeFn: '(null|function)',
    allowList: 'object',
    popperConfig: '(null|object)',
  };
  const AttachmentMap = {
    AUTO: 'auto',
    TOP: 'top',
    RIGHT: 'right',
    BOTTOM: 'bottom',
    LEFT: 'left',
  };
  const Default = {
    animation: true,
    template:
      '<div class="tooltip" role="tooltip">' +
      '<div class="tooltip-arrow"></div>' +
      '<div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    selector: false,
    placement: 'top',
    offset: 0,
    container: false,
    fallbackPlacement: 'flip',
    boundary: 'scrollParent',
    sanitize: true,
    sanitizeFn: null,
    allowList: DefaultAllowlist,
    popperConfig: null,
  };
  const Event$1 = {
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
  const CLASS_NAME_MODAL = 'modal';
  const CLASS_NAME_SHOW = 'show';
  const HOVER_STATE_SHOW = 'show';
  const HOVER_STATE_OUT = 'out';
  const SELECTOR_TOOLTIP_INNER = '.tooltip-inner';
  const TRIGGER_HOVER = 'hover';
  const TRIGGER_FOCUS = 'focus';
  const TRIGGER_CLICK = 'click';
  const TRIGGER_MANUAL = 'manual';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  const Tooltip = /* #__PURE__ */ (function () {
    function Tooltip(element, config) {
      if (typeof Popper__default.default === 'undefined') {
        throw new TypeError('Bootstrap\'s tooltips require Popper.js (https://popper.js.org)');
      } // private

      this._isEnabled = true;
      this._timeout = 0;
      this._hoverState = '';
      this._activeTrigger = {};
      this._popper = null; // Protected

      this.element = element;
      this.config = this._getConfig(config);
      this.tip = null;

      this._setListeners();

      Data__default.default.setData(element, this.constructor.DATA_KEY, this);
    } // Getters

    const _proto = Tooltip.prototype;

    // Public
    _proto.enable = function enable() {
      this._isEnabled = true;
    };

    _proto.disable = function disable() {
      this._isEnabled = false;
    };

    _proto.toggleEnabled = function toggleEnabled() {
      this._isEnabled = !this._isEnabled;
    };

    _proto.toggle = function toggle(event) {
      if (!this._isEnabled) {
        return;
      }

      if (event) {
        const dataKey = this.constructor.DATA_KEY;
        let context = Data__default.default.getData(event.delegateTarget, dataKey);

        if (!context) {
          context = new this.constructor(event.delegateTarget, this._getDelegateConfig());
          Data__default.default.setData(event.delegateTarget, dataKey, context);
        }

        context._activeTrigger.click = !context._activeTrigger.click;

        if (context._isWithActiveTrigger()) {
          context._enter(null, context);
        } else {
          context._leave(null, context);
        }
      } else {
        if (this.getTipElement().classList.contains(CLASS_NAME_SHOW)) {
          this._leave(null, this);

          return;
        }

        this._enter(null, this);
      }
    };

    _proto.dispose = function dispose() {
      clearTimeout(this._timeout);
      Data__default.default.removeData(this.element, this.constructor.DATA_KEY);
      EventHandler__default.default.off(this.element, this.constructor.EVENT_KEY);
      EventHandler__default.default.off(
        this.element.closest(`.${CLASS_NAME_MODAL}`),
        'hide.bs.modal',
        this._hideModalHandler
      );

      if (this.tip) {
        this.tip.parentNode.removeChild(this.tip);
      }

      this._isEnabled = null;
      this._timeout = null;
      this._hoverState = null;
      this._activeTrigger = null;

      if (this._popper) {
        this._popper.destroy();
      }

      this._popper = null;
      this.element = null;
      this.config = null;
      this.tip = null;
    };

    _proto.show = function show() {
      const _this = this;

      if (this.element.style.display === 'none') {
        throw new Error('Please use show on visible elements');
      }

      if (this.isWithContent() && this._isEnabled) {
        const showEvent = EventHandler__default.default.trigger(
          this.element,
          this.constructor.Event.SHOW
        );
        const shadowRoot = findShadowRoot(this.element);
        const isInTheDom =
          shadowRoot === null
            ? this.element.ownerDocument.documentElement.contains(this.element)
            : shadowRoot.contains(this.element);

        if (showEvent.defaultPrevented || !isInTheDom) {
          return;
        }

        const tip = this.getTipElement();
        const tipId = getUID(this.constructor.NAME);
        tip.setAttribute('id', tipId);
        this.element.setAttribute('aria-describedby', tipId);
        this.setContent();

        if (this.config.animation) {
          tip.classList.add(CLASS_NAME_FADE);
        }

        const placement =
          typeof this.config.placement === 'function'
            ? this.config.placement.call(this, tip, this.element)
            : this.config.placement;

        const attachment = this._getAttachment(placement);

        this._addAttachmentClass(attachment);

        const container = this._getContainer();

        Data__default.default.setData(tip, this.constructor.DATA_KEY, this);

        if (!this.element.ownerDocument.documentElement.contains(this.tip)) {
          container.appendChild(tip);
        }

        EventHandler__default.default.trigger(this.element, this.constructor.Event.INSERTED);
        this._popper = new Popper__default.default(
          this.element,
          tip,
          this._getPopperConfig(attachment)
        );
        tip.classList.add(CLASS_NAME_SHOW); // If this is a touch-enabled device we add extra
        // empty mouseover listeners to the body's immediate children;
        // only needed because of broken event delegation on iOS
        // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html

        if ('ontouchstart' in document.documentElement) {
          let _ref;

          (_ref = []).concat.apply(_ref, document.body.children).forEach((element) => {
            EventHandler__default.default.on(element, 'mouseover', noop());
          });
        }

        const complete = function complete() {
          if (_this.config.animation) {
            _this._fixTransition();
          }

          const prevHoverState = _this._hoverState;
          _this._hoverState = null;
          EventHandler__default.default.trigger(_this.element, _this.constructor.Event.SHOWN);

          if (prevHoverState === HOVER_STATE_OUT) {
            _this._leave(null, _this);
          }
        };

        if (this.tip.classList.contains(CLASS_NAME_FADE)) {
          const transitionDuration = getTransitionDurationFromElement(this.tip);
          EventHandler__default.default.one(this.tip, TRANSITION_END, complete);
          emulateTransitionEnd(this.tip, transitionDuration);
        } else {
          complete();
        }
      }
    };

    _proto.hide = function hide() {
      const _this2 = this;

      if (!this._popper) {
        return;
      }

      const tip = this.getTipElement();

      const complete = function complete() {
        if (_this2._hoverState !== HOVER_STATE_SHOW && tip.parentNode) {
          tip.parentNode.removeChild(tip);
        }

        _this2._cleanTipClass();

        _this2.element.removeAttribute('aria-describedby');

        EventHandler__default.default.trigger(_this2.element, _this2.constructor.Event.HIDDEN);

        _this2._popper.destroy();
      };

      const hideEvent = EventHandler__default.default.trigger(
        this.element,
        this.constructor.Event.HIDE
      );

      if (hideEvent.defaultPrevented) {
        return;
      }

      tip.classList.remove(CLASS_NAME_SHOW); // If this is a touch-enabled device we remove the extra
      // empty mouseover listeners we added for iOS support

      if ('ontouchstart' in document.documentElement) {
        let _ref2;

        (_ref2 = []).concat.apply(_ref2, document.body.children).forEach((element) => {
          return EventHandler__default.default.off(element, 'mouseover', noop);
        });
      }

      this._activeTrigger[TRIGGER_CLICK] = false;
      this._activeTrigger[TRIGGER_FOCUS] = false;
      this._activeTrigger[TRIGGER_HOVER] = false;

      if (this.tip.classList.contains(CLASS_NAME_FADE)) {
        const transitionDuration = getTransitionDurationFromElement(tip);
        EventHandler__default.default.one(tip, TRANSITION_END, complete);
        emulateTransitionEnd(tip, transitionDuration);
      } else {
        complete();
      }

      this._hoverState = '';
    };

    _proto.update = function update() {
      if (this._popper !== null) {
        this._popper.scheduleUpdate();
      }
    }; // Protected

    _proto.isWithContent = function isWithContent() {
      return Boolean(this.getTitle());
    };

    _proto.getTipElement = function getTipElement() {
      if (this.tip) {
        return this.tip;
      }

      const element = document.createElement('div');
      element.innerHTML = this.config.template;
      this.tip = element.children[0];
      return this.tip;
    };

    _proto.setContent = function setContent() {
      const tip = this.getTipElement();
      this.setElementContent(
        SelectorEngine__default.default.findOne(SELECTOR_TOOLTIP_INNER, tip),
        this.getTitle()
      );
      tip.classList.remove(CLASS_NAME_FADE, CLASS_NAME_SHOW);
    };

    _proto.setElementContent = function setElementContent(element, content) {
      if (element === null) {
        return;
      }

      if (typeof content === 'object' && isElement(content)) {
        if (content.jquery) {
          content = content[0];
        } // content is a DOM node or a jQuery

        if (this.config.html) {
          if (content.parentNode !== element) {
            element.innerHTML = '';
            element.appendChild(content);
          }
        } else {
          element.textContent = content.textContent;
        }

        return;
      }

      if (this.config.html) {
        if (this.config.sanitize) {
          content = sanitizeHtml(content, this.config.allowList, this.config.sanitizeFn);
        }

        element.innerHTML = content;
      } else {
        element.textContent = content;
      }
    };

    _proto.getTitle = function getTitle() {
      let title = this.element.getAttribute('data-original-title');

      if (!title) {
        title =
          typeof this.config.title === 'function'
            ? this.config.title.call(this.element)
            : this.config.title;
      }

      return title;
    }; // Private

    _proto._getPopperConfig = function _getPopperConfig(attachment) {
      const _this3 = this;

      const defaultBsConfig = {
        placement: attachment,
        modifiers: {
          offset: this._getOffset(),
          flip: {
            behavior: this.config.fallbackPlacement,
          },
          arrow: {
            element: `.${this.constructor.NAME}-arrow`,
          },
          preventOverflow: {
            boundariesElement: this.config.boundary,
          },
        },
        onCreate: function onCreate(data) {
          if (data.originalPlacement !== data.placement) {
            _this3._handlePopperPlacementChange(data);
          }
        },
        onUpdate: function onUpdate(data) {
          return _this3._handlePopperPlacementChange(data);
        },
      };
      return { ...defaultBsConfig, ...this.config.popperConfig };
    };

    _proto._addAttachmentClass = function _addAttachmentClass(attachment) {
      this.getTipElement().classList.add(`${CLASS_PREFIX}-${attachment}`);
    };

    _proto._getOffset = function _getOffset() {
      const _this4 = this;

      const offset = {};

      if (typeof this.config.offset === 'function') {
        offset.fn = function (data) {
          data.offsets = {

            ...data.offsets,
            ..._this4.config.offset(data.offsets, _this4.element) || {}
          };
          return data;
        };
      } else {
        offset.offset = this.config.offset;
      }

      return offset;
    };

    _proto._getContainer = function _getContainer() {
      if (this.config.container === false) {
        return document.body;
      }

      if (isElement(this.config.container)) {
        return this.config.container;
      }

      return SelectorEngine__default.default.findOne(this.config.container);
    };

    _proto._getAttachment = function _getAttachment(placement) {
      return AttachmentMap[placement.toUpperCase()];
    };

    _proto._setListeners = function _setListeners() {
      const _this5 = this;

      const triggers = this.config.trigger.split(' ');
      triggers.forEach((trigger) => {
        if (trigger === 'click') {
          EventHandler__default.default.on(
            _this5.element,
            _this5.constructor.Event.CLICK,
            _this5.config.selector,
            (event) => {
              return _this5.toggle(event);
            }
          );
        } else if (trigger !== TRIGGER_MANUAL) {
          const eventIn =
            trigger === TRIGGER_HOVER
              ? _this5.constructor.Event.MOUSEENTER
              : _this5.constructor.Event.FOCUSIN;
          const eventOut =
            trigger === TRIGGER_HOVER
              ? _this5.constructor.Event.MOUSELEAVE
              : _this5.constructor.Event.FOCUSOUT;
          EventHandler__default.default.on(
            _this5.element,
            eventIn,
            _this5.config.selector,
            (event) => {
              return _this5._enter(event);
            }
          );
          EventHandler__default.default.on(
            _this5.element,
            eventOut,
            _this5.config.selector,
            (event) => {
              return _this5._leave(event);
            }
          );
        }
      });

      this._hideModalHandler = function () {
        if (_this5.element) {
          _this5.hide();
        }
      };

      EventHandler__default.default.on(
        this.element.closest(`.${CLASS_NAME_MODAL}`),
        'hide.bs.modal',
        this._hideModalHandler
      );

      if (this.config.selector) {
        this.config = {
          ...this.config,
          trigger: 'manual',
          selector: '',
        };
      } else {
        this._fixTitle();
      }
    };

    _proto._fixTitle = function _fixTitle() {
      const titleType = typeof this.element.getAttribute('data-original-title');

      if (this.element.getAttribute('title') || titleType !== 'string') {
        this.element.setAttribute('data-original-title', this.element.getAttribute('title') || '');
        this.element.setAttribute('title', '');
      }
    };

    _proto._enter = function _enter(event, context) {
      const dataKey = this.constructor.DATA_KEY;
      context = context || Data__default.default.getData(event.delegateTarget, dataKey);

      if (!context) {
        context = new this.constructor(event.delegateTarget, this._getDelegateConfig());
        Data__default.default.setData(event.delegateTarget, dataKey, context);
      }

      if (event) {
        context._activeTrigger[event.type === 'focusin' ? TRIGGER_FOCUS : TRIGGER_HOVER] = true;
      }

      if (
        context.getTipElement().classList.contains(CLASS_NAME_SHOW) ||
        context._hoverState === HOVER_STATE_SHOW
      ) {
        context._hoverState = HOVER_STATE_SHOW;
        return;
      }

      clearTimeout(context._timeout);
      context._hoverState = HOVER_STATE_SHOW;

      if (!context.config.delay || !context.config.delay.show) {
        context.show();
        return;
      }

      context._timeout = setTimeout(() => {
        if (context._hoverState === HOVER_STATE_SHOW) {
          context.show();
        }
      }, context.config.delay.show);
    };

    _proto._leave = function _leave(event, context) {
      const dataKey = this.constructor.DATA_KEY;
      context = context || Data__default.default.getData(event.delegateTarget, dataKey);

      if (!context) {
        context = new this.constructor(event.delegateTarget, this._getDelegateConfig());
        Data__default.default.setData(event.delegateTarget, dataKey, context);
      }

      if (event) {
        context._activeTrigger[event.type === 'focusout' ? TRIGGER_FOCUS : TRIGGER_HOVER] = false;
      }

      if (context._isWithActiveTrigger()) {
        return;
      }

      clearTimeout(context._timeout);
      context._hoverState = HOVER_STATE_OUT;

      if (!context.config.delay || !context.config.delay.hide) {
        context.hide();
        return;
      }

      context._timeout = setTimeout(() => {
        if (context._hoverState === HOVER_STATE_OUT) {
          context.hide();
        }
      }, context.config.delay.hide);
    };

    _proto._isWithActiveTrigger = function _isWithActiveTrigger() {
      for (const trigger in this._activeTrigger) {
        if (this._activeTrigger[trigger]) {
          return true;
        }
      }

      return false;
    };

    _proto._getConfig = function _getConfig(config) {
      const dataAttributes = Manipulator__default.default.getDataAttributes(this.element);
      Object.keys(dataAttributes).forEach((dataAttr) => {
        if (DISALLOWED_ATTRIBUTES.indexOf(dataAttr) !== -1) {
          delete dataAttributes[dataAttr];
        }
      });

      if (config && typeof config.container === 'object' && config.container.jquery) {
        config.container = config.container[0];
      }

      config = {

        ...this.constructor.Default,
        ...dataAttributes,
        ...typeof config === 'object' && config ? config : {}
      };

      if (typeof config.delay === 'number') {
        config.delay = {
          show: config.delay,
          hide: config.delay,
        };
      }

      if (typeof config.title === 'number') {
        config.title = config.title.toString();
      }

      if (typeof config.content === 'number') {
        config.content = config.content.toString();
      }

      typeCheckConfig(NAME, config, this.constructor.DefaultType);

      if (config.sanitize) {
        config.template = sanitizeHtml(config.template, config.allowList, config.sanitizeFn);
      }

      return config;
    };

    _proto._getDelegateConfig = function _getDelegateConfig() {
      const config = {};

      if (this.config) {
        for (const key in this.config) {
          if (this.constructor.Default[key] !== this.config[key]) {
            config[key] = this.config[key];
          }
        }
      }

      return config;
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
    };

    _proto._handlePopperPlacementChange = function _handlePopperPlacementChange(popperData) {
      this.tip = popperData.instance.popper;

      this._cleanTipClass();

      this._addAttachmentClass(this._getAttachment(popperData.placement));
    };

    _proto._fixTransition = function _fixTransition() {
      const tip = this.getTipElement();
      const initConfigAnimation = this.config.animation;

      if (tip.getAttribute('x-placement') !== null) {
        return;
      }

      tip.classList.remove(CLASS_NAME_FADE);
      this.config.animation = false;
      this.hide();
      this.show();
      this.config.animation = initConfigAnimation;
    }; // Static

    Tooltip.jQueryInterface = function jQueryInterface(config) {
      return this.each(function () {
        let data = Data__default.default.getData(this, DATA_KEY);

        const _config = typeof config === 'object' && config;

        if (!data && /dispose|hide/.test(config)) {
          return;
        }

        if (!data) {
          data = new Tooltip(this, _config);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }

          data[config]();
        }
      });
    };

    Tooltip.getInstance = function getInstance(element) {
      return Data__default.default.getData(element, DATA_KEY);
    };

    _createClass(Tooltip, null, [
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
          return Event$1;
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

    return Tooltip;
  }());

  const $ = getjQuery();
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .tooltip to jQuery only if jQuery is present
   */

  /* istanbul ignore if */

  if ($) {
    const JQUERY_NO_CONFLICT = $.fn[NAME];
    $.fn[NAME] = Tooltip.jQueryInterface;
    $.fn[NAME].Constructor = Tooltip;

    $.fn[NAME].noConflict = function () {
      $.fn[NAME] = JQUERY_NO_CONFLICT;
      return Tooltip.jQueryInterface;
    };
  }

  return Tooltip;
}));
// # sourceMappingURL=tooltip.js.map
