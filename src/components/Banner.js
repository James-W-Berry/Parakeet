import React, { useState, useEffect, useCallback } from "react";
import bannerLogo from "../assets/bannerLogo.png";
import Fab from "@material-ui/core/Fab";
import { Avatar, TextField } from "material-ui";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import PersonIcon from "@material-ui/icons/Person";
import { connect } from "react-redux";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { setUser } from "../actions/actions";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import uuid from "react-uuid";
import { Typography, Button } from "@material-ui/core";
import firebase from "../firebase";
import ReactSearchBox from "react-search-box";
import { withStyles } from "@material-ui/core/styles";
import "firebase/auth";
import LogoutIcon from "@material-ui/icons/ExitToApp";

const styles = {
  root: {
    background: "black"
  },
  input: {
    color: "white"
  }
};

function logout() {
  firebase.auth().signOut();
}

function useGroups() {
  const [groups, setGroups] = useState([]);
  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("groups")
      .onSnapshot(snapshot => {
        const retrievedGroups = snapshot.docs.map(doc => ({
          ...doc.data()
        }));

        setGroups(retrievedGroups);
        return () => unsubscribe();
      });
  }, []);
  return groups;
}

function Banner(props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [newGroupDialog, setNewGroupDialog] = useState(false);
  const groups = useGroups();

  const requestLogout = useCallback(() => {
    logout();
  }, []);

  function openUserSettings() {
    setModalOpen(true);
  }

  function closeUserSettings() {
    setModalOpen(false);
  }

  function showAddNewGroup() {
    setNewGroupDialog(!newGroupDialog);
  }

  function handleAddNewGroup() {
    // addGroup(this.state.newGroupName);
    setNewGroupDialog(!newGroupDialog);
  }

  return (
    <div>
      <div>
        <img
          src={bannerLogo}
          alt=""
          height="80"
          width="62"
          style={{ position: "absolute", left: "2vw" }}
        />
      </div>
      <div
        onClick={requestLogout}
        style={{
          position: "absolute",
          right: "2vw",
          cursor: "pointer",
          width: "10vw"
        }}
      >
        <Typography
          style={{
            marginRight: "10px",
            color: "#e54750",
            fontFamily: "AntikorMonoLightItalic"
          }}
        >
          Logout
        </Typography>
        <LogoutIcon />
      </div>
    </div>
  );
}

export default withStyles(styles)(Banner);
