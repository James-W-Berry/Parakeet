import { firebase } from "../../firebase";

function uploadUser(song, user, coords) {
  const data = {
    listenerId: user.spotifyId,
    listenerName: user.displayName,
    listenerImage: user.image,
    group: "",
    location: {
      latitude: coords.latitude,
      longitude: coords.longitude
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
  const db = firebase.firestore();
  db.collection("pastSongs")
    .doc(song.timestamp)
    .set(song)
    .catch(error => {
      console.log("There was an error uploading the song");
    });
}

export { uploadSong, uploadUser };
