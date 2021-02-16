import React from "react";
import { Link } from "react-router-dom";

import "./Homepage.scss";

class Homepage extends React.Component {
  render() {
    return (
      <div>
        this is homepage
        <div>
          <Link to="/login">login</Link>
        </div>
        <div>
          <Link to="/signup">signup</Link>
        </div>
      </div>
    );
  }
}

export default Homepage;
