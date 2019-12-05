import React from "react";
import { db } from "../../firebase";

class SavedList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    };
  }

  componentDidMount() {
    db.collection("users")
      .get()
      .then(querySnapshot => {
        const data = querySnapshot.docs.map(doc => doc.data());
        console.log(data);
        this.setState({ users: data });
      });
  }

  render() {
    const { users } = this.state;
    return(
      <div >
        {users.map(user => (
          <div>
            <div> {user.firstName} {user.lastName} </div>
            <div> {user.currentSong} </div>
          </div>
        ))}
      </div>
    );
  }
}

export default SavedList;
