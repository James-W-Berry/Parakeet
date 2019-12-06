import React, { Component } from "react";
import uuid from "react-uuid";
import Fab from "@material-ui/core/Fab";
import PersonIcon from "@material-ui/icons/Person";

class UserBubble extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: this.props.user,
      show: true,
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

  componentDidMount() {
    this.setState({
      x: `${5 + Math.random() * 90}vw`,
      y: `${15 + Math.random() * 60}vh`,
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
      >
        <Fab color="primary" aria-label="add" style={{ outline: "none" }}>
          <PersonIcon />
        </Fab>
      </div>
    );
  }
}

export default UserBubble;
