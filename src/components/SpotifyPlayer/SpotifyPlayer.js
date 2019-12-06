import React, { Component } from "react";
import SpotifyWebApi from "spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();

class SpotifyPlayer extends Component {
  constructor() {
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: { name: "Not Checked", albumArt: "" },
      playing: true
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

  getNowPlaying() {
    spotifyApi.getMyCurrentPlaybackState().then(response => {
      this.setState({
        nowPlaying: {
          name: response.item.name,
          albumArt: response.item.album.images[0].url
        }
      });
    });
  }

  postNextSong() {
    spotifyApi.skipToNext();
    this.getNowPlaying();
  }

  postPreviousSong() {
    spotifyApi.skipToPrevious();
    this.getNowPlaying();
  }

  postPlayPause() {
    if (this.playing) {
      spotifyApi.pause();
      this.playing = false;
    } else {
      spotifyApi.play();
      this.playing = true;
    }
  }

  render() {
    return (
      <div
        style={{
          background: "rgba(28,29,35, 0.6)",
          height: "100%",
          textAlign: "center",
          border: "1px solid black",
          borderTopLeftRadius: "120px"
        }}
      >
        <div className="App">
          {/* <a href="http://spotispies-spotifyauthserver.firebaseapp.com:8888/login"> */}
          <a href="http://localhost:8888/login"> Login to Spotify </a>
          <div>Now Playing: {this.state.nowPlaying.name}</div>
          <div>
            <img src={this.state.nowPlaying.albumArt} style={{ height: 150 }} />
          </div>
          <div>
            {this.state.loggedIn && (
              <button onClick={() => this.getNowPlaying()}>
                Check Now Playing
              </button>
            )}
          </div>
          {this.state.loggedIn && (
            <button onClick={() => this.postPreviousSong()}>Prev Song</button>
          )}
          {this.state.loggedIn && (
            <button onClick={() => this.postPlayPause()}>Pause/Play</button>
          )}
          {this.state.loggedIn && (
            <button onClick={() => this.postNextSong()}>Next Song -></button>
          )}
        </div>
      </div>
    );
  }
}

export default SpotifyPlayer;
