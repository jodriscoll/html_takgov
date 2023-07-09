/**
 * Module:  Form validation used for login
 * @desc    Dynamically validation form fields
 */
const defaults = {
  debug: false,
  disableSubmit: false,
};

export const CLASSNAME_NEEDS_VALIDATION = 'needs-validation';
const CLASSNAME_WAS_VALIDATED = 'was-validated';

// eslint-disable-next-line valid-jsdoc
/**
 * Primary Function
 * @param options options Optional properties to override defaults
 * @return
 */
class FormValidation {
  constructor(elem, options) {
    this._options = { ...defaults, ...options };
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    this._form = elem;
    this._options.disableSubmit =
      'disableSubmit' in elem.dataset
        ? elem.dataset.disableSubmit === 'true'
        : this._options.disableSubmit;
    this._submitBtn = elem.querySelector('button[type="submit"]');
    this._initialData = {};
    this._dirty = {};
    this.init();
  }

  init() {
    // for each form field
    [...this._form.elements].forEach((input) => {
      // if the field has a name, store its initial value for later comparison
      if (input.name) {
        this._initialData[input.name] = input.value;
        this._dirty[input.name] = false;
      }
      if (this._options.disableSubmit) {
        // if there are no named fields, we can't check dirty state,
        // so set submit button state based on form validity
        if (Object.keys(this._initialData).length === 0) {
          this._submitBtn.disabled = !this._form.checkValidity();
        }
      }
    });

    this._form.addEventListener('submit', this.onSubmit, false);
    this._form.addEventListener('input', this.onInput, false);
  }

  onSubmit = (event) => {
    const dirty = this.isDirty();
    // on submit, if the form is valid or isn't dirty, abort submission
    if (!this._form.checkValidity() || !dirty) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (dirty) {
      this._form.classList.add(CLASSNAME_WAS_VALIDATED);
    }
  };

  onInput = (event) => {
    const input = event.target;
    // on field change, check the value against the initial value, set dirty if they're different
    this._dirty[input.name] = input.value !== this._initialData[input.name];
    if (this._options.disableSubmit) {
      // update submit button state
      this._submitBtn.disabled = !(this.isDirty() && this._form.checkValidity());
    }
  };

  isDirty = () => {
    // form is dirty if any field has changed or there are no named fields
    const dirtyFields = Object.values(this._dirty);
    return dirtyFields.length === 0 || dirtyFields.includes(true);
  };
}

/**
 * Public API
 */
export default FormValidation;
