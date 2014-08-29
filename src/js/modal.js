/** @jsx React.DOM */

var React = require('react');
var Track = require('./track.js');
//Ugly hack, fix this
var cb;

var Modal = React.createClass({
  getInitialState: function() {
    return {
      visible: false
    }
  },
  showPopup: function() {
    Track("Showing the popup");
    this.setState({visible: true});
  },
  hidePopup: function() {
    Track("Closing the popup");
    this.setState({visible: false});
  },
  componentDidMount: function() {
    //TODO This needs to be fixed asap, or browserify wont work
    cb = function() {
      this.showPopup();
    }.bind(this);
  },
  render: function() {
    return (
      <div className={this.state.visible ? 'popup-show' : 'popup-hide'}>
        <div className="popup-body">
          <div className="popup-close" onClick={this.hidePopup}>
            <span className="glyphicon glyphicon-remove"></span>
          </div>
          <h2>
            <span className="glyphicon glyphicon-info-sign"></span>
            &nbsp;
            About
          </h2>
          <p>
            WorldNews is a collection of news from all around the world.
          </p>
          <p>
            The source is <a href="http://www.reddit.com/r/worldnews" target="_blank">r/worldnews</a> on reddit.
          </p>
          <p>
            It was created by <a href="http://victor.bjelkholm.com/?source=worldnews" target="_blank">Victor Bjelkholm</a> and the source will be available on Github as OSS as soon as possible.
          </p>
          <p>
            If you like the application, please rate it on <a href="https://marketplace.firefox.com/app/worldnews/" target="_blank">Firefox Marketplace</a>, spread
            it or just keep using it like before.
          </p>
        </div>
      </div>
    )
  }
})

module.exports = Modal;
