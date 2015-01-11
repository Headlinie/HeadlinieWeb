/** @jsx React.DOM */

var React = require('react');
var Track = require('./track.js');

var lightyear = require('lightyear').VMediator;


// Modal for showing the about popup, needs to be refactored into proper model
// and abstract away the specific stuff for the about-page
var Modal = React.createClass({
  getInitialState: function() {
    return {
      visible: false
    };
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
    lightyear.subscribe('about:show', function() {
      this.showPopup();
    }.bind(this));
  },
  render: function() {
    var headerStyle = {
      margin: 0,
      padding: 0,
      display: 'inline',
      float: 'left',
      marginBottom: '10px'
    };

    var iconStyle = {
      top: "4px",
      left: "6px"
    };

    return (
      <div className={this.state.visible ? 'popup-show' : 'popup-hide'}>
        <div className="popup-body">
          <div className="popup-close" onClick={this.hidePopup}>
            <span className="glyphicon glyphicon-remove"></span>
          </div>
          <h2 style={headerStyle}>
            <span style={iconStyle} className="glyphicon glyphicon-info-sign"></span>
            &nbsp;
            About
          </h2>
          <div className="clear"></div>
          <div className="popup-body-scroll">
            <p>
              Headlinie is a collection of news from all around the world.
            </p>
            <p>
              The source is <a href="http://www.reddit.com/r/worldnews" target="_blank">r/worldnews</a> on reddit.
            </p>
            <p>
              It was created by <a href="http://www.twitter.com/VictorBjelkholm" target="_blank">Victor Bjelkholm</a> and the source is available on Github
              &nbsp;
              <a href="https://github.com/Headlinie" target="_blank">https://github.com/Headlinie</a>
            </p>
            <p>
              If you like the application, please rate it on <a href="https://marketplace.firefox.com/app/worldnews/" target="_blank">Firefox Marketplace</a>, spread
              it or just keep using it like before.
            </p>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Modal;
