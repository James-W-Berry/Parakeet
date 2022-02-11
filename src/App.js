import "firebase/auth";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import ScaleLoader from "react-spinners/ScaleLoader";
import "./App.css";
import ForgottenPassword from "./components/ForgottenPassword";
import LandingPage from "./components/LandingPage";
import Main from "./components/Main";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import SpotifyLogin from "./components/SpotifyLogin";
import firebase from "./firebase";

const UserContext = React.createContext({});
const UserProvider = UserContext.Provider;

function onAuthStateChange(callback) {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      callback({ loggedIn: true, email: user.email, isLoading: false });
    } else {
      callback({ loggedIn: false, isLoading: false });
    }
  });
}

function App() {
  const [user, setUser] = useState({ loggedIn: false, isLoading: true });

  useEffect(() => {
    const unsubscribe = onAuthStateChange(setUser);
    return () => {
      unsubscribe();
    };
  }, []);

  const AuthRoutes = () => (
    <Route
      render={({ location }) => (
        <motion.div
          key={location.pathname}
          animate={{
            opacity: [0, 1.0],
          }}
          transition={{ duration: 1 }}
        >
          <Switch location={location}>
            <Route path="/home" exact component={LandingPage} />
            <Route path="/signin" component={SignIn} />
            <Route path="/signup" component={SignUp} />
            <Route path="/forgotpassword" component={ForgottenPassword} />
            <Redirect to="/home" />
          </Switch>
        </motion.div>
      )}
    />
  );

  const FeatureRoutes = () => (
    <Route
      render={({ location }) => (
        <motion.div
          id="content"
          key={location.pathname}
          animate={{
            opacity: [0, 1.0],
          }}
          transition={{ duration: 1 }}
        >
          <Switch location={location}>
            <Route path="/spotifylogin" component={SpotifyLogin} />
            <Route path="/pandemonium" component={Main} />
            <Redirect to="/spotifylogin" />
          </Switch>
        </motion.div>
      )}
    />
  );

  if (user.isLoading) {
    return (
      <div
        style={{
          backgroundColor: "#252a2e",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        <ScaleLoader color={"#e54750"} />
      </div>
    );
  }

  if (!user.loggedIn) {
    return (
      <div
        style={{
          backgroundColor: "#252a2e",
        }}
      >
        <BrowserRouter>{AuthRoutes()}</BrowserRouter>;
      </div>
    );
  }
  return (
    <UserProvider value={user}>
      <div
        style={{
          backgroundColor: "#252a2e",
        }}
      >
        <BrowserRouter>{FeatureRoutes()}</BrowserRouter>
      </div>
    </UserProvider>
  );
}

export default App;
