import {
  SET_TOKEN,
  SET_NEARBY_USERS,
  SET_SELECTED_SONG,
  SET_USER,
  SET_LOCATION
} from "../actions/actions";

let initialState = null;

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SELECTED_SONG:
      return {
        ...state,
        selectedSong: action.selectedSong
      };
    case SET_NEARBY_USERS:
      return {
        ...state,
        nearbyUsers: action.nearbyUsers
      };
    case SET_TOKEN:
      return {
        ...state,
        token: action.token
      };
    case SET_USER:
      return {
        ...state,
        user: action.user
      };
    case SET_LOCATION:
      return {
        ...state,
        location: action.location
      };

    default:
      return state;
  }
}

export default rootReducer;
