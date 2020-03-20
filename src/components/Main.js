import React, { useState, useEffect } from "react";
import WhatsTrendingController from "./WhatsTrendingController";
import Banner from "./Banner";
import LocalMapButton from "./LocalMapButton";
import UserBubble from "./UserBubble";
import SpotifyPlayerUI from "./SpotifyPlayerUI";
import firebase from "../firebase";
import { usePosition } from "use-position";
import ScaleLoader from "react-spinners/ScaleLoader";
import getDistance from "geolib/es/getDistance";
import Slider from "@material-ui/core/Slider";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  slider: {
    color: "#252a2e",
    width: "50vw",
    marginTop: "30px"
  }
});

function useNearbyPeople(user, distanceFilter) {
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

          let userLocation = {
            latitude: user.location.latitude,
            longitude: user.location.longitude
          };
          let retrivedUsersInDistanceFilter = [];
          retrievedUsers.forEach(retrievedUser => {
            let retrievedUserLocation = {
              latitude: retrievedUser.location.latitude,
              longitude: retrievedUser.location.longitude
            };

            let distanceToUser = getDistance(
              userLocation,
              retrievedUserLocation
            );

            if (distanceToUser <= distanceFilter) {
              retrivedUsersInDistanceFilter.push(retrievedUser);
            }
          });

          setNearbyPeople(retrivedUsersInDistanceFilter);
          return () => unsubscribe();
        });
    }
  }, [user, distanceFilter]);
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
          uid: doc.id,
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
  const [distanceFilter, setDistanceFilter] = useState(21000);
  const nearbyPeople = useNearbyPeople(user, distanceFilter);
  const { latitude, longitude, timestamp, accuracy, error } = usePosition(true);
  const groups = useGroups();
  const [userGroupName, setUserGroupName] = useState();
  const [mapHeight, setMapHeight] = useState("20vh");
  const [showUserBubbles, setShowBubblesVisible] = useState(false);
  const [userBubblesOpacity, setUserBubblesOpacity] = useState(0);
  const classes = useStyles();

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
    let userGroupName = groups.filter(group => {
      return (group.id = user.group);
    });
    if (userGroupName[0]?.name) {
      setUserGroupName(userGroupName[0].name);
    }
  }, [groups, user.group]);

  function toggleMapHeight() {
    if (mapHeight === "20vh") {
      setMapHeight("95vh");
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

  const handleDistanceFilterChange = (event, value) => {
    setDistanceFilter(value);
  };

  function valuetext(value) {
    return `${value}km`;
  }

  const marks = [
    {
      value: 1,
      label: "1km"
    },
    {
      value: 5000,
      label: "5k km"
    },
    {
      value: 10000,
      label: "10k km"
    },
    {
      value: 15000,
      label: "15k km"
    },
    {
      value: 20000,
      label: "20k km"
    }
  ];

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
        <Banner user={user} />
      </div>

      <div
        id="body"
        style={{
          display: "flex",
          flex: 2
        }}
      >
        <WhatsTrendingController group={user.group} groupName={userGroupName} />
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
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "50vw",
                  fontSize: 24,
                  fontFamily: "AntikorMonoLightItalic",
                  color: "#252a2e"
                }}
              >
                {userGroupName}
              </span>
              <Slider
                className={classes.slider}
                getAriaValueText={valuetext}
                aria-labelledby="discrete-slider-custom"
                min={1}
                max={21000}
                defaultValue={21000}
                marks={marks}
                onChangeCommitted={handleDistanceFilterChange}
                valueLabelDisplay="auto"
              />
            </div>
          ) : (
            <div />
          )}

          {showUserBubbles &&
            nearbyPeople &&
            nearbyPeople.map(user => createNearbyUser(user))}
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
              bottom: "8vh",
              left: "48vw"
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
