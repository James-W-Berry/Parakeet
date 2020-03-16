import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import {
  makeStyles,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from "@material-ui/core";
import Main from "./components/Main";
import firebase from "./firebase";
import "firebase/auth";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import LandingPage from "./components/LandingPage";
import ForgottenPassword from "./components/ForgottenPassword";
import SyncLoader from "react-spinners/SyncLoader";
import posed, { PoseGroup } from "react-pose";

const useStyles = makeStyles({
  drawerPaper: {
    // backgroundImage: `url(${drawerPhoto})`,
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
  const [tokens, setTokens] = useState();
  const [loggedIn, setLoggedIn] = useState(false);

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
        <div
          id="content"
          key={location.pathname}
          style={{ width: "100%", height: "100%" }}
        >
          <Switch location={location}>
            {/* <Route path="/dashboard" component={DashboardPage} />
            <Route path="/steppers" component={SteppersPage} />
            <Route path="/edit" component={EditPage} />
            <Route path="/profile" component={ProfilePage} />
            <Redirect to="/dashboard" /> */}
          </Switch>
        </div>
      )}
    />
  );

  const requestLogout = useCallback(() => {
    logout();
  }, []);

  // useEffect(() => {
  //   const tokens = getHashParams();
  //   if (tokens.access_token) {
  //     setTokens(tokens);
  //     setLoggedIn(true);
  //   }
  // }, []);

  // function getHashParams() {
  //   var hashParams = {};
  //   var e,
  //     r = /([^&;=]+)=?([^&;]*)/g,
  //     q = window.location.hash.substring(1);
  //   e = r.exec(q);
  //   while (e) {
  //     hashParams[e[1]] = decodeURIComponent(e[2]);
  //     e = r.exec(q);
  //   }
  //   return hashParams;
  // }

  if (user.isLoading) {
    return (
      <div
        style={{
          backgroundColor: "#393E41",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw"
        }}
      >
        <SyncLoader color={"#fdc029"} />
      </div>
    );
  }

  if (!user.loggedIn) {
    return (
      <div style={{ backgroundColor: "#393E41" }}>
        <BrowserRouter>{AuthRoutes()}</BrowserRouter>
      </div>
    );
  }
  return (
    <UserProvider value={user}>
      <div
        style={{
          backgroundColor: "#393E41",
          display: "flex",
          flexDirection: "column",
          width: "100vw",
          height: "100vh"
        }}
      >
        <BrowserRouter>
          <CssBaseline />
          <div
            style={{
              height: "100vh",
              width: "100vw - 200px",
              display: "flex",
              marginLeft: 240,
              flex: 1,
              backgroundColor: "#393E41"
            }}
          >
            {FeatureRoutes()}
          </div>
        </BrowserRouter>
      </div>
    </UserProvider>
  );
}

export default App;
