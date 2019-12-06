import React, { Component } from "react";
import { firebase } from "../../firebase";
class WhatsTrendingController extends Component {
  constructor(props){
    super(props);
    this.state = {
      pastSongs: []
    };
  }


  componentDidMount(){
    const db = firebase.firestore()
    let doc = db.collection("pastSongs");
    doc.onSnapshot(docSnapshot => {
      let pastSongs = [];
      console.log("got a snappy");
      docSnapshot.forEach(doc =>
        pastSongs.push({ ...doc.data(), uid:doc.id}),
      );
      // console.log(pastSongs);
      this.setState({ pastSongs });
    }, err => {
      console.log("FUCK");
    })

    // db.collection("pastSongs")
    //   .get()
    //   .then(querySnapshot => {
    //     const data = querySnapshot.docs.map(doc => doc.data());
    //     console.log(data);
    //     this.setState({ pastSongs: data });
    //   });
  }

  render() {
    const { pastSongs } = this.state;
    console.log(pastSongs);
    return(
      <div >
        {pastSongs.map(song => (
          <div>
            <div> {song.songId} {song.lastName} </div>
            <div> {song.currentSong} </div>
          </div>
        ))}
      </div>
    );
  }
}

export default WhatsTrendingController;
