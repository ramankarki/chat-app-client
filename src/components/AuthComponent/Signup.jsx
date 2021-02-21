import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { login } from "../../utils/Routes";
import { setNewUserData, signupUser } from "../../actions";
import { newUserDataState } from "../../actions/types";
import Alert from "react-bootstrap/Alert";
import spinner from "../spinner.svg";

class Signup extends React.Component {
  onSubmit = (event) => {
    event.preventDefault();

    if (this.props.newUserData.state === newUserDataState.submitting) return;

    // password length should be greater than 12
    if (this.props.newUserData.password.length >= 12) {
      // password and confirm password should be same
      if (
        this.props.newUserData.password ===
        this.props.newUserData.confirmPassword
      ) {
        this.props.setNewUserData(
          true,
          this.props.newUserData.username,
          this.props.newUserData.email,
          this.props.newUserData.password,
          this.props.newUserData.confirmPassword,
          newUserDataState.submitting
        );

        this.props.signupUser();
      } else {
        this.props.setNewUserData(
          true,
          this.props.newUserData.username,
          this.props.newUserData.email,
          this.props.newUserData.password,
          this.props.newUserData.confirmPassword,
          newUserDataState.unmatchedValidation
        );
      }
    } else {
      this.props.setNewUserData(
        true,
        this.props.newUserData.username,
        this.props.newUserData.email,
        this.props.newUserData.password,
        this.props.newUserData.confirmPassword,
        newUserDataState.lengthValidation
      );
    }
  };

  onSignupFieldChange = (event, field) => {
    switch (field) {
      case "username":
        this.props.setNewUserData(
          true,
          event.target.value,
          this.props.newUserData.email,
          this.props.newUserData.password,
          this.props.newUserData.confirmPassword,
          newUserDataState.typing
        );
        break;
      case "email":
        this.props.setNewUserData(
          true,
          this.props.newUserData.username,
          event.target.value,
          this.props.newUserData.password,
          this.props.newUserData.confirmPassword,
          newUserDataState.typing
        );
        break;
      case "password":
        this.props.setNewUserData(
          true,
          this.props.newUserData.username,
          this.props.newUserData.email,
          event.target.value,
          this.props.newUserData.confirmPassword,
          newUserDataState.typing
        );
        break;
      case "confirmPassword":
        this.props.setNewUserData(
          true,
          this.props.newUserData.username,
          this.props.newUserData.email,
          this.props.newUserData.password,
          event.target.value,
          newUserDataState.typing
        );
        break;
      default:
        this.props.setNewUserData(
          true,
          this.props.newUserData.username,
          this.props.newUserData.email,
          this.props.newUserData.password,
          this.props.newUserData.confirmPassword,
          newUserDataState.typing
        );
    }
  };

  componentDidMount() {
    this.props.setNewUserData(
      true,
      "",
      "",
      "",
      "",
      newUserDataState.emptyFields
    );
  }

  componentWillUnmount() {
    if (this.props.newUserData.state !== newUserDataState.submitted) {
      this.props.setNewUserData(false);
    }
  }

  render() {
    if (this.props.newUserData) {
      const failed =
        this.props.newUserData.state.startsWith("failed") ||
        this.props.newUserData.state.startsWith("validation");

      let failedMessage;
      if (failed) {
        failedMessage = this.props.newUserData.state.split(",")[1];
      }

      return (
        <form className="form" onSubmit={this.onSubmit}>
          <div className="signup-warning">
            <Alert show={failed} variant="danger">
              <p>{failedMessage}</p>
            </Alert>
          </div>
          <h2 className="form__heading">Sign up</h2>

          <div className="form__fieldsWrapper">
            <input
              type="text"
              placeholder="Username"
              value={this.props.newUserData.username}
              onChange={(event) => this.onSignupFieldChange(event, "username")}
              required
              autoFocus
            />
            <input
              type="email"
              placeholder="Email"
              value={this.props.newUserData.email}
              onChange={(event) => this.onSignupFieldChange(event, "email")}
              required
            />
            <input
              type="text"
              placeholder="Password"
              value={this.props.newUserData.password}
              onChange={(event) => this.onSignupFieldChange(event, "password")}
              required
            />
            <input
              type="text"
              placeholder="Confirm password"
              value={this.props.newUserData.confirmPassword}
              onChange={(event) =>
                this.onSignupFieldChange(event, "confirmPassword")
              }
              required
            />
          </div>

          <button type="submit" className="form__submitBtn">
            {this.props.newUserData.state === newUserDataState.submitting ? (
              <img
                className="icon-spinner"
                src={spinner}
                alt="spinner icon svg"
              />
            ) : (
              "Signup"
            )}
          </button>

          <p className="form__switchAuth">
            Already have an account ?{" "}
            <Link to={login} className="form__log-or-sign">
              Login
            </Link>{" "}
          </p>
        </form>
      );
    } else {
      return "";
    }
  }
}

const mapStateToProps = ({ newUserData }) => {
  return { newUserData };
};

export default connect(mapStateToProps, { setNewUserData, signupUser })(Signup);
