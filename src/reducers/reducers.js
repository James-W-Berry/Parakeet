import {
  REGISTER_USER,
  SET_TOKEN,
  SET_NEARBY_USERS,
  SET_SELECTED_SONG
} from "../actions/actions";

const initialState = {
  user: [],
  token: null
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
    case REGISTER_USER:
      return {
        user: [
          ...state.user,
          {
            spotifyId: action.spotifyId,
            displayName: action.displayName,
            location: action.location,
            currentSong: {
              uri: action.currentSong.uri,
              title: action.currentSong.title,
              artist: action.currentSong.artist,
              album: action.currentSong.album
            },
            group: action.group
          }
        ]
      };

    default:
      return state;
  }
}

export default rootReducer;
