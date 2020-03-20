import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import logo from "../assets/logo.png";
import { Button } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
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
    fontFamily: "AntikorDisplayLight",
    fontSize: "15vw",
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
        justifyContent: "center",
        display: "flex",
        flexDirection: "column"
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

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div style={{ flex: 1 }}>
            <img src={logo} alt="" height="300" width="300" />
          </div>

          <div style={{ flex: 1 }}>
            <Typography className={classes.title}>Parakeet</Typography>
          </div>
        </div>

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
      </div>
    </div>
  );
}

export default LandingPage;
