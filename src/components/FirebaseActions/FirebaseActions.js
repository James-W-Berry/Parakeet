import { firebase } from "../../firebase";
const uuidv4 = require("uuid/v4");

function uploadUser(song, user, coords, groups) {
  let fireUser;
  let fireCoords;
  let fireSong;
  let fireGroups;

  user === undefined
    ? (fireUser = {})
    : (fireUser = {
        listenerId: user.spotifyId,
        listenerName: user.displayName,
        listenerImage: user.image
      });

  coords === undefined
    ? (fireCoords = {})
    : (fireCoords = {
        location: {
          latitude: coords.latitude,
          longitude: coords.longitude
        }
      });

  song === undefined
    ? (fireSong = {})
    : (fireSong = {
        timestamp: song.timestamp,
        uri: song.uri,
        songTitle: song.songTitle,
        artist: song.artist
      });

  groups === undefined ? (fireGroups = {}) : (fireGroups = { groups: groups });

  const data = {
    ...fireUser,
    ...fireCoords,
    ...fireSong,
    ...fireGroups
  };

  // console.log(data);

  const db = firebase.firestore();
  db.collection("users")
    .doc(data.listenerId)
    .update(data)
    .catch(error => {
      console.log("There was an error uploading the song");
    });
}

function uploadSong(song) {
  const db = firebase.firestore();
  db.collection("pastSongs")
    .doc(song.timestamp)
    .set(song)
    .catch(error => {
      console.log("There was an error uploading the song");
    });
}

function addGroup(group) {
  const db = firebase.firestore();

  const newGroup = {
    key: group.toLowerCase(),
    value: group
  };

  db.collection("groups")
    .doc(group.toLowerCase())
    .set(newGroup)
    .catch(error => {
      console.log("Error creating new group");
    });
}

export { uploadSong, uploadUser, addGroup };
