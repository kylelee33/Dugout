import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase/';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import Paper from '@material-ui/core/Paper';


import * as ROUTES from '../../Constants/Routes';

const SignUp = () => {
    return (
        <div>
            <br />
            <Typography align="center" variant="h4">Create an account</Typography>
            <br />
            <SignUpForm />
            
        </div>
    );
};

const INITIAL_STATE = {
    displayName: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    error: null
}

class SignUpFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = {...INITIAL_STATE}
    }


    onSubmit = (e) => {
        const { displayName, email, passwordOne } = this.state;

        this.props.firebase
            .doCreateUserWithEmailAndPassword(email, passwordOne)
            .then(authUser => {
                this.props.firebase.doUpdateProfile({displayName: displayName})
                return this.props.firebase
                
                    .user(authUser.user.uid)
                    .set({
                        displayName, 
                        email,
                    });
                    

            })
            .then(() => {
                
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.HOME);
            })
            .catch(error => {
                this.setState({ error });
            });

        

        

        e.preventDefault();
    }

    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    };

    render() {
        const {
            displayName,
            email,
            passwordOne,
            passwordTwo,
            error,
        } = this.state;

        const isInvalid = 
            passwordOne !== passwordTwo ||
            passwordOne === '' ||
            email === '';

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
            justifyContent: 'center',
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
                    name="passwordOne"
                    value={passwordOne}
                    onChange={this.onChange}
                    type="password"
                    variant="outlined"
                    autoComplete="off"
                    label="Password"
                    />
                </div>
                <div style={textContainer}>
                <TextField
                    name="passwordTwo"
                    value={passwordTwo}
                    onChange={this.onChange}
                    type="password"
                    variant="outlined"
                    autoComplete="off"
                    label="Confirm Password"
                    />
                </div>
                <div style={buttonContainer}>
                <Button type="submit" disabled={isInvalid} variant="contained" color="primary">Sign Up</Button>
                </div>
                </div>

                

                {error && <p>{error.message}</p>}
                
            </form>
            </div>
        )
    }
}

const SignUpLink = () => {
    return(
       <Link to={ROUTES.SIGN_UP} style={{ textDecoration: 'none' }}><Typography variant="subtitle2">Don't have an account? Sign up for one!</Typography></Link>
    )
}

const SignUpForm = withRouter(withFirebase(SignUpFormBase));

export default SignUp;

export { SignUpForm, SignUpLink };