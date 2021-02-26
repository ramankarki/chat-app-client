import React, { useEffect } from "react";
import { connect } from "react-redux";

import { resendAccountActivateEmail } from "../../actions";
import { newUserDataState } from "../../actions/types";
import history from "../../utils/history";
import { signup, conversations } from "../../utils/Routes";
import logo from "../logo.png";
import spinner from "../spinner.svg";

function EmailConfirmation(props) {
  useEffect(() => {
    const token = localStorage.getItem("token");
    const exp = localStorage.getItem("exp");

    if (token && +exp >= Date.now()) {
      return history.push(conversations);
    }
  }, []);

  const resendEmail = () => {
    if (
      props.newUserData &&
      props.newUserData.state === newUserDataState.submitted
    ) {
      props.resendAccountActivateEmail();
    }
  };

  if (props.newUserData) {
    return (
      <div className="confirmation">
        <div className="confirmation__wrapper">
          <picture className="chat-app-logo">
            <img src={logo} alt="chat app logo" />
          </picture>
          <h1 className="confirmation__heading">
            Please confirm you email address
          </h1>
          <p className="confirmation__desc">
            An email has been sent to your mail account. Please check your email
            to{" "}
            <span>
              activate chat app account. <br />
            </span>
            If you don't see any email in inbox, check promotions tab or spam
            folder.
          </p>
          <p className="confirmation__resendEmailQue">Didn't get any email?</p>
          <button onClick={resendEmail} className="confirmation__resendBtn">
            {props.newUserData.state === newUserDataState.resubmitting ? (
              <img
                className="icon-spinner-dark"
                src={spinner}
                alt="spinner icon svg"
              />
            ) : (
              "Resend email"
            )}
          </button>
        </div>
      </div>
    );
  } else {
    history.push(signup);
    return "";
  }
}

const mapStateToProps = ({ newUserData }) => {
  return { newUserData };
};

export default connect(mapStateToProps, { resendAccountActivateEmail })(
  EmailConfirmation
);
