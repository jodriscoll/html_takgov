/*!
 * Bootstrap polyfill.js v5.0.0-alpha2 (https://getbootstrap.com/)
 * Copyright 2011-2020 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? factory(exports)
    : typeof define === 'function' && define.amd
      ? define(['exports'], factory)
      : (global = typeof globalThis !== 'undefined' ? globalThis : global || self,
      factory(global.Polyfill = {}));
}(this, (exports) => {

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.0-alpha2): util/index.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  const MAX_UID = 1000000;
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

  /* istanbul ignore file */
  exports.find = Element.prototype.querySelectorAll;
  exports.findOne = Element.prototype.querySelector; // MSEdge resets defaultPrevented flag upon dispatchEvent call if at least one listener is attached

  const defaultPreventedPreservedOnDispatch = (function () {
    const e = new CustomEvent('Bootstrap', {
      cancelable: true,
    });
    const element = document.createElement('div');
    element.addEventListener('Bootstrap', () => {
      return null;
    });
    e.preventDefault();
    element.dispatchEvent(e);
    return e.defaultPrevented;
  }());

  const scopeSelectorRegex = /:scope\b/;

  const supportScopeQuery = (function () {
    const element = document.createElement('div');

    try {
      element.querySelectorAll(':scope *');
    } catch (_) {
      return false;
    }

    return true;
  }());

  if (!supportScopeQuery) {
    exports.find = function find(selector) {
      if (!scopeSelectorRegex.test(selector)) {
        return this.querySelectorAll(selector);
      }

      const hasId = Boolean(this.id);

      if (!hasId) {
        this.id = getUID('scope');
      }

      let nodeList = null;

      try {
        selector = selector.replace(scopeSelectorRegex, `#${this.id}`);
        nodeList = this.querySelectorAll(selector);
      } finally {
        if (!hasId) {
          this.removeAttribute('id');
        }
      }

      return nodeList;
    };

    exports.findOne = function findOne(selector) {
      if (!scopeSelectorRegex.test(selector)) {
        return this.querySelector(selector);
      }

      const matches = exports.find.call(this, selector);

      if (typeof matches[0] !== 'undefined') {
        return matches[0];
      }

      return null;
    };
  }

  exports.defaultPreventedPreservedOnDispatch = defaultPreventedPreservedOnDispatch;

  Object.defineProperty(exports, '__esModule', { value: true });
}));
// # sourceMappingURL=polyfill.js.map
