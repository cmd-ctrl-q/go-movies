import React, { useState, useEffect, Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Movies from './components/Movies'
import AdminFunc from './components/AdminFunc'
import Home from './components/Home'
import OneMovieFunc from './components/OneMovieFunc';
import OneGenreFunc from './components/OneGenreFunc';
import EditMovieFunc from './components/EditMovieFunc';
import Login from './components/Login'
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
}