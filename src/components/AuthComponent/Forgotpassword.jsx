import React from "react";
import { connect } from "react-redux";

import { setForgotPassword, sendForgotPassword } from "../../actions";
import Alert from "react-bootstrap/Alert";
import spinner from "../spinner.svg";

class ForgotPassword extends React.Component {
  onSubmit = (event) => {
    event.preventDefault();

    if (this.props.forgotPassword.state === "submitting") return;

    this.props.sendForgotPassword();
  };

  componentDidMount() {
    this.props.setForgotPassword("", "empty", true);
  }

  componentWillUnmount() {
    this.props.setForgotPassword("", "empty", false);
  }

  render() {
    if (!this.props.forgotPassword) return "";

    const show =
      this.props.forgotPassword.state === "submitted" ||
      this.props.forgotPassword.state === "failed";

    const variant =
      this.props.forgotPassword.state === "submitted" ? "success" : "danger";

    const failedMessage =
      variant === "success"
        ? "An email has been sent to your mail account. It will only valid for 10min"
        : "Either there is no user with this email or has not activated account";

    return (
      <form className="form" onSubmit={this.onSubmit}>
        <div className="signup-warning">
          <Alert show={show} variant={variant}>
            <p>{failedMessage}</p>
          </Alert>
        </div>

        <h2 className="form__heading">Forgot Password</h2>

        <p className="form__forgotPasswordDesc">
          Get reset token to your mailbox
        </p>

        <div className="form__fieldsWrapper">
          <input
            type="email"
            placeholder="Email"
            value={this.props.forgotPassword.email}
            required
            autoFocus
            onChange={(event) =>
              this.props.setForgotPassword(event.target.value, "typing", true)
            }
          />
        </div>

        <button type="submit" className="form__submitBtn">
          {this.props.forgotPassword.state === "submitting" ? (
            <img
              className="icon-spinner"
              src={spinner}
              alt="spinner icon svg"
            />
          ) : (
            "Send"
          )}
        </button>
      </form>
    );
  }
}

const mapStateToProps = ({ forgotPassword }) => {
  return { forgotPassword };
};

export default connect(mapStateToProps, {
  setForgotPassword,
  sendForgotPassword,
})(ForgotPassword);
