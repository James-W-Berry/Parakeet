import React, { Component } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import spotify from "../../images/spotify.png";
import "./SpotifyPlayerUI.css";
import { uploadSong } from "../Register/Register.js";
import SpotifyWebPlayer from "react-spotify-web-playback";
import { connect } from "react-redux";
import { setToken } from "../../actions/actions";

const spotifyApi = new SpotifyWebApi();

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
      token: token,
      selectedTrendingSong: this.props.selectedTrendingSong,
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
              <a href="http://localhost:8888/login">
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
          {/* {this.state.loggedIn && this.props.selectedTrendingSong === null && (
            <div
              style={{
                justifyContent: "center",
                position: "absolute",
                height: "5vh",
                width: "30vw",
                top: "5vh",
                left: "35vw"
              }}
            >
              Listen to your own music or spy on someone else's!
            </div>
          )} */}

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
                uris={[this.props.selectedTrendingSong]}
                callback={state => {
                  //console.log(state);
                }}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  setToken: setToken
};

export default connect(null, mapDispatchToProps)(SpotifyPlayerUI);
