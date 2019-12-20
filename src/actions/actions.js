export const SET_TOKEN = "SET_TOKEN";
export const SET_NEARBY_USERS = "SET_NEARBY_USERS";
export const SET_SELECTED_SONG = "SET_SELECTED_SONG";
export const SET_USER = "SET_USER";
export const SET_LOCATION = "SET_LOCATION";

export function setLocation(location) {
  return {
    type: SET_LOCATION,
    location: location
  };
}

export function setUser(user) {
  return {
    type: SET_USER,
    user: user
  };
}

export function setSelectedSong(selectedSong) {
  return {
    type: SET_SELECTED_SONG,
    selectedSong: selectedSong
  };
}

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
