/*!
 * Bootstrap selector-engine.js v5.0.0-alpha2 (https://getbootstrap.com/)
 * Copyright 2011-2020 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? module.exports = factory(require('./polyfill.js'))
    : typeof define === 'function' && define.amd
      ? define(['./polyfill.js'], factory)
      : (global = typeof globalThis !== 'undefined' ? globalThis : global || self,
      global.SelectorEngine = factory(global.Polyfill));
}(this, (polyfill_js) => {

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.0-alpha2): dom/selector-engine.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NODE_TEXT = 3;
  const SelectorEngine = {
    matches: function matches(element, selector) {
      return element.matches(selector);
    },
    find: function find(selector, element) {
      let _ref;

      if (element === void 0) {
        element = document.documentElement;
      }

      return (_ref = []).concat.apply(_ref, polyfill_js.find.call(element, selector));
    },
    findOne: function findOne(selector, element) {
      if (element === void 0) {
        element = document.documentElement;
      }

      return polyfill_js.findOne.call(element, selector);
    },
    children: function children(element, selector) {
      let _ref2;

      const children = (_ref2 = []).concat.apply(_ref2, element.children);

      return children.filter((child) => {
        return child.matches(selector);
      });
    },
    parents: function parents(element, selector) {
      const parents = [];
      let ancestor = element.parentNode;

      while (
        ancestor &&
        ancestor.nodeType === Node.ELEMENT_NODE &&
        ancestor.nodeType !== NODE_TEXT
      ) {
        if (this.matches(ancestor, selector)) {
          parents.push(ancestor);
        }

        ancestor = ancestor.parentNode;
      }

      return parents;
    },
    prev: function prev(element, selector) {
      let previous = element.previousElementSibling;

      while (previous) {
        if (previous.matches(selector)) {
          return [previous];
        }

        previous = previous.previousElementSibling;
      }

      return [];
    },
    next: function next(element, selector) {
      let next = element.nextElementSibling;

      while (next) {
        if (this.matches(next, selector)) {
          return [next];
        }

        next = next.nextElementSibling;
      }

      return [];
    },
  };

  return SelectorEngine;
}));
// # sourceMappingURL=selector-engine.js.map
