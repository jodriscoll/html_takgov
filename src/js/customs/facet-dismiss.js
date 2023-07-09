/**
 * Module:  Facet/Query Dismiss
 * @desc    Dismiss/close support for facets / queries pills
 */

const defaults = {
  debug: false,
};

const SELECTOR_DISMISS = '[data-dismiss="facet"]';

// eslint-disable-next-line valid-jsdoc
/**
 * Primary Function
 * @param options options Optional properties to override defaults
 * @return
 */
class FacetDismiss {
  constructor(elem, options) {
    this._options = { ...defaults, ...options };
    this._facet = elem;
    this._button = this._facet.querySelector(SELECTOR_DISMISS);
    this.init();
  }

  init() {
    if (!this._facet || !this._button) {
      return;
    }
    this._button.addEventListener('click', () => {
      // eslint-disable-next-line no-unused-expressions
      this._options.debug ? console.log('Destroying the facet...') : false;
      this._facet.parentElement.removeChild(this._facet);

      // @TODO: Insert logic for updating search query
    });
  }
}

/**
 * Public API
 */
export default FacetDismiss;
