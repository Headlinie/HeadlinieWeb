/** @jsx React.DOM */

var React = require('react');
var Track = require('./track.js');


// Variable to keep track of if device supports installation
var possibleToInstallWebapp = false;
if(window.navigator.mozApps !== undefined) {
  possibleToInstallWebapp = true;
}

// Button for installing the application
// TODO requires two clicks to popup installation in FxOS
var InstallAppButton = React.createClass({
  handleInstallApp: function() {
    Track("Installing App");
    var request = window.navigator.mozApps.install(window.manifestUrl);
    request.onsuccess = function () {
      Track("App installed!");
    };
    request.onerror = function () {
      alert("Something went wrong. Please report this issue");
      Track("App not installed!", {message: this.error.name});
    };
    return false;
  },
  componentDidMount: function() {
    // Only do stuff if device supports installation
    if(possibleToInstallWebapp) {
      Track("Device supports installation");
      // If installed since before, don't show install button
      // This throws out of memory exception if not on the same domain
      // https://bugzilla.mozilla.org/show_bug.cgi?id=922187
      try {
        var request = window.navigator.mozApps.checkInstalled(window.manifestUrl);
        request.onsuccess = function(event) {
          if (!request.result) {
            // Wait ten seconds then show the installation button
            setTimeout(function() {
              this.setState({visible: true});
              Track("Show installation button");
            }.bind(this), 10000);
          } else {
            Track("App already installed");
          }
        }.bind(this);
      } catch (err) {
        console.log("Error with domains");
      }
    }
  },
  getInitialState: function() {
    return {
      visible: false
    };
  },
  render: function() {
    var styleObj = {
      position: 'fixed',
      bottom: 15,
      left: 5
    };
    return (
      <div style={styleObj} className={this.state.visible ? '' : 'hidden'}>
        <a href="#" className="btn-info btn-lg hidden-xs" onClick={this.handleInstallApp}>
          <span className="glyphicon glyphicon-download-alt"></span>
          &nbsp;
          Install locally
        </a>
        <a href="#" className="btn-info btn-lg visible-xs-block" onClick={this.handleInstallApp}>
          <span className="glyphicon glyphicon-download-alt"></span>
          &nbsp;
          Install
        </a>
      </div>
    );
  }
});

module.exports = InstallAppButton;
