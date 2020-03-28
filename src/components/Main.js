import React, { useState, useEffect } from "react";
import WhatsTrendingController from "./WhatsTrendingController";
import Banner from "./Banner";
import LocalMapButton from "./LocalMapButton";
import SpotifyPlayerUI from "./SpotifyPlayerUI";
import firebase from "../firebase";
import { usePosition } from "use-position";
import ScaleLoader from "react-spinners/ScaleLoader";
import ParakeetMap from "./ParakeetMap";
import Checkbox from "@material-ui/core/Checkbox";
import { MuiThemeProvider } from "material-ui/styles";
import { FormControlLabel } from "@material-ui/core";

function useNearbyPeopleInGroup(user) {
  const [nearbyPeopleInGroup, setNearbyPeopleInGroup] = useState([]);
  useEffect(() => {
    if (user.group) {
      const unsubscribe = firebase
        .firestore()
        .collection("users")
        .where("group", "==", user.group)
        .onSnapshot(snapshot => {
          const retrievedUsers = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          setNearbyPeopleInGroup(retrievedUsers);
          return () => unsubscribe();
        });
    }
  }, [user]);
  return nearbyPeopleInGroup;
}

function useNearbyPeople(user) {
  const [nearbyPeople, setNearbyPeople] = useState([]);
  useEffect(() => {
    if (user.group) {
      const unsubscribe = firebase
        .firestore()
        .collection("users")
        .onSnapshot(snapshot => {
          const retrievedUsers = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          setNearbyPeople(retrievedUsers);
          return () => unsubscribe();
        });
    }
  }, [user]);
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

function useGroups() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("groups")
      .onSnapshot(snapshot => {
        const retrievedGroups = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setGroups(retrievedGroups);
        return () => unsubscribe();
      });
  }, []);

  return groups;
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
  const nearbyPeopleInGroup = useNearbyPeopleInGroup(user);
  const { latitude, longitude, timestamp, accuracy, error } = usePosition(true);
  const groups = useGroups();
  const [userGroupName, setUserGroupName] = useState();
  const [mapHeight, setMapHeight] = useState("20vh");
  const [userBubblesOpacity, setUserBubblesOpacity] = useState(0);
  const [filterByGroup, setFilterByGroup] = useState(false);

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

  useEffect(() => {
    groups.forEach(group => {
      if (group.id === user.group) {
        setUserGroupName(group.name);
      }
    });
  }, [groups, user.group]);

  const handleGroupFilterChange = event => {
    setFilterByGroup(event.target.checked);
  };

  function toggleMapHeight() {
    if (mapHeight === "20vh") {
      setMapHeight("95vh");
      setUserBubblesOpacity(1);
    } else {
      setMapHeight("20vh");
      setUserBubblesOpacity(0);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        background: "#252a2e",
        color: "#f7f7f5"
      }}
    >
      <div id="header" style={{ height: "75px" }}>
        <Banner user={user} groups={groups} groupName={userGroupName} />
      </div>

      <div
        id="body"
        style={{
          display: "flex",
          flex: 2
        }}
      >
        <WhatsTrendingController
          group={user.group}
          groupName={userGroupName}
          groups={groups}
        />
      </div>

      <div
        id="footer"
        style={{
          flex: 1,
          bottom: 0,
          left: 0,
          width: "100vw",
          height: "20vh"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100vw",
            height: mapHeight,
            borderTopLeftRadius: "120px",
            background: "#e54750",
            transition: "height 0.3s ease-in-out",
            minHeight: "100px"
          }}
        >
          <LocalMapButton slideCallback={() => toggleMapHeight()} />

          {userBubblesOpacity ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "2vh",
                width: "100vw"
              }}
            >
              <MuiThemeProvider>
                <FormControlLabel
                  control={
                    <Checkbox
                      style={{ color: "#f7f7f5" }}
                      checked={filterByGroup}
                      onChange={handleGroupFilterChange}
                      inputProps={{ fontFamily: "AntikorMonoLightItalic" }}
                    />
                  }
                  label={`Only show people in ${userGroupName}`}
                  style={{ fontFamily: "AntikorMonoLightItalic" }}
                />
              </MuiThemeProvider>

              <div
                style={{ height: "65vh", width: "90vw", borderRadius: "100px" }}
              >
                <ParakeetMap
                  user={user}
                  nearbyPeople={nearbyPeople}
                  nearbyPeopleInGroup={nearbyPeopleInGroup}
                  filterByGroup={filterByGroup}
                />
              </div>
            </div>
          ) : (
            <div />
          )}
        </div>

        {user.tokens ? (
          <SpotifyPlayerUI
            tokens={user.tokens}
            selectedSong={user.selectedSong}
            group={user.group}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              bottom: "7vh",
              left: "47%"
            }}
          >
            <ScaleLoader color={"#252a2e"} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Main;
