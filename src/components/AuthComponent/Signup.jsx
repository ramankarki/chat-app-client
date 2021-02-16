import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { login } from "../../utils/Routes";
import { setNewUserData } from "../../actions";
import { newUserDataState } from "../../actions/types";

class Signup extends React.Component {
  onSubmit = (event) => {
    event.preventDefault();

    if (this.props.newUserData.password.length >= 12) {
      if (
        this.props.newUserData.password ===
        this.props.newUserData.confirmpassword
      ) {
        this.props.setNewUserData(
          true,
          this.props.newUserData.username,
          this.props.newUserData.email,
          this.props.newUserData.password,
          this.props.newUserData.confirmpassword,
          newUserDataState.submitting
        );
      } else {
        this.props.setNewUserData(
          true,
          this.props.newUserData.username,
          this.props.newUserData.email,
          this.props.newUserData.password,
          this.props.newUserData.confirmpassword,
          newUserDataState.unmatchedValidation
        );
      }
    } else {
      this.props.setNewUserData(
        true,
        this.props.newUserData.username,
        this.props.newUserData.email,
        this.props.newUserData.password,
        this.props.newUserData.confirmpassword,
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
          this.props.newUserData.confirmpassword,
          newUserDataState.typing
        );
        break;
      case "email":
        this.props.setNewUserData(
          true,
          this.props.newUserData.username,
          event.target.value,
          this.props.newUserData.password,
          this.props.newUserData.confirmpassword,
          newUserDataState.typing
        );
        break;
      case "password":
        this.props.setNewUserData(
          true,
          this.props.newUserData.username,
          this.props.newUserData.email,
          event.target.value,
          this.props.newUserData.confirmpassword,
          newUserDataState.typing
        );
        break;
      case "confirmpassword":
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
          this.props.newUserData.confirmpassword,
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

  render() {
    if (this.props.newUserData) {
      return (
        <form className="form" onSubmit={this.onSubmit}>
          <h2 className="form__heading">Sign up</h2>

          <div className="form__fieldsWrapper">
            <input
              type="text"
              placeholder="Username"
              value={this.props.newUserData.username}
              onChange={(event) => this.onSignupFieldChange(event, "username")}
              required
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
              value={this.props.newUserData.confirmpassword}
              onChange={(event) =>
                this.onSignupFieldChange(event, "confirmpassword")
              }
              required
            />
          </div>

          <button type="submit" className="form__submitBtn">
            Signup
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

export default connect(mapStateToProps, { setNewUserData })(Signup);
