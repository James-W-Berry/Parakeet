import React, { useState } from "react";
import Fab from "@material-ui/core/Fab";
import pull_up from "../assets/pull_up.png";
import pull_down from "../assets/pull_down.png";
import { Avatar } from "material-ui";
import { MuiThemeProvider } from "material-ui/styles";
import ReactToolTip from "react-tooltip";

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
      <MuiThemeProvider>
        <Fab
          style={{
            outline: "none"
          }}
          data-tip
          data-for="mapButton"
          onClick={() => {
            toggle();
            props.slideCallback();
          }}
          aria-label="map"
        >
          {open ? (
            <div style={{ outline: "none" }}>
              <ReactToolTip place="right" id="mapButton">
                <span
                  style={{
                    color: "#37e0b6",
                    fontFamily: "AntikorMonoLightItalic"
                  }}
                >
                  Close Map
                </span>
              </ReactToolTip>
              <Avatar
                style={{
                  outline: "none",
                  width: "60px",
                  height: "60px"
                }}
                alt={"map"}
                src={pull_down}
              />
            </div>
          ) : (
            <div style={{ outline: "none" }}>
              <ReactToolTip place="right" id="mapButton">
                <span
                  style={{
                    color: "#37e0b6",
                    fontFamily: "AntikorMonoLightItalic"
                  }}
                >
                  Open Map
                </span>
              </ReactToolTip>
              <Avatar
                style={{
                  outline: "none",
                  width: "60px",
                  height: "60px"
                }}
                alt={"map"}
                src={pull_up}
              />
            </div>
          )}
        </Fab>
      </MuiThemeProvider>
    </div>
  );
}

export default LocalMapButton;
