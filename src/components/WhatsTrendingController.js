import React, { useState, useEffect } from "react";
import firebase from "../firebase";
import trending from "../assets/trending.png";
import TrendingList from "./TrendingList";
import { FormControl, Select, Container, Grid } from "@material-ui/core";
import { MenuItem, Paper } from "material-ui";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import ScaleLoader from "react-spinners/ScaleLoader";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    // flexDirection: "column",
    alignItems: "center"
  },
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
}));

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
  const [sortedSongList, setSortedSongList] = useState();
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
    console.log(event.target);
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
    <Grid
      container
      spacing={5}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "15px"
      }}
    >
      <Grid item xl={6} lg={6} md={6} s={12} xs={12}>
        <div
          style={{
            fontSize: 40,
            border: "1px solid black",
            borderRadius: "30px",
            display: "flex",
            flex: 1,
            backgroundColor: "#37e0b6",
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

          <Typography
            align="center"
            style={{
              justifyContent: "center",
              alignItems: "center",
              fontSize: "100%",
              marginTop: "20px",
              color: "#f7f7f5",
              fontFamily: "AntikorMonoLightItalic"
            }}
          >
            Top Songs
          </Typography>
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
                  past hour
                </MenuItem>
                <MenuItem
                  style={{
                    color: "#252a2e",
                    fontFamily: "AntikorMonoLightItalic"
                  }}
                  name="during the last day"
                  value={86400000}
                >
                  past day
                </MenuItem>
                <MenuItem
                  style={{
                    color: "#252a2e",
                    fontFamily: "AntikorMonoLightItalic"
                  }}
                  name="during the last week"
                  value={604800000}
                >
                  past week
                </MenuItem>
              </Select>
            </FormControl>
          </MuiThemeProvider>
        </div>
      </Grid>

      <Grid item xl={6} lg={6} md={6} s={12} xs={12}>
        {sortedSongList ? (
          <TrendingList songList={sortedSongList} />
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
      </Grid>
    </Grid>
  );
}

export default WhatsTrendingController;
