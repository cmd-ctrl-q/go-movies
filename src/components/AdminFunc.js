import React, { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom'; 

// Display and functinality for Manage Catalogue tab
function AdminFunc(props) {
    let [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {

        // check if user is logged in by checking jwt 
        if (props.jwt === "") {
            // reroute to /login
            props.history.push({
                pathname: "/login",
            })
            return;
        }

        // get movies 
        fetch(`${process.env.REACT_APP_API_URL}/v1/movies`)
            .then((response) => {
                if (response.status !== 200) {
                    setError("Invalid respones code " + response.status);
                    setIsLoaded(true);
                } else {
                    setError(null);
                }
                // return movies as json 
                return response.json();
            })
            .then((json) => {
                // store json into movies 
                setMovies(json.movies);
                setIsLoaded(true);
            })

    }, [props.history, props.jwt])

    // check if movies is not null
    if (!movies) {
        // if null, then convert to an empty array
        movies = [];
    }

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

export default AdminFunc;