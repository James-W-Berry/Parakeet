import React from "react";
import "./App.css";
import SplashScreen from "./components/SplashScreen/SplashScreen";
import { Provider } from "react-redux";
import { ConfigureStore } from "./store/configureStore";

const store = ConfigureStore();

function App() {
  return (
    <Provider store={store}>
      <SplashScreen />
    </Provider>
  );
}

export default App;
