import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { AuthUserContext } from "../Session";

import { SignInForm } from "./SignIn";
import Score from "../GameScore";

import moment from "moment";

import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import DeleteForever from "@material-ui/icons/DeleteForever";
import Edit from "@material-ui/icons/Edit";
import Save from "@material-ui/icons/Save";
import Cancel from "@material-ui/icons/Cancel";
import Send from "@material-ui/icons/Send";
import TextField from "@material-ui/core/TextField";
import Fab from "@material-ui/core/Fab";

const Home = () => {
  return (
    <div>
      <AuthUserContext.Consumer>
        {authUser => (authUser ? <HomeAuth /> : <HomeNoAuth />)}
      </AuthUserContext.Consumer>
    </div>
  );
};

const HomeAuth = () => {
  const bodyStyle = {
    marginTop: "70px",
    marginBottom: "50px",
    backgroundColor: "#DDDDDD"
  };

  const slideCont = {
    position: "fixed",
    width: "100%",
    top: "65px",
    backgroundColor: "whitesmoke",
    zIndex: "10"
  };

  const boxStyle = {
    width: "100%",
    height: "30px",
    top: "50px",
    position: "fixed",
    zIndex: "9",
    backgroundColor: "#DDDDDD"
  };

  return (
    <div style={bodyStyle}>
      <div style={boxStyle} />
      <div style={slideCont}>
        <Score />
      </div>
      <Messages />
    </div>
  );
};

class MessagesBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "",
      loading: false,
      messages: [],
      limit: 4
    };
  }

  deleteOldPosts = () => {
    let now = moment();
    let cutoff = now.subtract(1, 'd');
    let cutoffDate = cutoff.format("MMMM Do YYYY, h:mm:ss a")
    let old = this.props.firebase.messages().orderByChild('createdAt').endAt(cutoffDate).limitToLast(1);
    let listener = old.on('child_added', function(snapshot) {
    snapshot.ref.remove();
    });
    

    return listener

    
  }

  onChangeText = e => {
    this.setState({ text: e.target.value });
  };

  onCreateMessage = (e, authUser) => {
    this.props.firebase.messages().push({
      text: this.state.text,
      userId: authUser.uid,
      userEmail: authUser.email,
      userName: authUser.displayName,
      timeStamp: this.props.firebase.serverValue.TIMESTAMP,
      createdAt: moment.utc().format("MMMM Do YYYY, h:mm:ss a")
    });
    this.setState({ text: "" });
    this.scrollToTop();
    
    e.preventDefault();
  };

  onRemoveMessage = uid => {
    this.props.firebase.message(uid).remove();
  };

  onEditMessage = (message, text) => {
    const { uid, ...messageSnapshot } = message;

    this.props.firebase.message(message.uid).set({
      ...messageSnapshot,
      text,
      editedAt: moment().format("MMMM Do YYYY, h:mm:ss a")
    });
  };

  onListenForMessages() {
    this.setState({ loading: true });

    this.props.firebase
      .messages()
      .limitToLast(this.state.limit)
      .orderByChild("timeStamp")
      .on("value", snapshot => {
        const messageObject = snapshot.val();

        if (messageObject) {
          const messageList = Object.keys(messageObject).map(key => ({
            ...messageObject[key],
            uid: key
          }));

          this.setState({ loading: false, messages: messageList.reverse() });
        } else {
          this.setState({ messages: null, loading: false });
        }
        this.setState({ loading: false });
      });
  }

  handleScroll = () => {
    this.setState(
      state => ({ limit: state.limit + 4 }),
      this.onListenForMessages
    );
  };

  scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  onNextPage = () => {
    this.setState(
      state => ({ limit: state.limit + 4 }),
      this.onListenForMessages
    );
  };

  componentDidMount() {
    this.onListenForMessages();
    this.deleteOldPosts();
  }

  componentWillUnmount() {
    this.props.firebase.messages().off();
  }

  render() {
    const { text, messages, loading } = this.state;

    const submitStyle = {
      position: "fixed",
      bottom: "0",
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      width: "100%",
      height: "50px"
    };
    const buttonStyle = {
      margin: "5px",
      width: "75%"
    };

    const formStyle = {
      width: "100%",
      display: "flex",
      justifyContent: "flex-end"
    };

    const butStyle = {
      margin: "5px",
      backgroundColor: "#001f3f"
    };

    const contStyle = {
      marginTop: "190px"
    };

    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div style={contStyle}>
            {loading && <div>Loading...</div>}
            {messages ? (
              <MessageList
                messages={messages}
                onRemoveMessage={this.onRemoveMessage}
                onEditMessage={this.onEditMessage}
                authUser={authUser}
              />
            ) : (
            <div>
                <br />
              <Typography variant="h5" align="center">Start a conversation!</Typography>
            </div>
            )}
            <div style={submitStyle}>
              <Fab
                style={butStyle}
                variant="extended"
                onClick={this.onNextPage}
                color="primary"
                size="medium"
              >
                OLDER
              </Fab>
              <form
                onSubmit={e => this.onCreateMessage(e, authUser)}
                style={formStyle}
              >
                <TextField
                  style={buttonStyle}
                  type="text"
                  value={text}
                  onChange={this.onChangeText}
                  placeholder="Start typing!"
                />

                <Fab
                  style={butStyle}
                  color="primary"
                  area-label="Add"
                  type="submit"
                  size="small"
                >
                  <Send />
                </Fab>
              </form>
            </div>
          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

const formStyles = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  margin: "20px"
};

const MessageList = ({
  messages,
  onRemoveMessage,
  onEditMessage,
  authUser
}) => {
  return (
    <div style={formStyles}>
      {messages.map(message => (
        <MessageItem
          key={message.uid}
          message={message}
          onRemoveMessage={onRemoveMessage}
          onEditMessage={onEditMessage}
          authUser={authUser}
        />
      ))}
    </div>
  );
};

class MessageItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      editText: this.props.message.text
    };
  }

  onToggleEditMode = () => {
    this.setState(state => ({
      editMode: !state.editMode,
      editText: this.props.message.text
    }));
  };

  onChangeEditText = e => {
    this.setState({ editText: e.target.value });
  };

  onSaveEditText = () => {
    this.props.onEditMessage(this.props.message, this.state.editText);

    this.setState({ editMode: false });
  };

  render() {
    const { message, onRemoveMessage, authUser } = this.props;
    const { editMode, editText } = this.state;

    let userEmailOriginal = message.userEmail;
    let userEmailDisplay = userEmailOriginal.substring(
      0,
      userEmailOriginal.lastIndexOf("@")
    );
    
    let utcTime = message.createdAt;
    let convertTime = moment.utc(utcTime, "MMMM Do YYYY, h:mm:ss a")
    let localTime = convertTime.local().format("MMMM Do YYYY, h:mm:ss a")

    const formStyles = {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      margin: "0 auto"
    };

    const contStyles = {
      padding: "10px",
      margin: "5px auto",
      display: "flex",
      flexDirection: "column",
      justifyContent: "left",
      textAlign: "center",
      width: "100%",
      borderStyle: "solid",
      borderRadius: "2px",
      borderWidth: "0px",
      borderColor: "gray",
      boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
      backgroundColor: "#F2F2F2"
    };

    const postCont = {
      display: "flex",
      flexDirection: "column"
    };

    const spanStyle = {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end"
    };

    return (
      <div style={contStyles}>
        {editMode ? (
          <TextField
            type="text"
            value={editText}
            onChange={this.onChangeEditText}
          />
        ) : (
          <div style={postCont}>
            <Typography align="left" variant="subtitle2">
              {userEmailDisplay}
            </Typography>
            <Typography align="left" variant="caption">
              Posted {localTime}
            </Typography>
            <br />
            <Typography align="left" variant="body1">
              {message.text}
              <Typography variant="caption">
                {message.editedAt && <span>(Edited)</span>}
              </Typography>
            </Typography>
          </div>
        )}

        {authUser.email === message.userEmail && (
          <span>
            {editMode ? (
              <span style={spanStyle}>
                <IconButton onClick={this.onSaveEditText}>
                  <Save fontSize="small" />
                </IconButton>
                <IconButton onClick={this.onToggleEditMode}>
                  <Cancel fontSize="small" />
                </IconButton>
              </span>
            ) : (
              <span style={spanStyle}>
                <IconButton onClick={this.onToggleEditMode}>
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton onClick={() => onRemoveMessage(message.uid)}>
                  <DeleteForever fontSize="small" />
                </IconButton>
              </span>
            )}
          </span>
        )}
      </div>
    );
  }
}

const Messages = withFirebase(MessagesBase);

const HomeNoAuth = () => {
  return (
    <div>
      <br />
      <Typography align="center" variant="h4">
        Please sign in
      </Typography>
      <br />
      <SignInForm />
    </div>
  );
};

export default Home;
