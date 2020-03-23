import React, { useCallback, useState, useEffect } from "react";
import settings from "../assets/settings.png";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import firebase from "../firebase";
import "firebase/auth";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import Scrollbar from "react-scrollbars-custom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import groupIcon from "../assets/groupIcon.png";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import { makeStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    margin: 0,
    backgroundColor: "#252a2e",
    padding: theme.spacing(2),
    "&:hover": {
      color: "#f7f7f5"
    },
    fontFamily: "AntikorMonoLightItalic",
    border: 0,
    color: "#e54750"
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: "#e54750"
  },
  textInput: {
    width: "100%",
    "& label ": {
      color: "#f7f7f5",
      fontFamily: "AntikorMonoLightItalic"
    },
    "& label.Mui-focused": {
      fontFamily: "AntikorMonoLightItalic",
      color: "#f7f7f580"
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#e54750"
    }
  },
  input: {
    fontFamily: "AntikorMonoLightItalic",
    color: "#e54750",
    fontSize: "24px"
  }
});

const useStyles = makeStyles({
  textInput: {
    "& label ": {
      color: "#f7f7f580",
      fontFamily: "AntikorMonoLightItalic",
      fontSize: "16px"
    },
    "& label.Mui-focused": {
      fontFamily: "AntikorMonoLightItalic",
      color: "#f7f7f580"
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#e54750"
    }
  },
  root: {
    "&:hover": {
      color: "#f7f7f5"
    },
    fontFamily: "AntikorMonoLightItalic",
    border: 0,
    borderRadius: 3,
    color: "#e54750",
    height: 48,
    padding: "0 30px"
  },
  input: {
    fontFamily: "AntikorMonoLightItalic",
    color: "#e54750",
    fontSize: "24px"
  }
});

function logout() {
  firebase.auth().signOut();
}

function updateDisplayName(displayName, oldName) {
  const userId = firebase.auth().currentUser.uid;
  const docRef = firebase
    .firestore()
    .collection("users")
    .doc(userId);

  return docRef
    .set(
      {
        displayName: displayName
      },
      { merge: true }
    )
    .then(function() {
      console.log("successfully updated display name");
    })
    .catch(function(error) {
      console.log(error);
    });
}

function updateDisplayNameVisibility(isVisible) {
  const userId = firebase.auth().currentUser.uid;
  const docRef = firebase
    .firestore()
    .collection("users")
    .doc(userId);

  return docRef
    .set(
      {
        displayNameVisible: isVisible
      },
      { merge: true }
    )
    .then(function() {
      console.log("successfully updated display name visibility");
    })
    .catch(function(error) {
      console.log(error);
    });
}

function updateGroup(groupId) {
  const userId = firebase.auth().currentUser.uid;
  const docRef = firebase
    .firestore()
    .collection("users")
    .doc(userId);

  return docRef
    .set(
      {
        group: groupId
      },
      { merge: true }
    )
    .then(function() {
      console.log("successfully updated group");
    })
    .catch(function(error) {
      console.log(error);
    });
}

function addNewGroup(groupName) {
  if (groupName) {
    const docRef = firebase
      .firestore()
      .collection("groups")
      .doc();

    return docRef
      .set(
        {
          name: groupName
        },
        { merge: true }
      )
      .then(function() {
        console.log("successfully added new group");
      })
      .catch(function(error) {
        console.log(error);
      });
  }
}

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography
        style={{ color: "#f7f7f5", fontFamily: "AntikorMonoLightItalic" }}
        variant="h6"
      >
        {children}
      </Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    backgroundColor: "#252a2e",
    color: "#f7f7f5"
  }
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
    backgroundColor: "#252a2e"
  }
}))(MuiDialogActions);

function Banner(props) {
  const [open, setOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState();
  const [newDisplayName, setNewDisplayName] = useState(props.user.displayName);
  const [displayNameVisible, setDisplayNameVisible] = useState(
    props.user.displayNameVisible
  );
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = useStyles();

  useEffect(() => {
    setDisplayNameVisible(props.user.displayNameVisible);
  }, [props.user.displayNameVisible]);

  function createGroupItem(group) {
    if (group !== undefined) {
      return (
        <div key={group.id}>
          <ListItem
            key={group.id}
            style={{ backgroundColor: "#252a2e", marginBottom: "1px" }}
            button={true}
            onClick={() => {
              updateGroup(group.id);
            }}
          >
            <ListItemAvatar>
              <Avatar style={{ backgroundColor: "#37e0b6" }}>
                <img src={groupIcon} alt="" height="100%" />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              disableTypography
              primary={
                <Typography
                  variant="h6"
                  style={{
                    fontFamily: "AntikorMonoLightItalic",
                    color: "#f7f7f5"
                  }}
                >
                  {group.name}
                </Typography>
              }
            />
          </ListItem>
        </div>
      );
    }
  }
  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleDisplayNameVisibleChange = event => {
    setDisplayNameVisible(event.target.checked);
    updateDisplayNameVisibility(event.target.checked);
  };

  const requestLogout = useCallback(() => {
    logout();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center"
      }}
    >
      <div
        style={{
          position: "absolute",
          right: "2vw",
          top: "2vh",
          cursor: "pointer",
          boxShadow: "10px"
        }}
      >
        <img
          onClick={handleClickOpen}
          src={settings}
          alt=""
          height="60"
          width="84"
          style={{ flex: 1 }}
        />
      </div>

      <Dialog
        fullScreen={fullScreen}
        fullWidth={true}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#252a2e"
          }}
        >
          <DialogTitle id="customized-dialog-title" onClose={handleClose}>
            Settings
          </DialogTitle>
        </div>

        <DialogContent dividers>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column"
            }}
          >
            <Typography
              style={{ color: "#f7f7f5", fontFamily: "AntikorMonoLightItalic" }}
              gutterBottom
            >
              Change Group
            </Typography>
            <Typography
              style={{
                color: "#f7f7f5",
                fontSize: "16px",
                fontFamily: "AntikorMonoLightItalic",
                marginBottom: "10px"
              }}
              gutterBottom
            >
              {`Currently a member of ${props.groupName}`}
            </Typography>
          </div>
          <div style={{ backgroundColor: "#f7f7f5" }}>
            <Scrollbar style={{ height: "30vh", width: "100%" }}>
              <List style={{ borderRadius: "10px" }}>
                {props.groups.map(group => createGroupItem(group))}
              </List>
            </Scrollbar>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              marginTop: "30px"
            }}
          >
            <Typography
              style={{
                color: "#f7f7f5",
                fontFamily: "AntikorMonoLightItalic"
              }}
              gutterBottom
            >
              Create a new group
            </Typography>
            <div style={{ display: "flex", alignItems: "center" }}>
              <TextField
                className={classes.textInput}
                label="New group name"
                InputProps={{
                  className: classes.input
                }}
                onChange={event => {
                  setNewGroupName(event.target.value);
                }}
              />

              <Button
                style={{
                  marginLeft: "10px",
                  backgroundColor: "#37e0b6",
                  color: "#f7f7f5",
                  fontFamily: "AntikorMonoLightItalic"
                }}
                onClick={() => {
                  addNewGroup(newGroupName);
                }}
                color="primary"
              >
                <Typography>Create</Typography>
              </Button>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              marginTop: "60px"
            }}
          >
            <Typography
              style={{ color: "#f7f7f5", fontFamily: "AntikorMonoLightItalic" }}
              gutterBottom
            >
              Change your display name
            </Typography>
            <div
              style={{ display: "flex", alignItems: "center", padding: "10px" }}
            >
              <TextField
                className={classes.textInput}
                label="Display name"
                value={newDisplayName}
                InputProps={{
                  className: classes.input
                }}
                onChange={event => {
                  setNewDisplayName(event.target.value);
                }}
              />
              <Button
                style={{
                  marginLeft: "10px",
                  backgroundColor: "#37e0b6",
                  color: "#f7f7f5",
                  fontFamily: "AntikorMonoLightItalic"
                }}
                onClick={() => {
                  updateDisplayName(newDisplayName, props.user.displayName);
                }}
                color="primary"
              >
                <Typography>Update</Typography>
              </Button>

              <FormControlLabel
                style={{ marginLeft: "10px" }}
                control={
                  <Checkbox
                    style={{ color: "#37e0b6" }}
                    checked={displayNameVisible}
                    onChange={handleDisplayNameVisibleChange}
                    inputProps={{ "aria-label": "primary checkbox" }}
                  />
                }
                label="visible"
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <div
            style={{
              display: "flex",
              flex: 1,
              marginTop: "20px",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Button
              style={{
                backgroundColor: "#e54750",
                color: "#f7f7f5",
                fontFamily: "AntikorMonoLightItalic"
              }}
              onClick={requestLogout}
            >
              <Typography>Logout</Typography>
              <LogoutIcon />
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Banner;
