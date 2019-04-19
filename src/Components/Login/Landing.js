import React from 'react';
import Typography from '@material-ui/core/Typography';
import SignUp, { SignUpForm } from './SignUp';
import { SignInForm } from './SignIn';

const bodyStyle = {
    width: '100%',
    marginTop: '60px',
}

const Landing = () => {
    return (
        <div style={bodyStyle}>
            <br />
            <Typography align="center" variant="h2">Welcome to <strong>Dugout</strong></Typography>
            <br />
            <Typography align="center" variant="h6">Talk about the baseball game while getting live MLB updates from around the league!</Typography>
            <br />
            <Typography align="center" variant="h5">Please sign in</Typography>
            <br />
            <SignInForm />
            <br />
        </div>
    );
};

export default Landing;