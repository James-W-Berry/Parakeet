import React, { useState, useEffect } from "react";
import Fab from "@material-ui/core/Fab";
import { Avatar } from "material-ui";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import firebase from "../firebase";
import "firebase/auth";
import { Marker } from "react-mapbox-gl";

function uploadSelectedSong(selectedSong) {
  if (selectedSong) {
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
}

function UserBubble(props) {
  const [user, setUser] = useState();
  const [isExpanded, setIsExpanded] = useState(false);
  const [parakeetImage, setParakeetImage] = useState();

  useEffect(() => {
    if (props.user?.location) {
      setUser(props.user);
    }
  }, [props.user]);

  useEffect(() => {
    const image = require("../assets/parakeet_" +
      Math.floor(Math.random() * 6) +
      ".jpg");
    setParakeetImage(image);
  }, []);

  function toggleSongBubble() {
    setIsExpanded(!isExpanded);
  }

  return (
    <div>
      {user ? (
        <div key={user.id} onClick={() => toggleSongBubble()}>
          <Marker
            coordinates={[user.location.longitude, user.location.latitude]}
            offsetLeft={-20}
            offsetTop={-10}
          >
            <MuiThemeProvider>
              <Fab color="primary" aria-label="add" style={{ outline: "none" }}>
                {user.profilePic ? (
                  <Avatar
                    alt={user.displayName}
                    src={user.profilePic}
                    style={{ height: "60px", width: "60px" }}
                  />
                ) : (
                  <Avatar
                    alt={user.displayName}
                    src={parakeetImage}
                    style={{ height: "60px", width: "60px" }}
                  />
                )}
              </Fab>
            </MuiThemeProvider>
            {user.displayNameVisible && (
              <div
                style={{
                  position: "absolute",
                  bottom: "-30px",
                  left: "15px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "5px",
                  color: "#37e0b6",
                  fontSize: "12px",
                  backgroundColor: "#252a2e",
                  fontFamily: "AntikorMonoLightItalic"
                }}
              >
                {user.displayName}
              </div>
            )}
            {isExpanded && (
              <div
                onClick={() => {
                  uploadSelectedSong(user.currentlyListeningTo);
                  console.log(user);
                }}
                style={{
                  display: "flex",
                  justifyContent: "flexStart",
                  flexDirection: "column",
                  position: "absolute",
                  top: "0px",
                  left: "65px",
                  fontSize: "12px",
                  fontFamily: "AntikorMonoLightItalic",
                  color: "#37e0b6",
                  backgroundColor: "#252a2e",
                  padding: "5px",
                  borderRadius: "10px",
                  width: "minContent",
                  transition: "width 0.3s ease-in-out",
                  cursor: "pointer",
                  boxShadow: "1px 1px 1px 1px #37e0b6",
                  whiteSpace: "nowrap"
                }}
              >
                <div>
                  {user.currentlyListeningTo?.name
                    ? user.currentlyListeningTo.name
                    : "No music yet"}
                </div>
                <div>
                  {user.currentlyListeningTo?.artists
                    ? `by ${user.currentlyListeningTo.artists}`
                    : null}
                </div>
              </div>
            )}
          </Marker>
        </div>
      ) : (
        <div />
      )}
    </div>
  );
}

export default UserBubble;
