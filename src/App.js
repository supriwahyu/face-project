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
 apiKey: '6d4acbf6caa24903a3a5e812a54cfdf8'
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
                        //,shape: {
                           //type: 'images',
                            //image: [
                                //{src: 'path/to/first/image.svg', height: 20, width: 20},
                                //{src: 'path/to/second/image.jpg', height: 20, width: 20},
                            //]
                        //}
                        ,move:{
                        enable:true,
                        speed:0.5,
                        direction:"none",
                        random:false,
                        straight:false
                 }
               }
            }

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
        //password: 'bananas',
        entries: 0,
        joined: ''
      }
    }
  }

loadUser = (data) => {
  this.setState({user: {
     id: data.id,
      name: data.name,
      email: data.email,
      //password: 'bananas',
      entries: data.entries,
      joined: data.joined
    }
  })
}  

/*componentDidMount() {
  fetch('http://localhost:3000')
  .then(response => response.json())
  .then(console.log)
}*/

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
  console.log(box);
  this.setState({box: box});
}

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL,
      //"f76196b43bbd45c99b4f3cd8e8b40a8a", 
      this.state.input).then(response =>
        //console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
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
      <Navigation onRouteChange={this.onRouteChange}/>
      { this.state.route === 'home'
      ? <div>
        {/*<Particles className='particles'
           params={particlesOptions}
           />*/}
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
