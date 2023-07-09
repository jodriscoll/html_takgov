/**
 * Module:  Dropdown Search Filters
 * @desc    Controls logic for dropdown filters on search pages
 */
const defaults = {
  debug: false,
};

const DROPDOWN_ITEMS_SELECTOR = '.accordion-filter-body input';
const DROPDOWN_BUTTON_SELECTOR = '.accordion-filter-button';
const DROPDOWN_EMPTY_CLASS = 'text-muted';

const DROPDOWN_0_SELECTED = 'No Items Selected';
const DROPDOWN_1_SELECTED = '1 Item Selected';
const DROPDOWN_N_SELECTED = 'Items Selected';

class DropdownFilter {
  constructor(elem, options) {
    this._options = { ...defaults, ...options };
    this._dropdown = elem;
    this._button = elem.querySelector(DROPDOWN_BUTTON_SELECTOR);
    this._inputs = Array.from(elem.querySelectorAll(DROPDOWN_ITEMS_SELECTOR));
    this.init();
  }

  init() {
    if (!this._button) {
      return;
    }
    this._dropdown.addEventListener('input', (e) => {
      const input = e.target;
      if (this._inputs.includes(input)) {
        this.updateCount();
      }
    });
    this.updateCount();
    this._button.classList.remove(DROPDOWN_EMPTY_CLASS);
  }

  updateCount = () => {
    const count = this._inputs.filter((input) => !!input.checked).length;
    this._button.dataset.count = count;
    if (!count) {
      this._button.innerHTML = DROPDOWN_0_SELECTED;
    } else {
      this._button.innerHTML =
        count === 1 ? DROPDOWN_1_SELECTED : `${count} ${DROPDOWN_N_SELECTED}`;
    }
  };
}

export default DropdownFilter;
