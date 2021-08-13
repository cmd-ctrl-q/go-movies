import React, { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';

function GenresFunc(props) {
    const [genres, setGenres] = useState([]);
    const [error, setError] = useState(null); 
    const [isLoaded, setLoaded] = useState(false); 

    // use useEffect in place of componentDidMount()
    useEffect(() => {
        // fetch genres 
        fetch(`${process.env.REACT_APP_API_URL}/v1/genres`)
            .then((response) => {
                if (response.status !== 200) {
                    setError("Invalid response: ", response.status);
                    setLoaded(true);
                } else {
                    // no error
                    setError(null);
                }
                return response.json();
            })
            .then((json) => {
                setGenres(json.genres);
                setLoaded(true);
            });
            // without the square brackets, an infinite loop is created as it
            // continuously tries to fetch data from the backend.
    },[]);

    // render 
    if (error) { // if has error
        return <div>Error: {error.message}</div>
    } else if (!isLoaded) { // if not loaded
        return <p>Loading...</p>
    } else {
        return (
            <Fragment> 
                <h2>Genres</h2>

                <div className="list-group">
                    {/* loop through genres */}
                    {genres.map((m) => (
                        <Link
                            key={m.id}
                            className="list-group-item list-group-item-action"
                            to={{
                                pathname: `/genre/${m.id}`, 
                                genreName: m.genre_name,
                            }}
                        >
                            {m.genre_name}
                        </Link>
                    ))}
                </div>
            </Fragment>
        )
    }
}

export default GenresFunc;