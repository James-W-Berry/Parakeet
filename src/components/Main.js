import React, { useState, useEffect } from "react";
import WhatsTrendingController from "./WhatsTrendingController";
import Banner from "./Banner";
import LocalMapButton from "./LocalMapButton";
import Flexbox from "flexbox-react";
import UserBubble from "./UserBubble";
import SpotifyPlayerUI from "./SpotifyPlayerUI";
import firebase from "../firebase";
import { usePosition } from "use-position";
import ScaleLoader from "react-spinners/ScaleLoader";

function useNearbyPeople(user) {
  const [nearbyPeople, setNearbyPeople] = useState([]);
  useEffect(() => {
    if (user.group) {
      const unsubscribe = firebase
        .firestore()
        .collection("users")
        .where("group", "==", user.group)
        .onSnapshot(snapshot => {
          const retrievedUsers = snapshot.docs.map(doc => ({
            uid: doc.id,
            ...doc.data()
          }));

          setNearbyPeople(retrievedUsers);
          return () => unsubscribe();
        });
    }
  }, [user.group]);
  return nearbyPeople;
}

function useUser() {
  const [user, setUser] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .onSnapshot(snapshot => {
        const retrievedUser = { ...snapshot.data() };
        setUser(retrievedUser);
      });

    return () => unsubscribe();
  }, []);
  return user;
}

function uploadPosition(position) {
  if (position.latitude) {
    const userId = firebase.auth().currentUser.uid;
    const docRef = firebase
      .firestore()
      .collection("users")
      .doc(userId);

    return docRef
      .set(
        {
          location: position
        },
        { merge: true }
      )
      .then(function() {
        console.log("successfully updated location");
      })
      .catch(function(error) {
        console.log(error);
      });
  }
}

function Main() {
  const user = useUser();
  const nearbyPeople = useNearbyPeople(user);
  const { latitude, longitude, timestamp, accuracy, error } = usePosition(true);
  const [mapHeight, setMapHeight] = useState("20vh");
  const [showUserBubbles, setShowBubblesVisible] = useState(false);
  const [userBubblesOpacity, setUserBubblesOpacity] = useState(0);

  useEffect(() => {
    let location = {
      latitude: latitude,
      longitude: longitude,
      timestamp: timestamp,
      accuracy: accuracy,
      error: error
    };
    uploadPosition(location);
  }, [latitude, longitude, timestamp, accuracy, error]);

  function toggleMapHeight() {
    if (mapHeight === "20vh") {
      setMapHeight("90vh");
      setShowBubblesVisible(true);
      setUserBubblesOpacity(1);
    } else {
      setMapHeight("20vh");
      setShowBubblesVisible(false);
      setUserBubblesOpacity(0);
    }
  }

  function createNearbyUser(nearbyUser) {
    return (
      <div key={nearbyUser.displayName}>
        <UserBubble user={nearbyUser} />
      </div>
    );
  }

  return (
    <Flexbox
      flexDirection="column"
      minHeight="100vh"
      style={{
        background: "#252a2e",
        color: "#f7f7f5"
      }}
    >
      <Flexbox element="header" height="60px" marginTop="20px">
        <Banner user={user} />
      </Flexbox>

      <Flexbox flexGrow={1} alignSelf="center">
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: "20vh",
            width: "100vw",
            height: "40vh",
            left: 0
          }}
        >
          <WhatsTrendingController />
        </div>
      </Flexbox>

      <Flexbox
        flexGrow={1}
        alignSelf="center"
        element="footer"
        flexDirection="column"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            bottom: "0vh",
            left: 0,
            width: "100vw",
            height: mapHeight,
            minHeight: "20vh",
            borderTopLeftRadius: "120px",
            background: "#e54750",
            transition: "height 0.3s ease-in-out"
          }}
        >
          <LocalMapButton slideCallback={toggleMapHeight} />

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignSelf: "baseline",
              marginTop: "2vh",
              fontSize: 24,
              color: "#252a2e"
            }}
          >
            {user?.group}
          </div>
          {showUserBubbles &&
            nearbyPeople &&
            nearbyPeople.map(user => createNearbyUser(user))}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100vw",
            height: "20vh"
          }}
        >
          {user.tokens ? (
            <SpotifyPlayerUI
              tokens={user.tokens}
              selectedSong={user.selectedSong}
            />
          ) : (
            <div
              style={{
                position: "absolute",
                bottom: "8vh",
                left: "48vw"
              }}
            >
              <ScaleLoader color={"#252a2e"} />
            </div>
          )}
        </div>
      </Flexbox>
    </Flexbox>
  );
}

export default Main;
