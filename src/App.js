import "./App.css";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import ParticlesBg from "particles-bg";
import { Component } from "react";
import SignIn from "./components/SignIn/SignIn";
import Register from "./components/Register/Register";

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageURL: "",
      boxes: [],
      route: "signin",
      isSignedIn: false,
    };
  }

  calculateFaceLocation = (data) => {
    console.log(data.outputs[0].data.regions);
    const faceBoxList = [];
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    const faceData = data.outputs[0].data.regions;
    let key = 1;
    for (let face of faceData) {
      let faceData = face.region_info.bounding_box;
      let faceBox = {
        key: key,
        leftCol: faceData.left_col * width,
        topRow: faceData.top_row * height,
        rightCol: width - faceData.right_col * width,
        bottomRow: height - faceData.bottom_row * height,
      };
      faceBoxList.push(faceBox);
      key++;
    }
    return faceBoxList;
  };

  displayFaceBox = (boxes) => {
    this.setState({ boxes: boxes });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onSubmit = () => {
    const { input } = this.state;
    this.setState({ imageURL: input });

    const createResponse = (imageURL) => {
      const PAT = "b37240271fe345ae91607df5204e0613";
      const USER_ID = "xcarter93";
      const APP_ID = "smart-brain";
      const IMAGE_URL = imageURL;

      const raw = JSON.stringify({
        user_app_id: {
          user_id: USER_ID,
          app_id: APP_ID,
        },
        inputs: [
          {
            data: {
              image: {
                url: IMAGE_URL,
              },
            },
          },
        ],
      });

      return {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: "Key " + PAT,
        },
        body: raw,
      };
    };

    fetch(
      `https://api.clarifai.com/v2/models/face-detection/outputs`,
      createResponse(input)
    )
      .then((response) => response.json())
      .then((result) => {
        this.displayFaceBox(this.calculateFaceLocation(result));
        // console.log(result.outputs[0].data.regions[0].region_info.bounding_box);
      })
      .catch((error) => console.error("error", error));
  };

  onRouteChange = (route) => {
    if (route === "home") {
      this.setState({ isSignedIn: true });
    } else if (route === "signout") {
      this.setState({ isSignedIn: false });
    }
    this.setState({ route: route });
  };
  render() {
    const { isSignedIn, route, imageURL, boxes } = this.state;
    return (
      <div className="App">
        <ParticlesBg type="cobweb" bg={true} num={250} />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        <Logo />
        {route === "home" ? (
          <div>
            <Rank />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onSubmit={this.onSubmit}
            />
            <FaceRecognition imageURL={imageURL} boxes={boxes} />
          </div>
        ) : route === "signin" ? (
          <SignIn onRouteChange={this.onRouteChange} />
        ) : (
          <Register onRouteChange={this.onRouteChange} />
        )}
      </div>
    );
  }
}

export default App;
