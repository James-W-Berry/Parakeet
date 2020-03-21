import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import audio_wave from "../assets/audio_wave.png";
import uuid from "react-uuid";
import { Typography } from "@material-ui/core";
import firebase from "../firebase";
import "firebase/auth";
import Scrollbar from "react-scrollbars-custom";

function uploadSelectedSong(selectedSong) {
  const userId = firebase.auth().currentUser.uid;
  const docRef = firebase
    .firestore()
    .collection("users")
    .doc(userId);

  return docRef
    .set(
      {
        selectedSong: selectedSong
      },
      { merge: true }
    )
    .then(function() {
      console.log("successfully updated selected song");
    })
    .catch(function(error) {
      console.log(error);
    });
}

function TrendingList(props) {
  function createSongItem(song) {
    if (song !== undefined) {
      return (
        <ListItem
          key={uuid()}
          button={true}
          onClick={() => {
            uploadSelectedSong(song.pastSong);
          }}
        >
          <ListItemAvatar>
            <Avatar style={{ backgroundColor: "#37e0b6" }}>
              <img src={audio_wave} alt="" height="70%" width="70%" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            disableTypography
            primary={
              <Typography
                variant="h6"
                style={{
                  fontFamily: "AntikorMonoLightItalic",
                  color: "#f7f7f5",
                  fontSize: "100%"
                }}
              >
                {song.pastSong.name}
              </Typography>
            }
            secondary={
              <Typography
                variant="body2"
                style={{
                  fontSize: "100%",
                  fontFamily: "AntikorMonoLightItalic",
                  color: "#f7f7f5"
                }}
              >
                {song.pastSong.artists}
              </Typography>
            }
          />
        </ListItem>
      );
    }
  }

  return (
    <div style={{ height: "50%", width: "100%" }}>
      <Scrollbar style={{ height: "60vh", width: "50vw" }}>
        <List>{props.songList.map(song => createSongItem(song))}</List>
      </Scrollbar>
    </div>
  );
}

export default TrendingList;
