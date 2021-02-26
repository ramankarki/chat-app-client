import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import {
  setProfileData,
  saveProfileData,
  deleteAccount,
  logout,
} from "../../actions";
import { conversations, login } from "../../utils/Routes";
import ProfileBar from "../ProfileBar";
import defaultAvatar from "../avatar.svg";
import Alert from "react-bootstrap/Alert";
import spinner from "../spinner.svg";
import "./Profile.scss";
import history from "../../utils/history";

class index extends Component {
  state = { deleteAccountModal: false, deleteAccountLoading: false };
  profileAvatar = React.createRef();

  setDeleteAccountModal = () => {
    this.setState({ deleteAccountModal: !this.state.deleteAccountModal });
  };

  onFieldChange = (event, field) => {
    const { profileData } = this.props;

    if (field === "username") {
      this.props.setProfileData(event.target.value, profileData.email);
    } else if (field === "email") {
      this.props.setProfileData(profileData.username, event.target.value);
    } else if (field === "avatar") {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.profileAvatar.current.src = event.target.result;
      };
    }
  };

  onSubmit = (event) => {
    event.preventDefault();

    if (this.props.profileData.state !== "saving") {
      this.props.saveProfileData();
    }
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

  deleteMe = () => {
    this.setState({ deleteAccountLoading: true });
    this.props.deleteAccount();
    this.props.logout();
  };

  componentDidMount() {
    const token = localStorage.getItem("token");
    const exp = localStorage.getItem("exp");

    if (!token || +exp < Date.now()) {
      history.push(login);
    }

    if (this.props.auth.user)
      this.props.setProfileData(
        this.props.auth.user.username,
        this.props.auth.user.email
      );
  }

  render() {
    if (!this.props.auth.user) return "";

    let show, message, variant;
    if (this.props.profileData.state === "saved") {
      variant = "success";
      show = true;
      message = "Profile saved successfully !";
    } else if (this.props.profileData.state === "failed") {
      variant = "danger";
      show = true;
      message =
        "Something went wrong ! Maybe user with this email already exists, try using another email.";
    }

    return (
      <div className="profile">
        <ProfileBar />
        <div className="profile-mainWrapper">
          <div className="container profile-formWrapper">
            <Link to={conversations} className="back-to-conversation">
              <i className="bi bi-arrow-left-short"></i>
              <span>Conversations</span>
            </Link>
            <div className="notification">
              <Alert show={show} variant={variant}>
                <p>{message}</p>
              </Alert>
            </div>
            <h3 className="profile-heading">My Profile</h3>
            <form onSubmit={this.onSubmit} className="profile-form">
              <picture className="profile-form-avatar">
                <img
                  ref={this.profileAvatar}
                  src={this.userAvatar(this.props.auth.user) || defaultAvatar}
                  alt="user avatar"
                />
                <label>
                  <input
                    className="user-avatar"
                    type="file"
                    accept="image/*"
                    onChange={(event) => this.onFieldChange(event, "avatar")}
                  />
                  Upload
                </label>
              </picture>
              <div className="profile-form-fields">
                <p className="joined-at">
                  Joined at:{" "}
                  {new Date(this.props.auth.user.joinedAt).toDateString()}
                </p>
                <input
                  type="text"
                  placeholder="Username"
                  required
                  value={this.props.profileData.username}
                  onChange={(event) => {
                    this.onFieldChange(event, "username");
                  }}
                />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={this.props.profileData.email}
                  onChange={(event) => this.onFieldChange(event, "email")}
                />
                <button className="profile-submitBtn">
                  {this.props.profileData.state === "saving" ? (
                    <img
                      className="icon-spinner"
                      src={spinner}
                      alt="spinner icon svg"
                    />
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </form>
            <button
              onClick={this.setDeleteAccountModal}
              className="delete-account-btn"
            >
              Delete Account
            </button>
          </div>
        </div>
        {this.state.deleteAccountModal ? (
          <div className="delete-account-modal-bg">
            <div className="delete-account-modal">
              <h3>Delete Account</h3>
              <p>Are you sure you want to delete your account ?</p>
              <button onClick={this.deleteMe} className="delete">
                {this.state.deleteAccountLoading ? (
                  <img
                    className="icon-spinner"
                    src={spinner}
                    alt="spinner icon svg"
                  />
                ) : (
                  "Delete"
                )}
              </button>
              <button onClick={this.setDeleteAccountModal} className="cancel">
                Cancel
              </button>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = ({ auth, profileData }) => {
  return { auth, profileData };
};

export default connect(mapStateToProps, {
  setProfileData,
  saveProfileData,
  deleteAccount,
  logout,
})(index);
