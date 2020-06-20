import React, { Component } from 'react';
// import axios from 'axios';
import './App.css';
import list from './list';
import { compare } from 'semver';
// import Loading from './Loading';

const isSearched = (sTerm) => {
  return (item) => !sTerm || item.title.toLowerCase().includes(sTerm.toLowerCase());
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state ={
      list,
      searchTerm: ''
    }
    this.removeItem = this.removeItem.bind(this);
    this.searchValue = this.searchValue.bind(this);
  }

  removeItem(id) {
   const updatedList = this.state.list.filter(item => item.objectID !== id);
   this.setState({list: updatedList});
  }

  searchValue(e) {
    this.setState({searchTerm: e.target.value});
  }

  render() {
    const{list, searchTerm} = this.state;
    return (
      <div className="App">
        <Search
          onChange={this.searchValue} 
          value={searchTerm}
        />
        <Table 
          list={list}
          searchTerm={searchTerm}
          removeItem={this.removeItem}
        />
          
      </div>
    );
  }
}

class Search extends Component {
  render() {
    const {onChange, value} = this.props;
    return (
      <form>
          <input 
          type="text" 
          onChange={onChange} 
          value={value}/>
        </form>
    );
  }
}

class Table extends Component {
  render() {
    const {list, searchTerm, removeItem} = this.props;
    return (
      <div>
        {
            list.filter(isSearched(searchTerm)).map(item => 
             {
               return (
                 <div key={item.objectID}>
                    <h2><a href={item.url}> {item.title} </a> by {item.author}</h2>
                    <h4>{item.num_comments} comments | {item.points} points</h4>
                    <button type="button" onClick={() => removeItem(item.objectID)} value="remove">remove</button>
                 </div>
               );
             }
             )
          }
      </div>
    );
  }
}
export default App;
