import React, { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom'; 

function OneGenreFunc(props) {

    // use let for modifiable content
    let [movies, setMovies] = useState([]); 
    let [genreName, setGenreName] = useState("");
    const [error, setError] = useState(null); 
    const [isLoaded, setIsLoaded] = useState(false); 

    // call use effect 
    useEffect(() => {
        // fetch from backend 
        fetch(`${process.env.REACT_APP_API_URL}/v1/movies/` + props.match.params.id)
            .then((response) => {
                // check response 
                if (response.status !== 200) {
                    // error 
                    setError("Invalid response: " + response.status);
                    setIsLoaded(true);
                } else {
                    // no error
                    setError(null);
                }
                // return the genre in json form 
                return response.json();
            })
            .then((json) => {
                setMovies(json.movies);
                setGenreName(props.location.genreName);
                setIsLoaded(true);
            })
    }, [props.match.params.id, props.location.genreName])

    // check if movies is not null 
    if (!movies) {
        movies = [];
    }

    // equivalent of render function 
    // check error is isLoaded before rending genre data 
    if (error) {
        return <div>Error: {error.status} : {error.message}</div>
    } else if (!isLoaded) {
        return <p>Loading...</p>
    } else {
        return (
            <Fragment>
                <h2>Genre: {genreName}</h2>
                {/* display movies associated with genre */}
                <div className="list-group">
                    {movies.map((movie) => (
                        <Link
                            to={`/movies/${movie.id}`}
                            key={movie.id}
                            className="list-group-item list-group-item-action"
                        >
                            {movie.title}
                        </Link>
                    ))}
                </div>
            </Fragment>
        );
    }
}

export default OneGenreFunc;