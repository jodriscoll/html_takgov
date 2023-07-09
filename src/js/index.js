import Alert from './bootstrap/src/alert';
import Button from './bootstrap/src/button';
import Carousel from './bootstrap/src/carousel';
import Collapse from './bootstrap/src/collapse';
import Modal from './bootstrap/src/modal';
import Popover from './bootstrap/src/popover';
import ScrollSpy from './bootstrap/src/scrollspy';
import Tab from './bootstrap/src/tab';
import Tooltip from './bootstrap/src/tooltip';
// import Toast from './bootstrap/src/toast';
import Dropdown from './bootstrap/src/dropdown';

// customizations
import DropdownFilter from './customs/dropdown-filter';
import FacetDismiss from './customs/facet-dismiss';
import FormValidation, { CLASSNAME_NEEDS_VALIDATION } from './customs/form-validation';
import MultiLayeredForms from './customs/multi-layered-forms';
import FileUpload from './customs/file-upload';
import PasswordValidator from './customs/password-validator';
import BreadcrumbExpander from './customs/breadcrumb-expander';
import PasswordExposer from './customs/password-exposer';
import DuffleManager from './customs/duffle-manager';
import LoadMoreItemsButton, { ID_LOAD_MORE_BTN } from './customs/load-more-items';
import MarqueeVideoAutoplay from './customs/marquee-video-autoplay';
import VideoPlaylist from './customs/video-playlist';
import EventRegisterForm from './customs/event-register-form';
import VoteButton, { CLASS_VOTE_CONTAINER } from './customs/vote-button';
import ProductVersionSelect from './customs/product-version-select';

// auto init bootstrap features
[...document.querySelectorAll('[data-toggle="tooltip"]')].map((tooltip) => new Tooltip(tooltip));
[...document.querySelectorAll('[data-toggle="popover"]')].map((popover) => new Popover(popover));
// [...document.querySelectorAll('.toast')].map((toast) => new Toast(toast));

// custom initializers
[...document.querySelectorAll('.accordion-select .accordion-item')].map(
  (dropdown) => new DropdownFilter(dropdown)
);
[...document.querySelectorAll('.facet[data-dismissible="true"]')].map(
  (facet) => new FacetDismiss(facet)
);

[...document.querySelectorAll(`#${ID_LOAD_MORE_BTN}`)].map((btn) => new LoadMoreItemsButton(btn));

[...document.querySelectorAll(`.${CLASS_VOTE_CONTAINER}`)].map((btn) => new VoteButton(btn));
[...document.querySelectorAll(`.${CLASSNAME_NEEDS_VALIDATION}`)].map(
  (form) => new FormValidation(form)
);

export {
  Alert,
  Button,
  Carousel,
  Collapse,
  Modal,
  Popover,
  ScrollSpy,
  Tab,
  Tooltip,
  Dropdown,
  DropdownFilter,
  FormValidation,
  MultiLayeredForms,
  FileUpload,
  PasswordValidator,
  BreadcrumbExpander,
  PasswordExposer,
  FacetDismiss,
  DuffleManager,
  LoadMoreItemsButton,
  MarqueeVideoAutoplay,
  VideoPlaylist,
  EventRegisterForm,
  VoteButton,
  ProductVersionSelect,
};
