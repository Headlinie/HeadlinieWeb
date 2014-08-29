/** @jsx React.DOM */

var React = require('react');
var Track = require('./track.js');

var InstallAppButton = React.createClass({
  handleInstallApp: function() {
    Track("Installing App");
    var request = window.navigator.mozApps.install(manifestUrl);
    request.onsuccess = function () {
      Track("App installed!")
    };
    request.onerror = function () {
      alert("Something went wrong. Please report this issue");
      Track("App not installed!", {message: this.error.name});
    };
    return false;
  },
  componentDidMount: function() {
    if(possibleToInstallWebapp) {
      Track("Device supports installation");
      var request = window.navigator.mozApps.checkInstalled(manifestUrl);
      request.onsuccess = function(event) {
        if (!request.result) {
          setTimeout(function() {
            this.setState({visible: true});
            Track("Show installation button");
          }.bind(this), 10000);
        } else {
          Track("App already installed");
        }
      }.bind(this);
    }
  },
  getInitialState: function() {
    return {
      visible: false
    }
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
    )
  }
})

module.exports = InstallAppButton;
