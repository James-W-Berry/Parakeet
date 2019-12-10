import React, { Component } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import audio_wave from "../../images/audio_wave.png";
import uuid from "react-uuid";
import { Typography } from "@material-ui/core";

class TrendingList extends Component {
  createSongItem(song) {
    console.log(song);
    if (song !== undefined) {
      return (
        <ListItem key={uuid()}>
          <ListItemAvatar>
            <Avatar>
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
    console.log(this.props.orderedList);

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

export default TrendingList;
