import React, { Component } from "react";
import spy from "../../images/mr_spy.png";

class Banner extends Component {
  render() {
    return (
      <img src={spy} alt="" height="50" width="50" style={{ position: "absolute", left: "2vw" }} />
    );
  }
}

export default Banner;
