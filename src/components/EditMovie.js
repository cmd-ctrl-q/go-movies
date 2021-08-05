import React, { Component, Fragment } from 'react';
import './EditMovie.css';
import Input from './form-components/Input'
import Textarea from './form-components/Textarea'
import Select from './form-components/Select'
import Alert from './ui-components/Alert'

class EditMovie extends Component {

    constructor(props) {
        super(props); 
        this.state = {
            movie: {
                id: 0,
                title: "",
                release_date: "",
                runtime: "",
                mpaa_rating: "",
                rating: "",
                description: "",
            },
            mpaaOptions: [
                {id: "G", value: "G"},
                {id: "PG", value: "PG"},
                {id: "PG13", value: "PG13"},
                {id: "R", value: "R"},
                {id: "NC17", value: "NC17"},
            ],
            isLoaded: false, 
            error: null,
            errors: [],
            alert: {
                type: "d-none", 
                message: "",
            }
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = (evt) => {
        evt.preventDefault();

        // client-side validation 
        let errors = []; 
        if (this.state.movie.title === "") {
            errors.push("title");
        }
        if (this.state.movie.runtime === "") {
            errors.push("runtime");
        }

        this.setState({errors: errors});

        if (errors.length > 0) {
            return false;
        }

        // get info from form 
        const data = new FormData(evt.target);
        // convert to payload (what to post)
        const payload = Object.fromEntries(data.entries()); 
        console.log(payload)

        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(payload),
        }

        fetch('http://localhost:4000/v1/admin/editmovie', requestOptions)
            .then(response => response.json())
            .then(data => {
                // check if data has error
                if (data.error) {
                    // display error alert 
                    this.setState({
                        alert: {type: "alert-danger", message: data.error.message},
                    });
                } else {
                    this.setState({
                        alert: {type: "alert-success", message: "Changes saved!"},
                    });
                }
            })
    }

    handleChange = (evt) => {
        let value = evt.target.value;
        let name = evt.target.name;
        this.setState((prevState) => ({
            movie: {
                ...prevState.movie, 
                [name]: value,
            }
        }))
    }

    // checks if errors array has error in specified index
    hasError(key) {
        return this.state.errors.indexOf(key) !== -1
    }

    componentDidMount() {
        // gets :id from Route url in App.js
        const id = this.props.match.params.id;
        if (id > 0) {
            // get movie
            fetch("http://localhost:4000/v1/movie/" + id)
                .then((response) => {
                    if (response.status !== "200") {
                        let err = Error; 
                        err.Message = "Invalid response code: " + response.status;
                        this.setState({error: err});
                    }
                    return response.json();
                })
                .then((json) => {
                    const releaseDate = new Date(json.movie.release_date); 

                    this.setState({
                        movie: {
                            id: id, 
                            title: json.movie.title, 
                            // fix date
                            release_date: releaseDate.toISOString().split("T")[0],
                            runtime: json.movie.runtime,
                            mpaa_rating: json.movie.mpaa_rating, 
                            rating: json.movie.rating, 
                            description: json.movie.description,
                        },
                        isLoaded: true, 
                    }, 
                    (error) => {
                        this.setState({
                            isLoaded: true, 
                            error,
                        })
                    })
                })
        } else {
            this.setState({isLoaded: true});
        }
    }

    render() { 
        let {movie, isLoaded, error} = this.state; 

        if (error) {
            return <div>Error: {error.message}</div>
        } else if (!isLoaded) {
            return <p>Loading...</p>
        } else {

            return ( 
                <Fragment>
                    <h2>Add/Edit Movie</h2>
                    <Alert 
                        alertType={this.state.alert.type}
                        alertMessage={this.state.alert.message}
                    />
                    <hr />

                    <form onSubmit={this.handleSubmit}>
                        <input 
                            type="hidden"
                            name="id"
                            id="id"
                            value={movie.id}
                            onChange={this.handleChange}
                        />

                        <Input 
                            title={'Title'}
                            // if error, set className to is-invalid
                            className={this.hasError("title") ? "is-invalid" : ""}
                            type={'text'}
                            name={'title'}
                            value={movie.title}
                            handleChange={this.handleChange}
                            // d-none is do no display element
                            errorDiv={this.hasError("title") ? "text-danger" : "d-none"} 
                            errorMsg={"Please enter a title"}
                        />

                        <Input 
                            title={'Release Date'}
                            type={'date'}
                            name={'release_date'}
                            value={movie.release_date}
                            handleChange={this.handleChange}
                        />

                        <Input 
                            title={'Runtime'}
                            className={this.hasError("runtime") ? "is-invalid" : ""}
                            type={'text'}
                            name={'runtime'}
                            value={movie.runtime}
                            handleChange={this.handleChange}
                            errorDiv={this.hasError("runtime") ? "text-danger" : "d-none"} 
                            errorMsg={"Please add a runtime"}
                        />

                        <Select 
                            title={'MPAA Rating'}
                            name={'mpaa_rating'}
                            options={this.state.mpaaOptions}
                            value={movie.mpaa_rating}
                            handleChange={this.handleChange}
                            placeholder={'Choose'}
                        />

                        <Input 
                            title={'Rating'}
                            type={'text'}
                            name={'rating'}
                            value={movie.rating}
                            handleChange={this.handleChange}
                        />

                        <Textarea 
                            title={'Description'}
                            id={'description'}
                            name={'description'}
                            value={movie.description}
                            handleChange={this.handleChange}
                        />

                        <hr />

                        <button className="btn btn-primary">Save</button>

                    </form>

                </Fragment>
            );
        }
    }
}
 
export default EditMovie;