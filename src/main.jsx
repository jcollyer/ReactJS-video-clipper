var React = require('react');
var ReactDOM = require('react-dom');
require('../node_modules/firebase/lib/firebase-web.js');
var ReactFireMixin = require('../node_modules/reactfire/dist/reactfire.js');
require('./style.css');

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
    debugger;
      this.unbind("clips");
      this.firebaseRef.off();
  },
  render: function() {
    return (
      <div>
        <h3>Clips</h3>
        <ClipForm onChange={this.addClip} buttonName="Add Clip"/>
        <ClipList clips={this.state.clips} />
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
        Name: <input onChange={this.onChange} id="name" value={this.state.name} />
        Start Time: <input onChange={this.onChange} id="start-time" value={this.state.start_time} />
        End Time: <input onChange={this.onChange} id="end-time" value={this.state.end_time} />
        <button>{this.props.buttonName}</button>
      </form>
    );
  }
});

var ClipList = React.createClass({
  mixins: [ReactFireMixin],
  getInitialState: function() {
    return{clipKey: "", showEditForm: false, clip_name: "", in: 4, out: 20};
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
  showClip: function(clip) {
    this.setState({clip_name: clip.name, in: clip.start_time, out: clip.end_time})
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
    // this.firebaseRef.off();
    // this.unbind("clips");
  },
  render: function() {
    var that = this;
    var editClipForm;
    if(this.state.showEditForm) {
      editClipForm = <ClipForm onChange={this.editClip} buttonName="Update Clip" clipKey={this.state.clipKey} />;
    }

    var createClip = function(clip, index) {
      return <li key={index + clip} onClick={that.showClip.bind(null, clip)}>
               <div>name: {clip.name}</div>
               <div>start: {clip.start_time}</div>
               <div>end: {clip.end_time}</div>
               <button onClick={that.handleEdit.bind(null, clip.name)}>Edit</button>
               <button onClick={that.handleDelete.bind(null, clip.name)}>Delete</button>
            </li>;
    };

    return (
      <div>
        <h3>Clip list</h3>
        {editClipForm}
        <ul>{this.props.clips.map(createClip)}</ul>
        <VideoPlayer in={this.state.in} out={this.state.out} />
      </div>
    );
  }
});

var VideoPlayer = React.createClass({
  componentWillReceiveProps: function(nextProps) {
    // Tear down existing video
    var videoContainer = document.getElementById("video-container");
    videoContainer.innerHTML = "";
    var video = "";

    // Set up new video player
    video = document.createElement("video");
    video.setAttribute("controls","");
    video.setAttribute("src","http://grochtdreis.de/fuer-jsfiddle/video/sintel_trailer-480.mp4#t="+nextProps.in+","+nextProps.out+"");
    videoContainer.appendChild(video);
  },
  render: function() {
    return <div id="video-container"></div>;
  }
});

ReactDOM.render(<Home />, document.getElementById('home'));
