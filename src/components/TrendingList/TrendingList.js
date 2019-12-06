import React, { Component } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import audio_wave from "../../images/audio_wave.png";
import uuid from "react-uuid";

class TrendingList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      songList: [],
      timerange: 6.048e8
    };
  }

  createSongItem(song) {
    console.log(`creating a playlist entry from ${song}`);
    if (song !== undefined) {
      return (
        <ListItem key={uuid()}>
          <ListItemAvatar>
            <Avatar>
              <img src={audio_wave} alt="" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={song.songId}
            secondary={`${song.currentSong} * ${song.lastName}`}
          />
        </ListItem>
      );
    }
  }

  render() {
    // const classes = useStyles();
    console.log(this.props.pastSongs);

    if (this.props.pastSongs !== undefined) {
      return (
        <List>
          {this.props.pastSongs.map(song => this.createSongItem(song))}
        </List>
      );
    } else {
      return null;
    }
  }
}

export default TrendingList;
