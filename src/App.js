import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecongnition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import 'tachyons';
import './App.css';
import ParticlesBg from 'particles-bg';

const initialState = {
    input: '',
    imageUrl: '',
    box: {},
    route: 'signin',
    // to start from signin page
    isSignedIn: false,
    user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
    }
}
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
                joined: data.joined
            }
        })
    }

    //For calculation of the face detected
    calculateFaceLocation = (data) => {
        const clarifaiFace = data?.outputs[0].data.regions[0].region_info.bounding_box;
        //bounding box is the percentage of image face
        const image = document.getElementById('inputImage');
        const width = Number(image.width);
        const height = Number(image.height);
        return {
            leftCol: clarifaiFace.left_col * width,
            topRow: clarifaiFace.top_row * height,
            rightCol: width - (clarifaiFace.right_col * width),
            bottomRow: height - (clarifaiFace.bottom_row * height)
        }
    }

    displayFaceBox = (box) => {
        this.setState({ box });
        // console.log(box);
    }

    onInputChange = (event) => {
        this.setState({ input: event.target.value });
    }

    onButtonSubmit = () => {
        this.setState({ imageUrl: this.state.input });
        fetch('http://localhost:5000/imageurl', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                input: this.state.input
            })
        })
            .then(response => response.json())
            .then(result => {
                this.displayFaceBox(this.calculateFaceLocation(result))
                if (result) {
                    this.setState(preval => ({
                        ...preval, user: {
                            ...preval.user,
                            entries: +(preval.user.entries) + 1
                        }
                    }))
                    fetch('http://localhost:5000/image', {
                        method: 'put',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            id: this.state.user.id
                        })
                    })
                        .then(response => response.json())
                }
            })
            .catch(error => console.log('error', error));
    }

    onRouteChange = (route) => {
        if (route === 'signout') {
            this.setState(initialState)// this will get the initial state of blank page when relogin the same page otherwise the previous checked picture will display
        } else if (route === 'home') {
            this.setState({ isSignedIn: true })
        }
        this.setState({ route: route });
    }

    render() {
        const { isSignedIn, imageUrl, route, box } = this.state;
        return (
            <div className="App" >
                <h1>Caught-U : A Face-Detection Website</h1>
                < ParticlesBg className='particles' color='#afff70' type="cobweb" num={100} bg={true} />
                <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
                {route === 'home'
                    ? <div className='logoAlign'>
                        <Logo />
                        <div className='rankAlign'>
                            <Rank
                                name={this.state.user.name}
                                entries={this.state.user.entries} />
                            <ImageLinkForm
                                onInputChange={this.onInputChange}
                                onButtonSubmit={this.onButtonSubmit} />
                            <FaceRecognition box={box} imageUrl={imageUrl} />
                        </div>
                    </div>
                    : (
                        route === 'signin'
                            ? <Signin loadUser={this.loadUser}
                                onRouteChange={this.onRouteChange} />
                            : <Register
                                loadUser={this.loadUser}
                                onRouteChange={this.onRouteChange} />
                    )
                }
            </div>
        );
    }
}
export default App;