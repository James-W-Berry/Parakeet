import React, { useState } from "react";
import firebase from "../firebase";
import "firebase/auth";
import SignUp from "./SignUp";
import { NavLink } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Typography, Divider } from "@material-ui/core";
import PropTypes from "prop-types";
import Img from "react-image";
import landingPhoto from "../assets/bannerLogo.png";
import logo from "../assets/bannerLogo.png";
import { withStyles } from "@material-ui/core/styles";
import SyncLoader from "react-spinners/SyncLoader";

const Logo = () => <Img src={logo} height={60} />;

const useStyles = makeStyles({
  textInput: {
    width: "20vw",
    "& label ": {
      color: "#e5475080"
    },
    "& label.Mui-focused": {
      color: "#e54750"
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#e54750"
    }
  },
  root: {
    "&:hover": {
      color: "#f7f7f5"
    },
    fontFamily: "AntikorMonoLightItalic",
    border: 0,
    borderRadius: 3,
    fontSize: "20px",
    color: "#e54750",
    height: 48,
    padding: "0 30px"
  },
  input: {
    fontFamily: "AntikorMonoLightItalic",

    color: "#e54750"
  },
  forgotButton: {
    "&:hover": {
      color: "#171820"
    },
    border: 0,
    borderRadius: 3,
    color: "#17182080",
    height: 48,
    padding: "0 30px"
  }
});

function SignIn(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function onSignIn(email, password) {
    setIsLoading(true);
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(function() {
        console.log("Sign in successful");
      })
      .catch(function(error) {
        alert("Incorrect email or password, please try again");
        setIsLoading(false);
      });
  }

  const classes = useStyles();

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        background: "#252a2e",
        alignSelf: "center",
        display: "flex",
        flex: 1
      }}
    >
      <NavLink
        style={{
          textDecoration: "none"
        }}
        to="/home"
      >
        <Button className={classes.root}>Back</Button>
      </NavLink>
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "10vh"
        }}
      >
        <TextField
          className={classes.textInput}
          id="standard-email-input"
          label="Email"
          type="email"
          InputProps={{
            className: classes.input
          }}
          autoComplete="email"
          onChange={event => {
            setEmail(event.target.value);
          }}
        />
        <TextField
          className={classes.textInput}
          id="standard-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
          InputProps={{
            className: classes.input
          }}
          onChange={event => {
            setPassword(event.target.value);
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          flex: "1",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "30px",
          marginRight: "20px"
        }}
      >
        {isLoading ? (
          <SyncLoader color={"#171820"} />
        ) : (
          <Button
            onClick={() => {
              onSignIn(email, password);
            }}
            className={classes.root}
          >
            Sign In
          </Button>
        )}
      </div>

      <div
        style={{
          display: "flex",
          flex: "1",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "120px"
        }}
      >
        <NavLink
          style={{
            textDecoration: "none"
          }}
          to="/forgotpassword"
        >
          <Button className={classes.forgotButton}>Forgot Password?</Button>
        </NavLink>
      </div>
    </div>
  );
}

export default SignIn;
