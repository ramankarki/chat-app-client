import React from "react";
import { connect } from "react-redux";

import { setForgotPassword } from "../../actions";

class ForgotPassword extends React.Component {
  onSubmit = (event) => {
    event.preventDefault();
  };

  componentDidMount() {
    this.props.setForgotPassword("", "empty", true);
  }

  componentWillUnmount() {
    this.props.setForgotPassword("", "empty", false);
  }

  render() {
    if (!this.props.forgotPassword) return "";

    return (
      <form className="form" onSubmit={this.onSubmit}>
        <h2 className="form__heading">Forgot Password</h2>

        <p className="form__forgotPasswordDesc">
          Get reset token to your mailbox
        </p>

        <div className="form__fieldsWrapper">
          <input
            type="email"
            placeholder="Email"
            value={this.props.forgotPassword.email}
            onChange={(event) =>
              this.props.setForgotPassword(event.target.value, "typing", true)
            }
          />
        </div>

        <button type="submit" className="form__submitBtn">
          Send
        </button>
      </form>
    );
  }
}

const mapStateToProps = ({ forgotPassword }) => {
  return { forgotPassword };
};

export default connect(mapStateToProps, { setForgotPassword })(ForgotPassword);
