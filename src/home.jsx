var React = require('react');
require('../node_modules/firebase/lib/firebase-web.js');
var ReactFireMixin = require('../node_modules/reactfire/dist/reactfire.js');

var Home = React.createClass({
  mixins: [ReactFireMixin],
  getInitialState: function() {
    return {clip: [], clips: [], name: "", start_time: "", end_time: ""};
  },
  addClip: function(clip) {
    this.firebaseRefs.clips.push({
      name: clip.name,
      start_time: clip.start_time,
      end_time: clip.end_time
    });
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
        <ClipForm onChange={this.addClip} buttonName="Add Clip"/>
        <ClipList clips={this.state.clips} />
        <VideoPlayer />
      </div>
    );
  }
});

var ClipForm = React.createClass({
  getInitialState: function() {
    return{name: "",start_time:"",end_time:""};
  },
  handleSubmit: function(e) {
    e.preventDefault();
    if (typeof this.props.onChange === 'function') {
      var newClip = this.state
      this.props.onChange(newClip);
      this.setState({name: "", start_time: "", end_time: ""});
    }
  },
  onChange: function(e) {
    if (e.target.id === "name") {
      this.setState({name: e.target.value});
    } else if (e.target.id === "start-time") {
      this.setState({start_time: e.target.value});
    } else if (e.target.id === "end-time") {
     this.setState({end_time: e.target.value});
    }
  },
  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label for="name" />Name
        <input onChange={this.onChange} id="name" value={this.state.name} />
        <label for="start-time" />Start Time
        <input onChange={this.onChange} id="start-time" value={this.state.start_time} />
        <label for="end-time" />End Time
        <input onChange={this.onChange} id="end-time" value={this.state.end_time} />
        <button>{this.props.buttonName}</button>
      </form>
    );
  }
});

var ClipList = React.createClass({
  mixins: [ReactFireMixin],
  getInitialState: function() {
    return{clipKey: "", showEditForm: false};
  },
  handleDelete: function(name) {
    var key = this.getKey(name);
    var ref = new Firebase('https://video-clips.firebaseio.com/clips/'+key+'');
    ref.remove();
  },
  handleEdit: function(name) {
    var key = this.getKey(name);
    this.setState({clipKey: key, showEditForm: true});
  },
  editClip: function(newClip) {
    var clip = new Firebase('https://video-clips.firebaseio.com/clips/'+this.state.clipKey+'');
    clip.set({name: newClip.name, start_time: newClip.start_time, end_time: newClip.end_time});
    this.setState({name: "", start_time: "", end_time: ""});
  },
  getKey: function(name) {
    var key = "";
    this.firebaseRefs.clips.orderByChild("name").equalTo(name).on("child_added", function(snapshot) {
      key = snapshot.key();
    });
    return key;
  },
  componentWillMount: function() {
    var ref = new Firebase("https://video-clips.firebaseio.com/clips/");
    this.bindAsArray(ref, "clips");
  },
  componentWillUnmount: function() {
    this.firebaseRef.off();
  },
  render: function() {
    var that = this;
    var editClipForm;
    if(this.state.showEditForm) {
      editClipForm = <ClipForm onChange={this.editClip} buttonName="Update Clip" clipKey={this.state.clipKey} />;
    } else {
      editClipForm = "";
    }

    var createClip = function(clip, index) {
      return <li key={index + clip}>
               <div>name: {clip.name}</div>
               <div>start: {clip.start_time}</div>
               <div>end: {clip.end_time}</div>
               <button onClick={that.handleEdit.bind(null, clip.name)}>Edit</button>
               <button onClick={that.handleDelete.bind(null, clip.name)}>Delete</button>
            </li>;
    };

    return (
      <div>
        {editClipForm}
        <ul>{this.props.clips.map(createClip)}</ul>
      </div>
    );
  }
});


React.render(<Home />, document.getElementById('home'));
