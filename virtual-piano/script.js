// Settings
const pianoKeySetting = {
  selectorPianoKey: '.piano-key',
  classPianoKey: "piano-key",
  letterKeyClass: "piano-key-letter",
  activeClassPianoKey: "piano-key-active"
}

const btnsSetting = {
  globalSelector: ".btn",
  globalClass: "btn",
  globalActiveClass: "btn-active",
  btnLetters: {
    selector: ".btn-letters",
    class: "btn-letters"
  },
  btnNotes: {
    selector: ".btn-notes",
    class: "btn-notes"
  },
  btnFullscreen: {
    selector: ".fullscreen",
    class: "fullscreen"
  }
}

const audioSetting = {
  url: "assets/audio",
  format: "mp3",
  getUrl: function(nameFile) {
    return `${this.url}/${nameFile}.${this.format}`
  }
};

// Variables
const piano = document.querySelector(".piano");
const pianoKeys = [...piano.querySelectorAll(pianoKeySetting.selectorPianoKey)];
const btns = [...document.querySelectorAll(btnsSetting.globalSelector)];
const fullscreenBtn = document.querySelector(btnsSetting.btnFullscreen.selector);

// Classes
class UI {
  addClassLetterKeys(addClass) {
    pianoKeys.forEach((pianoKey) => {
      UI.addClass(pianoKey, addClass);
    });
  }
  clearClassLetterKeys(clearClass) {
    pianoKeys.forEach((pianoKey) => {
      UI.removeClass(pianoKey, clearClass);
    });
  }

  getFullscreen() {
    return (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
  }
  openFullscreen(element) {
    if (element.requestFullScreen) {
      element.requestFullScreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullScreen) {
      element.webkitRequestFullScreen();
    } else if (element.msFullscreenElement) {
      element.msRequestFullScreen();
    }
  }
  cancelFullscreen() {
    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    } else if (documentElement.msCancelFullScreen) {
      document.msCancelFullScreen();
    }
  }

  Fullscreen() {
    if (!this.getFullscreen()) {
      this.openFullscreen(document.documentElement);
    } else {
      this.cancelFullscreen();
    }
  }

  clearActiveClassBtns() {
    btns.forEach((btn) => UI.removeClass(btn, btnsSetting.globalActiveClass));
    this.clearClassLetterKeys(pianoKeySetting.letterKeyClass);
  }

  addClickEventBtns() {
    btns
      .find((btn) => btn.classList.contains(btnsSetting.btnLetters.class))
      .addEventListener("click", (e) => {
        this.clearActiveClassBtns();
        UI.addClass(e.target, btnsSetting.globalActiveClass);
        this.addClassLetterKeys(pianoKeySetting.letterKeyClass);
      });
    btns
      .find((btn) => btn.classList.contains(btnsSetting.btnNotes.class))
      .addEventListener("click", (e) => {
        this.clearActiveClassBtns();
        UI.addClass(e.target, btnsSetting.globalActiveClass);
      });
    fullscreenBtn.addEventListener("click", () => {
      this.Fullscreen();
    });
  }

  static addClass(elem, classElement) {
    elem.classList.add(classElement);
  }
  static removeClass(elem, classElement) {
    elem.classList.remove(classElement);
  }
}

// App
window.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  ui.addClickEventBtns();
});
