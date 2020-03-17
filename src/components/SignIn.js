import React, { useState } from "react";
import firebase from "../firebase";
import "firebase/auth";
import { NavLink } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import ScaleLoader from "react-spinners/ScaleLoader";

const useStyles = makeStyles({
  textInput: {
    width: "100%",
    marginTop: "20px",
    "& label ": {
      color: "#f7f7f5",
      fontFamily: "AntikorMonoLightItalic"
    },
    "& label.Mui-focused": {
      fontFamily: "AntikorMonoLightItalic",
      color: "#f7f7f580"
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
    color: "#e54750",
    fontSize: "32px"
  },
  forgotButton: {
    "&:hover": {
      color: "#f7f7f5"
    },
    fontFamily: "AntikorMonoLightItalic",
    border: 0,
    borderRadius: 3,
    fontSize: "14px",
    color: "#e54750",
    height: 48,
    padding: "0 30px",
    marginTop: "20px"
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
      <div
        style={{
          display: "flex",
          flex: "1",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <NavLink
          style={{
            textDecoration: "none"
          }}
          to="/home"
        >
          <Button className={classes.root}>{"< Back"}</Button>
        </NavLink>
      </div>

      <div
        style={{
          flex: 2,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center"
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

        <NavLink
          style={{
            textDecoration: "none"
          }}
          to="/forgotpassword"
        >
          <Button className={classes.forgotButton}>Forgot Password?</Button>
        </NavLink>
      </div>

      <div
        style={{
          display: "flex",
          flex: "1",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {isLoading ? (
          <ScaleLoader color={"#e54750"} />
        ) : (
          <Button
            onClick={() => {
              onSignIn(email, password);
            }}
            className={classes.root}
          >
            Sign In >
          </Button>
        )}
      </div>
    </div>
  );
}

export default SignIn;
