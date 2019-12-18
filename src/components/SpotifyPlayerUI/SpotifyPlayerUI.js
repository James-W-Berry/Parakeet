import React, { Component } from "react";
import spotify from "../../images/spotify.png";
import "./SpotifyPlayerUI.css";
import { uploadSong } from "../Register/Register.js";
import SpotifyWebPlayer from "react-spotify-web-playback";
import { connect } from "react-redux";
import { setToken } from "../../actions/actions";
const dotenv = require("dotenv");

dotenv.config();

var loginUrl = process.env.REACT_APP_LOGIN_URL;
console.log(loginUrl);
class SpotifyPlayerUI extends Component {
  constructor(props) {
    super(props);
    const params = this.getHashParams();
    const token = params.access_token;

    if (token) {
      this.props.setToken(token);
      //uploadSong()
    }

    this.state = {
      loggedIn: token ? true : false,
      token: token,
      spotifyId: "",
      displayName: "",
      location: null,
      currentSong: null,
      group: ""
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
                // uris={[this.props.selectedSong]}
                // persistDeviceSelection={true}
                callback={state => {
                  console.log(state);

                  if (
                    state.devices[0] !== undefined &&
                    state.isActive !== true
                  ) {
                    fetch(`https://api.spotify.com/v1/me/player`, {
                      body: JSON.stringify({
                        device_ids: [state.devices[0].id],
                        play: false
                      }),
                      headers: {
                        Authorization: `Bearer ${this.state.token}`,
                        "Content-Type": "application/json"
                      },
                      method: "PUT"
                    });
                  }

                  // if (
                  //   state.devices[0] !== undefined &&
                  //   state.isActive === true &&
                  //   state.track.uri !== this.props.selectedSong
                  // ) {
                  //   let body;

                  //   if (this.props.selectedSong) {
                  //     body = JSON.stringify({
                  //       uris: [this.props.selectedSong]
                  //     });

                  //     console.log(body);

                  //     fetch(
                  //       `https://api.spotify.com/v1/me/player/play?device_id=${state.devices[0].id}`,
                  //       {
                  //         body,
                  //         headers: {
                  //           Authorization: `Bearer ${this.state.token}`,
                  //           "Content-Type": "application/json"
                  //         },
                  //         method: "PUT"
                  //       }
                  //     );
                  //   }
                  // }
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
    selectedSong: state.selectedSong
  };
};

const mapDispatchToProps = {
  setToken: setToken
};

export default connect(mapStateToProps, mapDispatchToProps)(SpotifyPlayerUI);
