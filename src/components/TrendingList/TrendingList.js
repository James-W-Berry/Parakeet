import React, { Component } from "react";

class TrendingList extends Component {
  render() {
    console.log("tlprops ",this.props.orderedList);

    return (
      <div>
      {this.props.orderedList.map(song => (
        <div>
          <div> {song.songId} {song.playcount}</div>
        </div>
      ))}
      </div>
    );
  }
}

export default TrendingList;
