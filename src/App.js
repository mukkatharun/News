import React, { Component } from 'react';
// import axios from 'axios';
import list from './list';
import { Jumbotron, FormGroup } from 'react-bootstrap';
// import Loading from './Loading';


const DEFAULT_QUERY = 'react';
const DEFAULT_PAGE = 0;
const DEFAULT_HPP = 50;

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage='
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;
console.log(url);

const isSearched = (sTerm) => {
  return (item) => !sTerm || item.title.toLowerCase().includes(sTerm.toLowerCase());
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: null,
      searchTerm: DEFAULT_QUERY,
      searchKey: ''
    }
    this.removeItem = this.removeItem.bind(this);
    this.searchValue = this.searchValue.bind(this);
    this.fetchTopStories = this.fetchTopStories.bind(this);
    this.setTopStories = this.setTopStories.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.checkTopStoriesSearchTerm = this.checkTopStoriesSearchTerm.bind(this);
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchTopStories(searchTerm, DEFAULT_PAGE);
  }

  fetchTopStories(searchTerm, page) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setTopStories(result))
      .catch(e => e);
  }

  checkTopStoriesSearchTerm(searchTerm){
    return !this.state.results[searchTerm];
  }

  setTopStories(result) {
    const { hits, page } = result;
    const { results, searchKey } = this.state;
    // const oldHits = page !==0 ? this.state.result.hits : [];
    const oldHits = results && results[searchKey] ? results[searchKey].hits : [];
    const updatedHits = [...oldHits, ...hits];
    this.setState({ results: { ...results, [searchKey]: { hits: updatedHits, page } } });
  }

  removeItem(id) {
    const { results, searchKey } = this.state;
    const { hits, page} = results[searchKey];
    const updatedList = hits.filter(item => item.objectID !== id);
    // this.setState({ result: Object.assign({}, this.state.result, {hits: updatedList}) });
    this.setState({ results: { ...results, [searchKey]: { hits: updatedList, page }}});
  }

  searchValue(e) {
    this.setState({ searchTerm: e.target.value });
  }

  onSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });

    if(this.checkTopStoriesSearchTerm(searchTerm)) {
      this.fetchTopStories(searchTerm, DEFAULT_PAGE);
    }
    event.preventDefault();
  }

  render() {
    const { results, searchTerm, searchKey } = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = (results && results[searchKey] && results[searchKey].hits) || [];
    return (
      <div>
        <Jumbotron>
          <Search
            onChange={this.searchValue}
            value={searchTerm}
            onSubmit={this.onSubmit}
          >News App</Search>
        </Jumbotron>

        <Table
          list={list}
          searchTerm={searchTerm}
          removeItem={this.removeItem}
        />
        <div className="text-center alert">
          <Button
            className="btn btn-success"
            onClick={() => this.fetchTopStories(searchTerm, page + 1)}
          >
            Load More
        </Button>
        </div>
      </div>
    );
  }
}

// class Search extends Component {
//   render() {
//     const {onChange, value, children} = this.props;
//     return (
//       <form>
//           {children}
//           <input 
//           type="text" 
//           onChange={onChange} 
//           value={value}/>
//         </form>
//     );
//   }
// }

const Search = ({ onChange, value, children, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <FormGroup>
        <h1 style={{ fontWeight: 'bold' }}>{children}</h1>
        <hr style={{ border: '2px solid black', width: '100px' }} />
        <div className="input-group">
          <input
            className="form-control width100 searchForm"
            type="text"
            onChange={onChange}
            value={value}
          />
          <span className="input-group-btn">
            <button
              className="btn btn-primary searchBtn"
              type="submit"
            >
              Search
            </button>
          </span>
        </div>
      </FormGroup>
    </form>
  );
}

// class Table extends Component {
//   render() {
//     const {list, searchTerm, removeItem} = this.props;
//     return (
//       <div>
//         {
//             list.filter(isSearched(searchTerm)).map(item => 
//              {
//                return (
//                  <div key={item.objectID}>
//                     <h2><a href={item.url}> {item.title} </a> by {item.author}</h2>
//                     <h4>{item.num_comments} comments | {item.points} points</h4>
//                     <Button
//                       onClick = {() => removeItem(item.objectID)}
//                     >
//                       Remove
//                     </Button>
//                  </div>
//                );
//              }
//              )
//           }
//       </div>
//     );
//   }
// }

const Table = ({ list, removeItem }) => {
  return (
    <div className="tableStyle">
      {
        list.map(item => {
          return (
            <div key={item.objectID}>
              <h2><a href={item.url}> {item.title} </a> by {item.author}</h2>
              <h4>{item.num_comments} comments | {item.points} points
              <Button
                  className="btn btn-danger btn-xs"
                  onClick={() => removeItem(item.objectID)}
                >
                  Remove
                  </Button>
              </h4>
              <hr />
            </div>

          );
        }
        )
      }
    </div>
  );
}

// class Button extends Component {
//   render() {
//     const {onClick, children} = this.props;

//     return (
//     <button type="button" onClick={onClick} value="remove">{children}</button>
//     );
//   }
// }

const Button = ({ onClick, children, className }) =>
  <button
    type="button"
    className={className}
    onClick={onClick} >
    {children}
  </button>

export default App;
