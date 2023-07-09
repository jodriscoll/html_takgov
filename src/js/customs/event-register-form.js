/**
 * Module:  Event register form
 * @desc    Manages logic for opening register form modal on event detail page
 */

const defaults = {
  debug: false,
};

const ID_REGISTER_FORM = 'eventDetailRegisterForm';
const ID_REGISTER_FORM_BUTTON = 'eventDetailRegisterButton';
const CLASS_REGISTER_FORM_CLOSE_BUTTON = 'btn-close';

class EventRegisterForm {
  constructor(options) {
    this.options = { ...defaults, ...options };
    this._button = document.getElementById(ID_REGISTER_FORM_BUTTON);
    this._form = document.getElementById(ID_REGISTER_FORM);
    if (!this._form) {
      return;
    }
    this._close = this._form.querySelector(`.${CLASS_REGISTER_FORM_CLOSE_BUTTON}`);
    this.init();
  }

  init() {
    if (!this._button || !this._form || !this._close) {
      return;
    }

    this._button.addEventListener('click', this.openForm);
    this._close.addEventListener('click', this.closeForm);
  }

  openForm = () => {
    this._form.classList.add('active');
    this._form.classList.add('show');
  };

  closeForm = () => {
    this._form.classList.remove('active');
    this._form.classList.remove('show');
  };
}

/**
 * Public API
 */
export default new EventRegisterForm();
