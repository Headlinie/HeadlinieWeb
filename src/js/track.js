//var mixpanel = require('./mixpanel.js');
// On line 9

// Helper for either console.log'ing stuff or sending it to mixpanel
var Track = null;
if(location.href.indexOf('debug') !== -1) {
    Track = function() {
        console.log(arguments);
    };
} else {
    var mixpanel = require('./mixpanel.js');
    Track = function(name, object) {
        if(object !== undefined) {
            mixpanel.track(name, object);
        } else {
            mixpanel.track(name);
        }
    };
}

module.exports = Track;
