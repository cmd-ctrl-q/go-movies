import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

export default class Movies extends Component {
    // set up state 
    state = {
        movies: [],
        isLoaded: false, 
        error: null,
    };

    // componentDidMount simulates a call to an api.
    // gets executed after component is rendered on the screen
    componentDidMount() {
        fetch(`${process.env.REACT_APP_API_URL}/v1/movies`)
            // .then((response) => response.json())
            .then((response) => {
                if (response.status !== "200") {
                    let err = Error; 
                    err.message = "Invalid response code " + response.status;
                    this.setState({error: err});
                }
                return response.json();
            })
            .then((json) => {
                this.setState({
                    movies: json.movies, 
                    isLoaded: true,
                }, 
                (error) => {
                    this.setState({
                        isLoaded: true, 
                        error
                    });
                }
                );
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
                    <h2>Choose a movie</h2>
                    <div className="list-group">
                        {movies.map( (m) => (
                            <Link 
                                to={`/movies/${m.id}`} 
                                key={m.id}
                                className="list-group-item list-group-item-action"
                                >
                                {m.title}
                            </Link>
                        ))
                        }
                    </div>
                </Fragment>
            );

        }
    }
}