import React, { useState } from "react";
import Fab from "@material-ui/core/Fab";
import pull_up from "../assets/pull_up.png";
import pull_down from "../assets/pull_down.png";

function LocalMapButton(props) {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    setOpen(!open);
  };

  return (
    <div
      style={{
        alignSelf: "top",
        marginTop: "-30px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Fab
        style={{
          outline: "none",
          background: "#252a2e"
        }}
        aria-label="open map"
        onClick={() => {
          toggle();
          props.slideCallback();
        }}
      >
        {open ? (
          <img
            style={{
              color: "#f7f7f5",
              outline: "none",
              width: "74px",
              height: "74px"
            }}
            src={pull_down}
            alt="map"
          />
        ) : (
          <img
            style={{
              color: "#f7f7f5",
              outline: "none",
              width: "74px",
              height: "74px"
            }}
            src={pull_up}
            alt="map"
          />
        )}
      </Fab>
    </div>
  );
}

export default LocalMapButton;
