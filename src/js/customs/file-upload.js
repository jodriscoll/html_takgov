/**
 * Module:  File Upload Customization(s)
 * @desc    Allows for a custom experience using file uploads
 */
const defaults = {
  debug: false,
};

const FILE_UPLOAD_FORM = 'js-file-upload-form';
const FILE_UPLOAD_INPUT = 'js-file-upload-input';
const FILE_UPLOAD_BUTTON = 'js-file-upload-button';
const FILE_UPLOAD_FILENAME = 'js-file-upload-return';
const FILE_UPLOAD_REMOVE = 'js-file-upload-remove';
const FILE_UPLOAD_SUBMIT = 'js-file-upload-submit';

// eslint-disable-next-line valid-jsdoc
/**
 * Primary Function
 * @param options options Optional properties to override defaults
 * @return
 */
class FileUpload {
  constructor(options) {
    this._options = { ...defaults, ...options };
    this._input = document.querySelector(`.${FILE_UPLOAD_INPUT}`);
    this._button = document.querySelector(`.${FILE_UPLOAD_BUTTON}`);
    this._remove = document.querySelector(`.${FILE_UPLOAD_REMOVE}`);
    this._text = document.querySelector(`.${FILE_UPLOAD_FILENAME}`);
    this._form_wrapper = document.querySelector(`.${FILE_UPLOAD_FORM}`);
    this._form = document.createElement('form');
    this._submit =
      document.querySelector(`.${FILE_UPLOAD_SUBMIT}`) || document.createElement('button');
    this.init();
  }

  init() {
    if (!this._button) {
      return;
    }
    // custom button to trigger the type="file"
    this._button.addEventListener('click', () => {
      // initiate the file upload field (that is hidden)
      this._input.click();
      return false;
    });
    // when a user interacts with a mouse
    this._button.addEventListener('keydown', (event) => {
      // 13 is for return or enter, and 32 is space bar
      if (event.keyCode === 13 || event.keyCode === 32) {
        // set focus to the file input
        this._input.focus();
      }
    });
    // (hidden) type="file" waiting for the trigger
    this._input.addEventListener('change', () => {
      // upload a text field with the filename of the uploaded file
      if (this._input.value) {
        this._text.innerHTML = this._input.value || '&nbsp;';
        this._submit.classList.remove('visually-hidden');
        this._submit.disabled = false;
      } else {
        this._submit.classList.add('visually-hidden');
        this._submit.disabled = true;
      }
      if (this._input.value || this._text.innerHTML) {
        this._remove.classList.remove('visually-hidden');
        this._remove.classList.remove('disabled');
      }
    });
    // clear input and text on click "Remove"
    this._remove.addEventListener('click', () => {
      this._remove.classList.add('visually-hidden');
      this._remove.classList.add('disabled');
      this._text.innerHTML = '&nbsp;';
      // wrap input in form so we can reset it
      this._form_wrapper.removeChild(this._input);
      this._form_wrapper.appendChild(this._form);
      this._form.appendChild(this._input);
      this._form.reset();
      this._form.removeChild(this._input);
      this._form_wrapper.removeChild(this._form);
      this._form_wrapper.appendChild(this._input);

      this._submit.classList.add('visually-hidden');
      this._submit.disabled = true;
    });
  }
}

/**
 * Public API
 */
export default new FileUpload();
