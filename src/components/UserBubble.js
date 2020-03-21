import React, { useState, useEffect } from "react";
import Fab from "@material-ui/core/Fab";
import { Avatar } from "material-ui";
import "./UserBubble.css";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import firebase from "../firebase";
import "firebase/auth";
import { Marker } from "react-mapbox-gl";

var Marquee = require("react-marquee");

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

function UserBubble(props) {
  const [user, setUser] = useState();
  const [isExpanded, setIsExpanded] = useState(false);
  const [parakeetImage, setParakeetImage] = useState();
  const [style, setStyle] = useState({
    fontSize: 60,
    opacity: 0,
    transition: "all 2s ease"
  });

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

  function expandedStyle() {
    setIsExpanded(!isExpanded);
    setStyle({
      flexDirection: "column",
      position: "absolute",
      width: "15vw",
      height: "6vh",
      border: "1px",
      borderRadius: "12px",
      opacity: 1,
      transition: "all 2s ease"
    });
  }

  if (user && isExpanded) {
    return (
      <div key={user.spotifyId} onClick={() => expandedStyle()}>
        <Marker
          coordinates={[user.location.longitude, user.location.latitude]}
          offsetLeft={-20}
          offsetTop={-10}
        >
          <MuiThemeProvider>
            <div>
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
              <div
                onClick={() => {
                  uploadSelectedSong(user.currentlyListeningTo);
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flexStart",
                    position: "absolute",
                    left: "65px",
                    top: "0.25vh",
                    fontSize: "16",
                    fontFamily: "AntikorMonoLightItalic",
                    color: "#f7f7f5",
                    backgroundColor: "#252a2e"
                  }}
                >
                  <Marquee
                    text={user.currentlyListeningTo.name}
                    hoverToStop={false}
                    loop={false}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flexStart",
                    position: "absolute",
                    left: "65px",
                    top: "2.25vh",
                    fontSize: "16",
                    maxWidth: "20vw",
                    fontFamily: "AntikorMonoLightItalic",
                    color: "#f7f7f5",
                    backgroundColor: "#252a2e"
                  }}
                >
                  <Marquee
                    text={user.currentlyListeningTo.artists}
                    hoverToStop={false}
                    loop={false}
                  />
                </div>
              </div>
            </div>
          </MuiThemeProvider>
        </Marker>
      </div>
    );
  }

  if (user) {
    return (
      <div key={user.spotifyId} onClick={() => expandedStyle()}>
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
        </Marker>
      </div>
    );
  }

  return <div />;
}

export default UserBubble;
