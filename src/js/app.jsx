/** @jsx React.DOM */
// The URL for the API
// Development
//window.serverUrl = "http://localhost:8001/";
// Production
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

// Where the manifest can be found
// Development
window.manifestUrl = 'http://localhost:8000/manifest.webapp';
// Production
//window.manifestUrl = 'http://headlinie.com/manifest.webapp';

//Initialization for the application
var startApplication = require('./load_page.js');

console.log(startApplication)

startApplication('WorldNews');
