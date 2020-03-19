import React, { useState, useEffect } from "react";
import firebase from "../firebase";
import "firebase/auth";
import { Redirect } from "react-router-dom";
import ScaleLoader from "react-spinners/ScaleLoader";

const loginUrl = process.env.REACT_APP_LOGIN_URL;
const devLoginUrl = process.env.REACT_APP_DEV_LOGIN_URL;

function uploadAccessTokens(tokens) {
  const userId = firebase.auth().currentUser.uid;
  const docRef = firebase
    .firestore()
    .collection("users")
    .doc(userId);

  return docRef
    .set(
      {
        tokens: {
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token
        }
      },
      { merge: true }
    )
    .then(function() {
      console.log("successfully set tokens");
    })
    .catch(function(error) {
      console.log(error);
    });
}

function SpotifyLogin() {
  const [tokens, setTokens] = useState();

  useEffect(() => {}, []);

  useEffect(() => {
    const tokens = getHashParams();
    if (tokens?.access_token) {
      setTokens(tokens);
      uploadAccessTokens(tokens);
    } else {
      setTimeout(function() {
        window.location.replace(devLoginUrl);
      }, 3000);
    }
  }, []);

  function getHashParams() {
    var hashParams = {};
    var e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    e = r.exec(q);
    while (e) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
      e = r.exec(q);
    }
    return hashParams;
  }

  if (tokens?.access_token) {
    return (
      <div
        style={{
          height: "100vh",
          width: "100vw",
          background: "#252a2e",
          alignSelf: "center",
          display: "flex",
          flex: 1
        }}
      >
        <div
          style={{
            height: "100vh",
            width: "100vw",
            background: "#252a2e",
            alignSelf: "center",
            display: "flex",
            flex: 1
          }}
        >
          <div
            style={{
              height: "100vh",
              width: "100vw",
              background: "#252a2e",
              alignSelf: "center",
              display: "flex",
              flex: 1
            }}
          >
            <ScaleLoader color={"#e54750"} />
            <Redirect to="/pandemonium" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        background: "#252a2e",
        alignSelf: "center",
        display: "flex",
        flex: 1
      }}
    >
      <div
        style={{
          height: "100vh",
          width: "100vw",
          background: "#252a2e",
          alignSelf: "center",
          display: "flex",
          flex: 1
        }}
      >
        <ScaleLoader color={"#e54750"} />
      </div>
    </div>
  );
}

export default SpotifyLogin;
