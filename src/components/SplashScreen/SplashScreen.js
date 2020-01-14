import React, { Component } from "react";
import FadeIn from "react-fade-in";
import "bootstrap/dist/css/bootstrap.css";
import "./SplashScreen.css";
import Main from "../Main/Main.js";
import bannerLogo from "../../images/bannerLogo.png";

class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      done: undefined
    };
  }

  componentDidMount() {
    setTimeout(() => {
      fetch("https://jsonplaceholder.typicode.com/posts")
        .then(response => response.json())
        .then(json => this.setState({ done: true }));
    }, 2000);
  }

  render() {
    return (
      <div>
        {!this.state.done ? (
          <FadeIn>
            <div
              className="SplashScreen"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <h1 className="SplashScreen_text">Parakeet</h1>
              <img src={bannerLogo} alt="" height="500" width="390" />
            </div>
          </FadeIn>
        ) : (
          <Main />
        )}
      </div>
    );
  }
}

export default SplashScreen;
