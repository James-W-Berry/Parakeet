import React, { Component } from "react";
import WhatsTrendingController from "../WhatsTrendingController/WhatsTrendingController";
import Banner from "../Banner/Banner";
import SearchForPerson from "../SearchForPerson/SearchForPerson";
import LocalMap from "../LocalMap/LocalMap";
import SpotifyPlayer from "../SpotifyPlayer/SpotifyPlayer";
import Flexbox from "flexbox-react";
import { firebase } from "../../firebase";
import uuid from "react-uuid";
import Fab from "@material-ui/core/Fab";
import PersonIcon from "@material-ui/icons/Person";

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mapHeight: "10vh",
      users: [1, 2, 3, 4, 5, 6, 7, 8]
    };
  }

  componentDidMount() {
    const db = firebase.firestore();
    //TODO: ger nearby users
  }

  toggleMapHeight = () => {
    if (this.state.mapHeight === "10vh") {
      this.setState({
        mapHeight: "75vh",
        userBubblesVisible: true
      });
    } else {
      this.setState({
        mapHeight: "10vh",
        userBubblesVisible: false
      });
    }
  };

  createNearbyUser(user) {
    const x = Math.random() * 90;
    const y = Math.random() * 70;
    console.log(x);
    console.log(y);

    return (
      <div
        key={uuid()}
        style={{
          flexDirection: "column",
          position: "absolute",
          bottom: `${y}vh`,
          left: `${x}vw`,
          width: "60",
          height: "60"
        }}
      >
        <Fab color="primary" aria-label="add">
          <PersonIcon />
        </Fab>
      </div>
    );
  }

  render() {
    return (
      <Flexbox
        flexDirection="column"
        minHeight="100vh"
        style={{
          background: "linear-gradient(180deg, #091740 0%, #112bbf 100%)",
          color: "#efefef"
        }}
      >
        <Flexbox element="header" height="60px" marginTop="20px">
          <div>
            <Banner />
          </div>

          <div
            style={{
              display: "flex",
              position: "absolute",
              flexGrow: 1,
              right: "15vw"
            }}
          >
            <SearchForPerson />
          </div>
        </Flexbox>

        <Flexbox flexGrow={1} alignSelf="center">
          <div
            style={{
              display: "flex",
              position: "absolute",
              top: "20vh",
              width: "100vw",
              height: "40vh",
              left: 0
            }}
          >
            <WhatsTrendingController />
          </div>
        </Flexbox>

        <Flexbox
          flexGrow={1}
          alignSelf="center"
          element="footer"
          flexDirection="column"
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              bottom: "15vh",
              left: 0,
              width: "100vw",
              height: this.state.mapHeight,
              background: "#112BBF"
            }}
          >
            <LocalMap slideCallback={this.toggleMapHeight} />
            <div
              style={{
                display: "flex",
                flexGrow: "1",
                width: "90vw",
                height: "90vh"
              }}
            >
              {this.state.userBubblesVisible &&
                this.state.users.map(user => this.createNearbyUser(user))}
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100vw",
              height: "15vh",
              background: "#112BBF"
            }}
          >
            <SpotifyPlayer />
          </div>
        </Flexbox>
      </Flexbox>
    );
  }
}

export default Main;
