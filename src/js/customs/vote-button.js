/**
 * Module:  Vote buttons
 * @desc    Logic for controlling upvote/downvote buttons
 */
const defaults = {
  debug: false,
};

export const CLASS_VOTE_CONTAINER = 'response-counter';
const CLASS_VOTE_UP_BTN = 'response-vote-up';
const CLASS_VOTE_DN_BTN = 'response-vote-down';
const CLASS_VOTE_COUNT = 'response-vote-total';

class VoteButton {
  constructor(elem, options) {
    this._options = { ...defaults, ...options };
    this._container = elem;
    this._btnUp = elem.querySelector(`.${CLASS_VOTE_UP_BTN}`);
    this._btnDn = elem.querySelector(`.${CLASS_VOTE_DN_BTN}`);
    this._countElem = elem.querySelector(`.${CLASS_VOTE_COUNT}`);
    this._count = parseInt(this._countElem.innerText, 10);
    this.init();
  }

  init() {
    if (!this._container || !this._btnUp || !this._btnDn || !this._countElem) {
      return;
    }

    if (Number.isNaN(this._count)) {
      this._count = 0;
    }

    this._btnDn.addEventListener('click', () => {
      if (this._btnDn.classList.contains('active')) {
        this.onRemoveVote(this._btnDn);
      } else {
        this.onVoteDown();
      }
    });

    this._btnUp.addEventListener('click', () => {
      if (this._btnUp.classList.contains('active')) {
        this.onRemoveVote(this._btnUp);
      } else {
        this.onVoteUp();
      }
    });
  }

  setCount = (newCount) => {
    this._count = newCount;
    this._countElem.innerText = this._count;
  };

  onVoteUp = () => {
    // @TODO: insert code to make api call for setting vote

    if (this._btnDn.classList.contains('active')) {
      this._count++;
      this._btnDn.classList.remove('active');
    }
    this._btnUp.classList.add('active');
    this.setCount(this._count + 1);
  };

  onVoteDown = () => {
    // @TODO: insert code to make api call for setting vote

    if (this._btnUp.classList.contains('active')) {
      this._count--;
      this._btnUp.classList.remove('active');
    }
    this._btnDn.classList.add('active');
    this.setCount(this._count - 1);
  };

  onRemoveVote = (btn) => {
    // @TODO: insert code to make api call for removing vote

    this.setCount(btn === this._btnUp ? this._count - 1 : this._count + 1);
    btn.classList.remove('active');
  };
}

export default VoteButton;
