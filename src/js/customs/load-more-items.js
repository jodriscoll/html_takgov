/**
 * Module:  Load More (button)
 * @desc    Button behavior for the "View More" / "Load More" functionality
 */
const defaults = {
  debug: false,
  pageSize: 10,
};

export const ID_LOAD_MORE_BTN = 'loadMoreItems';

// temporary function that duplicates the existing items; returns array of markup text items
// eslint-disable-next-line camelcase
const getNewItems_TEMP = (items, count) => {
  const randomIndex = (list) => Math.min(Math.floor(Math.random() * list.length), list.length - 1);
  const indices = [];
  const newItems = [];
  while (newItems.length < Math.min(count, items.length, 2)) {
    const index = randomIndex(items);
    if (!indices.includes(index)) {
      indices.push(index);
      newItems.push(items[index].outerHTML);
    }
  }
  return newItems;
};
// end temp code

// eslint-disable-next-line valid-jsdoc
/**
 * Primary Function
 * @param options options Optional properties to override defaults
 * @return
 */
class LoadMoreItemsButton {
  constructor(elem, options) {
    this._options = { ...defaults, endpoint: elem.dataset.endpoint, ...options };
    this._loadMoreButton = elem;
    this._resultsList = document.querySelector(elem.dataset.target);
    this.init();
  }

  init() {
    if (!this._loadMoreButton || !this._resultsList || !this._options.endpoint) {
      return;
    }

    this._loadMoreButton.addEventListener('click', () => {
      const newItems = this.getMoreItems(this._resultsList.childElementCount);

      newItems.forEach((item) => {
        this._resultsList.innerHTML += item;
      });
    });
  }

  /**
   * getNewItems
   * @param {number} offset: index to start at when fetching items from the db (i.e. current number of items in the displayed list)
   * @param {number} pageSize: max number of results to fetch per request
   * @return {string[]} list of markup items as text
   * */
  getMoreItems = (offset, pageSize = this._options.pageSize) => {
    // @todo: Insert actual code here to fetch new items from the back-end
    // e.g. api.fetchItems(this._options.endpoint, offset, pageSize)

    // TEMP CODE
    return getNewItems_TEMP(this._resultsList.children, pageSize);
    // END TEMP CODE
  };
}

/**
 * Public API
 */
export default LoadMoreItemsButton;
