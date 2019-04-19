import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { withFirebase } from './Components/Firebase';
import { AuthUserContext } from './Components/Session/index';

import Navigation from './Components/Navigation';
import LandingPage from './Components/Login/Landing';
import SignUp from './Components/Login/SignUp';
import SignIn from './Components/Login/SignIn';
import PasswordForget from './Components/PasswordForget';
import Home from './Components/Login/Home';
import Account from './Components/Login/Account';

import * as ROUTES from './Constants/Routes';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            authUser: null
        };
    }

    componentDidMount() {
        this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
            authUser ? this.setState({ authUser }) : this.setState({ authUser: null});

        });
    }

    componentWillUnmount() {
        this.listener();
    }

    render() {
        return (
            <div>
                <AuthUserContext.Provider value={this.state.authUser}>
                <Router>
                    <Navigation />
                    <Route exact path={ROUTES.LANDING} component={LandingPage} />
                    <Route path={ROUTES.SIGN_UP} component={SignUp} />
                    <Route path={ROUTES.SIGN_IN} component={SignIn} />
                    <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForget} />
                    <Route path={ROUTES.HOME} component={Home} />
                    <Route path={ROUTES.ACCOUNT} component={Account} />
                </Router>
                </AuthUserContext.Provider>
            </div>
        );
    }
}

export default withFirebase(App);