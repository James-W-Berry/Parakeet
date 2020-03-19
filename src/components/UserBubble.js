import React, { useState, useEffect } from "react";
import uuid from "react-uuid";
import Fab from "@material-ui/core/Fab";
import { Avatar } from "material-ui";
import "./UserBubble.css";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import firebase from "../firebase";
import "firebase/auth";

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

function UserBubble(nearbyUser) {
  const [showBubble, setShowBubble] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [parakeetImage, setParakeetImage] = useState();
  const [bubbleLocation, setBubbleLocation] = useState({
    x: `${10 + Math.random() * 80}vw`,
    y: `${20 + Math.random() * 60}vh`,
    id: uuid()
  });
  const [style, setStyle] = useState({
    fontSize: 60,
    opacity: 0,
    transition: "all 2s ease"
  });

  useEffect(() => {
    const image = require("../assets/parakeet_" +
      Math.floor(Math.random() * 6) +
      ".jpg");
    setParakeetImage(image);
  }, []);

  useEffect(() => {
    setTimeout(mountStyle(), 10);
  }, []);

  function unMountStyle() {
    setStyle({
      flexDirection: "column",
      position: "absolute",
      bottom: bubbleLocation.y,
      left: bubbleLocation.x,
      opacity: 0,
      transition: "all 1s ease"
    });
  }

  function mountStyle() {
    setStyle({
      flexDirection: "column",
      position: "absolute",
      bottom: bubbleLocation.y,
      left: bubbleLocation.x,
      opacity: 1,
      width: "15vw",
      height: "6vh",
      transition: "all 2s ease"
    });
  }

  function expandedStyle() {
    setIsExpanded(!isExpanded);
    setStyle({
      flexDirection: "column",
      position: "absolute",
      bottom: bubbleLocation.y,
      left: bubbleLocation.x,
      width: "15vw",
      height: "6vh",
      border: "1px",
      borderRadius: "12px",
      opacity: 1,
      transition: "all 2s ease"
    });
  }

  function transitionEnd() {
    setShowBubble(false);
  }

  return (
    <div
      style={style}
      onTransitionEnd={() => transitionEnd()}
      onClick={() => expandedStyle()}
    >
      {isExpanded ? (
        <MuiThemeProvider>
          <div
            style={{
              position: "absolute",
              fontWeight: "bold",
              fontSize: "16"
            }}
          >
            <Fab color="primary" aria-label="add" style={{ outline: "none" }}>
              {nearbyUser.user.profilePic ? (
                <Avatar
                  alt={nearbyUser.user.displayName}
                  src={nearbyUser.user.profilePic}
                  style={{ height: "60px", width: "60px" }}
                />
              ) : (
                <Avatar
                  alt={nearbyUser.user.displayName}
                  src={parakeetImage}
                  style={{ height: "60px", width: "60px" }}
                />
              )}
            </Fab>
            <div
              onClick={() => {
                uploadSelectedSong(nearbyUser.user.currentlyListeningTo);
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
                  color: "#f7f7f5"
                }}
              >
                <Marquee
                  text={nearbyUser.user.currentlyListeningTo.name}
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
                  color: "#f7f7f5"
                }}
              >
                <Marquee
                  text={nearbyUser.user.currentlyListeningTo.artists}
                  hoverToStop={false}
                  loop={false}
                />
              </div>
            </div>
          </div>
        </MuiThemeProvider>
      ) : (
        <MuiThemeProvider>
          <div
            style={{
              position: "absolute",
              fontWeight: "bold",
              fontSize: "16"
            }}
          >
            <Fab color="primary" aria-label="add" style={{ outline: "none" }}>
              {nearbyUser.user.profilePic ? (
                <Avatar
                  alt={nearbyUser.user.displayName}
                  src={nearbyUser.user.profilePic}
                  style={{ height: "60px", width: "60px" }}
                />
              ) : (
                <Avatar
                  alt={nearbyUser.user.displayName}
                  src={parakeetImage}
                  style={{ height: "60px", width: "60px" }}
                />
              )}
            </Fab>
          </div>
        </MuiThemeProvider>
      )}
    </div>
  );
}

export default UserBubble;
