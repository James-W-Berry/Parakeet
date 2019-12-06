import React, { Component } from "react";
import SavedList from "../SavedList/SavedList";
import Banner from "../Banner/Banner";
import SearchForPerson from "../SearchForPerson/SearchForPerson";
import WhatsTrendingController from "../WhatsTrendingController/WhatsTrendingController";
import LocalMap from "../LocalMap/LocalMap";
import SpotifyPlayer from "../SpotifyPlayer/SpotifyPlayer";
import Register from "../Register/Register";

class Main extends Component {
  render() {
    return (
      <div>
        <Banner />
        <SearchForPerson />
        <WhatsTrendingController />
        <LocalMap />
        <SpotifyPlayer />
        <SavedList />
        <Register />
      </div>
    );
  }
}

export default Main;
