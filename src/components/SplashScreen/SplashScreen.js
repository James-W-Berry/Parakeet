import React, { Component } from "react";
import "./SplashScreen.css";
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import "bootstrap/dist/css/bootstrap.css";
import * as spotispies from "./spotispies.json";
import Main from "../Main/Main";
import "./SplashScreen.css";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: spotispies.default
};

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
    }, 3000);
  }

  render() {
    return (
      <div>
        {!this.state.done ? (
          <FadeIn>
            <div className="SplashScreen">
              <h1 className="SplashScreen_text">SpotiSpies</h1>
              <Lottie
                className="SplashScreen_logo"
                options={defaultOptions}
                height={300}
                width={300}
              />
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
