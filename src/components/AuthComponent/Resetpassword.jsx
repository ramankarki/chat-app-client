import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { setResetPassword, resetPassword } from "../../actions";
import { newUserDataState } from "../../actions/types";
import Alert from "react-bootstrap/Alert";
import spinner from "../spinner.svg";

class Resetpassword extends React.Component {
  onSubmit = (event) => {
    event.preventDefault();

    if (this.props.resetPasswordData.state === "submitting") return;

    const { resetPasswordData } = this.props;

    if (resetPasswordData.password.length < 12)
      return this.props.setResetPassword(
        true,
        resetPasswordData.password,
        resetPasswordData.confirmPassword,
        newUserDataState.lengthValidation
      );

    if (resetPasswordData.password !== resetPasswordData.confirmPassword)
      return this.props.setResetPassword(
        true,
        resetPasswordData.password,
        resetPasswordData.confirmPassword,
        newUserDataState.unmatchedValidation
      );

    this.props.resetPassword(this.props.match.params.token);
  };

  onInputFieldChange = (event, field) => {
    switch (field) {
      case "password":
        this.props.setResetPassword(
          true,
          event.target.value,
          this.props.resetPasswordData.confirmPassword,
          "typing"
        );
        break;
      case "confirmPassword":
        this.props.setResetPassword(
          true,
          this.props.resetPasswordData.password,
          event.target.value,
          "typing"
        );
        break;
      default:
        this.props.setResetPassword(
          true,
          this.props.resetPasswordData.password,
          this.props.resetPasswordData.confirmPassword,
          "typing"
        );
    }
  };

  componentDidMount() {
    this.props.setResetPassword(true, "", "", "empty");
  }

  render() {
    if (!this.props.resetPasswordData) return "";

    const validation = this.props.resetPasswordData.state.startsWith(
      "validation"
    );
    const invalidToken =
      this.props.resetPasswordData.state === newUserDataState.invalidToken;

    let failedMessage;
    if (validation) {
      failedMessage = this.props.resetPasswordData.state.split(",")[1];
    } else if (invalidToken) {
      failedMessage =
        "Something went wrong ! Maybe token is invalid or has expired.";
    }

    return (
      <form className="form" onSubmit={this.onSubmit}>
        <div className="signup-warning">
          <Alert show={validation || invalidToken} variant="danger">
            <p>{failedMessage}</p>
          </Alert>
        </div>

        <h2 className="form__heading">Reset Password</h2>

        <div className="form__fieldsWrapper">
          <input
            type="text"
            placeholder="New password"
            required
            autoFocus
            value={this.props.resetPasswordData.password}
            onChange={(event) => this.onInputFieldChange(event, "password")}
          />
          <input
            type="text"
            placeholder="Confirm password"
            required
            value={this.props.resetPasswordData.confirmPassword}
            onChange={(event) =>
              this.onInputFieldChange(event, "confirmPassword")
            }
          />
        </div>

        <button type="submit" className="form__submitBtn">
          {this.props.resetPasswordData.state ===
          newUserDataState.submitting ? (
            <img
              className="icon-spinner"
              src={spinner}
              alt="spinner icon svg"
            />
          ) : (
            "Update"
          )}
        </button>
      </form>
    );
  }
}

const mapStateToProps = ({ resetPasswordData }) => {
  return { resetPasswordData };
};

export default withRouter(
  connect(mapStateToProps, { setResetPassword, resetPassword })(Resetpassword)
);
