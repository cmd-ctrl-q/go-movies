import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

class OneGenre extends Component {

    state = {
        movies: [], 
        isLoaded: false, 
        error: null,
        genreName: "",
    };

    componentDidMount() {
        // fetch 
        fetch("http://localhost:4000/v1/movies/" + this.props.match.params.id)
        .then((response) => {
            if (response.status !== "200") {
                // create new error
                let err = Error;
                err.message = "Invalid response code: " + response.status;

                // add error to state
                this.setState({error: err})
            }
            // else convert response to json 
            return response.json();
        })
        .then((json) => {
            this.setState({
                movies: json.movies, 
                isLoaded: true, 
                // genreName is available because of the react router
                genreName: this.props.location.genreName,
            }, (error) => {
                this.setState({
                    isLoaded: true, 
                    error
                })
            })
        })
    }

    render() {
        let { movies, isLoaded, error, genreName } = this.state;

        if (!movies) {
            movies = [];
        }

        // check error 
        if (error) {
            return <div>Error: {error.message}</div>
        } else if (!isLoaded) {
            return <div>Loading...</div>
        } 

        return (
            <Fragment>
                <h2>Genre: {genreName}</h2>
                {/* display movies  */}
                <div className="list-group">
                    {movies.map((movie) => (
                        <Link to={`/movies/${movie.id}`} key={movie.id} className="list-group-item list-group-item-action">{movie.title}</Link>
                    ))}
                </div>
            </Fragment>
        )
    }
}
 
export default OneGenre;