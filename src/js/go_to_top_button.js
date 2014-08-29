/** @jsx React.DOM */

var React = require('react');

var GoToTopButton = React.createClass({
  render: function() {
    var styleObj = {
      position: 'fixed',
      bottom: 5,
      right: 5
    };
    return (
      <div style={styleObj}>
        <a href="#" className="btn btn-default visible-xs-block">
          <span className="glyphicon glyphicon-arrow-up"></span>
          &nbsp;
          Top
        </a>
        <a href="#" className="btn btn-default hidden-xs">
          <span className="glyphicon glyphicon-arrow-up"></span>
          &nbsp;
          Go to top
        </a>
      </div>
    )
  }
});

module.exports = GoToTopButton;
