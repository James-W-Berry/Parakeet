import React, { Component } from "react";
import bannerLogo from "../../images/bannerLogo.png";
import SearchForPerson from "../SearchForPerson/SearchForPerson";
import Fab from "@material-ui/core/Fab";
import { Avatar } from "material-ui";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import PersonIcon from "@material-ui/icons/Person";
import { connect } from "react-redux";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { setUser } from "../../actions/actions";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import uuid from "react-uuid";
import { Typography } from "@material-ui/core";
import { firebase } from "../../firebase";
import ReactSearchBox from "react-search-box";
import { uploadUser } from "../FirebaseActions/FirebaseActions.js";

class Banner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
      groups: []
    };
  }

  componentWillMount() {
    const db = firebase.firestore();

    let doc = db.collection("users");
    doc.onSnapshot(
      docSnapshot => {
        let users = [];
        docSnapshot.forEach(doc => users.push({ ...doc.data(), uid: doc.id }));
        this.setState({ users: users });
      },
      err => {
        console.log(err);
      }
    );

    let groups = db.collection("groups");
    groups.onSnapshot(
      docSnapshot => {
        let groups = [];
        docSnapshot.forEach(group =>
          groups.push({ ...group.data(), uid: group.id })
        );
        this.setState({ groups: groups });
      },
      err => {
        console.log(err);
      }
    );
  }

  getUserGroups() {
    const db = firebase.firestore();
    let userDoc = db.collection("users").doc(this.props.store.user.spotifyId);
    let storeUser = this.props.store.user;
    let setUser = this.props.setUser;

    userDoc
      .get()
      .then(function(doc) {
        if (doc.exists) {
          let data = doc.data();

          let userGroup = {
            groups: data.groups
          };

          let user = {
            ...userGroup,
            ...storeUser
          };

          setUser(user);
        } else {
          console.log("No such document!");
        }
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
      });
  }

  createGroupItem(group) {
    if (group !== undefined) {
      return (
        <ListItem key={uuid()} button={true} onClick={() => {}}>
          <ListItemText
            disableTypography
            primary={
              <Typography variant="h6" style={{ color: "#FFFFFF" }}>
                {group.value}
              </Typography>
            }
          />
        </ListItem>
      );
    }
  }

  openUserSettings = user => {
    this.setState({ modalOpen: true });
  };

  closeUserSettings = user => {
    this.setState({ modalOpen: false });
  };

  render() {
    return (
      <div style={{ display: "flex", flexGrow: 1 }}>
        <div style={{ flexDirection: "column" }}>
          <img
            src={bannerLogo}
            alt=""
            height="80"
            width="62"
            style={{ position: "absolute", left: "2vw" }}
          />

          <div
            style={{
              display: "flex",
              position: "absolute",
              flexGrow: 1,
              right: "15vw"
            }}
          >
            <SearchForPerson />
          </div>

          <MuiThemeProvider>
            <div
              style={{
                display: "flex",
                position: "absolute",
                flexGrow: 1,
                right: "5vw"
              }}
            >
              <Fab
                color="primary"
                aria-label="add"
                style={{ outline: "none", background: "#091740" }}
              >
                {this.props.store &&
                  this.props.store.user &&
                  (this.props.store.user.image === undefined ? (
                    <PersonIcon
                      alt={`${this.props.store.user.displayName}`}
                      style={{ height: "60px", width: "60px" }}
                      onClick={() => {
                        this.openUserSettings(this.props.store.user);
                      }}
                    />
                  ) : (
                    <Avatar
                      alt={`${this.props.store.user.displayName}`}
                      src={`${this.props.store.user.image}`}
                      style={{ height: "60px", width: "60px" }}
                      onClick={() => {
                        this.openUserSettings(this.props.store.user);
                      }}
                    />
                  ))}
                {this.props.store === undefined && (
                  <PersonIcon style={{ height: "60px", width: "60px" }} />
                )}
              </Fab>
            </div>
          </MuiThemeProvider>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center"
          }}
        >
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            style={{
              display: "flex",
              justifyContent: "center",
              outline: "none"
            }}
            open={this.state.modalOpen}
            onClose={this.closeUserSettings}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500
            }}
          >
            <Fade in={this.state.modalOpen}>
              <div
                style={{
                  height: "80vh",
                  width: "60vw",
                  backgroundColor: "#091740",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 10,
                  outline: "none"
                }}
              >
                <div
                  id="transition-modal-title"
                  style={{
                    display: "flex",
                    marginTop: "20",
                    color: "#efefef",
                    justifyContent: "center",
                    fontSize: 30
                  }}
                >
                  Settings
                </div>

                {this.props.store && (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignSelf: "center",
                        color: "#efefef",
                        marginTop: "20",
                        fontSize: 20
                      }}
                    >
                      <label>
                        Your Group:
                        <List>
                          {this.props.store.user &&
                            (this.props.store.user.groups === undefined
                              ? this.getUserGroups()
                              : this.createGroupItem(
                                  this.props.store.user.groups
                                ))}
                        </List>
                      </label>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center"
                      }}
                    >
                      <ReactSearchBox
                        placeholder="search for a group to join"
                        data={this.state.groups}
                        onSelect={group => {
                          let userGroup = {
                            groups: group
                          };

                          let user = {
                            ...this.props.store.user,
                            ...userGroup
                          };

                          this.props.setUser(user);
                          uploadUser(
                            this.props.store.currentSong,
                            this.props.store.user,
                            this.props.store.coords,
                            group
                          );
                        }}
                        onFocus={() => {}}
                        fuseConfigs={{
                          threshold: 0.05
                        }}
                        value=""
                      />
                    </div>
                  </div>
                )}
              </div>
            </Fade>
          </Modal>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  setUser: setUser
};

const mapStateToProps = state => {
  return {
    store: state.rootReducer
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Banner);
