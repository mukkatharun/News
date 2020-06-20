import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state ={
      user:[]
    }
  }

  componentWillMount(){
    axios('https://api.randomuser.me/?nat=US&results=5')
    .then(response => this.setState({user: response.data.results}))
  }

  render() {
    return <div>hi check</div>
  }
}
export default App;
