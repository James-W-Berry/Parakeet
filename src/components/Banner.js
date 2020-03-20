import React, { useCallback } from "react";
import bannerLogo from "../assets/parakeet-nomusic.png";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import { Typography } from "@material-ui/core";
import firebase from "../firebase";
import "firebase/auth";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  paper: {
    color: "#f7f7f5",
    backgroundColor: "#12355b",
    padding: theme.spacing(2, 4, 3)
  }
}));

function logout() {
  firebase.auth().signOut();
}

function Banner(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const requestLogout = useCallback(() => {
    logout();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "5vw"
      }}
    >
      <div
        // onClick={requestLogout}
        onClick={handleOpen}
        style={{
          flex: 1,
          alignItems: "center",
          cursor: "pointer"
        }}
      >
        <img src={bannerLogo} alt="" height="80" width="100" />
      </div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">Settings</h2>
            <p id="transition-modal-description">
              Join a group or create a new group here
            </p>
            <div
              onClick={requestLogout}
              style={{ display: "flex", cursor: "pointer" }}
            >
              <Typography style={{ marginRight: "10px", color: "#f7f7f5" }}>
                Logout
              </Typography>
              <LogoutIcon />
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

export default Banner;
