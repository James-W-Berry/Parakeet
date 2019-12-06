import React, { Component } from "react";
import { firebase } from "../../firebase";
import TrendingList from "../TrendingList/TrendingList";

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
  constructor(props){
    super(props);
    this.state = {
      songList: [],
      timerange: 604800000
    };
  }


  componentWillMount(){
    const db = firebase.firestore()
    let doc = db.collection("pastSongs");
    doc.onSnapshot(docSnapshot => {
      let pastSongs = [];
      console.log("got a snappy");
      docSnapshot.forEach(doc =>
        pastSongs.push({ ...doc.data(), uid:doc.id}),
      );
      const orderedList = orderList(pastSongs, this.state.timerange);
      this.setState({ songList : orderedList });
    }, err => {
      console.log("FUCK");
    })
  }


  render() {
    const { songList } = this.state;
    console.log("SL",songList);

    // const { orderedList } = orderList(this.state, this.state.timerange);
    // console.log(orderedList);
    return(
      <div >
        <div>
          <TrendingList orderedList={songList} />
        </div>

      </div>
    );
  }
}

export default WhatsTrendingController;
