import React, { Component, Fragment } from 'react';
// import { HashRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Movies from './components/Movies'
import Admin from './components/Admin'
import Home from './components/Home'
import OneMovie from './components/OneMovie';
import Genres from './components/Genres';
import OneGenre from './components/OneGenre';
import EditMovie from './components/EditMovie';
import Login from './components/Login'

export default class App extends Component {
  constructor(props) {
    super(props)
    // set state 
    this.state = {
      jwt: "",
    }
    // bind function to lift state 
    this.handleJWTChange(this.handleJWTChange.bind(this));
  }

  // lift jwt to state 
  handleJWTChange = (jwt) => {
    this.setState({jwt: jwt});
  }

  // logout function 
  logout = () => {
    this.setState({jwt: ""});
  }

  render() {
    let loginLink; 
    if (this.state.jwt === "") {
      loginLink = <Link to="/login">Login</Link>
    } else {
      loginLink = <Link to="/logout" onClick={this.logout}>Logout</Link>
    }

    return (
      <Router>
      <div className="container">
        <div className="row">
          <div className="col mt-3">
            <h1 className="mt-3">
              Go Watch a Movie!
            </h1>
          </div>

          <div className="col mt-3 text-end">
            {loginLink}
          </div>
          <hr className="mb-3"></hr>
        </div>

        {/* content */}
        <div className="row">
          <div className="col-md-2">
            <nav>
              <ul className="list-group">
                {/* LINKS */}
                <li className="list-group-item">
                  {/* <a href="/">Home</a> */}
                  <Link to="/">Home</Link>
                </li>
                <li className="list-group-item">
                  <Link to="/movies">Movies</Link>
                </li>
                <li className="list-group-item">
                  <Link to="/genres">Genres</Link>
                </li>

                {/* check if jwt is empty */}
                {this.state.jwt !== "" && (
                  <Fragment>
                    <li className="list-group-item">
                      <Link to="/admin/movie/0">Add Movie</Link>
                    </li>
                    <li className="list-group-item">
                      <Link to="/admin">Manage Catalogue</Link>
                    </li>
                  </Fragment>
                )}

              </ul>
              <pre>
                {/* display state */}
                {JSON.stringify(this.state, null, 3)}
              </pre>
            </nav>
          </div>

          {/* main content */}
          <div className="col-md-10">

            {/* Matches LINKS */}
            <Switch>

              <Route exact path="/">
                <Home />
              </Route>

              <Route path="/movies/:id" component={OneMovie} />

              <Route path="/movies">
                <Movies />
              </Route>

              <Route path="/genre/:id" component={OneGenre} />

              {/* route with a props and bind with jwt to lift state */}
              <Route exact path="/login" 
                component={(props) => <Login {...props} handleJWTChangeFromParent={this.handleJWTChange} /> }/>

              {/* forces the router to match exact path */}
              <Route exact path="/genres">
                <Genres />
              </Route>

              {/* when id = 0, adding movie, else the movie of the id is being edited */}
              <Route path="/admin/movie/:id" component={EditMovie} />

              {/* <Route path="/by-category/comedy"
                  render={(props) => <Categories {...props} title={`Comedy`} />}   
              /> */}

              <Route path="/admin">
                <Admin />
              </Route>

            </Switch>

          </div>
        </div>
      </div>
    </Router>
   );
  }
}
