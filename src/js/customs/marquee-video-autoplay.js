/**
 * Module:  Video Auto-player
 * @desc    Auto plays a target video, when ready, with a nice subtle fade from the image to the video
 */
const defaults = {
  debug: false,
};

const MARQUEE_VIDEO = '#marquee-video';

// eslint-disable-next-line valid-jsdoc
/**
 * Primary Function
 * @param options options Optional properties to override defaults
 * @return
 */
class MarqueeVideoAutoplay {
  constructor(options) {
    this._options = { ...defaults, ...options };
    this._videoTarget = document.querySelector(`${MARQUEE_VIDEO}`);
    this.init();
  }

  init() {
    if (!this._videoTarget) {
      return;
    }
    // eslint-disable-next-line no-unused-expressions
    this._options.debug ? console.log('Video detected, starting fade & playback...') : false;
    this._videoTarget.addEventListener('load', () => {
      // eslint-disable-next-line no-unused-expressions

      this._videoTarget.setAttribute('autoplay', 'true');
      this._videoTarget.setAttribute('muted', 'true');
      this._videoTarget.setAttribute('loop', 'true');
      this._videoTarget.setAttribute('playsInline', 'true');

      this._videoTarget.muted = true;
    });

    this._videoTarget.addEventListener('play', () => {
      this._videoTarget.style.transitionDuration = '1s';
      this._videoTarget.style.opacity = 1;
    });
  }
}

/**
 * Public API
 */
export default new MarqueeVideoAutoplay();
