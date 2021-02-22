import React from "react";
import { Link } from "react-router-dom";

import { login, signup } from "../../utils/Routes";
import illustration from "./illustration.svg";
import logo from "../logo.png";
import "./Homepage.scss";

class Homepage extends React.Component {
  render() {
    return (
      <div className="container landing">
        <div className="landingPage-wrapper">
          <div className="landingPage">
            <div className="landingPage-actionWrapper">
              <div className="landingPage-action">
                <h6 className="landingPage-heading">
                  Search for your friends and
                  <span> Start Chatting</span>
                </h6>
                <div className="landingPage-buttons">
                  <Link to={signup} className="signup">
                    signup
                  </Link>
                  <Link to={login} className="login">
                    login
                  </Link>
                </div>
              </div>
            </div>
            <picture className="landingPage-image">
              <img src={illustration} alt="mobile chatting illustration" />
            </picture>
          </div>
          <div>
            <img className="landing-app-logo" src={logo} alt="app logo" />
            <p className="github-link">
              Chat App project by{" "}
              <a
                href="https://github.com/ramankarki"
                target="_blank"
                rel="noreferrer"
              >
                Raman Karki
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Homepage;
