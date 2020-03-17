import React, { useState, useEffect } from "react";
import firebase from "../firebase";
import "firebase/auth";
import { NavLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Typography, IconButton } from "@material-ui/core";
import SpotifyIcon from "../assets/SpotifyIcon";
import Lottie from "react-lottie";
import * as partyAnimation from "../assets/party.json";

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
    fontSize: "42px"
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
  },
  title: {
    fontFamily: "AntikorDisplayLight",
    fontSize: "80px",
    padding: "0 30px",
    color: "#f7f7f5"
  },
  spotifyButton: {
    background: "#1db954",
    borderColor: "#1aa34a",
    borderRadius: 60,
    color: "white",
    height: "80px",
    width: "80px"
  }
});

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: partyAnimation.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
};

function uploadAccessTokens(tokens) {
  const userId = firebase.auth().currentUser.uid;

  const docRef = firebase
    .firestore()
    .collection("users")
    .doc(userId);

  return docRef
    .set(
      {
        tokens: {
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token
        }
      },
      { merge: true }
    )
    .then(function() {
      console.log("successfully set tokens");
    })
    .catch(function(error) {
      console.log(error);
    });
}

const loginUrl = process.env.REACT_APP_LOGIN_URL;
const devLoginUrl = process.env.REACT_APP_DEV_LOGIN_URL;

function SpotifyLogin() {
  const [tokens, setTokens] = useState();

  useEffect(() => {
    const tokens = getHashParams();
    if (tokens?.access_token) {
      setTokens(tokens);
      uploadAccessTokens(tokens);
    }
  }, []);

  function getHashParams() {
    var hashParams = {};
    var e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    e = r.exec(q);
    while (e) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
      e = r.exec(q);
    }
    return hashParams;
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
      {tokens?.access_token ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <Lottie options={defaultOptions} height={"100vh"} width={"100vw"} />
          <div style={{ position: "absolute", top: "45vh", right: "35vw" }}>
            <NavLink
              style={{
                textDecoration: "none"
              }}
              to="/home"
            >
              <Button className={classes.root}>Success! Let's Party ></Button>
            </NavLink>
          </div>
        </div>
      ) : (
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <Typography className={classes.title}>Login With Spotify</Typography>

          <div
            style={{
              display: "flex",
              marginTop: "20vh",
              justifyContent: "center",
              alignSelf: "center"
            }}
          >
            <IconButton href={devLoginUrl} className={classes.spotifyButton}>
              <SpotifyIcon />
            </IconButton>
          </div>
        </div>
      )}
    </div>
  );
}

export default SpotifyLogin;
