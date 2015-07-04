var lock = null;
var level;
var stayAwakeInterval = null;
var video = null;

function start() {
  console.log('requesting keep awake');
  level = 0;
  try {
    chrome.power.requestKeepAwake('display');
  } catch (e) {
    level++;
    console.log('no chrome.power', e);
    if (lock === null) {
      try {
        lock = window.navigator.requestWakeLock('screen');
      } catch (e) {
        level++;
        console.log('no window.navigator.requestWakeLock', e);
        try {
          navigator.wakeLock.request("screen").then(function () {
            console.log('yeah?');
          }, function () {
            level++;
            console.log('nope.');
          });
        } catch (e) {
          level++;
          console.log('no navigator.wakeLock', e);
          playVideo();
        }
      }
    }
  }
}

function stop() {
  if (video !== null) {
    video.pause();
    video.src = '';
  }

  if (stayAwakeInterval !== null) {
    clearInterval(stayAwakeInterval);
    stayAwakeInterval = null;
  }

  if (lock !== null) {
    lock.unlock();
    lock = null;
  }

  if (level === 0) {
    chrome.power.releaseKeepAwake();
  }
}

function playVideo() {
  if (video === null) {
    video = document.createElement('video');
    document.body.appendChild(video);
    video.id = 'keep-awake-video';
    video.src =
      'data:video/webm;base64,GkXfo0AgQoaBAUL3gQFC8oEEQvOBCEKCQAR3ZWJtQoeBAkKFgQIYU4BnQI0VSalmQCgq17FAAw9CQE2AQAZ3aGFtbXlXQUAGd2hhbW15RIlACECPQAAAAAAAFlSua0AxrkAu14EBY8WBAZyBACK1nEADdW5khkAFVl9WUDglhohAA1ZQOIOBAeBABrCBCLqBCB9DtnVAIueBAKNAHIEAAIAwAQCdASoIAAgAAUAmJaQAA3AA/vz0AAA=';
    video.loop = true;
  }
  video.play();
}

module.exports = {
  start : start,
  stop : stop
};
