/**
 * Module:  Breadcrumbs Expander
 * @desc    Mobile '...' breadcrumb expander
 */
const defaults = {
  debug: false,
};

const BREADCRUMB_INSTANCE = 'breadcrumb-expand';

// eslint-disable-next-line valid-jsdoc
/**
 * Primary Function
 * @param options options Optional properties to override defaults
 * @return
 */
class BreadcrumbExpander {
  constructor(options) {
    this._options = { ...defaults, ...options };
    this._breadcrumbExpand = document.querySelectorAll(`.${BREADCRUMB_INSTANCE}`);
    this._breadcrumbCollapsed = document.querySelectorAll('.breadcrumb-item.d-none');
    this.init();
  }

  init() {
    this._breadcrumbExpand.forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        this._breadcrumbCollapsed.forEach((breadcrumb) => {
          button.remove();
          breadcrumb.classList.remove('d-none');
        });
      });
    });
  }
}

/**
 * Public API
 */
export default new BreadcrumbExpander();
