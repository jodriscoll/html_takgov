/**
 * Module:  Multi layered forms for create account
 * @desc    Dynamically validation form fields
 */
import { removeClasses, findParent } from './util';

const defaults = {
  debug: false,
  initialPanel: 0,
};

const CLASSNAME_STEP_COMPLETED = 'viewed-step';
const CLASSNAME_PANEL_VISIBLE = 'visible-panel';
const CLASSNAME_PANEL = 'multisteps-form__panel';
const CLASSNAME_PANEL_INNER = 'multisteps-form__panel__inner';
const CLASSNAME_BUTTON = 'multisteps-form__progress-btn';
const CLASSNAME_BUTTON_PREV = 'js-btn-prev';
const CLASSNAME_BUTTON_NEXT = 'js-btn-next';
const CLASSNAME_FORM = 'multisteps-form__form';
const CLASSNAME_PROGRESS_BAR = 'multisteps-form__stepper';

// eslint-disable-next-line valid-jsdoc
/**
 * Primary Function
 * @param options options Optional properties to override defaults
 * @return
 */
class MultiLayeredForms {
  constructor(options) {
    this._options = { ...defaults, ...options };
    this._elements = {
      stepsBtns: document.querySelectorAll(`.${CLASSNAME_BUTTON}`),
      stepsBar: document.querySelector(`.${CLASSNAME_PROGRESS_BAR}`),
      stepsForm: document.querySelector(`.${CLASSNAME_FORM}`),
      stepFormPanels: document.querySelectorAll(`.${CLASSNAME_PANEL}`),
    };
    this._inner_form = document.createElement('form');
    this._curPanel = -1;
    this.init();
  }

  init() {
    if (!this._elements.stepsBar || !this._elements.stepsForm) {
      return;
    }

    this.goToStep(this._elements.stepFormPanels, this._elements.stepsBtns, 0);

    // steps bar buttons
    this._elements.stepsBar.addEventListener('click', (event) => {
      // check if click target is a step button
      const eventTarget = event.target;

      if (!eventTarget.classList.contains(CLASSNAME_BUTTON)) {
        return;
      }

      // get active button step number
      const activeStep = this.getActiveStep(eventTarget);
      this.goToStep(this._elements.stepFormPanels, this._elements.stepsBtns, activeStep);
    });

    // preview/next buttons
    this._elements.stepsForm.addEventListener('click', (e) => {
      const eventTarget = e.target;

      if (
        !(
          eventTarget.classList.contains(CLASSNAME_BUTTON_PREV) ||
          eventTarget.classList.contains(CLASSNAME_BUTTON_NEXT)
        )
      ) {
        return;
      }

      const activePanel = findParent(eventTarget, CLASSNAME_PANEL);

      let activePanelNum = Array.from(this._elements.stepFormPanels).indexOf(activePanel);

      // if the previous button, go backwards
      if (eventTarget.classList.contains(CLASSNAME_BUTTON_PREV)) {
        activePanelNum--;
      } else {
        // otherwise, proceed forwards
        activePanelNum++;
      }
      this.goToStep(this._elements.stepFormPanels, this._elements.stepsBtns, activePanelNum);
    });

    // setting proper height, on load
    window.addEventListener('load', this.setFormHeight, false);

    // setting proper height, on resize
    window.addEventListener('resize', this.setFormHeight, false);

    // updated disabled state for Next button on input change
    this._elements.stepsForm.addEventListener('input', this.updateNextButton);
  }

  // get active button step number
  getActiveStep = (elem) => {
    return Array.from(this._elements.stepsBtns).indexOf(elem);
  };

  // get active panel
  getActivePanel = () => {
    let activePanel;

    this._elements.stepFormPanels.forEach((elem) => {
      if (elem.classList.contains(CLASSNAME_PANEL_VISIBLE)) {
        activePanel = elem;
      }
    });

    return activePanel;
  };

  // get inner content of form panel
  getInnerFormContent = (panel) => panel.querySelector(`.${CLASSNAME_PANEL_INNER}`);

  addInnerForm = (panel) => {
    // get inner content of form panel
    const content = this.getInnerFormContent(panel);
    if (!content || !content.parentElement || this._inner_form.parentElement) {
      return;
    }
    // wrap content in <form> element so we can validate it
    content.parentElement.replaceChild(this._inner_form, content);
    this._inner_form.appendChild(content);
  };

  removeInnerForm = () => {
    if (!this._inner_form.parentElement) {
      return;
    }
    // unwrap the panel content from the <form> element
    this._inner_form.parentElement.replaceChild(this._inner_form.firstChild, this._inner_form);
  };

  // updated disabled state for Next button based on form validity
  updateNextButton = () => {
    if (this._inner_form && this._inner_form.parentElement) {
      const button = this._inner_form.querySelector(`.${CLASSNAME_BUTTON_NEXT}`);
      if (button) {
        button.disabled = !this._inner_form.checkValidity();
      }
    }
  };

  // set form height equal to current panel height
  formHeight = (activePanel) => {
    const activePanelHeight = activePanel.offsetHeight;
    this._elements.stepsForm.style.height = `${activePanelHeight}px`;
  };

  setFormHeight = () => {
    const activePanel = this.getActivePanel();
    if (activePanel) {
      this.formHeight(activePanel);
    }
  };

  // set all steps before clicked (and clicked too) to active
  setActiveStep = (buttons, activeStepNum) => {
    removeClasses(buttons, CLASSNAME_STEP_COMPLETED);

    buttons.forEach((elem, index) => {
      if (index <= activeStepNum) {
        elem.classList.add(CLASSNAME_STEP_COMPLETED);
        elem.disabled = false;
      } else if (index > activeStepNum) {
        elem.classList.remove(CLASSNAME_PANEL_VISIBLE);
      }
    });
  };

  // open active panel (and close inactive)
  setActivePanel = (panels, activePanelNum) => {
    // remove active class from all the panels
    removeClasses(panels, CLASSNAME_PANEL_VISIBLE);
    this.removeInnerForm();

    // show active panel
    panels.forEach((elem, index) => {
      if (index === activePanelNum) {
        this.addInnerForm(elem);
        elem.classList.add(CLASSNAME_PANEL_VISIBLE);
        this.setFormHeight(elem);
      }
    });
  };

  goToStep = (panels, buttons, newStep) => {
    if (newStep === this._curPanel) {
      return;
    }
    if (newStep < this._curPanel || this._inner_form.checkValidity()) {
      this.setActiveStep(buttons, newStep);
      this.setActivePanel(panels, newStep);
      this._curPanel = newStep;
      this.updateNextButton();
      if (newStep === panels.length - 1) {
        this.finishForm();
      }
    } else {
      this._inner_form.reportValidity();
    }
  };

  finishForm = () => {
    this.removeInnerForm();
    this._elements.stepsBtns.forEach((elem) => {
      elem.disabled = true;
    });

    // @TODO: Insert logic for form submission here.
  };
}

/**
 * Public API
 */
export default new MultiLayeredForms();
