import React, { Component } from "react";
import WhatsTrendingController from "../WhatsTrendingController/WhatsTrendingController";

class TrendingList extends Component {
  constructor(props){
    super(props);
    this.state = {
      songList: [],
      timerange: 6.048e+8
    };
  }

  render() {
  var trendingData = <WhatsTrendingController />;
    return (
      <div>
      <br/><br/>
      {trendingData}
      <br/><br/>
      </div>
    );
  }
}

export default TrendingList;
