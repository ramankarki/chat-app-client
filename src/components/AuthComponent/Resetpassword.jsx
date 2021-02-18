import React from "react";

class Resetpassword extends React.Component {
  onSubmit = (event) => {
    event.preventDefault();
  };

  render() {
    return (
      <form className="form" onSubmit={this.onSubmit}>
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
}

export default Resetpassword;
