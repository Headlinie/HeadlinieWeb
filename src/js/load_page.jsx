/** @jsx React.DOM */

var React = require('react');
var Track = require('./track.js');
var getJSON = require('./get_json.js');
var AllPosts = require('./all_posts.jsx');
var _ = require('underscore');
var sources = require('./sources.js');

var lightyear = require('lightyear').VMediator;

// Helper method for loading stuff from the API
var loadPage = function(source) {
  Track("Loading initial source", {
    version: "1.2.0"
  });

  var shortname = _.findWhere(sources, {name: source}).shortname;

  getJSON(window.serverUrl + "sources/" + shortname + "/articles", function(data) {
      var allPosts = [];
      var posts = data.articles;
      posts.forEach(function(post) {
          allPosts.push(post);
      });
      React.renderComponent(<AllPosts data={allPosts} source={source}/>, document.getElementById('mountArea'));
  });
};

lightyear.subscribe('source:load', function(sourceName) {
  loadPage(sourceName);
});

window.lightyear = lightyear;

module.exports = loadPage;
