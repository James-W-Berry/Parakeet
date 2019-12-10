import React, { Component } from "react";
import { firebase } from "../../firebase";
import trendingPic from "../../images/trending_pic.png";
import trending from "../../images/trending.png";
import TrendingList from "../TrendingList/TrendingList";
import { FormControl, Select } from "@material-ui/core";
import { MenuItem } from "material-ui";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

export function orderList(songList, ts) {
  const tempList = songList;
  var timerange = ts;
  var curTime = Date.now();
  var startTime = curTime - timerange;
  var orderedList = [];

  for (var i = 0; i < tempList.length; i++) {
    var filteredList = orderedList.filter(item => {
      return item.songId === tempList[i].songId;
    });
    if (filteredList.length === 0) {
      orderedList.push({
        songId: tempList[i].songId,
        playcount: 1,
        songTitle: tempList[i].songTitle,
        artist: tempList[i].artist,
        album: tempList[i].album,
        uri: tempList[i].uri
      });
    } else {
      orderedList[orderedList.indexOf(filteredList[0])].playcount++;
    }
  }

  let swapped;
  do {
    swapped = false;
    for (let i = 0; i < orderedList.length - 1; i++) {
      if (orderedList[i].playcount < orderedList[i + 1].playcount) {
        var tmp = orderedList[i];
        orderedList[i] = orderedList[i + 1];
        orderedList[i + 1] = tmp;
        swapped = true;
      }
    }
  } while (swapped);

  return orderedList;
}

class WhatsTrendingController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      songList: [],
      timescale: 604800000,
      callback: this.props.trendingSongSelected
    };

    this.handleTrendingSongSelected = this.handleTrendingSongSelected.bind(
      this
    );
  }

  handleTimescaleChange = event => {
    this.setState({
      timescale: event.target.value
    });
  };

  handleTrendingSongSelected(uri) {
    this.state.callback(uri);
  }

  componentWillMount() {
    const db = firebase.firestore();
    var curTime = Date.now();
    var startTime = curTime - this.state.timescale;
    let doc = db.collection("pastSongs");
    doc.onSnapshot(
      docSnapshot => {
        let pastSongs = [];
        docSnapshot.forEach(doc =>
          pastSongs.push({ ...doc.data(), uid: doc.id })
        );

        const orderedList = orderList(pastSongs, this.state.timescale);

        this.setState({ songList: orderedList });
      },
      err => {
        console.log(err);
      }
    );
  }

  render() {
    const { songList } = this.state;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row"
        }}
      >
        <div
          style={{
            height: "80%",
            width: "20%",
            backgroundPosition: "center",
            backgroundRepeat: "no-input",
            backgroundSize: "cover",
            backgroundImage: `url(${trendingPic})`,
            position: "absolute",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 40,
            left: "15vw",
            textAlign: "start",
            border: "1px solid black",
            borderRadius: "30px"
          }}
        >
          <div style={{ position: "absolute", top: "20%" }}>Top Hits</div>
          <img
            src={trending}
            alt=""
            height="54"
            width="43"
            style={{ position: "absolute", top: "44%" }}
          />

          <div
            style={{
              position: "absolute",
              fontSize: 30,
              height: "10%",
              bottom: "-10%"
            }}
          >
            Trending now near you
          </div>

          <div
            style={{
              position: "absolute",
              fontSize: 30,
              height: "10%",
              bottom: "-25%"
            }}
          >
            <MuiThemeProvider>
              <FormControl>
                <Select
                  value={this.state.timescale}
                  onChange={this.handleTimescaleChange}
                  style={{ color: "#efefef" }}
                >
                  <MenuItem value={3600000}>Hour</MenuItem>
                  <MenuItem value={86400000}>Day</MenuItem>
                  <MenuItem value={604800000}>Week</MenuItem>
                </Select>
              </FormControl>
            </MuiThemeProvider>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            right: "25vw"
          }}
        >
          <TrendingList
            orderedList={songList}
            handleTrendingSongSelected={this.handleTrendingSongSelected}
          />
        </div>
      </div>
    );
  }
}

export default WhatsTrendingController;
