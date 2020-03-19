import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Main from "./components/Main";
import firebase from "./firebase";
import "firebase/auth";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import LandingPage from "./components/LandingPage";
import ForgottenPassword from "./components/ForgottenPassword";
import SpotifyLogin from "./components/SpotifyLogin";
import ScaleLoader from "react-spinners/ScaleLoader";
import posed, { PoseGroup } from "react-pose";

const AuthFeature = posed.div({
  enter: { opacity: 1 },
  exit: { opacity: 0 }
});

const Feature = posed.div({
  enter: { opacity: 1 },
  exit: { opacity: 0 }
});

const UserContext = React.createContext({});
const UserProvider = UserContext.Provider;

function onAuthStateChange(callback) {
  firebase.auth().onAuthStateChanged(user => {
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
        <PoseGroup>
          <AuthFeature key={location.pathname}>
            <Switch location={location}>
              <Route path="/home" exact component={LandingPage} />
              <Route path="/signin" component={SignIn} />
              <Route path="/signup" component={SignUp} />
              <Route path="/forgotpassword" component={ForgottenPassword} />
              <Redirect to="/home" />
            </Switch>
          </AuthFeature>
        </PoseGroup>
      )}
    />
  );

  const FeatureRoutes = () => (
    <Route
      render={({ location }) => (
        <PoseGroup>
          <Feature id="content" key={location.pathname}>
            <Switch location={location}>
              <Route path="/spotifylogin" component={SpotifyLogin} />
              <Route path="/pandemonium" component={Main} />

              <Redirect to="/spotifylogin" />
            </Switch>
          </Feature>
        </PoseGroup>
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
          width: "100vw"
        }}
      >
        <ScaleLoader color={"#e54750"} />
      </div>
    );
  }

  if (!user.loggedIn) {
    return (
      <div style={{ backgroundColor: "#252a2e" }}>
        <BrowserRouter>{AuthRoutes()}</BrowserRouter>
      </div>
    );
  }
  return (
    <UserProvider value={user}>
      <div
        style={{
          backgroundColor: "#252a2e"
        }}
      >
        <BrowserRouter>{FeatureRoutes()}</BrowserRouter>
      </div>
    </UserProvider>
  );
}

export default App;
