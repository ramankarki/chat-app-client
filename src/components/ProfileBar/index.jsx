import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { updateProfile, changePassword, login } from "../../utils/Routes";
import { logout } from "../../actions";
import defaultAvatar from "../avatar.svg";
import logo from "../logo.png";

class index extends Component {
  state = { isOptionsActive: false };

  setOptionsActive = () => {
    this.setState({ isOptionsActive: !this.state.isOptionsActive });
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

  render() {
    return (
      <aside className="profile-bar">
        <picture className="profile-bar-avatar">
          <img
            onClick={this.setOptionsActive}
            className="default-avatar"
            src={this.userAvatar(this.props.auth.user) || defaultAvatar}
            alt="default avatar"
          />
          <p className="profile-bar-username">
            {this.props.auth.user?.username || ""}
          </p>
          {this.state.isOptionsActive ? (
            <div className="profile-bar-options">
              <Link to={updateProfile} className="profile">
                Profile
              </Link>
              <Link to={changePassword} className="change-password">
                Change password
              </Link>
              <Link to={login} onClick={this.props.logout} className="logout">
                Logout
              </Link>
            </div>
          ) : null}
        </picture>
        <img className="profile-bar-logo" src={logo} alt="logo" />
      </aside>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  return { auth };
};

export default connect(mapStateToProps, { logout })(index);
