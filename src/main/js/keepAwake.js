var lock = null;
var level = 0;
var stayAwakeInterval = null;

function start() {
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

module.exports = {
  start : start,
  stop : stop
};
