import React, { Component } from "react";
import { firebase } from "../../firebase";

function uploadUser(song, user) {
  console.log("uploading user to Firebase");
  const data = {
    listenerId: user.spotifyId,
    listenerName: user.displayName,
    listenerImage: user.image,
    location: {
      latitude: user.location.latitude,
      longitude: user.location.longitude
    },
    timestamp: song.timestamp,
    uri: song.uri,
    songTitle: song.songTitle,
    artist: song.artist
  };

  const db = firebase.firestore();
  db.collection("users")
    .doc(data.listenerId)
    .set(data)
    .catch(error => {
      console.log("There was an error uploading the song");
    });
}

function uploadSong(song) {
  console.log("uploading song to Firebase");
  const db = firebase.firestore();
  db.collection("pastSongs")
    .doc(song.timestamp)
    .set(song)
    .catch(error => {
      console.log("There was an error uploading the song");
    });
}

class FirebaseActions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {
        firstName: "",
        lastName: "",
        currentSong: "",
        location: new firebase.firestore.GeoPoint(0, 0)
      },
      formErrors: {
        firstName: "",
        lastName: "",
        currentSong: "",
        location: new firebase.firestore.GeoPoint(0, 0)
      },
      formValidity: {
        firstName: false,
        lastName: false,
        currentSong: true,
        location: true
      },
      isSubmitting: false
    };
  }

  addUser = () => {
    const data = {
      ...this.state.formValues,
      uid: "1213144540"
    };
    const db = firebase.firestore();
    db.collection("users")
      .doc(data.uid.toString())
      .set(data)
      .catch(error => {
        this.setState({ isSubmitting: false });
      });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.setState({ isSubmitting: true });
    const { formValues, formValidity } = this.state;
    formValues.currentSong = "BANANA BREAD!";
    formValues.location = new firebase.firestore.GeoPoint(1, -2);
    if (Object.values(formValidity).every(Boolean)) {
      this.addUser();
    } else {
      for (let key in formValues) {
        let target = {
          name: key,
          value: formValues[key]
        };
        this.handleValidation(target);
      }
      this.setState({ isSubmitting: false });
    }
  };

  handleChange = ({ target }) => {
    const { formValues } = this.state;
    formValues[target.name] = target.value;
    this.setState({ formValues });
    this.handleValidation(target);
  };

  handleValidation = target => {
    const { name, value } = target;
    const fieldValidationErrors = this.state.formErrors;
    const validity = this.state.formValidity;
    const isImage = name === "image";

    if (!isImage) {
      validity[name] = value.length > 0;
      fieldValidationErrors[name] = validity[name]
        ? ""
        : `${name} is required and cannot be empty`;
    }

    this.setState({
      formErrors: fieldValidationErrors,
      formValidity: validity
    });
  };

  render() {
    const { formValues, formErrors, isSubmitting } = this.state;

    return (
      <>
        <div className="row mb-5">
          <div className="col-lg-12 text-center">
            <h1 className="mt-5">Register New Person</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className={`form-control ${
                    formErrors.firstName ? "is-invalid" : ""
                  }`}
                  placeholder="Enter first name"
                  onChange={this.handleChange}
                  value={formValues.firstName}
                />
                <div className="invalid-feedback">{formErrors.firstName}</div>
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className={`form-control ${
                    formErrors.lastName ? "is-invalid" : ""
                  }`}
                  placeholder="Enter last name"
                  onChange={this.handleChange}
                  value={formValues.lastName}
                />
                <div className="invalid-feedback">{formErrors.lastName}</div>
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Please wait..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }
}

export default FirebaseActions;
export { uploadSong, uploadUser };
