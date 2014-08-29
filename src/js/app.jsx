/** @jsx React.DOM */

window.serverUrl = "http://api.headlinie.com/";
var redditUrl = "http://www.reddit.com/r/worldnews.json";

if(location.href.indexOf('local') !== -1) {
  redditUrl = window.serverUrl + 'worldnews.json';
}

var possibleToInstallWebapp = false;
if(window.navigator.mozApps !== undefined) {
  possibleToInstallWebapp = true;
}

function lockToPortait(){
  try {
    var lockOrientation = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation;
    if(lockOrientation) {
      lockOrientation('portrait');
      Track("Locked to portrait");
    }
  } catch (e) {
    //console.error('Couldnt lock to portrait');
  }
}
lockToPortait();

var manifestUrl = 'http://victor.bjelkholm.com/worldnews/manifest.webapp';

var startApplication = require('./load_page.js');

startApplication();
