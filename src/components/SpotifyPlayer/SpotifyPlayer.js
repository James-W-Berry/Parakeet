import React, { Component } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import previousSong from "../../images/previousSong.png";
import play from "../../images/play.png";
import pause from "../../images/pause.png";
import nextSong from "../../images/nextSong.png";
import volumeIcon from "../../images/volume.png";
import spotify from "../../images/spotify.png";
import { Line } from "rc-progress";
import Slider from "react-rangeslider";
import "../SpotifyPlayer/SpotifyPlayer.css";
import { uploadSong } from "../Register/Register.js";

var Marquee = require("react-marquee");

const spotifyApi = new SpotifyWebApi();

class SpotifyPlayer extends Component {
  constructor() {
    super();
    const params = this.getHashParams();
    const token = params.access_token;

    if (token) {
      spotifyApi.setAccessToken(token);
      this.getCurrentUser();
    }
    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: { name: "", albumArt: "" },
      volume: 50,
      progress: 0
    };
  }

  componentDidMount() {
    this.getNowPlaying();
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

  handleVolumeChange = value => {
    this.setState({
      volume: value
    });
    spotifyApi.setVolume(value);
  };

  getNowPlaying() {
    spotifyApi.getMyCurrentPlaybackState().then(response => {
      if (response.item !== undefined) {
        uploadSong(response, this.state.user.id);
        this.setState({
          nowPlaying: {
            song: response.item.name,
            artist: response.item.artists[0].name,
            album: response.item.album.name,
            albumArt: response.item.album.images[0].url,
            duration: response.item.duration_ms
          }
        });
      }
      spotifyApi.getMyCurrentPlayingTrack().then(response => {
        if (response.progress_ms !== undefined) {
          this.setState({
            progress: response.progress_ms
            // playing: response.is_playing
          });
        }
      });
    });
  }

  getCurrentUser() {
    spotifyApi.getMe().then(response => {
      console.log(response);
      this.setState({
        user: response
      });
      this.getNowPlaying();
    });
  }

  postNextSong() {
    spotifyApi.skipToNext().then(() => {
      this.getNowPlaying();
      this.setState({
        playing: true
      });
    });
  }

  postPreviousSong() {
    spotifyApi.skipToPrevious().then(() => {
      this.getNowPlaying();
      this.setState({
        playing: true
      });
    });
  }

  postPlayPause() {
    this.state.playing ? spotifyApi.pause() : spotifyApi.play();
    this.getNowPlaying();
    this.setState({
      playing: !this.state.playing
    });
  }

  render() {
    let progressPercent = Math.round(
      (this.state.progress / this.state.nowPlaying.duration) * 100
    );

    let { volume } = this.state;

    console.log(this.state);
    return (
      <div
        style={{
          background: "rgba(28,29,35, 0.6)",
          height: "20vh",
          textAlign: "center",
          border: "1px solid black",
          borderTopLeftRadius: "120px"
        }}
      >
        <div className="App">
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
          {this.state.loggedIn && this.state.nowPlaying.song === undefined && (
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
          )}
          {this.state.loggedIn && this.state.nowPlaying.song !== undefined && (
            <div style={{ display: "flex", direction: "row" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flexStart",
                  position: "absolute",
                  left: "4vw",
                  top: "4vh",
                  borderRadius: "12px"
                }}
              >
                <img
                  src={this.state.nowPlaying.albumArt}
                  style={{
                    height: 100,
                    width: 100,
                    borderRadius: "12px"
                  }}
                  alt="album art"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flexStart",
                  position: "absolute",
                  left: "11vw",
                  top: "7vh",
                  fontWeight: "bold",
                  fontSize: "16"
                }}
              >
                <Marquee
                  text={this.state.nowPlaying.song}
                  hoverToStop={false}
                  loop={false}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flexStart",
                  position: "absolute",
                  left: "11vw",
                  top: "9vh",
                  fontSize: "16",
                  maxWidth: "20vw"
                }}
              >
                <Marquee
                  text={`${this.state.nowPlaying.artist} • ${this.state.nowPlaying.album}`}
                  hoverToStop={false}
                  loop={false}
                />
              </div>

              <div>
                <div style={{ position: "absolute", top: "3vw" }}>
                  <img
                    src={previousSong}
                    alt="previous song"
                    style={{
                      width: 40,
                      height: 40,
                      position: "absolute",
                      left: "39vw"
                    }}
                    onClick={() => this.postPreviousSong()}
                  />
                  {this.state.playing ? (
                    <img
                      src={pause}
                      alt="play song"
                      style={{
                        width: 30,
                        height: 30,
                        position: "absolute",
                        left: "49vw"
                      }}
                      onClick={() => this.postPlayPause()}
                    />
                  ) : (
                    <img
                      src={play}
                      alt="pause song"
                      style={{
                        width: 30,
                        height: 30,
                        position: "absolute",
                        left: "49vw"
                      }}
                      onClick={() => this.postPlayPause()}
                    />
                  )}

                  <img
                    src={nextSong}
                    alt="next song"
                    style={{
                      width: 30,
                      height: 30,
                      position: "absolute",
                      left: "59vw"
                    }}
                    onClick={() => this.postNextSong()}
                  />
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: "6vw",
                    width: "30vw",
                    left: "35vw"
                  }}
                >
                  <Line
                    percent={progressPercent}
                    strokeWidth="1"
                    strokeColor="#fff"
                    trailColor="#A4A7B4"
                  />
                </div>

                <div
                  style={{
                    width: 31,
                    height: 24,
                    position: "absolute",
                    right: "15vw",
                    top: "8vh"
                  }}
                >
                  <img
                    src={volumeIcon}
                    alt="volume"
                    style={{
                      width: 31,
                      height: 24
                    }}
                  />
                </div>

                <div
                  style={{
                    position: "absolute",
                    right: "5vw",
                    top: "6.8vh",
                    width: "10vw",
                    right: "4vw"
                  }}
                >
                  <Slider
                    value={volume}
                    orientation="horizontal"
                    min={0}
                    max={100}
                    onChange={this.handleVolumeChange}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default SpotifyPlayer;
