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
import { Button } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import uuid from "react-uuid";
import { Typography } from "@material-ui/core";
import { firebase } from "../../firebase";

class Banner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false
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
  }

  createGroupItem(user) {
    if (this.props.store.user) {
      if (user.listenerId === this.props.store.user.spotifyId) {
        if (user.group !== undefined) {
          return (
            <ListItem
              key={uuid()}
              button={true}
              onClick={() => {
                //let user = this.props.user;
                //user.group = group;
                //this.props.setUser(user);
              }}
            >
              <ListItemText
                disableTypography
                primary={
                  <Typography variant="h6" style={{ color: "#FFFFFF" }}>
                    {user.group}
                  </Typography>
                }
              />
            </ListItem>
          );
        }
      }
    }
  }

  openUserSettings = user => {
    this.setState({ modalOpen: true });
  };

  closeUserSettings = user => {
    this.setState({ modalOpen: false });
  };

  handleChange = event => {
    this.setState({ searchingGroup: event.target.value });
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
                {this.props.store && this.props.store.user && (
                  <Avatar
                    alt={`${this.props.store.user.displayName}`}
                    src={`${this.props.store.user.image}`}
                    style={{ height: "60px", width: "60px" }}
                    onClick={() => {
                      this.openUserSettings(this.props.store.user);
                    }}
                  />
                )}
                {this.props.store === undefined && <PersonIcon />}
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

                {this.props.store && this.state.users && (
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
                        Your Groups:
                        <List>
                          {this.state.users.map(group =>
                            this.createGroupItem(group)
                          )}
                        </List>
                        {/* <input
                            type="text"
                            value={this.props.user.group}
                            onChange={this.handleChange}
                          /> */}
                      </label>
                    </div>

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
                        Join a New Group:
                        <input
                          type="text"
                          placeholder="search for a group"
                          value={this.state.searchingGroup}
                          onChange={this.handleChange}
                        />
                      </label>
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
  // setUser: setUser
};

const mapStateToProps = state => {
  return {
    store: state.rootReducer
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Banner);
