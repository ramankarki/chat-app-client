import React from "react";
import { HashRouter, Route } from "react-router-dom";
import {
  root,
  login,
  signup,
  forgotpassword,
  resetpassword,
  emailConfirmation,
} from "../utils/Routes";

import "bootstrap/dist/css/bootstrap.min.css";
import AuthComponent from "./AuthComponent/AuthComponent";
import Signup from "./AuthComponent/Signup";
import Login from "./AuthComponent/Login";
import Forgotpassword from "./AuthComponent/Forgotpassword";
import Resetpassword from "./AuthComponent/Resetpassword";
import EmailConfirmation from "./AuthComponent/EmailConfirmation";
import Homepage from "./Homepage/Homepage";
import "./App.scss";

class App extends React.Component {
  render() {
    return (
      <div>
        <HashRouter>
          <Route path={root} exact component={Homepage} />
          <Route path={login} exact>
            <AuthComponent>
              <Login />
            </AuthComponent>
          </Route>
          <Route path={signup} exact>
            <AuthComponent>
              <Signup />
            </AuthComponent>
          </Route>
          <Route path={forgotpassword} exact>
            <AuthComponent>
              <Forgotpassword />
            </AuthComponent>
          </Route>
          <Route path={resetpassword} exact>
            <AuthComponent>
              <Resetpassword />
            </AuthComponent>
          </Route>
          <Route path={emailConfirmation} exact component={EmailConfirmation} />
        </HashRouter>
      </div>
    );
  }
}

export default App;
