var lock = null;
var level = 0;
var stayAwakeInterval = null;

function start() {
  console.log('requesting keep awake');
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
          createVideoElement();
        }
      }
    }
  }
}

function stop() {
  if (stayAwakeInterval !== null) {
    lock.unlock();
    lock = null;
  }
}

function createVideoElement() {
  var video = document.createElement('video');
  video.id = 'keep-awake-video';
  video.src = 'empty.avi';
  video.autoPlay = true;
  video.loop = true;
  document.body.appendChild(video);
}

module.exports = {
  start : start,
  stop : stop
};
