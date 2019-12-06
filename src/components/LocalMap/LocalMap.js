import React, { Component, Fragment } from "react";
import Expand from "react-expand-animated";
import Fab from "@material-ui/core/Fab";
import map from "../../images/map.png";

class LocalMap extends Component {
  state = { open: false };

  toggle = () => {
    this.setState(prevState => ({ open: !prevState.open }));
  };

  render() {
    return (
      <Fragment>
        <Fab
          style={{
            background: "#191919",
            display: "flex",
            flexGrow: 1,
            position: "absolute",
            left: "49vw",
            top: -40
          }}
          color="primary"
          aria-label="open map"
          onClick={this.toggle}
        >
          <img src={map} alt="map" />
        </Fab>
        <Expand open={this.state.open}>
          <div style={{ width: "100vw", height: "80vh" }}></div>
        </Expand>
      </Fragment>
    );
  }
}

export default LocalMap;
