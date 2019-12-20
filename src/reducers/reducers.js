import {
  SET_TOKEN,
  SET_NEARBY_USERS,
  SET_SELECTED_SONG,
  SET_USER,
  SET_LOCATION
} from "../actions/actions";

const initialState = {
  token: null,
  user: undefined
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SELECTED_SONG:
      return {
        selectedSong: action.selectedSong
      };
    case SET_NEARBY_USERS:
      return {
        nearbyUsers: action.nearbyUsers
      };
    case SET_TOKEN:
      return {
        token: action.token
      };
    case SET_USER:
      return {
        user: {
          spotifyId: action.user.spotifyId,
          displayName: action.user.displayName,
          location: action.user.location,
          group: action.user.group,
          currentSong: {
            uri: action.user.currentSong.uri,
            title: action.user.currentSong.title,
            artist: action.user.currentSong.artist
          }
        }
      };
    case SET_LOCATION:
      return {
        location: {
          latitude: action.location.latitude,
          longitude: action.location.longitude
        }
      };

    default:
      return state;
  }
}

export default rootReducer;
