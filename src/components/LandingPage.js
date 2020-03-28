import React from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import logo from "../assets/logo.png";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { NavLink } from "react-router-dom";
import Lottie from "react-lottie";
import * as musicAnimation from "../assets/music-animation.json";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: musicAnimation.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
};

const useStyles = makeStyles(theme => ({
  title: {
    fontFamily: "AntikorDisplayLight",
    fontSize: "10vw",
    padding: "0 30px",
    color: "#f7f7f5",
    marginTop: "20px"
  },
  heading: {
    fontFamily: "AntikorMonoLightItalic",
    color: "#f7f7f5"
  },
  text: {
    fontFamily: "AntikorMonoLightItalic",
    color: "#e54750",
    "&:hover": {
      color: "#f7f7f5"
    }
  },
  textInput: {
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
  input: {
    fontFamily: "AntikorMonoLightItalic",
    color: "#f7f7f5"
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(6, 0, 2),
    "&:hover": {
      color: "#f7f7f5",
      backgroundColor: "#e5475080"
    },
    fontFamily: "AntikorMonoLightItalic",
    backgroundColor: "#e54750",
    color: "#f7f7f5"
  },
  loader: {
    margin: theme.spacing(6, 0, 2)
  }
}));

export default function LandingPage() {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />

      <div className={classes.paper}>
        <img src={logo} alt="" height="75%" width="75%" style={{ flex: 1 }} />
        <div
          style={{
            position: "absolute",
            top: "15vh",
            right: "50vw"
          }}
        >
          <Lottie options={defaultOptions} height={150} width={100} />
        </div>
        <Typography className={classes.title} component="h1" variant="h5">
          Parakeet
        </Typography>

        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <NavLink
                className={classes.text}
                variant="body2"
                style={{
                  textDecoration: "none"
                }}
                to="/signin"
              >
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Sign In
                </Button>
              </NavLink>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box style={{ marginTop: "100px" }} mt={5}>
        <Typography
          variant="body2"
          style={{ fontFamily: "AntikorMonoLightItalic", color: "#e54750" }}
          align="center"
        >
          {"Copyright © "}
          <Link
            className={classes.text}
            style={{ textDecoration: "none" }}
            href="https://www.parakeet.web.app"
          >
            Parakeet
          </Link>{" "}
          {new Date().getFullYear()}
          {"."}
        </Typography>
      </Box>
    </Container>
  );
}
