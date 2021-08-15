import React, { useState, useEffect, Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Movies from './components/Movies'
import AdminFunc from './components/AdminFunc'
import Home from './components/Home'
import OneMovieFunc from './components/OneMovieFunc';
import OneGenreFunc from './components/OneGenreFunc';
import EditMovieFunc from './components/EditMovieFunc';
import LoginFunc from './components/LoginFunc';
import GraphQL from './components/GraphQL';
import OneMovieGraphQL from './components/OneMovieGraphQL';
import GenresFunc from './components/GenresFunc';

export default function AppFunc(props) {
    const [jwt, setJwt] = useState("");

    useEffect(() => {
        let t = window.localStorage.getItem("jwt")

        // check if user is logged in at any given time
        if (t) {
          // jwt token exists in local storage, 
          // if user was logged out, log user back in.
          if (jwt === "") {
            setJwt({jwt: JSON.parse(t)});
          }
        }
    }, [jwt])

    function handleJWTChange(jwt) {
        setJwt({jwt: jwt});
    }

    function logout() {
        setJwt("");
        // clear local storage 
        window.localStorage.removeItem("jwt");
    }

    let loginLink; 
    if (jwt === "") {
      loginLink = <Link to="/login">Login</Link>
    } else {
      loginLink = <Link to="/logout" onClick={logout}>Logout</Link>
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
                {jwt !== "" && (
                  <Fragment>
                    <li className="list-group-item">
                      <Link to="/admin/movie/0">Add Movie</Link>
                    </li>
                    <li className="list-group-item">
                      <Link to="/admin">Manage Catalogue</Link>
                    </li>
                  </Fragment>
                )}
                <li className="list-group-item">
                  <Link to="/graphql">GraphQL</Link>
                </li>

              </ul>
              <pre>
                {/* display state */}
                {JSON.stringify(jwt, null, 3)}
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

              <Route path="/movies/:id" component={OneMovieFunc} />

              <Route path="/moviesgraphql/:id" component={OneMovieGraphQL} />

              <Route path="/movies">
                <Movies />
              </Route>

              <Route path="/genre/:id" component={OneGenreFunc} />

              {/* route with a props and bind with jwt to lift state */}
              <Route exact path="/login" 
                component={(props) => <LoginFunc {...props} handleJWTChangeFromParent={handleJWTChange} /> }/>

              {/* forces the router to match exact path */}
              <Route exact path="/genres">
                <GenresFunc />
              </Route>

              <Route exact path="/graphql">
                <GraphQL />
              </Route>

              {/* push jwt to the EditMovie component */}
              {/* when id = 0, adding movie, else the movie of the id is being edited */}
              {/* <Route path="/admin/movie/:id" component={EditMovie} /> */}
              <Route path="/admin/movie/:id" component={(props) => (
                <EditMovieFunc {...props} jwt={jwt} />
              )} 
              />

              {/* <Route path="/by-category/comedy"
                  render={(props) => <Categories {...props} title={`Comedy`} />}   
              /> */}

              {/* <Route path="/admin">
                <Admin />
              </Route> */}

              <Route 
                path="/admin"
                component={(props) => (
                  // push props and jwt to component 
                  <AdminFunc {...props} jwt={jwt} />
                )}
              />

            </Switch>

          </div>
        </div>
      </div>
    </Router>
    )
}