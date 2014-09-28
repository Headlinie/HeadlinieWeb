/** @jsx React.DOM */

var React = require('react');
var Track = require('./track.js');
var Post = require('./post.js');
var GoToTopButton = require('./go_to_top_button.js');
var InstallAppButton = require('./install_app_button.js');
var Modal = require('./modal.js');
var moment = require('moment');

var lightyear = require('lightyear').VMediator;


var AllPosts = React.createClass({
    getInitialState: function() {
      var dateToShow = moment().format("MMM Do YYYY")
      return {
          posts: this.props.data,
          date: dateToShow
      }
    },
    reloadSource: function() {
      Track("Reloading source");
      document.getElementById('mountArea').innerHTML = "<h1>Loading...</h1>";
      loadPage();
    },
    showAbout: function() {
        console.log('Clicked show about button');
        lightyear.publish('about:show');
    },
    render: function() {
      var iconStyle = {
        top: "6px",
        marginRight: "-12px"
      };
      var posts = this.state.posts.map(function(data, i) {
        return (
          <div className="postItem">
            <Post data={data}/>
          </div>
        )
      });
      return (
        <div>
          <h1>
            <span style={iconStyle} className="glyphicon glyphicon-globe"></span>
            &nbsp;
            Headlinie
            <span className="hidden-xs">
            &nbsp;
            -
            &nbsp;
            {this.state.date}
            &nbsp;
            -
            &nbsp;
            {this.state.source}
            </span>
            <span className="pull-right">
              <a href="#" className="btn btn-primary" onClick={this.showAbout}>
                <span className="glyphicon glyphicon-info-sign"></span>
                <span className="hidden-xs">
                  &nbsp;
                  About
                </span>
              </a>
              &nbsp;
              <a href="#" className="btn btn-default" onClick={this.reloadSource}>
                <span className="glyphicon glyphicon-refresh"></span>
                <span className="hidden-xs">
                  &nbsp;
                  Reload main-source
                </span>
              </a>
            </span>
          </h1>
          {posts}
          <GoToTopButton/>
          <InstallAppButton/>
          <Modal/>
        </div>
      );
    }
});

module.exports = AllPosts;
