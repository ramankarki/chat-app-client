import React from "react";
import { HashRouter, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import AuthComponent from "./AuthComponent/AuthComponent";
import Signup from "./AuthComponent/Signup";
import Login from "./AuthComponent/Login";
import Homepage from "./Homepage/Homepage";
import "./App.scss";

class App extends React.Component {
  render() {
    return (
      <div>
        <HashRouter>
          <Route path="/" exact component={Homepage} />
          <Route path="/login" exact>
            <AuthComponent>
              <Login />
            </AuthComponent>
          </Route>
          <Route path="/signup" exact>
            <AuthComponent>
              <Signup />
            </AuthComponent>
          </Route>
        </HashRouter>
      </div>
    );
  }
}

export default App;
