import { Box, FormControlLabel, Grid, useMediaQuery } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import { makeStyles } from "@material-ui/core/styles";
import { MuiThemeProvider } from "material-ui/styles";
import React, { useEffect, useState } from "react";
import ScaleLoader from "react-spinners/ScaleLoader";
import { usePosition } from "use-position";
import firebase from "../firebase";
import Banner from "./Banner";
import LocalMapButton from "./LocalMapButton";
import ParakeetMap from "./ParakeetMap";
import SpotifyPlayerUI from "./SpotifyPlayerUI";
import TrendingList from "./TrendingList";
import WhatsTrendingController from "./WhatsTrendingController";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

function useNearbyPeopleInGroup(user) {
  const [nearbyPeopleInGroup, setNearbyPeopleInGroup] = useState([]);
  useEffect(() => {
    if (user.group) {
      const unsubscribe = firebase
        .firestore()
        .collection("users")
        .where("group", "==", user.group)
        .onSnapshot((snapshot) => {
          const retrievedUsers = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
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
        .onSnapshot((snapshot) => {
          const retrievedUsers = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
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
      .onSnapshot((snapshot) => {
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
      .onSnapshot((snapshot) => {
        const retrievedGroups = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
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
    const docRef = firebase.firestore().collection("users").doc(userId);

    return docRef
      .set(
        {
          location: position,
        },
        { merge: true }
      )
      .then(function () {
        console.log("successfully updated location");
      })
      .catch(function (error) {
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
  const [mapHeight, setMapHeight] = useState("100%");
  const [userBubblesOpacity, setUserBubblesOpacity] = useState(0);
  const [filterByGroup, setFilterByGroup] = useState(false);
  const classes = useStyles();
  const [sortedSongList, setSortedSongList] = useState();

  useEffect(() => {
    let location = {
      latitude: latitude,
      longitude: longitude,
      timestamp: timestamp,
      accuracy: accuracy,
      error: error,
    };
    uploadPosition(location);
  }, [latitude, longitude, timestamp, accuracy, error]);

  useEffect(() => {
    groups.forEach((group) => {
      if (group.id === user.group) {
        setUserGroupName(group.name);
      }
    });
  }, [groups, user.group]);

  const isMobile = useMediaQuery("(max-width:599px)");

  const handleGroupFilterChange = (event) => {
    setFilterByGroup(event.target.checked);
  };

  function toggleMapHeight() {
    if (mapHeight === "100%") {
      setMapHeight("calc(100vh - 154px)");
      setUserBubblesOpacity(1);
    } else {
      setMapHeight("100%");
      setUserBubblesOpacity(0);
    }
  }

  const handleUpdatedSortedSongList = (songList) => {
    setSortedSongList(songList);
  };

  return (
    <Grid
      container
      style={{
        maxWidth: "100vw",
        minHeight: "100vh",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Banner user={user} groups={groups} groupName={userGroupName} />

      {userBubblesOpacity ? null : (
        <Grid
          container
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 4,
          }}
        >
          <Grid
            item
            xs={10}
            sm={6}
            md={6}
            lg={6}
            xl={6}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "24px",
            }}
          >
            <WhatsTrendingController
              group={user.group}
              groupName={userGroupName}
              groups={groups}
              handleUpdatedSortedSongList={handleUpdatedSortedSongList}
            />
          </Grid>

          <Grid
            item
            xs={10}
            sm={6}
            md={6}
            lg={6}
            xl={6}
            style={{ padding: "24px" }}
          >
            {sortedSongList ? (
              <TrendingList songList={sortedSongList} />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ScaleLoader color={"#e54750"} />
              </div>
            )}
          </Grid>
        </Grid>
      )}

      <Grid
        container
        item
        style={{
          flex: 1,
          minHeight: "125px",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderTopLeftRadius:
            isMobile && !userBubblesOpacity ? "0px" : "120px",
          background: "#e54750",
          width: "100vw",
        }}
      >
        <Box id="footer" style={{ flex: 1 }}>
          <LocalMapButton slideCallback={() => toggleMapHeight()} />
          {userBubblesOpacity ? (
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "15px",
                width: "100vw",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    style={{ color: "#f7f7f5" }}
                    checked={filterByGroup}
                    onChange={handleGroupFilterChange}
                    inputProps={{
                      fontFamily: "AntikorMonoLightItalic",
                    }}
                  />
                }
                label={`Only show people in ${userGroupName}`}
                style={{ fontFamily: "AntikorMonoLightItalic" }}
              />

              <Box
                style={{
                  borderRadius: "100px",
                  height: mapHeight,
                  width: "100%",
                  transition: "height 0.3s ease-in-out",
                }}
              >
                <ParakeetMap
                  user={user}
                  nearbyPeople={nearbyPeople}
                  nearbyPeopleInGroup={nearbyPeopleInGroup}
                  filterByGroup={filterByGroup}
                />
              </Box>
            </Box>
          ) : null}
        </Box>
        {user.tokens ? (
          <SpotifyPlayerUI
            tokens={user.tokens}
            selectedSong={user.selectedSong}
            group={user.group}
            isBackgroundOpaque={userBubblesOpacity}
          />
        ) : (
          <ScaleLoader />
        )}
      </Grid>
    </Grid>
  );
}

export default Main;
