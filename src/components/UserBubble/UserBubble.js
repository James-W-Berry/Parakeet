import React, { Component } from "react";
import uuid from "react-uuid";
import Fab from "@material-ui/core/Fab";
import PersonIcon from "@material-ui/icons/Person";
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
        width: "60",
        height: "60",
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
        width: "60",
        height: "60",
        opacity: 1,
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
    console.log(this.state);
    return (
      <div
        key={this.state.id}
        style={this.state.style}
        onTransitionEnd={this.transitionEnd}
        onClick={this.expandedStyle}
      >
        {this.state.expanded ? (
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
              <PersonIcon />
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
              <Marquee text="Song" hoverToStop={false} loop={false} />
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
              <Marquee text="Artist • Album" hoverToStop={false} loop={false} />
            </div>
          </div>
        ) : (
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
              <PersonIcon />
            </Fab>
          </div>
        )}
      </div>
    );
  }
}

export default UserBubble;
