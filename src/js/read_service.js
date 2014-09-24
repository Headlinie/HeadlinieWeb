var _ = require("underscore");

var readArticles = []

var readService = {
    getLocalstorage: function() {
        if(localStorage.getItem('readArticles')) {
            readArticles = JSON.parse(localStorage.getItem('readArticles'))
        }
    },
    saveLocalstorage: function() {
        localStorage.setItem(
                "readArticles",
                JSON.stringify(readArticles)
        );
    },
    haveBeenRead: function(link) {
        if(_.indexOf(readArticles, link) !== -1) {
            return true
        } else {
            return false
        }
    },
    setAsRead: function(link) {
        if(!readService.haveBeenRead(link)) {
            readArticles.push(link);
            readService.saveLocalstorage();
        }
    }
}

readService.getLocalstorage();

module.exports = readService;
