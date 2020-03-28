import React, { useState, useEffect } from "react";
import firebase from "../firebase";
import trending from "../assets/trending.png";
import TrendingList from "./TrendingList";
import { FormControl, Select } from "@material-ui/core";
import { MenuItem } from "material-ui";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import ScaleLoader from "react-spinners/ScaleLoader";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  groupSelector: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "100%",
    color: "#252a2e",
    fontFamily: "AntikorDisplayLight",
    menuStyle: {
      border: "1px solid black",
      borderRadius: "5%"
    },
    "& .MuiInput-underline:before": {
      border: "0px"
    },
    "& .MuiInput-underline:after": {
      border: "0px"
    }
  },
  selector: {
    color: "#252a2e",
    fontFamily: "AntikorMonoLightItalic",
    menuStyle: {
      border: "1px solid black",
      borderRadius: "5%",
      backgroundColor: "lightgrey"
    },
    marginTop: "20px",
    "& .MuiInput-underline:before": {
      border: "0px"
    },
    "& .MuiInput-underline:after": {
      border: "0px"
    }
  },
  dropdownStyle: {
    root: {
      color: "#252a2e",
      fontFamily: "AntikorMonoLightItalic"
    },
    fontFamily: "AntikorMonoLightItalic",
    border: "1px solid black",
    borderRadius: "5%",
    backgroundColor: "#37e0b6"
  }
});

function usePastSongs(trendingRange, groupId) {
  const [pastSongs, setPastSongs] = useState([]);

  useEffect(() => {
    if (groupId) {
      const today = new Date();
      const range = new Date(today.getTime() - trendingRange);

      const unsubscribe = firebase
        .firestore()
        .collection("groups")
        .doc(groupId)
        .collection("pastSongs")
        .where("listenDate", ">=", range)
        .onSnapshot(snapshot => {
          const retrievedSongs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setPastSongs(retrievedSongs);
        });
      return () => unsubscribe();
    }
  }, [trendingRange, groupId]);

  return pastSongs;
}

function updateGroup(groupId) {
  const userId = firebase.auth().currentUser.uid;
  const docRef = firebase
    .firestore()
    .collection("users")
    .doc(userId);

  return docRef
    .set(
      {
        group: groupId
      },
      { merge: true }
    )
    .then(function() {
      console.log("successfully updated group");
    })
    .catch(function(error) {
      console.log(error);
    });
}

function WhatsTrendingController(props) {
  const [trendingRange, setTrendingRange] = useState(3600000);
  const [group, setGroup] = useState("yW06i5L3vi8FipmaltGo");
  const [groupName, setGroupName] = useState();
  const [availableGroups, setAvailableGroups] = useState();
  const songList = usePastSongs(trendingRange, props.group);
  const [sortedSongList, setSortedSongList] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    if (props.group) {
      setGroup(props.group);
    }
  }, [props.group]);

  useEffect(() => {
    if (props.groupName) {
      setGroupName(props.groupName);
    }
  }, [props.groupName]);

  useEffect(() => {
    if (props.groups.length > 0) {
      setAvailableGroups(props.groups);
    }
  }, [props.groups]);

  useEffect(() => {
    const sortedSongs = sortSongList(songList);
    setSortedSongList(sortedSongs);
  }, [songList]);

  function sortSongList(songList) {
    let sortedRetrievedSongs = songList.sort((a, b) =>
      a.totalListens > b.totalListens ? -1 : 1
    );
    return sortedRetrievedSongs;
  }

  const handleTrendingRangeChange = event => {
    setTrendingRange(event.target.value);
  };

  const handleGroupChange = event => {
    console.log(event);
    updateGroup(event.target.value);
  };

  function createGroupMenuItem(group) {
    if (group.name) {
      return (
        <MenuItem
          key={group.id}
          style={{
            color: "#252a2e",
            fontFamily: "AntikorMonoLightItalic"
          }}
          value={group.id}
        >
          {group.name}
        </MenuItem>
      );
    } else {
      return null;
    }
  }

  function createGroupSelector(group, groupName, groups) {
    return (
      <MuiThemeProvider>
        <FormControl className={classes.groupSelector}>
          <Select
            className={classes.groupSelector}
            MenuProps={{ classes: { paper: classes.dropdownStyle } }}
            value={group}
            onChange={handleGroupChange}
          >
            {groups.map(map => createGroupMenuItem(map))}
          </Select>
        </FormControl>
      </MuiThemeProvider>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
        minHeight: "448px"
      }}
    >
      <div
        style={{
          flex: 1,
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div
          style={{
            fontSize: 40,
            border: "1px solid black",
            borderRadius: "30px",
            display: "flex",
            backgroundColor: "#37e0b6",
            height: "75%",
            width: "75%",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "#f7f7f5",
            padding: "30px"
          }}
        >
          {group && groupName && availableGroups
            ? createGroupSelector(group, groupName, availableGroups)
            : null}

          <span
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "100%",
              marginTop: "20px",
              fontFamily: "AntikorMonoLightItalic"
            }}
          >
            Top Songs
          </span>
          <img src={trending} alt="" height="54" width="43" />
          <MuiThemeProvider>
            <FormControl className={classes.selector}>
              <Select
                className={classes.selector}
                MenuProps={{ classes: { paper: classes.dropdownStyle } }}
                value={trendingRange}
                onChange={handleTrendingRangeChange}
              >
                <MenuItem
                  style={{
                    color: "#252a2e",
                    fontFamily: "AntikorMonoLightItalic"
                  }}
                  value={3600000}
                >
                  over the past hour
                </MenuItem>
                <MenuItem
                  style={{
                    color: "#252a2e",
                    fontFamily: "AntikorMonoLightItalic"
                  }}
                  value={86400000}
                >
                  over the past day
                </MenuItem>
                <MenuItem
                  style={{
                    color: "#252a2e",
                    fontFamily: "AntikorMonoLightItalic"
                  }}
                  value={604800000}
                >
                  over the past week
                </MenuItem>
              </Select>
            </FormControl>
          </MuiThemeProvider>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {sortedSongList ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <TrendingList songList={sortedSongList} />
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <ScaleLoader color={"#e54750"} />
          </div>
        )}
      </div>
    </div>
  );
}

export default WhatsTrendingController;
