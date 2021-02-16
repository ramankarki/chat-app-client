import React from "react";
import { Link } from "react-router-dom";

function Signup() {
  const onSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <form className="form" onSubmit={onSubmit}>
      <h2 className="form__heading">Sign up</h2>

      <div className="form__fieldsWrapper">
        <input type="text" placeholder="Username" />
        <input type="email" placeholder="Email" />
        <input type="text" placeholder="Password" />
        <input type="text" placeholder="Confirm password" />
      </div>

      <button type="submit" className="form__submitBtn">
        Signup
      </button>

      <p className="form__switchAuth">
        Already have an account ?{" "}
        <Link to="/login" className="form__log-or-sign">
          Login
        </Link>{" "}
      </p>
    </form>
  );
}

export default Signup;
