import React, { useState, useEffect } from "react";
import WhatsTrendingController from "./WhatsTrendingController";
import Banner from "./Banner";
import LocalMapButton from "./LocalMapButton";
import Flexbox from "flexbox-react";
import UserBubble from "./UserBubble";
import SpotifyPlayerUI from "./SpotifyPlayerUI";
import firebase from "../firebase";

function Main() {
  const user = useUser();
  const nearbyPeople = useNearbyPeople();
  const [mapHeight, setMapHeight] = useState("20vh");
  const [showUserBubbles, setShowBubblesVisible] = useState(false);
  const [userBubblesOpacity, setUserBubblesOpacity] = useState(0);

  function useNearbyPeople() {
    const [users, setUsers] = useState([]);
    useEffect(() => {
      const unsubscribe = firebase
        .firestore()
        .collection("users")
        .onSnapshot(snapshot => {
          const retrievedUsers = snapshot.docs.map(doc => ({
            uid: doc.id,
            ...doc.data()
          }));

          setUsers(retrievedUsers);
        });

      return () => unsubscribe();
    }, []);
    return users;
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
          console.log(retrievedUser);

          setUser(retrievedUser);
        });

      return () => unsubscribe();
    }, []);
    return user;
  }

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
    if (nearbyUser.groups.value === user.groups.value) {
      return (
        <div key={nearbyUser.displayName}>
          <UserBubble user={nearbyUser} />
        </div>
      );
    }
  }

  return (
    <Flexbox
      flexDirection="column"
      minHeight="100vh"
      style={{
        background: "linear-gradient(180deg, #ee0979 0%, #ff6a00 100%)",
        color: "#efefef"
      }}
    >
      <Flexbox element="header" height="60px" marginTop="20px">
        <Banner />
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
          {/* <WhatsTrendingController /> */}
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
            background: "rgba(0,0,0,1)",
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
              color: "#ee0979"
            }}
          >
            {user?.groups?.value}
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
          {/* <SpotifyPlayerUI /> */}
        </div>
      </Flexbox>
    </Flexbox>
  );
}

export default Main;
