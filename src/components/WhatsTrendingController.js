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
  selector: {
    color: "#252a2e",
    fontFamily: "AntikorMonoLightItalic",
    menuStyle: {
      border: "1px solid black",
      borderRadius: "5%",
      backgroundColor: "lightgrey"
    },
    marginTop: "20px",
    "& .MuiInput-underline:after": {
      borderBottomColor: "#f7f7f5"
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

          let sortedRetrievedSongs = retrievedSongs.sort((a, b) =>
            a.totalListens > b.totalListens ? -1 : 1
          );

          setPastSongs(sortedRetrievedSongs);
        });
      return () => unsubscribe();
    }
  }, [trendingRange, groupId]);

  return pastSongs;
}

function WhatsTrendingController(props) {
  const [trendingRange, setTrendingRange] = useState(3600000);
  const songList = usePastSongs(trendingRange, props.group);
  const classes = useStyles();

  const handleTrendingRangeChange = event => {
    setTrendingRange(event.target.value);
  };

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
            fontFamily: "AntikorMonoLightItalic",
            color: "#f7f7f5",
            padding: "30px"
          }}
        >
          <span style={{ color: "#252a2e" }}> {props.groupName}</span>
          <span> Top Hits</span>
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
                  Past Hour
                </MenuItem>
                <MenuItem
                  style={{
                    color: "#252a2e",
                    fontFamily: "AntikorMonoLightItalic"
                  }}
                  value={86400000}
                >
                  Past Day
                </MenuItem>
                <MenuItem
                  style={{
                    color: "#252a2e",
                    fontFamily: "AntikorMonoLightItalic"
                  }}
                  value={604800000}
                >
                  Past Week
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
        {songList ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <TrendingList songList={songList} />
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
