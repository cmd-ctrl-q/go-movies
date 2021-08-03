import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

export default class Genres extends Component {
    state = {
        genres: [], 
        isLoaded: false, 
        error: null,
    }

    componentDidMount() {
        // fetch 
        fetch("http://localhost:4000/v1/genres")
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
                genres: json.genres,
                isLoaded: true, 
            },
            (error) => {
                this.setState({
                    isLoaded: true, 
                    error
                });
            })
        })
    }

    render() { 

        const { genres, isLoaded, error } = this.state; 

        if (error) {
            return <div>Error: {error.message}</div>
        } else if (!isLoaded) {
            return <div>Loading...</div>
        } else {

            if (!genres) {
                // convert map to array
                return <div>No genres availabe</div>
            }

            return ( 
                <Fragment>
                    <h2>Genres</h2> 

                    <div className="list-group">
                        {genres.map((genre) => (
                            <Link 
                                key={genre.id}
                                className="list-group-item list-group-item-action"
                                to={{
                                    pathname: `/genre/${genre.id}`,
                                    genreName: genre.genre_name, 
                                }}
                                >
                                {genre.genre_name}
                            </Link>
                        ))}
                    </div>
                </Fragment>
            );
        }
    }
}