/**
 * Module:  Password Exposer
 * @desc    Clicking a button to reveal the password field text
 */
const defaults = {
  debug: false,
};

const EXPOSER_INSTANCE = 'js-reveal-password';

// eslint-disable-next-line valid-jsdoc
/**
 * Primary Function
 * @param options options Optional properties to override defaults
 * @return
 */
class PasswordExposer {
  constructor(options) {
    this._options = { ...defaults, ...options };
    this._exposerInstances = document.querySelectorAll(`.${EXPOSER_INSTANCE}`);
    this.init();
  }

  init() {
    this._exposerInstances.forEach((button) => {
      const target = document.querySelector(button.dataset.target);
      if (!target) {
        return;
      }
      target.classList.add('js-reveal-password-input');
      button.addEventListener('click', (event) => {
        event.preventDefault();
        if (target.getAttribute('type') === 'password') {
          target.setAttribute('type', 'text');
          event.target.classList.replace('ico-eye-off', 'ico-eye');
        } else {
          target.setAttribute('type', 'password');
          event.target.classList.replace('ico-eye', 'ico-eye-off');
        }
      });
    });
  }
}

/**
 * Public API
 */
export default new PasswordExposer();
