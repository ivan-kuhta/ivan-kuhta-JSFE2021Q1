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

