import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

export default class Admin extends Component {

    // set state
    state = {
        movies: [], 
        isLoaded: false, 
        error: null,
    }; 

    componentDidMount() {

        // if no jwt, dont do request. 
        if (this.props.jwt === "") {
            this.props.history.push({
                pathname: "/login",
            });
            return;
        }
        // get movies 
        fetch(`${process.env.REACT_APP_API_URL}/v1/movies`)
            .then((response) => {
                if (response.status !== "200") {
                    let err = Error; 
                    err.message = "Invalid response code " + response.status;
                    // set error in state 
                    this.setState({error: err});
                }
                return response.json();
            })
            // if no error, convert response to json 
            .then((json) => {
                this.setState({
                    movies: json.movies,
                    isLoaded: true, 
                }, 
                (error) => {
                    this.setState({isLoaded: true, error});
                })
            })
    }

    render() {
        const { movies, isLoaded, error } = this.state; 
        
        if (error) {
            return <div>Error: {error.message}</div>
        } else if (!isLoaded) {
            return <p>Loading...</p>
        } else {
            return (
                <Fragment>
                    <h2>Manage Catalogue</h2>
                    <div className="list-group">
                        {/* display list of movies */}
                        {movies.map((m) => (
                            <Link
                                to={`/admin/movie/${m.id}`}
                                key={m.id}
                                className="list-group-item list-group-item-action"
                            >
                                {m.title}
                            </Link>
                        ))}
                    </div>
                </Fragment>
            )
        }
    }
}