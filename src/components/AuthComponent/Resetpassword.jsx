import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { setResetPassword } from "../../actions";
import { newUserDataState } from "../../actions/types";

class Resetpassword extends React.Component {
  onSubmit = (event) => {
    event.preventDefault();

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

    console.log("submitting");
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
    return (
      <form className="form" onSubmit={this.onSubmit}>
        <h2 className="form__heading">Reset Password</h2>

        <div className="form__fieldsWrapper">
          <input
            type="text"
            placeholder="New password"
            required
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
          Update
        </button>
      </form>
    );
  }
}

const mapStateToProps = ({ resetPasswordData }) => {
  return { resetPasswordData };
};

export default withRouter(
  connect(mapStateToProps, { setResetPassword })(Resetpassword)
);
