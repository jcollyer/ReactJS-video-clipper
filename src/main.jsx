var React = require('react');
var ReactDOM = require('react-dom');
require('../node_modules/firebase/lib/firebase-web.js');
var ReactFireMixin = require('../node_modules/reactfire/dist/reactfire.js');
require('./style.css');

var Home = React.createClass({
  mixins: [ReactFireMixin],
  getInitialState: function() {
    return {clip: [], clips: [], name: "", start_time: "", end_time: "", database: "https://video-clips.firebaseio.com/clips/"};
  },
  addClip: function(clip) {
    this.firebaseRefs.clips.push({
      name: clip.name,
      start_time: clip.start_time,
      end_time: clip.end_time
    });
  },
  componentWillMount: function() {
    var ref = new Firebase(this.state.database);
    this.bindAsArray(ref, "clips");
  },
  componentWillUnmount: function() {
    this.firebaseRef.off();
  },
  render: function() {
    return (
      <div>
        <ClipForm onChange={this.addClip} action="Add Clip"/>
        <ClipList
          clips={this.state.clips}
          database={this.state.database}
          originalVideo="http://grochtdreis.de/fuer-jsfiddle/video/sintel_trailer-480.mp4"
          editable={true} />
      </div>
    );
  }
});

var ClipForm = React.createClass({
  getInitialState: function() {
    return{name: "", start_time:"", end_time:""};
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
      <div id="video-form">
        <h1>{this.props.action}</h1>
        <form onSubmit={this.handleSubmit}>
          <label>name</label>
          <input onChange={this.onChange} id="name" value={this.state.name} />
          <label>in</label>
          <input type="number" onChange={this.onChange} id="start-time" value={this.state.start_time} />
          <label>out</label>
          <input type="number" onChange={this.onChange} id="end-time" value={this.state.end_time} />
          <button>{this.props.action}</button>
        </form>
      </div>
    );
  }
});

var ClipList = React.createClass({
  mixins: [ReactFireMixin],
  getInitialState: function() {
    return{clip: {}, in: null, out: null, showEditForm: false};
  },
  handleDelete: function(name) {
    var key = this.getKey(name);
    var ref = new Firebase(this.props.database + key);
    ref.remove();
  },
  handleEdit: function(clip) {
    this.setState({clip: clip, showEditForm: true});
  },
  editClip: function(newClip) {
    var key = this.getKey(this.state.clip.name);
    var clip = new Firebase(this.props.database + key);
    clip.set({name: newClip.name || this.state.clip.name, start_time: newClip.start_time || this.state.clip.start_time, end_time: newClip.end_time || this.state.clip.end_time});
    this.setState({name: "", start_time: "", end_time: "", showEditForm: false});
  },
  showClip: function(clip) {
    this.setState({clipName: clip.name, in: clip.start_time, out: clip.end_time})
  },
  getKey: function(name) {
    var key = "";
    this.firebaseRefs.clips.orderByChild("name").equalTo(name).on("child_added", function(snapshot) {
      key = snapshot.key();
    });
    return key;
  },
  hideEditForm: function() {
    this.setState({showEditForm: false});
  },
  componentWillMount: function() {
    var ref = new Firebase(this.props.database);
    this.bindAsArray(ref, "clips");
  },
  componentWillUnmount: function() {
    this.firebaseRef.off();
  },
  render: function() {
    var that = this;
    var editClipForm;
    var fullVideo = {name: this.props.originalVideo};

    if(this.state.showEditForm) {
      editClipForm = <div>
        <ClipForm onChange={this.editClip} action="Update Clip" />
        <div onClick={this.hideEditForm} className="close fa fa-times-circle"></div>
      </div>;
    }

    var createClip = function(clip, index) {
      return <li key={index + clip}>
              <button onClick={that.showClip.bind(null, clip)} className="fa fa-play"></button>
               <div>{clip.name}</div>
               <p>in:</p> <div>{clip.start_time}</div>
               <p>out:</p> <div>{clip.end_time}</div>
               <button onClick={that.handleDelete.bind(null, clip.name)} className={that.props.editable ? "fa fa-trash" : "not-editable"}></button>
               <button onClick={that.handleEdit.bind(null, clip)} className={that.props.editable ? "fa fa-pencil" : "not-editable"}></button>
            </li>;
    };

    return (
      <div id="clip-list">
        {editClipForm}
        <h3>Clip list</h3>
        <ul>
          <li onClick={this.showClip.bind(null, fullVideo)}>Full Video<button className="fa fa-play"></button></li>
          {this.props.clips.map(createClip)}
        </ul>
        <VideoPlayer in={this.state.in} out={this.state.out} video={this.props.originalVideo} />
      </div>
    );
  }
});

var VideoPlayer = React.createClass({
  componentWillReceiveProps: function(nextProps) {
    // return if not new props
    if (this.props.in === nextProps.in && this.props.out === nextProps.out) return;

    // Tear down existing video
    var videoContainer = document.getElementById("video-container");
    videoContainer.innerHTML = "";
    var video = "";

    // Set up new video player
    video = document.createElement("video");
    video.setAttribute("controls","");
    var src = this.props.video + "#t=" + nextProps.in + "," + nextProps.out;
    video.setAttribute("src", src);
    videoContainer.appendChild(video);
    video.play();
  },
  render: function() {
    return (
      <div id="video-container">
        <video controls src={this.props.video} ></video>
      </div>
    );
  }
});

ReactDOM.render(<Home />, document.getElementById('home'));
