import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Alert from "react-bootstrap/Alert";
import {
  activateAccount,
  setNewUserData,
  resendAccountActivateEmail,
} from "../../actions";
import { newUserDataState } from "../../actions/types";
import spinner from "../spinner.svg";

class ActivateAccount extends React.Component {
  onSubmit = (event) => {
    event.preventDefault();
    this.props.resendAccountActivateEmail();
  };

  componentDidMount() {
    this.props.setNewUserData(
      true,
      "",
      "",
      "",
      "",
      newUserDataState.activatingAccount
    );
    this.props.activateAccount(this.props.match.params.token);
  }

  render() {
    if (!this.props.newUserData) return "";

    if (
      this.props.newUserData.state === newUserDataState.activatingAccount ||
      this.props.newUserData.state === "accountActivated"
    ) {
      return (
        <img
          className="icon-spinner-activateAccount"
          src={spinner}
          alt="spinner"
        />
      );
    } else {
      let failedMessage;
      let failed;
      if (this.props.newUserData.state.startsWith("Invalid")) {
        failedMessage = this.props.newUserData.state;
        failed = true;
      } else if (this.props.newUserData.state.startsWith("failed")) {
        failedMessage = this.props.newUserData.state.split(",")[1];
        failed = true;
      } else {
        failed = false;
      }

      return (
        <form className="form" onSubmit={this.onSubmit}>
          <div className="signup-warning">
            <Alert show={failed} variant="danger">
              <p>{failedMessage}</p>
            </Alert>
          </div>
          <h2 className="form__heading">Account Activation Failed !</h2>

          <p className="form__forgotPasswordDesc">
            Token was invalid or expired. Enter email to get email with
            activation link again.
          </p>

          <div className="form__fieldsWrapper">
            <input
              type="email"
              placeholder="Email"
              value={this.props.newUserData.email}
              required
              autoFocus
              onChange={(event) =>
                this.props.setNewUserData(
                  true,
                  "",
                  event.target.value,
                  "",
                  "",
                  newUserDataState.typing
                )
              }
            />
          </div>

          <button type="submit" className="form__submitBtn">
            {this.props.newUserData.state === newUserDataState.resubmitting ? (
              <img
                className="icon-spinner"
                src={spinner}
                alt="spinner icon svg"
              />
            ) : (
              "Resend email"
            )}
          </button>
        </form>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return { newUserData: state.newUserData };
};

export default withRouter(
  connect(mapStateToProps, {
    activateAccount,
    setNewUserData,
    resendAccountActivateEmail,
  })(ActivateAccount)
);
