import React from "react";
import { Link } from "react-router-dom";

function Signup() {
  const onSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <form className="form" onSubmit={onSubmit}>
      <h2 className="form__heading">Login</h2>

      <div className="form__fieldsWrapper">
        <input type="email" placeholder="Email" />
        <input type="text" placeholder="Password" />
      </div>

      <Link to="/forgotpassword" className="form__forgotPassword">
        Forgot password ?
      </Link>

      <button type="submit" className="form__submitBtn">
        Login
      </button>

      <p className="form__switchAuth">
        Don't have an account ?{" "}
        <Link to="/signup" className="form__log-or-sign">
          Register
        </Link>{" "}
      </p>
    </form>
  );
}

export default Signup;
