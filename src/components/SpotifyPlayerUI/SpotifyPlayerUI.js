import React, { Component } from "react";
import spotify from "../../images/spotify.png";
import "./SpotifyPlayerUI.css";
import { uploadUser } from "../Register/Register.js";
import SpotifyWebPlayer from "react-spotify-web-playback";
import { connect } from "react-redux";
import { setToken, setUser } from "../../actions/actions";
const dotenv = require("dotenv");

dotenv.config();

const loginUrl = process.env.REACT_APP_LOGIN_URL;
const devLoginUrl = process.env.REACT_APP_DEV_LOGIN_URL;

class SpotifyPlayerUI extends Component {
  constructor(props) {
    super(props);
    const params = this.getHashParams();
    const token = params.access_token;

    if (token) {
      this.props.setToken(token);
    }

    this.state = {
      loggedIn: token ? true : false,
      token: token
    };
  }

  componentDidMount() {
    if (this.props.user === undefined) {
      this.getSpotifyUserInfo(this.state.token);
    }
    this.interval = setInterval(
      () => this.getCurrentSpotifySong(this.state.token),
      5000
    );
  }

  getCurrentSpotifySong(token) {
    fetch(`https://api.spotify.com/v1/me/player/currently-playing`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      method: "GET"
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          var error = new Error(
            "Error" + response.status + ": " + response.statusText
          );
          error.response = response;
          throw error;
        }
      })
      .then(data => {
        let currentSong = {
          timestamp: Date.now(),
          uri: data.item.uri,
          title: data.item.name,
          artist: data.item.artists[0].name,
          album: data.item.album.name
        };
        this.setState({ currentSong: currentSong });
        uploadUser(currentSong, this.state.user);
      })
      .catch(error => {
        console.log(error);
      });
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

  getSpotifyUserInfo(token) {
    console.log("getting Spotify user details");
    fetch(`https://api.spotify.com/v1/me/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      method: "GET"
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          var error = new Error(
            "Error" + response.status + ": " + response.statusText
          );
          error.response = response;
          throw error;
        }
      })
      .then(data => {
        let user = {
          spotifyId: data.id,
          displayName: data.display_name,
          image: data.images[0].url,
          location: "42.4884253,-83.4552092",
          group: "Public",
          currentSong: {
            uri: "",
            title: "",
            artist: "",
            album: ""
          }
        };
        this.props.setUser(user);
        this.setState({ user: user });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    return (
      <div
        style={{
          background: "#091740",
          height: "20vh",
          textAlign: "center",
          border: "1px solid black",
          borderTopLeftRadius: "120px"
        }}
      >
        <div>
          {!this.state.loggedIn && (
            <div
              style={{
                justifyContent: "center",
                position: "absolute",
                height: "5vh",
                width: "20vw",
                top: "5vh",
                left: "40vw"
              }}
            >
              <a href={loginUrl}>
                <img
                  src={spotify}
                  alt="login"
                  style={{
                    width: 60,
                    height: 60,
                    padding: "10px"
                  }}
                />
                Login to Spotify
              </a>
            </div>
          )}
          {this.state.loggedIn && (
            <div
              style={{
                display: "flex",
                direction: "row",
                position: "absolute",
                top: "5vh",
                left: "10vw",
                justifyContent: "center",
                width: "80vw"
              }}
            >
              <SpotifyWebPlayer
                styles={{
                  bgColor: "#091740",
                  trackNameColor: "#efefef",
                  trackArtistColor: "#efefef",
                  sliderTrackColor: "#A4A7B4",
                  sliderColor: "#efefef",
                  color: "#efefef",
                  loaderSize: "10vw",
                  magnifySliderOnHover: "true",
                  showSaveIcon: "true",
                  persistDeviceSelection: "true"
                }}
                token={this.state.token}
                callback={state => {
                  if (
                    state.devices[0] !== undefined &&
                    state.isActive !== true
                  ) {
                    fetch(`https://api.spotify.com/v1/me/player`, {
                      body: JSON.stringify({
                        device_ids: [state.devices[0].id],
                        play: true
                      }),
                      headers: {
                        Authorization: `Bearer ${this.state.token}`,
                        "Content-Type": "application/json"
                      },
                      method: "PUT"
                    });
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    selectedSong: state.selectedSong,
    user: state.user
  };
};

const mapDispatchToProps = {
  setToken: setToken,
  setUser: setUser
};

export default connect(mapStateToProps, mapDispatchToProps)(SpotifyPlayerUI);
