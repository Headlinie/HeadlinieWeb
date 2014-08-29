/** @jsx React.DOM */

var React = require('react');
var Track = require('./track.js');
var Post = require('./post.js');
var GoToTopButton = require('./go_to_top_button.js');
var InstallAppButton = require('./install_app_button.js');
var Modal = require('./modal.js');

var AllPosts = React.createClass({
    getInitialState: function() {
      return {posts: this.props.data}
    },
    reloadSource: function() {
      Track("Reloading source");
      document.getElementById('mountArea').innerHTML = "<h1>Loading...</h1>";
      loadPage();
    },
    showAbout: function() {
      cb();
    },
    render: function() {
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
            <span className="glyphicon glyphicon-globe"></span>
            &nbsp;
            WorldNews
            &nbsp;
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
