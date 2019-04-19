import React from 'react';
import { PasswordForgetForm } from '../PasswordForget';
import PasswordChange from '../PasswordChange';
import { AuthUserContext } from '../Session';
import Typography from '@material-ui/core/Typography';

import { SignInForm } from './SignIn';

const Account = () => {
    return(
        <div>
        <AuthUserContext.Consumer>{authUser => authUser ? <AccountAuth /> : <AccountNoAuth />}
        </AuthUserContext.Consumer>
        </div>
        )
};
const bodyStyle = {
    paddingTop: '70px',
}
const AccountAuth = () => {
    return (
        <div style={bodyStyle}>
            <Typography align="center" variant="h4">My Account</Typography>
            <br />
            <Typography align="center" variant="h6">Reset Password</Typography>
            <PasswordForgetForm />
            <br />
            <Typography align="center" variant="h6">Update Password</Typography>
            <PasswordChange />
            <br />
        </div>
    );
}

const AccountNoAuth = () => {
    return(
        <div>
            <br />
            <Typography align="center" variant="h4">Please sign in</Typography>
            <br />
            <SignInForm />
            
        </div>
    )
}

export default Account;