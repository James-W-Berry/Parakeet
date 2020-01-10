import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import rootReducer from "../reducers/reducers";

export const ConfigureStore = () => {
  const store = createStore(
    combineReducers({
      rootReducer
    }),
    applyMiddleware(thunk, logger)
  );

  return store;
};
