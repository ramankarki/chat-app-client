import React, { Component } from "react";
import { connect } from "react-redux";
import Pusher from "pusher-js";

import ProfileBar from "../ProfileBar";
import {
  setMessageData,
  sendMessage,
  userInserted,
  userUpdated,
  userDeleted,
  conversationInserted,
  conversationDeleted,
  messageInserted,
  addEmoji,
} from "../../actions";
import keys from "../../config";
import ConversationCard from "./ConversationCard";
import Message from "./Message";
import EMOJIS from "../../utils/emojis";
import defaultAvatar from "../avatar.svg";
import sendMessageIcon from "../send.svg";
import spinner from "../spinner.svg";
import "./Conversations.scss";
import { login } from "../../utils/Routes";
import history from "../../utils/history";

class Conversations extends Component {
  state = {
    activeTab: "people",
    messageContainerClass: "message-container",
    isEmojiActive: false,
    isMsgFormActive: false,
  };

  messageContainer = React.createRef();

  setMessageContainerClass = (isActive) => {
    this.setState({
      messageContainerClass: isActive
        ? "message-container message-container-active"
        : "message-container",
    });
  };

  setActiveTab = (tab) => {
    this.setState({ activeTab: tab });
  };

  isTabActive = (tab) => {
    if (this.state.activeTab === tab) return "tabs active";
    return "tabs";
  };

  bufferToBase64(buffer) {
    let binary = "";
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  userAvatar = (user) => {
    let image = user?.avatar?.data;
    if (image) {
      image = this.bufferToBase64(image);
      return `data:image/jpeg;base64,${image}`;
    }

    return null;
  };

  renderUsers = () => {
    return this.props.users.map((user) => {
      if (!this.props.auth.user || !user) return null;
      if (user._id === this.props.auth.user._id) {
        return null;
      }

      let conversation;
      for (let con of this.props.conversations.data) {
        if (user._id === con.user1 || user._id === con.user2) {
          conversation = con;
          break;
        }
      }

      return (
        <ConversationCard
          conversation={conversation}
          key={user._id}
          username={user.username}
          id={user._id}
          setMessageContainerClass={this.setMessageContainerClass}
          avatar={user.avatar}
          isOnline={user.isUserActive}
          userAvatar={this.userAvatar(user) || defaultAvatar}
        />
      );
    });
  };

  getUser = (conversation) => {
    let otherID;
    if (this.props.auth.user._id === conversation.user1) {
      otherID = conversation.user2;
    } else {
      otherID = conversation.user1;
    }

    return this.getUserWithId(otherID);
  };

  getUserWithId = (id) => {
    for (let user of this.props.users) {
      if (user._id === id) {
        return user;
      }
    }
  };

  renderConversations = () => {
    const conversations = this.props.conversations.data.map((conversation) => {
      const user = this.getUser(conversation);

      return (
        <ConversationCard
          conversation={conversation}
          setMessageContainerClass={this.setMessageContainerClass}
          key={user._id}
          username={user.username}
          userID={user._id}
          avatar={user.avatar}
          isOnline={user.isUserActive}
          userAvatar={this.userAvatar(user) || defaultAvatar}
          lastMsgUser={
            conversation.messages.length
              ? conversation.messages[conversation.messages.length - 1].user
              : null
          }
          lastMsg={
            (conversation.messages[conversation.messages.length - 1] &&
              conversation.messages[conversation.messages.length - 1]
                .message) ||
            `You and ${user.username} are connected and can start chatting...`
          }
        />
      );
    });

    return conversations;
  };

  renderMessages = () => {
    return this.props.activeConversation.messages.map((message) => {
      if (this.props.auth.user._id === message.user) {
        return (
          <Message
            key={message._id}
            msg={message.message}
            className="my-message"
            title={`${new Date(message.createdAt).toGMTString()}`}
          />
        );
      }
      return (
        <Message
          key={message._id}
          msg={message.message}
          className="others-message"
          title={
            new Date(message.createdAt).toDateString() +
            ", " +
            new Date(message.createdAt).toLocaleTimeString()
          }
        />
      );
    });
  };

  renderEmojis = () =>
    EMOJIS.split("").map((emoji, index) => (
      <span
        onClick={() => {
          this.props.addEmoji(index);
        }}
        key={index}
      >
        {emoji}
      </span>
    ));

  onMessageSubmit = (event) => {
    if (event.preventDefault) event.preventDefault();

    if (
      !this.props.message.message.trim() ||
      this.props.message.state !== "submitting"
    ) {
      this.props.sendMessage();
    }
  };

  componentDidMount() {
    const token = localStorage.getItem("token");
    const exp = localStorage.getItem("exp");

    if (!token || +exp < Date.now()) {
      history.push(login);
    }

    const pusher = new Pusher(keys.PUSHER_KEY, {
      cluster: keys.PUSHER_CLUSTER,
    });

    this.userChannel = pusher.subscribe("users");
    this.conversationChannel = pusher.subscribe("conversations");
    this.messageChannel = pusher.subscribe("messages");

    this.userChannel.bind("inserted", (data) => {
      this.props.userInserted(data);
    });

    this.userChannel.bind("updated", (data) => {
      this.props.userUpdated(data);
    });

    this.userChannel.bind("deleted", (data) => {
      this.props.userDeleted(data._id);
    });

    this.conversationChannel.bind("inserted", (data) => {
      this.props.conversationInserted(data);
    });

    this.conversationChannel.bind("deleted", (data) => {
      this.props.conversationDeleted(data);
    });

    this.messageChannel.bind("inserted", (data) => {
      this.props.messageInserted(data);
    });

    window.onbeforeunload = () => {
      this.userChannel.unsubscribe();
      this.conversationChannel.unsubscribe();
      this.messageChannel.unsubscribe();
    };
  }

  componentDidUpdate() {
    if (this.messageContainer.current) {
      let scroll = this.messageContainer.current.scrollHeight;
      this.messageContainer.current.scrollTop = scroll;
    }
  }

  render() {
    return (
      <div className="conversations">
        <ProfileBar />
        <aside className="conversation-bar">
          <div className="conversation-tab">
            <span
              onClick={() => this.setActiveTab("people")}
              className={this.isTabActive("people")}
            >
              <i className="bi bi-people-fill"></i>
            </span>
            <span
              onClick={() => this.setActiveTab("messages")}
              className={this.isTabActive("messages")}
            >
              <i className="bi bi-chat-dots-fill"></i>
              {this.props.conversations.notifications ? (
                <span className="msg-notification">
                  {this.props.conversations.notifications}
                </span>
              ) : null}
            </span>
          </div>
          <div className="conversation-users">
            {!this.props.conversations.data.length &&
            this.state.activeTab === "messages" ? (
              <p className="conversation-users-o">
                You haven't started conversation with anyone
              </p>
            ) : null}

            {this.state.activeTab === "people"
              ? this.renderUsers()
              : this.renderConversations()}
          </div>
        </aside>
        <section className={this.state.messageContainerClass}>
          {!this.props.activeConversation ? (
            <div className="start-chatting-message">
              <p>Send messages to your friends.</p>
              <p>
                Search for other users <i className="bi bi-people-fill"></i>
              </p>
              <p>Start chatting</p>
            </div>
          ) : this.props.activeConversation.state === "creating" ? (
            <div className="start-chatting-message">
              Creating conversation with{" "}
              {this.getUserWithId(this.props.activeConversation.id).username}{" "}
              <picture>
                <img
                  className="icon-spinner"
                  src={spinner}
                  alt="spinner icon svg"
                />
              </picture>
            </div>
          ) : this.props.activeConversation.state !== "failed" ? (
            <>
              <header className="message-header">
                <div className="message-header-user">
                  <i
                    onClick={() => this.setMessageContainerClass(false)}
                    className="bi bi-arrow-left-short"
                  ></i>
                  <picture className="message-header-user-avatar">
                    <img
                      className="default-avatar"
                      src={
                        this.userAvatar(
                          this.getUser(this.props.activeConversation)
                        ) || defaultAvatar
                      }
                      alt="default avatar"
                    />
                  </picture>
                  <div className="message-header-user-text">
                    <h5 className="message-header-user-name">
                      {this.getUser(this.props.activeConversation).username}
                    </h5>
                  </div>
                </div>
              </header>
              <main ref={this.messageContainer} className="message-messages">
                <p className="message-messages-started">
                  You and {this.getUser(this.props.activeConversation).username}{" "}
                  are connected and can start chatting... <br />
                  {`${new Date(
                    this.props.activeConversation.createdAt
                  ).toDateString()}`}
                </p>
                {this.renderMessages()}
              </main>
              <footer
                className={
                  this.state.isMsgFormActive
                    ? "message-messageForm message-messageForm-active"
                    : "message-messageForm"
                }
              >
                <form
                  onSubmit={this.onMessageSubmit}
                  className="message-messageForm-field"
                >
                  <input
                    type="text"
                    placeholder="Type message..."
                    required
                    value={this.props.message.message}
                    onChange={(event) =>
                      this.props.setMessageData(event.target.value, "typing")
                    }
                    onFocus={() => this.setState({ isMsgFormActive: true })}
                    onBlur={() => this.setState({ isMsgFormActive: false })}
                  />

                  <i
                    onClick={() =>
                      this.setState({
                        isEmojiActive: !this.state.isEmojiActive,
                      })
                    }
                    className="bi bi-emoji-laughing-fill"
                  ></i>

                  <input type="submit" value="" style={{ display: "none" }} />

                  {this.state.isEmojiActive ? (
                    <div className="emoji-container">{this.renderEmojis()}</div>
                  ) : null}
                </form>
                <img
                  className={
                    this.props.message.state === "submitting"
                      ? "icon-spinner-dark"
                      : "message-messageForm-sendBtn"
                  }
                  src={
                    this.props.message.state === "submitting"
                      ? spinner
                      : sendMessageIcon
                  }
                  alt="send message icon svg"
                  onClick={this.onMessageSubmit}
                />
              </footer>
            </>
          ) : (
            <div className="start-chatting-message">
              Something went wrong ! try reloading this page
            </div>
          )}
        </section>
        {this.props.appDataLoading !== "loaded" ? (
          <div className="app-data-loading">
            {this.props.appDataLoading === "failed" ? (
              <p>Something went wrong ! Try reloading this page</p>
            ) : (
              <img
                className="icon-spinner"
                src={spinner}
                alt="spinner icon svg"
              />
            )}
          </div>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = ({
  auth,
  users,
  conversations,
  activeConversation,
  message,
  appDataLoading,
}) => {
  return {
    auth,
    users,
    conversations,
    activeConversation,
    message,
    appDataLoading,
  };
};

export default connect(mapStateToProps, {
  setMessageData,
  sendMessage,
  userInserted,
  userUpdated,
  userDeleted,
  conversationInserted,
  conversationDeleted,
  messageInserted,
  addEmoji,
})(Conversations);
