import React, { Component } from "react";
import { connect } from "react-redux";

import defaultAvatar from "../avatar.svg";
import logo from "../logo.png";

class index extends Component {
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

  render() {
    return (
      <aside className="profile-bar">
        <picture>
          <img
            className="default-avatar"
            src={this.userAvatar(this.props.auth.user) || defaultAvatar}
            alt="default avatar"
          />
          <p className="profile-bar-username">
            {this.props.auth.user?.username || "raman karki"}
          </p>
        </picture>
        <img className="profile-bar-logo" src={logo} alt="logo" />
      </aside>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  return { auth };
};

export default connect(mapStateToProps)(index);
