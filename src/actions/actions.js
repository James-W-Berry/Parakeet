export const REGISTER_USER = "REGISTER_USER";
export const SET_TOKEN = "SET_TOKEN";
export const SET_NEARBY_USERS = "SET_NEARBY_USERS";

export function setNearbyUsers(nearbyUsers) {
  return {
    type: SET_NEARBY_USERS,
    nearbyUsers: nearbyUsers
  };
}

export function setToken(token) {
  return {
    type: SET_TOKEN,
    token: token
  };
}

export function registerUser(
  spotifyId,
  displayName,
  location,
  currentSong,
  group
) {
  console.log("registering new user");
  return {
    type: REGISTER_USER,
    spotifyId: spotifyId,
    displayName: displayName,
    location: {
      latitude: location.latitude,
      longitude: location.longitude
    },
    currentSong: {
      uri: currentSong.uri,
      title: currentSong.title,
      artist: currentSong.artist,
      album: currentSong.album
    },
    group: group
  };
}
