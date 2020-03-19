import React, { useState, useEffect } from "react";
import "./SpotifyPlayerUI.css";
import SpotifyWebPlayer from "react-spotify-web-playback";
import firebase from "../firebase";

const dotenv = require("dotenv");

dotenv.config();

const prodLoginUrl = process.env.REACT_APP_LOGIN_URL;
const devLoginUrl = process.env.REACT_APP_DEV_LOGIN_URL;

function getSpotifyUserInfo(tokens) {
  fetch(`https://api.spotify.com/v1/me/`, {
    headers: {
      Authorization: `Bearer ${tokens.access_token}`,
      "Content-Type": "application/json"
    },
    method: "GET"
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        var error = new Error(
          "Error" + response.status + ": " + response.statusText
        );
        error.response = response;
        throw error;
      }
    })
    .then(data => {
      if (data.id) {
        uploadSpotifyInfo(data);
      }
    })
    .catch(error => {
      console.log(`error: ${error}`);
      return false;
    });
}

function uploadSpotifyInfo(info) {
  const userId = firebase.auth().currentUser.uid;

  const docRef = firebase
    .firestore()
    .collection("users")
    .doc(userId);

  return docRef
    .set(
      {
        profilePic: info.images[0].url || undefined,
        spotifyId: info.id
      },
      { merge: true }
    )
    .then(function() {
      console.log("successfully set profile picture and spotify id");
    })
    .catch(function(error) {
      console.log(error);
    });
}

function uploadCurrentlyListeningTo(
  currentlyListeningTo,
  previouslyListeningTo
) {
  const userId = firebase.auth().currentUser.uid;
  const docRef = firebase
    .firestore()
    .collection("users")
    .doc(userId);

  docRef
    .set(
      {
        currentlyListeningTo: currentlyListeningTo
      },
      { merge: true }
    )
    .then(function() {
      console.log("successfully updated currently listening to");
    })
    .catch(function(error) {
      console.log(error);
    });

  if (previouslyListeningTo?.uri !== currentlyListeningTo?.uri) {
    let now = new Date();
    const pastSongRef = firebase
      .firestore()
      .collection("pastSongs")
      .doc(currentlyListeningTo.uri);

    pastSongRef
      .set(
        {
          pastSong: currentlyListeningTo,
          listenDate: now,
          totalListens: firebase.firestore.FieldValue.increment(1)
        },
        { merge: true }
      )
      .then(function() {
        console.log("successfully added song to past songs");
      })
      .catch(function(error) {
        console.log(error);
      });
  }
}

function playSelectedSong(uri, tokens, playerInstance) {
  fetch(
    `https://api.spotify.com/v1/me/player/play?device_id=${playerInstance}`,
    {
      method: "PUT",
      body: JSON.stringify({ uris: [uri] }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokens.access_token}`
      }
    }
  );
}

function SpotifyPlayerUI(props) {
  const [playerInstance, setPlayerInstance] = useState();
  const [previouslySelectedSong, setPreviouslySelectedSong] = useState();
  const [previousToken, setPreviousToken] = useState();
  const [previouslyListeningTo, setPreviouslyListeningTo] = useState();

  useEffect(() => {
    if (props.tokens?.access_token !== previousToken) {
      setPreviousToken(props.tokens.access_token);
      getSpotifyUserInfo(props.tokens);
    }
  }, [props.tokens, previousToken]);

  useEffect(() => {
    if (props.selectedSong?.uri !== previouslySelectedSong) {
      setPreviouslySelectedSong(props.selectedSong.uri);
      playSelectedSong(props.selectedSong.uri, props.tokens, playerInstance);
    }
  }, [
    props.selectedSong,
    props.tokens,
    playerInstance,
    previouslySelectedSong
  ]);

  return (
    <div
      style={{
        display: "flex",
        direction: "row",
        position: "absolute",
        bottom: "5vh",
        left: "10vw",
        justifyContent: "center",
        alignItems: "center",
        width: "80vw"
      }}
    >
      <SpotifyWebPlayer
        styles={{
          bgColor: "#e54750",
          trackNameColor: "#f7f7f5",
          trackArtistColor: "#f7f7f5",
          sliderTrackColor: "#f7f7f580",
          sliderColor: "#f7f7f5",
          color: "#f7f7f5",
          loaderSize: "5vw",
          magnifySliderOnHover: "true",
          showSaveIcon: "true",
          persistDeviceSelection: "true",
          fontFamily: "AntikorMonoLightItalic"
        }}
        name="Parakeet"
        token={props.tokens.access_token}
        callback={state => {
          if (state.track.uri !== "") {
            let currentlyListeningTo = {
              timestamp: Date.now().toString(),
              ...state.track
            };

            uploadCurrentlyListeningTo(
              currentlyListeningTo,
              previouslyListeningTo
            );
            setPreviouslyListeningTo(currentlyListeningTo);
          }

          if (state.errorType === "authentication_error") {
            console.log(state);
            console.log("need to get refresh token");
            setTimeout(function() {
              window.location.replace(devLoginUrl);
            }, 2000);
          }
          if (state.devices[0] !== undefined && state.isActive !== true) {
            for (const device in state.devices) {
              if (state.devices[device].name === "Parakeet") {
                setPlayerInstance(state.devices[device].id);
                fetch(`https://api.spotify.com/v1/me/player`, {
                  body: JSON.stringify({
                    device_ids: [state.devices[device].id],
                    play: true
                  }),
                  headers: {
                    Authorization: `Bearer ${props.tokens.access_token}`,
                    "Content-Type": "application/json"
                  },
                  method: "PUT"
                });
              }
            }
          }
        }}
      />
    </div>
  );
}

export default SpotifyPlayerUI;
