import React, { useState, useEffect, Fragment } from 'react';

function OneMovieFunc(props) {

    const [movie, setMovie] = useState({}); 
    const [error, setError] = useState(null); 
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // get movie 
        fetch(`${process.env.REACT_APP_API_URL}/v1/movie/` + props.match.params.id)
            .then((response) => {
                if (response.status !== 200) {
                    setError("Invalid response: " + response.status);
                    setIsLoaded(true); // done loading
                } else {
                    setError(null);
                }
                // return the response in json format to be accessed elsewhere
                return response.json(); 
            })
            .then((json) => {
                setMovie(json.movie);
                setIsLoaded(true); // done loading
            });
            // the square brackets below is for a callback (optional)
            // to use props, it must be set inside []
    }, [props.match.params.id]);

    // check if movie has genres, 
    // this makes certain that movie.genres is set to a usable value.
    // since if a movie may not have any genres, its value will be null, 
    // which can cause issues, so if null, then set movie.genres to an array [].
    if (movie.genres) {
        movie.genres = Object.values(movie.genres);
    } else {
        movie.genres = [];
    }

    // render 

    if (error) {
        return <div>Error: {error.status} : {error.message}</div>
    } else if (!isLoaded) {
        return <p>Loading...</p>
    } else {
        return (
            <Fragment>
                <h2>Movie: {movie.title} ({movie.year})</h2>

                <div className="float-start">
                    <small>Rating: {movie.mpaa_rating}</small>
                </div>

                {/* list genres */}
                <div className="float-end">
                    {movie.genres.map((m, index) => (
                        <span className="badge bg-secondary me-1" key={index}>
                            {m}
                        </span>
                    ))}
                </div>
                <div className="clearfix"></div>

                <hr />

                <table className="table table-compact table-striped">
                    <thead>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Title:</strong></td>
                            <td>{movie.title}</td>
                        </tr>
                        <tr>
                            <td><strong>Description:</strong></td>
                            <td>{movie.description}</td>
                        </tr>
                        <tr>
                            <td><strong>Runtime:</strong></td>
                            <td>{movie.runtime} minutes</td>
                        </tr>
                    </tbody>
                </table>
            </Fragment>
        );
    }
}

export default OneMovieFunc;