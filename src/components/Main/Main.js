import React, { Component } from "react";
import SavedList from "../SavedList/SavedList";
import Banner from "../Banner/Banner";
import SearchForPerson from "../SearchForPerson/SearchForPerson";
import WhatsTrendingController from "../WhatsTrendingController/WhatsTrendingController";
import TrendingList from "../TrendingList/TrendingList";
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
        <TrendingList />
        <LocalMap />
        <SpotifyPlayer />
        <SavedList />
        <Register />
      </div>
    );
  }
}

export default Main;
