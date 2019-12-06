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

class WhatsTrendingController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pastSongs: [],
      timescale: 24
    };
  }

  componentDidMount() {
    const db = firebase.firestore();
    let doc = db.collection("pastSongs");
    doc.onSnapshot(
      docSnapshot => {
        let pastSongs = [];
        console.log("got a snappy");
        docSnapshot.forEach(doc =>
          pastSongs.push({ ...doc.data(), uid: doc.id })
        );
        // console.log(pastSongs);
        this.setState({ pastSongs });
      },
      err => {
        console.log("FUCK");
      }
    );

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

        <div
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
          <TrendingList pastSongs={pastSongs} />
        </div>
      </div>
    );
  }
}

export default WhatsTrendingController;
