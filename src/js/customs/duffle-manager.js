/**
 * Module:  Duffle Manager
 * @desc    Duffle dropdown manager
 */
const defaults = {
  debug: false,
};

const BTN_DUFFLE_INSTANCE = 'btn-duffle';
const BTN_ADD_TEXT = 'Add to Duffle';
const BTN_ADDED_TEXT = 'Added!';

const BTN_DUFFLE_DROPDOWN_ID = 'duffleDropdown';
const BTN_DUFFLE_DROPDOWN_LIST = `#${BTN_DUFFLE_DROPDOWN_ID} ~ div.dropdown-menu ul`;
const BTN_DUFFLE_BADGE = '.notification-dot';
const DROPDOWN_ITEM_DUFFLE_CLASS = 'duffle-item';
const BTN_REMOVE_ID = 'duffleItemRemove';
const BTN_REMOVE_ALL_ID = 'duffleAllRemove';
const BTN_DOWNLOAD_ID = 'duffleItemDownload';
const BTN_DOWNLOAD_ALL_ID = 'duffleAllDownload';
const DUFFLE_ITEM_ID = 'duffleItem';
const DROPDOWN_ITEM_COUNT_ID = 'duffleTotalQuantity';

const getItemCountText = (count) =>
  `${count > 0 ? count : 'There are no'} item${count === 1 ? '' : 's'} in your duffle`;

const createDropdownItem = (name, filename, href, type, size, id) => {
  const item = document.createElement('LI');
  item.innerHTML = `
    <strong class="d-block fw-bolder mb-3 fs-6">${name}</strong>
    <div class="d-flex flex-row align-items-center w-100">
      <a 
        id="${BTN_DOWNLOAD_ID}-${id}"
        class="link-tak-blue text-decoration-underline me-3 fs-6" 
        href="${href}"
        type="button"
      >
        Download (${type} — ${size})
      </a>
      <button id="${BTN_REMOVE_ID}-${id}" class="link-tak-blue text-decoration-underline fs-6">
        Remove
      </button>
    </div>
  `;
  item.classList.add('dropdown-item', 'mb-0', DROPDOWN_ITEM_DUFFLE_CLASS);
  item.id = `${DUFFLE_ITEM_ID}-${id}`;
  return item;
};

const createRemoveAllBtn = () => {
  const btn = document.createElement('button');
  btn.classList.add('link-tak-blue', 'text-decoration-underline', 'fs-6');
  btn.id = BTN_REMOVE_ALL_ID;
  btn.type = 'button';
  btn.innerHTML = 'Remove All';
  return btn;
};

const createDownloadAllBtn = () => {
  const btn = document.createElement('a');
  btn.classList.add('btn', 'btn-dark', 'rounded-0', 'text-uppercase');
  btn.id = BTN_DOWNLOAD_ALL_ID;
  btn.title = 'Download all resources in your duffle';
  btn.href = '#0';
  btn.innerHTML = 'Download All <i class="ico-download ms-2 fs-5"></i>';
  return btn;
};

// create the footer for the dropdown, which contains the "Remove/Download All" buttons
const createDropdownFooter = (download, remove) => {
  const div = document.createElement('div');
  div.classList.add('d-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'w-100');
  div.appendChild(remove);
  div.appendChild(download);
  const li = document.createElement('li');
  li.classList.add('dropdown-item', 'mb-0');
  li.appendChild(div);
  return li;
};

// eslint-disable-next-line valid-jsdoc
/**
 * Primary Function
 * @param options options Optional properties to override defaults
 * @return
 */
class DuffleManager {
  constructor(options) {
    this._options = { ...defaults, ...options };
    this._addButtons = document.querySelectorAll(`.${BTN_DUFFLE_INSTANCE}`);
    this._dropdown = document.querySelectorAll(`#${BTN_DUFFLE_DROPDOWN_ID}`);
    this._removeAll = document.querySelector(`#${BTN_REMOVE_ALL_ID}`);
    this._downloadAll = document.querySelector(`#${BTN_DOWNLOAD_ALL_ID}`);
    this._list = document.querySelector(BTN_DUFFLE_DROPDOWN_LIST);
    this._badge = document.querySelector(`#${BTN_DUFFLE_DROPDOWN_ID} ${BTN_DUFFLE_BADGE}`);
    this._count = document.querySelector(`#${DROPDOWN_ITEM_COUNT_ID}`);
    this.init();
  }

  init() {
    if (!this._list || !this._badge || !this._count) {
      return;
    }
    if (!this._downloadAll) {
      this._downloadAll = createDownloadAllBtn();
    }
    if (!this._removeAll) {
      this._removeAll = createRemoveAllBtn();
    }

    // for all the "Add to Duffle" buttons on the page
    this._addButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        // eslint-disable-next-line no-unused-expressions
        this._options.debug ? console.log('Adding content to duffle list...') : false;
        e.preventDefault();
        const btn = e.target;
        if (`${btn.dataset.duffleSelected}` !== 'true') {
          this.addToDuffle(btn);
        } else {
          this.removeFromDuffle(btn.dataset.duffleId);
        }

        // @see: https://v5.getbootstrap.com/docs/5.0/components/buttons/#toggle-states
      });
    });

    // upon clicking "Download All", force clicks on each download link in the dropdown
    this._downloadAll.addEventListener('click', (e) => {
      e.preventDefault();
      this._list.querySelectorAll(`.${DROPDOWN_ITEM_DUFFLE_CLASS} a`).forEach((link) => {
        link.click();
      });
    });

    // upon clicking "Remove All"
    this._removeAll.addEventListener('click', () => {
      this.updateCount(0);
      this.clearList();

      // set all the buttons on the page to their unselected state
      this._addButtons.forEach((btn) => {
        btn.setAttribute('data-duffle-selected', false);
        btn.innerHTML = BTN_ADD_TEXT;
      });
    });

    // for all items already in the list at page load
    this._list.querySelectorAll(`.${DROPDOWN_ITEM_DUFFLE_CLASS} button`).forEach((btn) => {
      const id = btn.id.replace(`${BTN_REMOVE_ID}-`, '');
      // get the "Add to Duffle" button for this item
      const mainButton = document.querySelector(`[data-duffle-id="${id}"`);
      if (mainButton) {
        // Update the button text to "Added!"
        mainButton.innerHTML = BTN_ADDED_TEXT;
        // Update the data-duffle-selected to true
        mainButton.setAttribute('data-duffle-selected', true);
      }
      // add listener for "Remove" button inside the menu item
      btn.addEventListener('click', () => {
        this.removeFromDuffle(id);
      });
    });
  }

  // update the count displayed in the badge and dropdown header
  updateCount = (count) => {
    // if a count arg is passed, set that as the new count
    // otherwise, use the number of resources in the dropdown list
    const newCount =
      typeof count === 'number'
        ? count
        : this._list.querySelectorAll(`.${DROPDOWN_ITEM_DUFFLE_CLASS}`).length;
    this._count.innerHTML = getItemCountText(newCount);
    this._badge.setAttribute('data-notification', newCount);
    return newCount;
  };

  clearList = () => {
    // remove all list items except the header that shows the count
    Array.from(this._list.childNodes).forEach((node) => {
      if (!this._count.parentElement.isSameNode(node)) {
        this._list.removeChild(node);
      }
    });
  };

  addToDuffle = (btn) => {
    // Update the button text to "Added!"
    btn.innerHTML = BTN_ADDED_TEXT;
    // Update the data-duffle-selected to true
    btn.setAttribute('data-duffle-selected', true);

    // Take the data-duffle-* values and use them to construct the item in the dropdown
    const filename = btn.dataset.duffleFilename;
    const href = btn.dataset.duffleLink;
    const type = btn.dataset.duffleType;
    const size = btn.dataset.duffleSize;
    const title = btn.dataset.duffleTitle;
    const id = btn.dataset.duffleId;

    const item = createDropdownItem(title, filename, href, type, size, id);

    // get the remove button in the new dropdown item and add the click listener to it
    const remBtn = item.querySelector(`#${BTN_REMOVE_ID}-${id}`);
    if (remBtn) {
      remBtn.addEventListener('click', () => this.removeFromDuffle(id));
    }

    // if the last element in the dropdown is the header, then the dropdown has no items,
    // so add the new item at the end, and then add the footer ("remove/download all" btns)
    if (
      this._list.lastElementChild &&
      this._count.parentElement.isSameNode(this._list.lastElementChild)
    ) {
      this._list.appendChild(item);
      this._list.appendChild(createDropdownFooter(this._downloadAll, this._removeAll));
    } else {
      // otherwise, insert the new item before the footer
      this._list.insertBefore(item, this._list.lastElementChild);
    }

    this.updateCount();

    // @TODO: Insert logic for state/local storage management
  };

  removeFromDuffle = (id) => {
    // get the "Add to Duffle" button and toggle its state
    const btn = document.querySelector(`[data-duffle-id="${id}"`);
    if (btn) {
      btn.setAttribute('data-duffle-selected', false);
      btn.innerHTML = BTN_ADD_TEXT;
    }
    // get the dropdown item and remove it from the list
    const item = this._list.querySelector(`#${DUFFLE_ITEM_ID}-${id}`);
    if (item) {
      this._list.removeChild(item);
    }

    const newCount = this.updateCount();
    // if the new count is 0, clear the list (i.e. remove the footer)
    if (!newCount) {
      this.clearList();
    }

    // @TODO: Insert logic for state/local storage management
  };
}

/**
 * Public API
 */
export default new DuffleManager();
