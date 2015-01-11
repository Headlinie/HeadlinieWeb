/** @jsx React.DOM */

var React = require('react');

var UnreadButton = React.createClass({
    getInitialState: function() {
        return {
            read: this.props.read
        };
    },
    componentWillReceiveProps: function() {
        this.setState({read: this.props.read});
    },
    render: function() {
        
        var display = "inline";

        if(this.state.read) {
            display = "none";
        }

        var styleObj = {
            fontSize: "60%",
            lineHeight: "2",
            position: "relative",
            top: "-3px",
            display: display,
            marginRight: "4px"
        };

        return (
                <span className="label label-success" style={styleObj}>
                    New!
                </span>
        );
    }
});

module.exports = UnreadButton;
