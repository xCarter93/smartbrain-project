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

const initialState = {
	input: "",
	imageURL: "",
	boxes: [],
	route: "signin",
	isSignedIn: false,
	user: {
		id: "",
		name: "",
		email: "",
		entries: 0,
		joinedAt: "",
	},
};
class App extends Component {
	constructor() {
		super();
		this.state = initialState;
	}

	loadUser = (data) => {
		this.setState({
			user: {
				id: data.id,
				name: data.name,
				email: data.email,
				entries: data.entries,
				joinedAt: data.joinedAt,
			},
		});
	};

	calculateFaceLocation = (data) => {
		const faceBoxList = [];
		const image = document.getElementById("inputimage");
		const width = Number(image.width);
		const height = Number(image.height);
		const faceData = data.outputs[0].data.regions;
		for (let face of faceData) {
			let faceData = face.region_info.bounding_box;
			let faceBox = {
				leftCol: faceData.left_col * width,
				topRow: faceData.top_row * height,
				rightCol: width - faceData.right_col * width,
				bottomRow: height - faceData.bottom_row * height,
			};
			faceBoxList.push(faceBox);
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

		fetch("https://smartbrain-project-api.vercel.app/imageurl", {
			method: "post",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ input: input }),
		})
			.then((response) => response.json())
			.then((result) => {
				if (result) {
					fetch("https://smartbrain-project-api.vercel.app/image", {
						method: "put",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ id: this.state.user.id }),
					})
						.then((response) => response.json())
						.then((count) => {
							this.setState(Object.assign(this.state.user, { entries: count }));
						})
						.catch(console.log);
					this.displayFaceBox(this.calculateFaceLocation(result));
				}
			})
			.catch((error) => console.error("error", error));
	};

	onRouteChange = (route) => {
		if (route === "home") {
			this.setState({ isSignedIn: true });
		} else if (route === "signout") {
			this.setState(initialState);
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
				></Navigation>
				<Logo />

				{route === "home" ? (
					<div>
						<Rank
							name={this.state.user.name}
							entries={this.state.user.entries}
						/>
						<ImageLinkForm
							onInputChange={this.onInputChange}
							onSubmit={this.onSubmit}
						/>
						<FaceRecognition imageURL={imageURL} boxes={boxes} />
					</div>
				) : route === "signin" ? (
					<SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
				) : (
					<Register
						onRouteChange={this.onRouteChange}
						loadUser={this.loadUser}
					/>
				)}
			</div>
		);
	}
}

export default App;
