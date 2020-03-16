import React, { Component } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import audio_wave from "../assets/audio_wave.png";
import uuid from "react-uuid";
import { Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { setSelectedSong } from "../actions/actions";

class TrendingList extends Component {
  createSongItem(song) {
    if (song !== undefined) {
      return (
        <ListItem
          key={uuid()}
          button={true}
          onClick={() => {
            this.props.setSelectedSong(song.uri);
          }}
        >
          <ListItemAvatar>
            <Avatar style={{ backgroundColor: "#091740" }}>
              <img src={audio_wave} alt="" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            disableTypography
            primary={
              <Typography variant="h6" style={{ color: "#FFFFFF" }}>
                {song.songTitle}
              </Typography>
            }
            secondary={
              <Typography variant="body2" style={{ color: "#FFFFFF" }}>
                {`${song.artist} • ${song.album}`}
              </Typography>
            }
          />
        </ListItem>
      );
    }
  }

  render() {
    let abrevList = [];
    if (this.props.orderedList !== undefined) {
      if (this.props.orderedList.length > 5) {
        for (var i = 0; i < this.props.orderedList.length && i <= 4; i++) {
          abrevList.push(this.props.orderedList[i]);
        }
      } else {
        abrevList = this.props.orderedList;
      }
      return <List>{abrevList.map(song => this.createSongItem(song))}</List>;
    } else {
      return null;
    }
  }
}

const mapDispatchToProps = {
  setSelectedSong: setSelectedSong
};

export default connect(null, mapDispatchToProps)(TrendingList);