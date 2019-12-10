import React, { Component, Fragment } from "react";
import Fab from "@material-ui/core/Fab";
import map from "../../images/map.svg";

class LocalMapButton extends Component {
  state = { open: false };

  toggle = () => {
    this.setState(prevState => ({ open: !prevState.open }));
  };

  render() {
    return (
        
          <img onClick={() => {
            this.props.slideCallback();
          }} style={{ display: "flex",
            flexGrow: 1,
            position: "absolute",
            justifyContent: "center",
            top: -40,
            outline: "none",
            width: "85px",
            height: "85px",
            backgroundColor: "#efefef" }} src={map} alt="map" />
    );
  }
}

export default LocalMapButton;
