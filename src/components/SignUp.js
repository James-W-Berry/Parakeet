import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import logo from "../assets/logo.png";

import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import ScaleLoader from "react-spinners/ScaleLoader";
import app from "../firebase";
import "firebase/auth";
import { NavLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  heading: {
    fontFamily: "AntikorMonoLightItalic",
    color: "#f7f7f5",
  },
  text: {
    fontFamily: "AntikorMonoLightItalic",
    color: "#e54750",
    "&:hover": {
      color: "#f7f7f5",
    },
  },
  textInput: {
    "& label ": {
      color: "#f7f7f5",
      fontFamily: "AntikorMonoLightItalic",
    },
    "& label.Mui-focused": {
      fontFamily: "AntikorMonoLightItalic",
      color: "#f7f7f580",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#e54750",
    },
  },
  input: {
    fontFamily: "AntikorMonoLightItalic",
    color: "#f7f7f5",
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(6, 0, 2),
    "&:hover": {
      color: "#f7f7f5",
      backgroundColor: "#e5475080",
    },
    fontFamily: "AntikorMonoLightItalic",
    backgroundColor: "#e54750",
    color: "#f7f7f5",
  },
  loader: {
    margin: theme.spacing(6, 0, 2),
  },
}));

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [failure, setFailure] = useState(false);
  const [failureMessage, setFailureMessage] = useState("");
  const classes = useStyles();

  function onSignUp(username, email, password) {
    setIsLoading(true);
    const db = app.firestore();

    app
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(function () {
        var userId = app.auth().currentUser.uid;

        db.collection("users")
          .doc(userId)
          .set({
            displayName: username,
            displayNameVisible: false,
            group: "ETVOvDEqnWL9I7fURN3D",
          })
          .catch(function (error) {
            console.log(error);
          });

        console.log("sign up successful");
      })
      .catch(function (error) {
        var errorMessage = error.message;
        setIsLoading(false);
        setFailure(true);
        setFailureMessage(errorMessage);
      });
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <NavLink
          className={classes.text}
          style={{
            textDecoration: "none",
          }}
          to="/"
        >
          <img src={logo} alt="" height="80" width="80" style={{ flex: 1 }} />
        </NavLink>
        <Typography className={classes.heading} component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                className={classes.textInput}
                margin="normal"
                autoFocus
                required
                fullWidth
                name="userName"
                type="username"
                id="userName"
                label="User name"
                InputProps={{
                  className: classes.input,
                }}
                onChange={(event) => {
                  setUsername(event.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                className={classes.textInput}
                InputProps={{
                  className: classes.input,
                }}
                margin="normal"
                required
                fullWidth
                name="email"
                label="Email Address"
                type="email"
                id="email"
                autoComplete="email"
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                className={classes.textInput}
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                InputProps={{
                  className: classes.input,
                }}
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
              />
            </Grid>
          </Grid>
          {failure && (
            <div
              className={classes.loader}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                className={classes.heading}
                style={{ color: "#e54750" }}
                component="h1"
                variant="body2"
              >
                {`${failureMessage}`}
              </Typography>
            </div>
          )}
          {isLoading ? (
            <div
              className={classes.loader}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ScaleLoader color={"#e54750"} />
            </div>
          ) : (
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={() => {
                onSignUp(username, email, password);
              }}
            >
              Sign Up
            </Button>
          )}
          <Grid
            container
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "30px",
            }}
          >
            <Grid item>
              <NavLink
                className={classes.text}
                variant="body2"
                style={{
                  textDecoration: "none",
                }}
                to="/signin"
              >
                {"Already have an account? Sign in"}
              </NavLink>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
