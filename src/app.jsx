/** @jsx React.DOM */
var getJSON = function(url, callback) {
  xhr = new XMLHttpRequest;
  xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
          callback(JSON.parse(xhr.responseText));
      }
  }
  xhr.open("GET", url)
  xhr.send();
}

var serverUrl = "server/";
var redditUrl = "http://www.reddit.com/r/worldnews.json";
if(location.href.indexOf('local') !== -1) {
  redditUrl = serverUrl + 'worldnews.json';
}

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

var PostInfo = React.createClass({
  render: function() {
    // return ()
  }
});

var Post = React.createClass({
  getInitialState: function() {
    return {
      loading: false,
      error: false,
      open: false,
      content: null
    };
  },
  closeArticle: function() {
    this.setState({loading: false, open: false, error: false, content: null});
    return false;
  },
  getArticle: function(articleLink, forceReload, callback) {
    var articleLink = serverUrl + "?url=" + articleLink;
    if(forceReload) {
      articleLink = articleLink + "&force-reload=true";
    }
    getJSON(articleLink, function(data) {
      callback(data);
    }.bind(this));
  },
  forceReload: function() {
    var post = this.props.data;
    this.setState({loading: true, content: "Loading..."});
    this.getArticle(post.link, true, function(data) {
      // this.setState({open: true});
      if(data.content === undefined) {
        this.setState({error: true, content: data.messages});
      } else {
        this.setState({error: false, content: data.content});
      }
    }.bind(this));
    return false;
  },
  readArticle: function() {
    var post = this.props.data;
    this.setState({loading: true, content: "Loading...", open: true});
    this.getArticle(post.link, false, function(data) {
      // this.setState({open: true});
      if(data.content === undefined) {
        this.setState({error: true, content: data.messages});
      } else {
        this.setState({error: false, content: data.content});
      }
    }.bind(this));
    return false;
  },
  render: function() {
      var post = this.props.data;
      var closeBtnStyle = {
        position: 'fixed',
        top: '5',
        left: '5'
      };
      return (
        <div>
          <p>
            <h5>{post.title}</h5>
            <span className={this.state.open ? 'hidden' : ''}>
              <a className="btn btn-primary" href="" onClick={this.readArticle}>
                <span className="glyphicon glyphicon-chevron-down"></span>
                &nbsp;
                Read
              </a>
            </span>
            <span className={this.state.open ? '' : 'hidden'}>
              <a className="btn btn-primary" href="" onClick={this.closeArticle}>
                <span className="glyphicon glyphicon-chevron-up"></span>
                &nbsp;
                Close
              </a>
            </span>
            &nbsp;
            <a className="btn btn-info" href={post.link} target="_blank">
              <span className="glyphicon glyphicon-link"></span>
              &nbsp;
              Source
            </a>
            &nbsp;
            <span className="hidden-xs">
              <span className="label label-primary">
                <span className="glyphicon glyphicon-globe"></span>
                &nbsp;
                {post.domain}
              </span>
              &nbsp;
              <span className={post.category ? "badge" : "hidden"}>
                <span className="glyphicon glyphicon-tag"></span>
                &nbsp;
                {post.category}
              </span>
            </span>
            <div className="visible-xs-block meta-small">
              <span className="label label-primary">
                <span className="glyphicon glyphicon-globe"></span>
                &nbsp;
                {post.domain}
              </span>
              &nbsp;
              <span className={post.category ? "badge" : "hidden"}>
                <span className="glyphicon glyphicon-tag"></span>
                &nbsp;
                {post.category}
              </span>
            </div>
          </p>
          <div className={this.state.loading ? 'well' : 'post'}>
            <div className={this.state.open ? '' : 'hidden'}>
              <a className="btn btn-warning" onClick={this.forceReload} target="_blank">
                <span className="glyphicon glyphicon-refresh"></span>
                &nbsp;
                Force-Reload
              </a>
              &nbsp;
              <a className="btn btn-default" href={post.comments} target="_blank">
                <span className="glyphicon glyphicon-comment"></span>
                &nbsp;
                Comments
              </a>
            </div>
            <div className={this.state.error ? 'alert alert-danger' : 'hidden'}>
              <h1>Error!</h1>
              { this.state.content }
            </div>
            <div className={this.state.error ? 'hidden' : ''}>
              <span className={this.state.open ? '' : 'hidden'}>
                <h2>{post.title}</h2>
                <div dangerouslySetInnerHTML={{__html: this.state.content}} />
              </span>
            </div>
          </div>
        </div>
      )
  }
});

var AllPosts = React.createClass({
    getInitialState: function() {
      return {posts: this.props.data}
    },
    reloadSource: function() {
      document.getElementById('mountArea').innerHTML = "<h1>Loading...</h1>";
      loadPage();
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
              <a href="#" className="btn btn-primary" onClick={this.reloadSource}>
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
        </div>
      );
    }
});

function loadPage() {
  getJSON(redditUrl, function(data) {
      var allPosts = [];
      var posts = data.data.children
      posts.forEach(function(post) {
          var d = post.data;
          var story = {
            title: d.title,
            domain: d.domain,
            comments: 'http://www.reddit.com' + d.permalink,
            link: d.url,
            category: d.link_flair_text
          };
          allPosts.push(story);
      })
      React.renderComponent(<AllPosts data={allPosts}/>, document.getElementById('mountArea'));
  });
}
loadPage();
