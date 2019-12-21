import React, { Component } from "react";

class Geolocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: this.props.coords,
      check: this.props.check
    };
  }
  render() {
    return !this.state.check ? (
      <div>Your browser does not support Geolocation</div>
    ) : !this.state.check ? (
      <div>Geolocation is not enabled</div>
    ) : this.state.location ? (
      console.log(this.state.location)
    ) : null;
  }
}

export default Geolocation;
