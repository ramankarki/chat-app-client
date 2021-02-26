import React from "react";
import { connect } from "react-redux";
import { HashRouter, Route } from "react-router-dom";
import {
  root,
  login,
  signup,
  forgotpassword,
  resetpassword,
  emailConfirmation,
  activateAccount,
  conversations,
  updateProfile,
  changePassword,
} from "../utils/Routes";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import AuthComponent from "./AuthComponent/AuthComponent";
import Signup from "./AuthComponent/Signup";
import Login from "./AuthComponent/Login";
import Forgotpassword from "./AuthComponent/Forgotpassword";
import Resetpassword from "./AuthComponent/Resetpassword";
import EmailConfirmation from "./AuthComponent/EmailConfirmation";
import ActivateAccount from "./AuthComponent/ActivateAccount";
import Conversations from "./Conversations";
import Homepage from "./Homepage/Homepage";
import Profile from "./Profile";
import ChangePassword from "./ChangePassword";
import { loadData } from "../actions";
import "./App.scss";

class App extends React.Component {
  componentDidMount() {
    this.props.loadData();
  }

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
          <Route path={activateAccount} exact>
            <AuthComponent>
              <ActivateAccount />
            </AuthComponent>
          </Route>
          <Route path={conversations} exact component={Conversations} />
          <Route path={updateProfile} exact component={Profile} />
          <Route path={changePassword} exact component={ChangePassword} />
        </HashRouter>
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  return { auth };
};

export default connect(mapStateToProps, {
  loadData,
})(App);
