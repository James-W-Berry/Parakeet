import React, { useState, useEffect } from "react";
import Fab from "@material-ui/core/Fab";
import { Avatar } from "material-ui";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import firebase from "../firebase";
import "firebase/auth";
import { Marker } from "react-mapbox-gl";
import Typography from "material-ui/styles/typography";

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
  const [isHovering, setIsHovering] = useState(false);
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
                    flexDirection: "column",
                    position: "absolute",
                    left: "65px",
                    top: "0.25vh",
                    fontSize: "20",
                    fontFamily: "AntikorMonoLightItalic",
                    color: "#37e0b6",
                    backgroundColor: "#252a2e",
                    cursor: "pointer",
                    whiteSpace: "nowrap"
                  }}
                >
                  {user.currentlyListeningTo?.name ? (
                    <div>{user.currentlyListeningTo.name}</div>
                  ) : (
                    <div>No music yet</div>
                  )}

                  {user.currentlyListeningTo?.artists ? (
                    <div>{user.currentlyListeningTo.artists}</div>
                  ) : (
                    <div />
                  )}
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
            <div
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
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
              {isHovering && user.displayNameVisible && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "-30px",
                    left: "15px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#37e0b6",
                    fontSize: "20px",
                    backgroundColor: "#252a2e",
                    fontFamily: "AntikorMonoLightItalic"
                  }}
                >
                  {user.displayName}
                </div>
              )}
            </div>
          </MuiThemeProvider>
        </Marker>
      </div>
    );
  }

  return <div />;
}

export default UserBubble;
