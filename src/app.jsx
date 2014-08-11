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
var Track = null;
if(location.href.indexOf('debug') !== -1) {
  Track = function() {
    console.log(arguments);
  }
} else {
  Track = function(name, object) {
    if(object !== undefined) {
      mixpanel.track(name, object);
    } else {
      mixpanel.track(name);
    }
  }
}

if(location.href.indexOf('local') !== -1) {
  redditUrl = serverUrl + 'worldnews.json';
}

var possibleToInstallWebapp = false;
if(window.navigator.mozApps !== undefined) {
  possibleToInstallWebapp = true;
}

function lockToPortait(){
  try {
    var lockOrientation = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation;
    if(lockOrientation) {
      lockOrientation('portrait');
      Track("Locked to portrait");
    }
  } catch (e) {
    //console.error('Couldnt lock to portrait');
  }
}
lockToPortait();

var manifestUrl = 'http://victor.bjelkholm.com/worldnews/manifest.webapp';

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
    Track("Closing article", {
      'link': this.props.data.link,
      'Title': this.props.data.title
    });
    this.setState({loading: false, open: false, error: false, content: null});
    return false;
  },
  getArticle: function(articleLink, forceReload, callback) {
    var articleLink = serverUrl + "sources/reddit/articles/" + encodeURIComponent(articleLink);
    if(forceReload) {
      articleLink = articleLink + "&force-reload=true";
    }
    getJSON(articleLink, function(data) {
      callback(data);
    }.bind(this));
  },
  forceReload: function() {
    var post = this.props.data;
    Track("Force reloading article", {
      'link': post.link,
      'Title': post.title
    });
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
  toggleArticle: function() {
    if(!this.state.open) {
      this.readArticle();
    } else {
      this.closeArticle();
    }
  },
  readArticle: function() {
    var post = this.props.data;
    Track("Reading article", {
      'link': post.link,
      'Title': post.title
    });
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
            <h5 onClick={ this.toggleArticle }>{post.title}</h5>
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
            <div className={this.state.error ? 'hidden' : 'post-content'}>
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

//Ugly hack, fix this
var cb;

var Modal = React.createClass({
  getInitialState: function() {
    return {
      visible: false
    }
  },
  showPopup: function() {
    this.setState({visible: true});
  },
  hidePopup: function() {
    this.setState({visible: false});
  },
  componentDidMount: function() {
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

function loadPage() {
  Track("Loading initial source");
  getJSON(serverUrl + "sources/reddit/articles", function(data) {
      var allPosts = [];
      console.log(data);
      var posts = data.articles;
      posts.forEach(function(post) {
          allPosts.push(post);
      })
      React.renderComponent(<AllPosts data={allPosts}/>, document.getElementById('mountArea'));
  });
}
loadPage();

