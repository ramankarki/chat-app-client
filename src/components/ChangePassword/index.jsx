import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { setChangePasswordData, saveNewPassword } from "../../actions";
import ProfileBar from "../ProfileBar";
import Alert from "react-bootstrap/Alert";
import spinner from "../spinner.svg";
import { conversations, login } from "../../utils/Routes";
import history from "../../utils/history";
import "./ChangePassword.scss";

class index extends Component {
  onFieldChange = (event, field) => {
    const { changePassword } = this.props;
    if (field === "current") {
      this.props.setChangePasswordData(
        event.target.value,
        changePassword.newPassword,
        changePassword.confirmPassword
      );
    } else if (field === "new") {
      this.props.setChangePasswordData(
        changePassword.currentPassword,
        event.target.value,
        changePassword.confirmPassword
      );
    } else if (field === "confirm") {
      this.props.setChangePasswordData(
        changePassword.currentPassword,
        changePassword.newPassword,
        event.target.value
      );
    }
  };

  onSubmit = (event) => {
    event.preventDefault();

    this.props.saveNewPassword();
  };

  componentDidMount() {
    const token = localStorage.getItem("token");
    const exp = localStorage.getItem("exp");

    if (!token || +exp < Date.now()) {
      history.push(login);
    }
  }

  render() {
    let show, variant, message;
    if (this.props.changePassword.state?.startsWith("validation")) {
      show = true;
      variant = "danger";
      message = this.props.changePassword.state.split(",")[1];
    } else if (this.props.changePassword.state === "saved") {
      show = true;
      variant = "success";
      message = "Password changed successfully !";
    } else if (this.props.changePassword.state === "failed") {
      show = true;
      variant = "danger";
      message = "Something went wrong ! May be current password is wrong.";
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
            <h3 className="profile-heading">Change Password</h3>
            <form onSubmit={this.onSubmit} className="changePassword-form">
              <input
                type="text"
                placeholder="Current Password"
                required
                value={this.props.changePassword.currentPassword}
                onChange={(event) => {
                  this.onFieldChange(event, "current");
                }}
              />
              <input
                type="text"
                placeholder="New Password"
                required
                value={this.props.changePassword.newPassword}
                onChange={(event) => this.onFieldChange(event, "new")}
              />
              <input
                type="text"
                placeholder="Confirm Password"
                required
                value={this.props.changePassword.confirmPassword}
                onChange={(event) => this.onFieldChange(event, "confirm")}
              />
              <button className="profile-submitBtn">
                {this.props.changePassword.state === "saving" ? (
                  <img
                    className="icon-spinner"
                    src={spinner}
                    alt="spinner icon svg"
                  />
                ) : (
                  "Save"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ changePassword, auth }) => {
  return { changePassword, auth };
};

export default connect(mapStateToProps, {
  setChangePasswordData,
  saveNewPassword,
})(index);
