import React, { Component } from "react";

class SpotifyPlayer extends Component {
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
        I'm the Spotify Player Component
      </div>
    );
  }
}

export default SpotifyPlayer;
