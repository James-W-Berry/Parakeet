import React, { useState, useEffect } from "react";
import ReactMapboxGl from "react-mapbox-gl";
import UserBubble from "./UserBubble";

const dotenv = require("dotenv");
dotenv.config();
const mapboxApiKey = process.env.REACT_APP_MAPBOX_API_KEY;
const mapboxStyle = process.env.REACT_APP_MAPBOX_STYLE_URL;

function ParakeetMap(props) {
  const [userLocation, setUserLocation] = useState({
    longitude: 42.3523699,
    latitude: -83.3793885
  });
  const [nearbyUsers, setNearbyUsers] = useState();
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

  function createPersonBubble(person) {
    if (person?.location?.longitude) {
      return (
        <div key={person.spotifyId}>
          <UserBubble user={person} />
        </div>
      );
    } else {
      return null;
    }
  }

  const Map = ReactMapboxGl({
    accessToken: mapboxApiKey
  });

  return (
    <Map
      zoom={[10]}
      style={mapboxStyle}
      containerStyle={{
        borderRadius: "200px",
        height: "100%",
        width: "100%"
      }}
      flyToOptions={{ speed: 2.0 }}
      center={[userLocation.longitude, userLocation.latitude]}
    >
      {nearbyUsers && nearbyUsers.map(person => createPersonBubble(person))}
    </Map>
  );
}

export default ParakeetMap;
