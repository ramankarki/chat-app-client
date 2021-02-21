import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import Alert from "react-bootstrap/Alert";
import { setLoginData, loginUser } from "../../actions";
import { forgotpassword, signup } from "../../utils/Routes";
import { newUserDataState } from "../../actions/types";
import spinner from "../spinner.svg";

class Signup extends React.Component {
  onSubmit = (event) => {
    event.preventDefault();
    if (this.props.loginUserData.state === "submitting") return;
    this.props.loginUser();
  };

  onInputFieldChange = (event, field) => {
    switch (field) {
      case "email":
        this.props.setLoginData(
          true,
          event.target.value,
          this.props.loginUserData.password
        );
        break;
      case "password":
        this.props.setLoginData(
          true,
          this.props.loginUserData.email,
          event.target.value
        );
        break;
      default:
        this.props.setLoginData(
          true,
          this.props.loginUserData.email,
          this.props.loginUserData.password
        );
    }
  };

  componentDidMount() {
    this.props.setLoginData(true, "", "");
  }

  componentWillUnmount() {
    this.props.setLoginData(false);
  }

  render() {
    if (!this.props.loginUserData) return "";
    return (
      <form className="form" onSubmit={this.onSubmit}>
        <div className="signup-warning">
          <Alert
            show={this.props.loginUserData.loginFailed === true}
            variant="danger"
          >
            <p>Email or password is wrong !!!</p>
          </Alert>
        </div>

        <h2 className="form__heading">Login</h2>

        <div className="form__fieldsWrapper">
          <input
            type="email"
            placeholder="Email"
            value={this.props.loginUserData.email}
            required
            autoFocus
            onChange={(event) => this.onInputFieldChange(event, "email")}
          />
          <input
            type="text"
            placeholder="Password"
            value={this.props.loginUserData.password}
            required
            onChange={(event) => this.onInputFieldChange(event, "password")}
          />
        </div>

        <Link to={forgotpassword} className="form__forgotPassword">
          Forgot password ?
        </Link>

        <button type="submit" className="form__submitBtn">
          {this.props.loginUserData.state === newUserDataState.submitting ? (
            <img
              className="icon-spinner"
              src={spinner}
              alt="spinner icon svg"
            />
          ) : (
            "Login"
          )}
        </button>

        <p className="form__switchAuth">
          Don't have an account ?{" "}
          <Link to={signup} className="form__log-or-sign">
            Register
          </Link>{" "}
        </p>
      </form>
    );
  }
}

const mapStateToProps = ({ loginUserData }) => {
  return { loginUserData };
};

export default connect(mapStateToProps, { setLoginData, loginUser })(Signup);
