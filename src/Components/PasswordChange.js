import React, { Component } from "react";

import { withFirebase } from "./Firebase";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const INITIAL_STATE = {
  passwordOne: "",
  passwordTwo: "",
  error: null
};

class PasswordChange extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = e => {
    const { passwordOne } = this.state;

    this.props.firebase
      .doPasswordUpdate(passwordOne)
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
    const { passwordOne, passwordTwo, error } = this.state;

    const isInvalid = passwordOne !== passwordTwo || passwordOne === "";

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
              <Button
                type="submit"
                disabled={isInvalid}
                variant="contained"
                color="primary"
              >
                Update Password
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

export default withFirebase(PasswordChange);
