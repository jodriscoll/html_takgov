/**
 * Module:  Video Playlist
 * @desc    YouTube-like playlist controller UI
 */
const defaults = {
  debug: false,
};

const ID_VIDEO_PLAYLIST = 'video-playlist';
const ID_VIDEO_FRAME = 'vid_frame';
const CLASS_VIDEO_META_TITLE = 'js-video-meta-title';
const CLASS_VIDEO_META_DURATION = 'js-video-meta-duration';
const CLASS_PLAYLIST_LINK = 'video-playlist__link';

// eslint-disable-next-line valid-jsdoc
/**
 * Primary Function
 * @param options options Optional properties to override defaults
 * @return
 */
class VideoPlaylist {
  constructor(options) {
    this._options = { ...defaults, ...options };
    this._playlist = document.getElementById(ID_VIDEO_PLAYLIST);
    this._frame = document.getElementById(ID_VIDEO_FRAME);
    this._metaTitle = document.querySelector(`.${CLASS_VIDEO_META_TITLE}`);
    this._metaDuration = document.querySelector(`.${CLASS_VIDEO_META_DURATION}`);
    this._playerLinks = document.querySelectorAll(`.${CLASS_PLAYLIST_LINK}`);
    this.init();
  }

  init() {
    if (!this._playlist || !this._frame || !this._metaTitle || !this._metaDuration) {
      return;
    }
    // eslint-disable-next-line no-unused-expressions
    this._options.debug && console.log('Video playlist detected!');
    /*
    $('.vid-item').each(function(index) {
      $(this).on('click', function(){
        var current_index = index+1;
        $('.vid-item .thumb').removeClass('active');
        $('.vid-item:nth-child('+current_index+') .thumb').addClass('active');
      });
    });
    */
    this._playerLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.onClickLink(link);
      });
    });
  }

  onClickLink = (link) => {
    this._playerLinks.forEach((l) => {
      l.classList.remove('active');
    });
    link.classList.add('active');
    this._frame.src = link.dataset.videoUrl;
    this._metaTitle.innerHTML = link.dataset.videoTitle;
    this._metaDuration.innerHTML = link.dataset.videoLength;
  };
}

/**
 * Public API
 */
export default new VideoPlaylist();
