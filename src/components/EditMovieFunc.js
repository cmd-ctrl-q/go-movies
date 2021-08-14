import React, { useEffect, useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import './EditMovie.css';
import Input from './form-components/Input'
import Textarea from './form-components/Textarea'
import Select from './form-components/Select'
import Alert from './ui-components/Alert'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

function EditMovieFunc(props) {

    const [movie, setMovie] = useState({}); 
    const [error, setError] = useState(null); 
    // use errors for form validation 
    const [errors, setErrors] = useState([]);
    // use for alerts 
    const [alert, setAlert] = useState({type: "d-none", message: ""}); 
    const [isLoaded, setIsLoaded] = useState(false); 

    // local constants 
    const mpaaOptions = [
        {id: "G", value: "G"},
        {id: "PG", value: "PG"},
        {id: "PG13", value: "PG13"},
        {id: "R", value: "R"},
        {id: "NC17", value: "NC17"},
    ]

    // set up use effect
    useEffect(() => {
        // check admin authorization from token 
        if (props.jwt === "") {
            // send user to /login route
            props.history.push({
                pathname: "/login",
            }); 
            return;
        } 

        // get movie id from props  
        const id = props.match.params.id;
        if (id > 0) {
            // fetch movie from backend 
            fetch(`${process.env.REACT_APP_API_URL}/v1/movie/` + id)
                // check response
                .then((response) => {
                    if (response.status !== 200) {
                        // error 
                        setError("Invalid response code" + response.status);
                        // done loading 
                        setIsLoaded(true);
                    } else {
                        // no error
                        setError(null);
                    }
                    // return response data as json 
                    return response.json();
                })
                .then((json) => {
                    const releaseDate = new Date(json.movie.release_date);
                    json.movie.releas_date = releaseDate.toISOString().split("T")[0];
                    setMovie(json.movie)
                    setIsLoaded(true);
                });
        }
    }, [props.jwt, props.history, props.match.params.id])

    // handle changes 
    const handleChange = () => (e) => {
        let value = e.target.value; 
        let name = e.target.name; 

        // set current state movie with previous state movie, then change name field with the value 
        setMovie({
            ...movie, 
            [name]: value,
        }); 
    }

    // handle submissions 
    const handleSubmit = (e) => {
        e.preventDefault();

        // client-side validation 
        let errors = []; 
        if (movie.title === "") {
            errors.push("title");
        }

        setErrors(errors);

        // dont create or submit form if there are errors 
        if (errors.length > 0) {
            return false;
        }

        // prepare to submit to backend 
        // get info from form 
        const data = new FormData(e.target);
        // convert to payload (what to post)
        const payload = Object.fromEntries(data.entries()); 
        const myHeaders = new Headers();
        // add jwt to header
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + props.jwt);

        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: myHeaders,
        }

        // send data to backend 
        fetch(`${process.env.REACT_APP_API_URL}/v1/admin/editmovie`, requestOptions)
            .then(response => response.json())
            .then(data => {
                // check if data has error
                if (data.error) {
                    // set error alert
                    setAlert({
                        alert: {type: "alert-danger", message: data.error.message},
                    })
                } else {
                    props.history.push({
                        pathname: "/admin",
                    });
                }
            })
    }

    // confirm deletion for delete button 
    const confirmDelete = (e) => {

        confirmAlert({
            title: 'Delete Movie?',
            message: 'Are you sure?',
            buttons: [
              {
                label: 'Yes',
                onClick: () => {
                    // delete movie 
                    const headers = new Headers(); 
                    headers.append("Content-Type", "application/json");
                    headers.append("Authorization", "Bearer " + props.jwt);

                    fetch(`${process.env.REACT_APP_API_URL}/v1/admin/deletemovie/` + movie.id, {method: 'GET'})
                        // convert response to json
                        .then(response => response.json())
                        // get data and hand it to objects on frontend
                        .then(data => {
                            if (data.error) {
                                setAlert({
                                    alert: {type: "alert-danger", message: data.error.message}
                                })
                            } else {
                                // take user somewhere else 
                                props.history.push({
                                    pathname: "/admin"
                                })
                                // setAlert({
                                //     alert: {type: "alert-success", message: "Movie deleted!"}
                                // })
                            }
                        })
                }
              },
              {
                label: 'No',
                onClick: () => {}
              }
            ]
        });
    }

    function hasError(key) {
        return errors.indexOf(key) !== -1;
    }

    // equivalent of render function 
    if (error) {
        return <div>Error: {error.status}, {error.message}</div>
    } else if (!isLoaded) {
        return <p>Loading...</p>
    } else {
        return ( 
            <Fragment>
                <h2>Add/Edit Movie</h2>
                <Alert 
                    alertType={alert.type}
                    alertMessage={alert.message}
                />
                <hr />

                <form onSubmit={handleSubmit}>
                    <input 
                        type="hidden"
                        name="id"
                        id="id"
                        value={movie.id}
                        onChange={handleChange("id")}
                    />

                    <Input 
                        title={'Title'}
                        // if error, set className to is-invalid
                        className={hasError("title") ? "is-invalid" : ""}
                        type={'text'}
                        name={'title'}
                        value={movie.title}
                        handleChange={handleChange("title")}
                        // d-none is do no display element
                        errorDiv={hasError("title") ? "text-danger" : "d-none"} 
                        errorMsg={"Please enter a title"}
                    />

                    <Input 
                        title={'Release Date'}
                        type={'date'}
                        name={'release_date'}
                        value={movie.release_date}
                        handleChange={handleChange("release_date")}
                    />

                    <Input 
                        title={'Runtime'}
                        className={hasError("runtime") ? "is-invalid" : ""}
                        type={'text'}
                        name={'runtime'}
                        value={movie.runtime}
                        handleChange={handleChange("runtime")}
                        errorDiv={hasError("runtime") ? "text-danger" : "d-none"} 
                        errorMsg={"Please add a runtime"}
                    />

                    <Select 
                        title={'MPAA Rating'}
                        name={'mpaa_rating'}
                        options={mpaaOptions}
                        value={movie.mpaa_rating}
                        handleChange={handleChange("mpaa_rating")}
                        placeholder={'Choose'}
                    />

                    <Input 
                        title={'Rating'}
                        type={'text'}
                        name={'rating'}
                        value={movie.rating}
                        handleChange={handleChange("rating")}
                    />

                    <Textarea 
                        title={'Description'}
                        id={'description'}
                        name={'description'}
                        value={movie.description}
                        handleChange={handleChange("description")}
                    />

                    <hr />

                    {/* save */}
                    <button className="btn btn-primary">Save</button>

                    {/* cancel */}
                    <Link to="/admin" className="btn btn-warning ms-1">
                        Cancel
                    </Link>

                    {/* delete */}
                    {movie.id > 0 && (
                        <a href="#!" onClick={() => confirmDelete()}
                        className="btn btn-danger ms-1">
                            Delete
                        </a>
                    )}

                </form>

            </Fragment>
        );
    }
}

export default EditMovieFunc;