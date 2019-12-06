import React, { Component } from "react";
import { firebase } from "../../firebase";
import eye from "../../images/eye.png";
import zenuity from "../../images/zenuity.png";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TrendingList from "../TrendingList/TrendingList";

const handleChange = event => {
  console.log("selected time range");
};

export function orderList(songList, ts){
  const tempList  = songList;
  var timerange = ts;
  var curTime = Date.now();
  var startTime = curTime-timerange;
  var orderedList = [];

  for(var i=0; i < tempList.length; i++){
    var filteredList = orderedList.filter(item => {
      return item.songId === tempList[i].songId;
    });
    if(filteredList.length === 0) {
      orderedList.push({"songId" : tempList[i].songId, "playcount" : 1});
    }else{
      orderedList[orderedList.indexOf(filteredList[0])].playcount++;
    }
  }

  let swapped;
  do{
    swapped = false;
    for(let i = 0; i < orderedList.length-1; i++){
      if(orderedList[i].playcount < orderedList[i+1].playcount){
        var tmp = orderedList[i];
        orderedList[i] = orderedList[i+1];
        orderedList[i+1] = tmp;
        swapped = true;
      }
    }
  }while (swapped);

  return (orderedList);

}

class WhatsTrendingController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      songList: [],
      timescale: 604800000
    };
  }


  componentWillMount(){
    const db = firebase.firestore();
    var curTime = Date.now();
    var startTime = curTime-this.state.timescale;
    let doc = db.collection("pastSongs");
    doc.onSnapshot(docSnapshot => {
      let pastSongs = [];
      console.log("got a snappy");
      docSnapshot.forEach(doc =>
        pastSongs.push({ ...doc.data(), uid:doc.id}),
      );
      const orderedList = orderList(pastSongs, this.state.timescale);
      this.setState({ songList : orderedList });
    }, err => {
      console.log("FUCK");
    })
  }


  render() {

    const { songList } = this.state;
    console.log("SL",songList);
    return (
      <div>
        <div
          style={{
            height: "80%",
            width: "20%",
            backgroundPosition: "center",
            backgroundRepeat: "no-input",
            backgroundSize: "cover",
            backgroundImage: `url(${eye})`,
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontSize: 40,
            left: "15vw",
            textAlign: "start",
            border: "1px solid black",
            borderRadius: "30px"
          }}
        >
          <div style={{ position: "absolute", top: "20%" }}>
            zenuitian top hits
          </div>
          <img
            src={zenuity}
            alt=""
            height="54"
            width="43"
            style={{ position: "absolute", top: "44%" }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontSize: 30,
            height: "10%",
            bottom: "10%",
            left: "17%"
          }}
        >
          trending now at zenuity
        </div>

    {/*    <div
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontSize: 20,
            height: "10%",
            bottom: 0,
            left: "20%",
            color: "#efefef"
          }}
        >
          <FormControl>
            <Select
              value={this.state.timescale}
              onChange={handleChange}
              displayEmpty
              style={{ color: "#efefef" }}
            >
              <MenuItem value={1}>Hour</MenuItem>
              <MenuItem value={24}>Day</MenuItem>
              <MenuItem value={168}>Week</MenuItem>
            </Select>
          </FormControl>
        </div>
*/}
        <div
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontSize: 30,
            height: "10%",
            right: "30%"
          }}
        >
          <TrendingList orderedList={songList} />
        </div>
      </div>
    );
  }
}

export default WhatsTrendingController;
