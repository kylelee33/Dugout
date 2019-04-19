import React, { Component } from "react";
import { Link } from "react-router-dom";

import { withFirebase } from "./Firebase";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import * as ROUTES from "../Constants/Routes";

const bodyStyle = {
  marginTop: '20px'
}

const PasswordForget = () => {
  return (
    <div style={bodyStyle}>
      <Typography align="center" variant="h4">
        Reset Password
      </Typography>
      <br />
      <PasswordForgetForm />
    </div>
  );
};

const INITIAL_STATE = {
  email: "",
  error: null
};

class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = e => {
    const { email } = this.state;

    this.props.firebase
      .doPasswordReset(email)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => {
        this.setState({ error });
      });

    e.preventDefault();
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { email, error } = this.state;

    const isInvalid = email === "";

    const formStyles = {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      margin: "0 auto"
    };

    const contStyles = {
      padding: "20px",
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      textAlign: "center",
      width: "75%",
      borderStyle: "solid",
      borderRadius: "2px",
      borderWidth: "0px",
      borderColor: "gray",
      boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
      backgroundColor: "#F2F2F2"
    };

    const textContainer = {
      padding: "10px",
      display: "flex",
      justifyContent: "center"
    };

    const buttonContainer = {
      display: "flex",
      justifyContent: "center",
      padding: "10px"
    };

    const hrStyle = {
      width: "1px",
      size: "100"
    };

    const spanStyle = {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around"
    };

    return (
      <div style={contStyles}>
        <form onSubmit={this.onSubmit}>
          <div style={formStyles}>
            <div style={textContainer}>
              <TextField
                name="email"
                value={this.state.email}
                onChange={this.onChange}
                type="email"
                variant="outlined"
                autoComplete="off"
                label="Email Address"
              />
            </div>
            <div style={buttonContainer}>
              <Button
                type="submit"
                disabled={isInvalid}
                style={{}}
                variant="contained"
                color="primary"
              >
                Reset Password
              </Button>
            </div>
          </div>

          {error && <p>{error.message}</p>}
        </form>
        <br />
      </div>
    );
  }
}

const PasswordForgetLink = () => {
  return (
    <Link to={ROUTES.PASSWORD_FORGET} style={{ textDecoration: "none" }}>
      <Typography variant="subtitle2">Forgot Password?</Typography>
    </Link>
  );
};
export default PasswordForget;

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export { PasswordForgetForm, PasswordForgetLink };
