import React, { Component } from "react";
import uuid from "react-uuid";
import Fab from "@material-ui/core/Fab";
import { Avatar } from "material-ui";
import "./UserBubble.css";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

var Marquee = require("react-marquee");

class UserBubble extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: this.props.user,
      show: true,
      expanded: false,
      style: {
        fontSize: 60,
        opacity: 0,
        transition: "all 2s ease"
      }
    };

    this.transitionEnd = this.transitionEnd.bind(this);
    this.mountStyle = this.mountStyle.bind(this);
    this.unMountStyle = this.unMountStyle.bind(this);
  }

  unMountStyle() {
    this.setState({
      style: {
        flexDirection: "column",
        position: "absolute",
        bottom: this.state.y,
        left: this.state.x,
        opacity: 0,
        transition: "all 1s ease"
      }
    });
  }

  mountStyle() {
    this.setState({
      style: {
        flexDirection: "column",
        position: "absolute",
        bottom: this.state.y,
        left: this.state.x,
        opacity: 1,
        width: "15vw",
        height: "6vh",
        transition: "all 2s ease"
      }
    });
  }

  expandedStyle = () => {
    this.setState({
      expanded: !this.state.expanded,
      style: {
        flexDirection: "column",
        position: "absolute",
        bottom: this.state.y,
        left: this.state.x,
        width: "15vw",
        height: "6vh",
        border: "1px",
        borderRadius: "12px",
        opacity: 1,
        transition: "all 2s ease"
      }
    });
  };

  componentDidMount() {
    this.setState({
      x: `${10 + Math.random() * 80}vw`,
      y: `${20 + Math.random() * 60}vh`,
      id: uuid()
    });
    setTimeout(this.mountStyle, 10);
  }

  transitionEnd() {
    if (!this.props.mounted) {
      this.setState({
        show: false
      });
    }
  }

  render() {
    return (
      <div
        style={this.state.style}
        onTransitionEnd={this.transitionEnd}
        onClick={this.expandedStyle}
      >
        {this.state.expanded ? (
          <MuiThemeProvider>
            <div
              style={{
                position: "absolute",
                fontWeight: "bold",
                fontSize: "16"
              }}
            >
              <Fab
                color="primary"
                aria-label="add"
                style={{ outline: "none", background: "#ee0979" }}
              >
                <Avatar
                  alt={`${this.state.user.listenerName}`}
                  src={`${this.state.user.listenerImage}`}
                  style={{ height: "60px", width: "60px" }}
                />
              </Fab>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flexStart",
                  position: "absolute",
                  left: "65px",
                  top: "0.25vh",
                  fontWeight: "bold",
                  fontSize: "16"
                }}
              >
                <Marquee
                  text={this.state.user.songTitle}
                  hoverToStop={false}
                  loop={false}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flexStart",
                  position: "absolute",
                  left: "65px",
                  top: "2.25vh",
                  fontSize: "16",
                  maxWidth: "20vw"
                }}
              >
                <Marquee
                  text={`${this.state.user.artist}`}
                  hoverToStop={false}
                  loop={false}
                />
              </div>
            </div>
          </MuiThemeProvider>
        ) : (
          <MuiThemeProvider>
            <div
              style={{
                position: "absolute",
                fontWeight: "bold",
                fontSize: "16"
              }}
            >
              <Fab
                color="primary"
                aria-label="add"
                style={{ outline: "none", background: "#091740" }}
              >
                <Avatar
                  alt={`${this.state.user.listenerName}`}
                  src={`${this.state.user.listenerImage}`}
                  style={{ height: "60px", width: "60px" }}
                />
              </Fab>
            </div>
          </MuiThemeProvider>
        )}
      </div>
    );
  }
}

export default UserBubble;
