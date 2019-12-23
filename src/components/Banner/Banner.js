import React, { Component } from "react";
import spy from "../../images/mr_spy.png";
import SearchForPerson from "../SearchForPerson/SearchForPerson";
import Fab from "@material-ui/core/Fab";
import { Avatar } from "material-ui";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import PersonIcon from "@material-ui/icons/Person";
import { connect } from "react-redux";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

class Banner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: undefined,
      modalOpen: false
    };
  }
  setUser = user => {
    this.setState({ user: user });
  };

  openUserSettings = user => {
    this.setState({ modalOpen: true });
  };

  closeUserSettings = user => {
    this.setState({ modalOpen: false });
  };

  render() {
    return (
      <div style={{ flexDirection: "row" }}>
        <div style={{ flexDirection: "column" }}>
          <img
            src={spy}
            alt=""
            height="50"
            width="50"
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
                {this.props.user !== undefined &&
                  this.state.user === undefined &&
                  this.setUser(this.props.user) && (
                    <Avatar
                      alt={`${this.props.user.listenerName}`}
                      src={`${this.props.user.listenerImage}`}
                      style={{ height: "60px", width: "60px" }}
                      onClick={() => {
                        this.openUserSettings(this.props.user);
                      }}
                    />
                  )}
                {this.state.user !== undefined && (
                  <Avatar
                    alt={`${this.state.user.listenerName}`}
                    src={`${this.state.user.listenerImage}`}
                    style={{ height: "60px", width: "60px" }}
                    onClick={() => {
                      this.openUserSettings(this.state.user);
                    }}
                  />
                )}
                {this.state.user === undefined &&
                  this.props.user === undefined && <PersonIcon />}
              </Fab>
            </div>
          </MuiThemeProvider>
        </div>

        <div style={{ position: "absolute", top: "10vh", left: "25vw" }}>
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            style={{
              display: "flex",
              alignSelf: "center",
              justifyContent: "center",
              width: "50vw",
              height: "65vh",
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
                  flexGrow: 1,
                  flexDirection: "column",
                  display: "flex",
                  position: "absolute",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  top: "10vh",
                  left: "25vw",
                  width: "50vw",
                  height: "65vh",
                  backgroundColor: "#091740",
                  boxShadow: "5px 10px",
                  padding: "10",
                  borderRadius: 10,
                  outline: "none"
                }}
              >
                <div
                  style={{
                    marginTop: "20",
                    justifyContent: "center"
                  }}
                >
                  <h2
                    style={{
                      color: "#efefef"
                    }}
                    id="transition-modal-title"
                  >
                    Settings
                  </h2>
                </div>

                {this.state.user && (
                  <div style={{ justifyContent: "center" }}>
                    <h3
                      style={{
                        color: "#efefef",
                        marginTop: "20",

                        alignSelf: "center"
                      }}
                    >{`Group: ${this.state.user.group}`}</h3>
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

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps, null)(Banner);
