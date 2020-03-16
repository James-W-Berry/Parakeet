import React, { Component } from "react";
import spotify from "../assets/spotify.png";
import "./SpotifyPlayerUI.css";
import { uploadUser, uploadSong } from "./FirebaseActions.js";
import SpotifyWebPlayer from "react-spotify-web-playback";
import { connect } from "react-redux";
import {
  setToken,
  setUser,
  setLocation,
  setCurrentSong
} from "../actions/actions";
import Geolocation from "./GeoLocation";
import { geolocated } from "react-geolocated";
import { Button } from "@material-ui/core";

const dotenv = require("dotenv");

dotenv.config();

const prodLoginUrl = process.env.REACT_APP_LOGIN_URL;
const devLoginUrl = process.env.REACT_APP_DEV_LOGIN_URL;
const prodRefreshTokenUrl = process.env.REACT_APP_REFRESH_URL;
const devRefreshTokenUrl = process.env.REACT_APP_DEV_REFRESH_URL;

class SpotifyPlayerUI extends Component {
  constructor(props) {
    super(props);
    const params = this.getHashParams();
    const token = params.access_token;
    const refreshToken = params.refresh_token;

    if (token) {
      this.props.setToken(token);

      //TODO: this.props.setRefreshToken(refreshToken)
    }

    this.state = {
      loggedIn: token ? true : false,
      token: token,
      currentSong: null,
      refresh_token: refreshToken,
      location: {
        latitude: "",
        longitude: ""
      }
    };
  }

  componentDidMount() {
    if (this.state.token) {
      this.getSpotifyUserInfo(this.state.token);
      this.interval = setInterval(
        () => this.getCurrentSpotifySong(this.state.token),
        10000
      );
    }
  }

  getSpotifyUserInfo(token) {
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
          image: data.images[0].url || undefined
        };

        this.props.setUser(user);
      })
      .catch(error => {
        console.log(`error: ${error}`);
        return false;
      });
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
        if (data !== undefined) {
          let currentSong = {
            timestamp: Date.now().toString(),
            uri: data.item.uri,
            songTitle: data.item.name,
            artist: data.item.artists[0].name,
            album: data.item.album.name
          };

          this.props.setCurrentSong(currentSong);

          uploadUser(
            currentSong,
            this.props.store.user,
            this.props.coords,
            this.props.store.groups
          );
          uploadSong(currentSong);
          this.setState({ currentSong: currentSong });
        } else {
          console.log(
            "Error: no data retrieved from currently playing endpoint"
          );
        }
      })
      .catch(error => {
        console.log(`error: ${error}`);
      });
  }

  playSelectedSong = uri => {
    this.setState({ previouslySelectedSong: this.props.store.selectedSong });
    fetch(
      `https://api.spotify.com/v1/me/player/play?device_id=${this.state.playerInstance}`,
      {
        method: "PUT",
        body: JSON.stringify({ uris: [uri] }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.state.token}`
        }
      }
    );
  };

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

  getRefreshToken() {
    fetch(devRefreshTokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        refresh_token: this.state.refresh_token
      })
    }).then(response => {
      response.json().then(data => {
        let refreshedToken = data.access_token;
        let expiresIn = data.expires_in;
      });
    });
  }

  render() {
    if (
      this.props.store !== null &&
      this.props.store.selectedSong !== this.state.previouslySelectedSong
    ) {
      this.playSelectedSong(this.props.store.selectedSong);
    }

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
          <Geolocation
            check={this.props.isGeolocationAvailable}
            location={this.props.coords}
          />
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
              <a href={devLoginUrl}>
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
              <Button onClick={() => this.getRefreshToken()}>
                Get refresh token
              </Button>
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
                name="Parakeet"
                token={this.state.token}
                callback={state => {
                  console.log(state);
                  if (state.errorType === "authentication_error") {
                    console.log("retrieving new token with refresh token");
                    // fetch(devRefreshTokenUrl, {
                    //   body: JSON.stringify({
                    //     query: this.props.store.refreshedToken
                    //   })
                    // }).then(data => {
                    //   console.log(data);
                    //   let refreshedToken = data.access_token;
                    //   //TODO: this.props.setToken(refreshedToken)
                    // });
                  }
                  if (
                    state.devices[0] !== undefined &&
                    state.isActive !== true
                  ) {
                    for (const device in state.devices) {
                      if (state.devices[device].name === "Parakeet") {
                        this.setState({
                          playerInstance: state.devices[device].id
                        });

                        fetch(`https://api.spotify.com/v1/me/player`, {
                          body: JSON.stringify({
                            device_ids: [state.devices[device].id],
                            play: true
                          }),
                          headers: {
                            Authorization: `Bearer ${this.state.token}`,
                            "Content-Type": "application/json"
                          },
                          method: "PUT"
                        });
                        // .then(data => {
                        //   if (
                        //     this.props.store.user !== undefined &&
                        //     this.state.currentSong === null
                        //   ) {
                        //     this.getCurrentSpotifySong(
                        //       this.props.store.token
                        //     );
                        //   }
                        // })
                        // .catch(error => {
                        //   console.log(error);
                        // });
                      }
                    }
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
    store: state.rootReducer
  };
};

const mapDispatchToProps = {
  setToken: setToken,
  setUser: setUser,
  setLocation: setLocation,
  setCurrentSong: setCurrentSong
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  geolocated({
    positionOptions: {
      enableHighAccuracy: false
    },
    userDecisionTimeout: 60000
  })(SpotifyPlayerUI)
);
