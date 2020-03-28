import React, { useState, useEffect } from "react";
import ReactMapboxGl from "react-mapbox-gl";
import UserBubble from "./UserBubble";
import MyLocationIcon from "@material-ui/icons/MyLocation";

const dotenv = require("dotenv");
dotenv.config();
const mapboxApiKey = process.env.REACT_APP_MAPBOX_API_KEY;
const mapboxStyle = process.env.REACT_APP_MAPBOX_STYLE_URL;

const Map = new ReactMapboxGl({
  accessToken: mapboxApiKey,
  attributionControl: false
});

function ParakeetMap(props) {
  const [userLocation, setUserLocation] = useState({
    longitude: -83.0562526,
    latitude: 42.333456
  });
  const [center, setCenter] = useState([-83.0562526, 42.333456]);
  const [zoom, setZoom] = useState([8]);
  const [nearbyUsers, setNearbyUsers] = useState();
  const [nearbyPeopleInGroup, setNearbyPeopleInGroup] = useState();
  const [user, setUser] = useState();

  useEffect(() => {
    if (props.user?.location?.longitude) {
      setUser(props.user);

      setUserLocation({
        longitude: props.user.location.longitude,
        latitude: props.user.location.latitude
      });
    }
  }, [props.user]);

  useEffect(() => {
    if (props.nearbyPeople) {
      setNearbyUsers(props.nearbyPeople);
    }
  }, [props.nearbyPeople]);

  useEffect(() => {
    if (props.nearbyPeopleInGroup) {
      setNearbyPeopleInGroup(props.nearbyPeopleInGroup);
    }
  }, [props.nearbyPeopleInGroup]);

  function createPersonBubble(person) {
    if (person?.location?.longitude) {
      return (
        <div key={person.id}>
          <UserBubble user={person} />
        </div>
      );
    } else {
      return null;
    }
  }

  return (
    <Map
      style={mapboxStyle}
      zoom={zoom}
      containerStyle={{
        borderTopLeftRadius: "120px",
        height: "100%",
        width: "100%"
      }}
      center={center}
    >
      {props.filterByGroup
        ? nearbyPeopleInGroup &&
          nearbyPeopleInGroup.map(person => createPersonBubble(person))
        : nearbyUsers && nearbyUsers.map(person => createPersonBubble(person))}
    </Map>
  );
}

export default ParakeetMap;
