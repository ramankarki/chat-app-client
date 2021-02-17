import React from "react";

import logo from "../logo.png";
import "./AuthComponent.scss";

class AuthComponent extends React.Component {
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
