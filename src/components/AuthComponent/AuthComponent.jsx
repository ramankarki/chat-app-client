import React from "react";

import "./AuthComponent.scss";

class AuthComponent extends React.Component {
  render() {
    return (
      <div className="auth-component">
        <div className="app-logo-aside"></div>
        <div className="form-wrapper">{this.props.children}</div>
      </div>
    );
  }
}

export default AuthComponent;
