import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core";
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

const useStyles = makeStyles({
  drawerPaper: {
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    color: "#191919",
    width: "220px"
  },
  paperAnchorDockedLeft: {
    borderRight: "1px",
    borderLeft: "0px",
    borderTop: "0px",
    borderBottom: "0px",
    borderRightColor: "#E7E5DF40",
    borderStyle: "solid"
  },
  divider: {
    backgroundColor: "#191919",
    width: "90%",
    display: "flex",
    alignSelf: "center"
  }
});

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

function logout() {
  firebase.auth().signOut();
}

function App() {
  const [user, setUser] = useState({ loggedIn: false, isLoading: true });

  const classes = useStyles();

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
              <Route path="/home" component={Main} />

              <Redirect to="/spotifylogin" />
            </Switch>
          </Feature>
        </PoseGroup>
      )}
    />
  );

  const requestLogout = useCallback(() => {
    logout();
  }, []);

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
