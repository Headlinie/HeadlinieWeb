/** @jsx React.DOM */

var React = require('react');
var Track = require('./track.js');
var getJSON = require('./get_json.js');
var AllPosts = require('./all_posts.js');

// Helper method for loading stuff from the API
function loadPage() {
  Track("Loading initial source", {
    version: "1.1.0"
  });
  getJSON(window.serverUrl + "sources/reddit/articles", function(data) {
      var allPosts = [];
      console.log(data);
      var posts = data.articles;
      posts.forEach(function(post) {
          allPosts.push(post);
      })
      React.renderComponent(<AllPosts data={allPosts}/>, document.getElementById('mountArea'));
  });
}

module.exports = loadPage;
