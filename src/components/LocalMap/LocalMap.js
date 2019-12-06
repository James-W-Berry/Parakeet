import React, { Component, Fragment } from "react";
import Slide from "@material-ui/core/Slide";
import Fab from "@material-ui/core/Fab";
import map from "../../images/map.png";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class LocalMap extends Component {
  state = { open: false };

  toggle = () => {
    this.setState(prevState => ({ open: !prevState.open }));
  };

  render() {
    return (
      <Fragment>
        <Fab
          style={{
            display: "flex",
            flexGrow: 1,
            position: "absolute",
            left: "49vw",
            top: -40
          }}
          color="primary"
          aria-label="open map"
          onClick={() => {
            this.props.slideCallback();
          }}
        >
          <img src={map} alt="map" />
        </Fab>
        {/* <Dialog
          open={this.state.open}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.toggle}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          style={{
            background: "#123891",
            height: "80vh",
            width: "100vw"
          }}
        >
          <DialogTitle id="alert-dialog-slide-title">
            {"Local map of listeners"}
          </DialogTitle>
          <DialogContent
            style={{ flex: 1, flexGrow: 1, height: "80vh", width: "100vw" }}
          >
            <DialogContentText id="alert-dialog-slide-description">
              map goes here
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.toggle} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog> */}
      </Fragment>
    );
  }
}

export default LocalMap;
