import React from "react";
import { connect } from "react-redux";

import { setActiveConversation, createConversation } from "../../actions";

class ConversationCard extends React.Component {
  onSetActiveConver = () => {
    if (!this.props.conversation) {
      this.props.createConversation(this.props.id);
    } else {
      this.props.setActiveConversation(this.props.conversation);
    }
  };

  render() {
    let cardClass;
    if (this.props.activeConversation) {
      cardClass =
        this.props.activeConversation.user1 === this.props.userID ||
        this.props.activeConversation.user2 === this.props.userID
          ? "conversation-card conversation-card-active"
          : "conversation-card";
    } else {
      cardClass = "conversation-card";
    }

    const currentUserMsg = this.props.lastMsgUser === this.props.auth.user._id;

    return (
      <div
        onClick={() => {
          this.onSetActiveConver();
          this.props.setMessageContainerClass(true);
        }}
        className={cardClass}
      >
        <picture className="conversation-card-avatar">
          <img src={this.props.userAvatar} alt="default avatar for users" />
        </picture>
        <div className="conversation-card-usertext">
          <h6 className="conversation-card-username">{this.props.username}</h6>
          {this.props.lastMsg ? (
            <p
              className={
                currentUserMsg
                  ? "conversation-card-lastMsg"
                  : "conversation-card-lastMsg conversation-card-lastMsg-other"
              }
            >
              {currentUserMsg ? "You: " : null}
              {this.props.lastMsg}
            </p>
          ) : null}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ activeConversation, auth }) => {
  return { activeConversation, auth };
};

export default connect(mapStateToProps, {
  setActiveConversation,
  createConversation,
})(ConversationCard);
