/** @jsx React.DOM */

var React = require('react');
var Track = require('./track.js');
var Post = require('./post.jsx');
var GoToTopButton = require('./go_to_top_button.jsx');
var InstallAppButton = require('./install_app_button.jsx');
var Modal = require('./modal.jsx');
var moment = require('moment');
var _ = require('underscore');

var sources = require('./sources.js');
var lightyear = require('lightyear').VMediator;


var AllPosts = React.createClass({
    getInitialState: function() {
      var dateToShow = moment().format("MMM Do YYYY");
      return {
          posts: this.props.data,
          date: dateToShow,
          source: this.props.source
      };
    },
    reloadSource: function() {
      Track("Reloading source");
      document.getElementById('mountArea').innerHTML = "<h1>Loading...</h1>";
      loadPage('reddit');
    },
    toggleSource: function() {
      Track("Toggling source");
      document.getElementById('mountArea').innerHTML = "<h1>Loading...</h1>";
      var newSource;
      if(this.state.source === 'WorldNews') {
          newSource = _.findWhere(sources, {shortname: 'hackernews'});
          this.setState({source: newSource.name});
      }
      if(this.state.source === 'HackerNews') {
          newSource = _.findWhere(sources, {shortname: 'reddit'});
          this.setState({source: newSource.name});
      }
      lightyear.publish('source:load', newSource.name);
    },
    showAbout: function() {
        lightyear.publish('about:show');
    },
    render: function() {
      var iconStyle = {
        top: "6px",
        marginRight: "-12px"
      };
      var posts = this.state.posts.map(function(data, i) {
        return (
          <div className="postItem" key={i}>
            <Post data={data}/>
          </div>
        );
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

							{/*
              &nbsp;
              <a href="#" className="btn btn-default" onClick={this.toggleSource}>
                <span className="glyphicon glyphicon-refresh"></span>
                <span className="hidden-xs">
                  &nbsp;
                  Toggle Source
                </span>
              </a>
							*/}
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
