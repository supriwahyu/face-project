import React, { Component } from 'react'
import './App.css';
import Navigation from './components/navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';
import Clarifai from'clarifai';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';

const app = new Clarifai.App({
 apiKey: process.env.REACT_APP_API_KEY,
});

const particlesOptions = {
    particles: {
       number: {
	  value: 100,
	  }
	  ,density: {
	    enable: true,
	    value_area:800
	  }             
	,move:{
	  enable:true,
	  speed:0.5,
	  direction:"none",
	  random:false,
	  straight:false
      }
   }
};

class App extends Component  {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignIn: 'false',
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
	pass: 'banana',
        joined: ''
      }
    }
  }

loadUser = (data) => {
  this.setState({user: {
     id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      password: data.pass,
      joined: data.joined
    }
  })
}  

calculateFaceLocation = (data) => {
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById('inputimage');
  const width = Number(image.width);
  const height = Number(image.height);
  return {
    leftCol: clarifaiFace.left_col * width,
    topRow: clarifaiFace.top_row * height,
    rightCol: width - (clarifaiFace.right_col * width),
    bottomRow: height - (clarifaiFace.bottom_row * height),
  }
}

displayFaceBox = (box) => {
  this.setState({box: box});
}

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input).then(response =>
        this.displayFaceBox(this.calculateFaceLocation(response))
      .catch(err => console.log(err))
      );
  }

onRouteChange = (route) => {
  if (route === 'signout') {
    this.setState({isSignIn: false});
  } else if (route === 'home') {
    this.setState({isSignIn: true});
  }
  this.setState({route: route});
}

  render() {
  return (
    <div className="App">
      <Particles className='particles'
        params={particlesOptions}
        />
      { true
      ? <div>
        <Logo />
        <Rank />
        <ImageLinkForm 
        onInputChange={this.onInputChange} 
        onButtonSubmit={this.onButtonSubmit}/>
        <FaceRecognition 
        box={this.state.box}
        imageUrl={this.state.imageUrl} />
      </div>
      : (
        this.state.route === 'signin'
        )
        ?<Signin onRouteChange={this.onRouteChange}/>
        :<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
    }
    </div>
  );
}
}

export default App;
