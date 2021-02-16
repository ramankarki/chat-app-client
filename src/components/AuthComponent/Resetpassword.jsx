import React from "react";

function Signup() {
  const onSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <form className="form" onSubmit={onSubmit}>
      <h2 className="form__heading">Reset Password</h2>

      <div className="form__fieldsWrapper">
        <input type="text" placeholder="New password" />
        <input type="text" placeholder="Confirm password" />
      </div>

      <button type="submit" className="form__submitBtn">
        Update
      </button>
    </form>
  );
}

export default Signup;
