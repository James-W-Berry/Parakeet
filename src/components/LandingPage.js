import React, { Component } from "react";
import FadeIn from "react-fade-in";
import "bootstrap/dist/css/bootstrap.css";
import "./SplashScreen.css";
import Main from "./Main.js";
import logo from "../assets/logo.png";
import SpotifyIcon from "../assets/SpotifyIcon";
import {
  setToken,
  setUser,
  setLocation,
  setCurrentSong
} from "../actions/actions";
import { connect } from "react-redux";
import { Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { NavLink } from "react-router-dom";
import { Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import Img from "react-image";
import { makeStyles } from "@material-ui/core/styles";
import Lottie from "react-lottie";
import * as musicAnimation from "../assets/music-animation.json";
const dotenv = require("dotenv");

dotenv.config();

const loginUrl = process.env.REACT_APP_LOGIN_URL;
const devLoginUrl = process.env.REACT_APP_DEV_LOGIN_URL;

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: musicAnimation.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
};

const StyledButton = withStyles({
  root: {
    background: "#1db954",
    borderColor: "#1aa34a",
    borderRadius: 40,
    border: 0,
    color: "white",
    height: "10vh",
    width: "20vw",
    padding: "0 30px",
    boxShadow: "0 3px 5px 2px rgba(29, 185,	84, .3)"
  }
})(Button);

const useStyles = makeStyles({
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
  title: {
    fontFamily: "AntikorMonoLightItalic",
    fontSize: "120px",
    padding: "0 30px",
    color: "#f7f7f5"
  }
});

function LandingPage() {
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
          flex: 1,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "10vh"
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "17vh",
            right: "50vw"
          }}
        >
          <Lottie options={defaultOptions} height={150} width={100} />
        </div>
        <img src={logo} alt="" height="300" width="300" />
        <Typography className={classes.title}>Parakeet</Typography>

        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            margin: "10px",
            alignItems: "center"
          }}
        >
          <NavLink
            style={{
              textDecoration: "none"
            }}
            to="/signup"
          >
            <Button className={classes.root}>Sign Up</Button>
          </NavLink>

          <NavLink
            style={{
              textDecoration: "none"
            }}
            to="/signIn"
          >
            <Button className={classes.root}>Sign In</Button>
          </NavLink>
        </div>

        {/* <div
          style={{
            display: "flex",
            marginTop: "20vh",
            justifyContent: "center",
            alignSelf: "center"
          }}
        >
          <StyledButton
            variant="contained"
            href={devLoginUrl}
            startIcon={<SpotifyIcon />}
          >
            Login with Spotify
          </StyledButton>
        </div> */}
      </div>
    </div>
  );
}

export default LandingPage;
