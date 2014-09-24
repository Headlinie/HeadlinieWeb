/** @jsx React.DOM */

// TODO split up this class into smaller classes

var React = require('react');
var Track = require('./track.js');
var getJSON = require('./get_json.js');
var moment = require('moment');
var UnreadButton = require('./unread_button.js');
var ReadService = require('./read_service.js');

var Post = React.createClass({
  getInitialState: function() {
    var haveBeenRead = ReadService.haveBeenRead(
      this.props.data.link
    );
    return {
      loading: false,
      error: false,
      open: false,
      read: haveBeenRead,
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
    var articleLink = window.serverUrl + "sources/reddit/articles/" + encodeURIComponent(articleLink);
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
  setAsRead: function() {
    this.setState({read: true});
    ReadService.setAsRead(this.props.data.link);
  },
  readArticle: function() {
    var post = this.props.data;
    Track("Reading article", {
      'link': post.link,
      'Title': post.title
    });
    this.setAsRead();
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
  componentDidMount: function() {
      var idLink = this.props.data.title.substr(0, 50);
      idLink = idLink.replace(new RegExp("'", "g"), "");
      idLink = idLink.replace(new RegExp(",", "g"), "");
      idLink = idLink.replace(new RegExp("\\\(", "g"), "");
      idLink = idLink.replace(new RegExp("\\\)", "g"), "");
      idLink = idLink.replace(new RegExp("\\\.", "g"), "");
      idLink = idLink.replace(new RegExp("\\\/", "g"), "");
      idLink = idLink.replace(new RegExp('"', "g"), "");
      idLink = idLink.replace(new RegExp(" ", "g"), "_");
      this.idLink = idLink;

      console.log(location.hash.replace("#", "") === idLink);
      if(location.hash.replace("#", "") === idLink) {
        this.readArticle();
        var el = document.getElementById(idLink);
        el.scrollIntoView(true);
      }

  },
  render: function() {
      var post = this.props.data;


      var closeBtnStyle = {
        position: 'fixed',
        top: '5',
        left: '5'
      };

      var reportLink = "https://victorbjelkholm.typeform.com/to/sd4jNB?title=xxxxx";
      reportLink = reportLink.replace('xxxxx', post.title);
      var timePosted = moment.unix(post.date_posted).fromNow(true);

      var shareLink = location.origin + "/#" + this.idLink;

      return (
        <div id={this.idLink}>
          <p>
            <h5 onClick={ this.toggleArticle }>
              <UnreadButton read={this.state.read}/>
              {post.title}
            </h5>
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
              &nbsp;
              {timePosted} ago
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
              &nbsp;
              <a className="btn btn-danger" href={reportLink} target="_blank">
                <span className="glyphicon glyphicon-warning-sign"></span>
                &nbsp;
                Report broken article
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
                <div>
                  <br/>
                  <strong>Share this article with others by sharing the link below:</strong><br/>
                  <a href={shareLink}>{shareLink}</a>
                </div>
              </span>
            </div>
          </div>
        </div>
      )
  }
});

module.exports = Post;
