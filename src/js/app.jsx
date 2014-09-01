/** @jsx React.DOM */
// The URL for the API
window.serverUrl = "http://api.headlinie.com/";

// Locking to portrait if possible
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

//Where the manifest can be found
var manifestUrl = 'http://victor.bjelkholm.com/worldnews/manifest.webapp';

//Initialization for the application
var startApplication = require('./load_page.js');

startApplication();
