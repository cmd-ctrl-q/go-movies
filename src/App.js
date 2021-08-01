import React, { Fragment } from 'react';
// import { HashRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { BrowserRouter as Router, Switch, Route, Link, useParams, useRouteMatch } from 'react-router-dom';
import Movies from './components/Movies'
import Admin from './components/Admin'
import Home from './components/Home'
import Categories from './components/Categories'
import OneMovie from './components/OneMovie';

export default function App() {
  return (
      <Router>
      <div className="container">
        <div className="row">
          <h1 className="mt-3">
            Go Watch a Movie!
          </h1>
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
                  <Link to="/by-category">Categories</Link>
                </li>
                <li className="list-group-item">
                  <Link to="/admin">Manage Catalogue</Link>
                </li>
              </ul>
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

              {/* forces the router to match exact path */}
              <Route exact path="/by-category">
                <CategoryPage />
              </Route>

              <Route path="/by-category/drama"
                  render={(props) => <Categories {...props} title={`Drama`} />}   
              />

              <Route path="/by-category/comedy"
                  render={(props) => <Categories {...props} title={`Comedy`} />}   
              />

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

function CategoryPage() {

  // path allows you to build paths that are relative to the route path.
  // url allows you to build relative links. 
  let { path, url } = useRouteMatch();

  return (
    <div>
      <h2>Categories</h2>

      <ul>
      <li><Link to={`${path}/comedy`}>Comedy</Link> </li>
      <li><Link to={`${url}/drama`}>Drama</Link> </li>
      </ul>
    </div>
  );
}
