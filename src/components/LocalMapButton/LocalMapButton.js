import React, { Component, Fragment } from "react";
import Fab from "@material-ui/core/Fab";
import map from "../../images/map.png";

class LocalMapButton extends Component {
  state = { open: false };

  toggle = () => {
    this.setState(prevState => ({ open: !prevState.open }));
  };

  render() {
    return (
      <Fragment>
        <Fab
          style={{
            display: "flex",
            flexGrow: 1,
            position: "absolute",
            justifyContent: "center",
            top: -40,
            outline: "none"
          }}
          color="primary"
          aria-label="open map"
          onClick={() => {
            this.props.slideCallback();
          }}
        >
          <img src={map} alt="map" />
        </Fab>
      </Fragment>
    );
  }
}

export default LocalMapButton;
