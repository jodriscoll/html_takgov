/**
 * Module:  Product Version Select
 * @desc    Controls logic for syncing dropdowns on product detail page
 */
const defaults = {
  debug: false,
};

const ID_DROPDOWN_CONTAINER = 'productVersionSync';
const ID_SELECT_INPUT = 'productVersionSelect';
const SELECTOR_DROPDOWN_ITEM = `#${ID_DROPDOWN_CONTAINER} a.dropdown-item`;
const SELECTOR_DROPDOWN_BUTTON = `#${ID_DROPDOWN_CONTAINER} button[data-toggle="dropdown"]`;

class ProductVersionSelect {
  constructor(options) {
    this._options = { ...defaults, ...options };
    this._dropdown = document.getElementById(ID_DROPDOWN_CONTAINER);
    this._input = document.getElementById(ID_SELECT_INPUT);
    this._items = document.querySelectorAll(SELECTOR_DROPDOWN_ITEM);
    this._button = document.querySelector(SELECTOR_DROPDOWN_BUTTON);
    this.init();
  }

  init() {
    if (!this._dropdown || !this._input || !this._button) {
      return;
    }

    this._items.forEach((item) => {
      item.addEventListener('click', (e) => {
        const ver = e.target.dataset.value;
        const label = e.target.innerText;
        this._input.value = ver;
        this._button.innerText = label;
      });
    });

    this._input.addEventListener('input', (e) => {
      this._button.innerText = e.target.selectedOptions[0].innerText;
    });

    this._button.innerText = this._input.selectedOptions[0].innerText;
  }
}

export default new ProductVersionSelect();
