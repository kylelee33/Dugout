import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { PasswordForgetLink } from '../PasswordForget';
import { SignUpLink } from './SignUp';
import { withFirebase } from '../Firebase/';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import * as ROUTES from '../../Constants/Routes';

const SignIn = () => {
    return (
        <div>
            <br />
            <Typography variant="h4" align="center">Please sign in</Typography>
            <br />
            <SignInForm />
        </div>
    );
};

const INITIAL_STATE = {
    email: '',
    password: '',
    error: null,
};

class SignInFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = {...INITIAL_STATE};
    }

    onSubmit = (e) => {
        const { email, password } = this.state;

        this.props.firebase 
            .doSignInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({...INITIAL_STATE});
                this.props.history.push(ROUTES.HOME);
            })
            .catch(error => {
                this.setState({ error });
            });

        e.preventDefault();
    };

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    render() {
        const { email, password, error } = this.state;

        const isInvalid = password === '' || email === '';

        const formStyles = {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            margin: '0 auto',
            
        }

        const contStyles = {
            padding: '20px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            textAlign: 'center',
            width: '75%',
            borderStyle: 'solid',
            borderRadius: '2px',
            borderWidth: '0px',
            borderColor: 'gray',
            boxShadow:  '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
            backgroundColor: '#F2F2F2',

        }

        const textContainer = {
            padding: '10px',
            display: 'flex',
            justifyContent: 'center',
        }

        const buttonContainer = {
            display: 'flex',
            justifyContent: 'center',
            padding: '10px',
            
        }

        const hrStyle = {
            width: "1px",
            size: "100",
        }

        return (
            <div style={contStyles}>
            <form onSubmit={this.onSubmit}>
            <div style={formStyles}>
                <div style={textContainer}>
                <TextField
                    name="email"
                    value={email}
                    onChange={this.onChange}
                    type="email"
                    variant="outlined"
                    autoComplete="off"
                    label="Email Address"
                    />
                </div>
                <div style={textContainer}>
                <TextField
                    name="password"
                    value={password}
                    onChange={this.onChange}
                    type="password"
                    variant="outlined"
                    autoComplete="off"
                    label="Password"
                    />
                </div>
                <div style={buttonContainer}>
                <Button type="submit" disabled={isInvalid} variant="contained" color="primary">Sign In</Button>
                </div>
                </div>

                

                {error && <p>{error.message}</p>}
                
            </form>
            <br />
            <div> <PasswordForgetLink /> <br /> <SignUpLink /> </div>
            </div>
            
        )
    }
}

const SignInForm = withRouter(withFirebase(SignInFormBase));

export default SignIn;

export { SignInForm };