import React from "react";

import history from "../../utils/history";
import { conversations } from "../../utils/Routes";
import logo from "../logo.png";
import "./AuthComponent.scss";

class AuthComponent extends React.Component {
  componentDidMount() {
    const token = localStorage.getItem("token");
    const exp = localStorage.getItem("exp");

    if (token && +exp >= Date.now()) {
      return history.push(conversations);
    }
  }

  render() {
    return (
      <div className="auth-component">
        <div className="app-logo-aside">
          <img src={logo} alt="chat app logo" />
        </div>
        <div className="form-wrapper">{this.props.children}</div>
      </div>
    );
  }
}

export default AuthComponent;
