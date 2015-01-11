/** @jsx React.DOM */
// The URL for the API
// Development
//window.serverUrl = "http://localhost:8001/";
// Production
var hostSplitted = window.location.host.split('.');
var domain;
var tld;
if(hostSplitted.length !== 2) {
  var domain = hostSplitted[1];
  var tld = hostSplitted[2];
} else {
  var domain = hostSplitted[0];
  var tld = hostSplitted[1];
}
window.serverUrl = "http://api."+domain+"."+tld+"/";

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
//window.manifestUrl = 'http://localhost:8000/manifest.webapp';
// Production
window.manifestUrl = 'http://'+domain+'.'+tld+'/manifest.webapp';

//Initialization for the application
var startApplication = require('./load_page.js');

startApplication('WorldNews');
