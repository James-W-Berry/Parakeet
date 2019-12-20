import React, { Component } from "react";
import { geolocated } from "react-geolocated";
import { connect } from "react-redux";
import { setLocation } from "../../actions/actions";

class Geolocation extends Component {
  updateLocation(coords) {
    if (coords) {
      const location = {
        latitude: coords.latitude,
        longitude: coords.longitude
      };
      this.props.setLocation(location);
    }
    return null;
  }

  render() {
    return !this.props.isGeolocationAvailable ? (
      <div>Your browser does not support Geolocation</div>
    ) : !this.props.isGeolocationEnabled ? (
      <div>Geolocation is not enabled</div>
    ) : this.props.coords ? (
      this.updateLocation(this.props.coords)
    ) : null;
  }
}

const mapDispatchToProps = {
  setLocation: setLocation
};

export default connect(
  null,
  mapDispatchToProps
)(
  geolocated({
    positionOptions: {
      enableHighAccuracy: false
    },
    userDecisionTimeout: 5000
  })(Geolocation)
);
