/**
 * Module:  Password Validator
 * @desc    Validates password fields, then permits password reset
 */
const defaults = {
  debug: false,
};

const CUR_PASS_INPUT = 'userCurrPass';
const NEW_PASS_INPUT = 'userPassNew';
const NEW_PASS_CONFIRM_INPUT = 'userPassNewConfirm';
const REQ_CHAR_LENGTH = 'js-pass-char-length';
const REQ_UPPERCASE = 'js-pass-uppercase';
const REQ_LOWERCASE = 'js-pass-lowercase';
const REQ_NUMBER = 'js-pass-number';
const REQ_SPECIAL = 'js-pass-special-char';
const REQ_MATCHING = 'js-pass-match';
const NEW_PASS_SAVE_BTN = 'js-pass-save-new-pass';

// eslint-disable-next-line valid-jsdoc
/**
 * Primary Function
 * @param options options Optional properties to override defaults
 * @return
 */
class PasswordValidator {
  constructor(options) {
    this._options = { ...defaults, ...options };
    this._curPass = document.querySelector(`#${CUR_PASS_INPUT}`);
    this._newPass = document.querySelector(`#${NEW_PASS_INPUT}`);
    this._newPassConfirm = document.querySelector(`#${NEW_PASS_CONFIRM_INPUT}`);
    this._reqCharLength = document.querySelector(`#${REQ_CHAR_LENGTH}`);
    this._reqOneUppercase = document.querySelector(`#${REQ_UPPERCASE}`);
    this._reqOneLowercase = document.querySelector(`#${REQ_LOWERCASE}`);
    this._reqOneNumber = document.querySelector(`#${REQ_NUMBER}`);
    this._reqSpecialChar = document.querySelector(`#${REQ_SPECIAL}`);
    this._reqMatchingInputs = document.querySelector(`#${REQ_MATCHING}`);
    this._saveNewPassBtn = document.querySelector(`#${NEW_PASS_SAVE_BTN}`);
    this._valid = false;
    this.init();
  }

  init() {
    if (!this._newPass || !this._newPassConfirm || !this._curPass) {
      return;
    }
    this._old_value = this._curPass.value;
    this._value = this._newPass.value;
    this._value_conf = this._newPassConfirm.value;

    this._newPass.addEventListener('input', (e) => {
      // password requirement condition(s)
      this._value = e.target.value;
      this._valid = ![
        this.checkLength(this._value),
        this.checkUppercase(this._value),
        this.checkLowercase(this._value),
        this.checkNumber(this._value),
        this.checkSpecial(this._value),
      ].includes(false);

      this._saveNewPassBtn.disabled = !(this._valid && this.checkMatches() && !!this._old_value);
    });

    this._newPassConfirm.addEventListener('input', (e) => {
      // password requirement condition(s)
      this._value_conf = e.target.value;

      this._saveNewPassBtn.disabled = !(this._valid && this.checkMatches() && !!this._old_value);
    });

    this._curPass.addEventListener('input', (e) => {
      // password requirement condition(s)
      this._old_value = e.target.value;

      this._saveNewPassBtn.disabled = !(this._valid && this.checkMatches() && !!this._old_value);
    });
  }

  /**
   * Condition 1
   * @requires  none
   * @desc      check for longer than 8 characters
   * @param     {string} value: input value
   * @return    {boolean} true if the value passes the check
   */
  checkLength = (value) => {
    if (value.length >= 8) {
      // eslint-disable-next-line no-unused-expressions
      this._options.debug ? console.log('>8 characters: ', true) : false;
      // this._reqCharLength.classList.remove('valid');
      this._reqCharLength.setAttribute('data-pass-reset-status', 'true');
      return true;
    }
    // eslint-disable-next-line no-unused-expressions
    this._options.debug ? console.log('>8 characters: ', false) : false;
    // this._reqCharLength.classList.add('invalid');
    this._reqCharLength.setAttribute('data-pass-reset-status', 'false');
    return false;
  };

  /**
   * Condition 2
   * @requires  none
   * @desc      check for uppercase
   * @param     {string} value: input value
   * @return    {boolean} true if the value passes the check
   */
  checkUppercase = (value) => {
    if (/[A-Z]+/.test(value)) {
      // eslint-disable-next-line no-unused-expressions
      this._options.debug ? console.log('Uppercase: ', true) : false;
      // this._reqOneUppercase.classList.remove('valid');
      this._reqOneUppercase.setAttribute('data-pass-reset-status', 'true');
      return true;
    }
    // eslint-disable-next-line no-unused-expressions
    this._options.debug ? console.log('Uppercase: ', false) : false;
    this._reqOneUppercase.setAttribute('data-pass-reset-status', 'false');
    return false;
  };

  /**
   * Condition 3
   * @requires  none
   * @desc      check for lowercase
   * @param     {string} value: input value
   * @return    {boolean} true if the value passes the check
   */
  checkLowercase = (value) => {
    if (/[a-z]+/.test(value)) {
      // eslint-disable-next-line no-unused-expressions
      this._options.debug ? console.log('Lowercase: ', true) : false;
      this._reqOneLowercase.setAttribute('data-pass-reset-status', 'true');
      return true;
    }
    // eslint-disable-next-line no-unused-expressions
    this._options.debug ? console.log('Lowercase: ', false) : false;
    this._reqOneLowercase.setAttribute('data-pass-reset-status', 'false');
    return false;
  };

  /**
   * Condition 4
   * @requires  none
   * @desc      check for numbers
   * @param     {string} value: input value
   * @return    {boolean} true if the value passes the check
   */
  checkNumber = (value) => {
    if (/[0-9]+/.test(value)) {
      // eslint-disable-next-line no-unused-expressions
      this._options.debug ? console.log('Number(s): ', true) : false;
      this._reqOneNumber.setAttribute('data-pass-reset-status', 'true');
      return true;
    }
    // eslint-disable-next-line no-unused-expressions
    this._options.debug ? console.log('Number(s): ', false) : false;
    this._reqOneNumber.setAttribute('data-pass-reset-status', 'false');
    return false;
  };

  /**
   * Condition 5
   * @requires  none
   * @desc      check for special characters
   * @param     {string} value: input value
   * @return    {boolean} true if the value passes the check
   */
  checkSpecial = (value) => {
    if (/[~`!#@$%^&*+=\-[\]\\';,/{}|":<>?]/.test(value)) {
      // eslint-disable-next-line no-unused-expressions
      this._options.debug ? console.log('Special Characters: ', true) : false;
      this._reqSpecialChar.setAttribute('data-pass-reset-status', 'true');
      return true;
    }
    // eslint-disable-next-line no-unused-expressions
    this._options.debug ? console.log('Special Characters: ', false) : false;
    this._reqSpecialChar.setAttribute('data-pass-reset-status', 'false');
    return false;
  };

  /**
   * Condition 6
   * @requires  none
   * @desc      check for special characters
   * @return    {boolean} true if the value passes the check
   */
  checkMatches = () => {
    if (this._value === this._value_conf) {
      // eslint-disable-next-line no-unused-expressions
      this._options.debug ? console.log('New Passwords Match: ', true) : false;
      this._reqMatchingInputs.setAttribute('data-pass-reset-status', 'true');
      return true;
    }
    // eslint-disable-next-line no-unused-expressions
    this._options.debug ? console.log('New Passwords Match: ', false) : false;
    this._reqMatchingInputs.setAttribute('data-pass-reset-status', 'false');
    return false;
  };
}

/**
 * Public API
 */
export default new PasswordValidator();
