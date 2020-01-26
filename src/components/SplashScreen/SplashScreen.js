import React, { Component } from "react";
import FadeIn from "react-fade-in";
import "bootstrap/dist/css/bootstrap.css";
import "./SplashScreen.css";
import Main from "../Main/Main.js";
import bannerLogo from "../../images/bannerLogo.png";
import SpotifyIcon from "./SpotifyIcon";
import {
  setToken,
  setUser,
  setLocation,
  setCurrentSong
} from "../../actions/actions";
import { connect } from "react-redux";
import { Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
const dotenv = require("dotenv");

dotenv.config();

const loginUrl = process.env.REACT_APP_LOGIN_URL;
const devLoginUrl = process.env.REACT_APP_DEV_LOGIN_URL;

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
  },
  label: {
    textTransform: "capitalize"
  }
})(Button);

class SplashScreen extends Component {
  constructor(props) {
    super(props);
    const params = this.getHashParams();
    const token = params.access_token;

    if (token) {
      this.props.setToken(token);
    }

    this.state = {
      loggedIn: token ? true : false,
      token: token,
      done: undefined
    };
  }

  getHashParams() {
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

  render() {
    return (
      <div className="SplashScreen">
        {!this.state.loggedIn && (
          <FadeIn>
            <div
              style={{
                display: "flex",
                flex: 2,
                flexDirection: "row",
                justifyContent: "center"
              }}
            >
              <h1 className="SplashScreen_text">Parakeet</h1>
              <img src={bannerLogo} alt="" height="300" width="234" />
            </div>
            <div
              style={{
                display: "flex",
                marginTop: "20vh",
                justifyContent: "center",
                alignSelf: "center"
              }}
            >
              <StyledButton
                variant="contained"
                href={loginUrl}
                startIcon={<SpotifyIcon />}
              >
                Login with Spotify
              </StyledButton>
            </div>
          </FadeIn>
        )}
        {this.state.loggedIn && <Main />}
      </div>
    );
  }
}

const mapDispatchToProps = {
  setToken: setToken,
  setUser: setUser,
  setLocation: setLocation,
  setCurrentSong: setCurrentSong
};

export default connect(null, mapDispatchToProps)(SplashScreen);
