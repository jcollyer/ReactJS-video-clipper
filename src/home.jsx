var React = require('react');
require('../node_modules/firebase/lib/firebase-web.js');
var ReactFireMixin = require('../node_modules/reactfire/dist/reactfire.js');

var Home = React.createClass({
  mixins: [ReactFireMixin],
  getInitialState: function() {
    return {clips: [], text: ''};
  },
  onChange: function(e) {
    this.setState({text: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    this.firebaseRefs.clips.push({
      text: this.state.text
    });
    this.setState({text: ""});
  },
  componentWillMount: function() {
    var ref = new Firebase("https://video-clips.firebaseio.com/clips/");
    this.bindAsArray(ref, "clips");
  },
  componentWillUnmount: function() {
    this.firebaseRef.off();
  },
  render: function() {
    return (
      <div>
        <h3>Clips</h3>
        <ClipList clips={this.state.clips} />
        <form onSubmit={this.handleSubmit}>
          <input onChange={this.onChange} value={this.state.text} />
          <button>{'Add #' + (this.state.clips.length + 1)}</button>
        </form>
      </div>
    );
  }
});


var ClipList = React.createClass({
  render: function() {
    var createItem = function(itemText, index) {
      return <li key={index + itemText}>{itemText}</li>;
    };
    return <ul>{this.props.clips.map(createItem)}</ul>;
  }
});

App = React.render(<Home />, document.getElementById('home'));
