import React, { Component, Fragment } from 'react';
import Alert from './ui-components/Alert';
import Input from './form-components/Input';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            error: null, 
            errors: [],
            alert: {
                type: "d-none",
                message: "",
            },
        };
        // do binding to lift state 
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = (e) => {
        let value = e.target.value; 
        let name = e.target.name;

        // prevState prevents the loss of previous state
        this.setState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    handleSubmit = (e) => {
        // prevents action of an element
        // like sending a request.
        // use like:
        // onSubmit={this.handleSubmit}
        e.preventDefault();

        // do logic to validate data, provide feedback if problem, 
        // then make request to backend which will try to authenticate.
        let errors = [];
        // check for existence of two fields 
        if (this.state.email === "") {
            errors.push("email");
        }
        if (this.state.password === "") {
            errors.push("password");
        }

        this.setState({errors: errors});

        if (errors.length > 0) {
            return false;
        }

        // connect to backend
        const data = new FormData(e.target); 
        const payload = Object.fromEntries(data.entries()); 

        const requestOptions = {
            method: 'POST', 
            body: JSON.stringify(payload), 
        }

        // fetch 
        fetch(`${process.env.REACT_APP_API_URL}/v1/signin`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    this.setState({
                        alert: {
                            type: "alert-danger", 
                            message: data.error.message,
                        }
                    })
                } else {
                    console.log(data);
                    // store jwt token in local storage. 
                    window.localStorage.setItem("jwt", JSON.stringify(Object.values(data)[0]))
                    // this.handleJWTChange(data);
                    // get JWT value which is in 0th index of array
                    this.handleJWTChange(Object.values(data)[0]);
                    // redirect user 
                    this.props.history.push({
                        pathname: "/admin",
                    })
                }
            })
    }

    // create function that'll handle the handleJWTChange() function 
    // from parent (App.js). 
    handleJWTChange(jwt) {
        this.props.handleJWTChangeFromParent(jwt);
    }

    hasError(key) {
        return this.state.errors.indexOf(key) !== -1;
    }

    render() {
        return (
            <Fragment>
                <h2>Login</h2>
                <hr />
                <Alert 
                    alertType={this.state.alert.type}
                    alertMessage={this.state.alert.message}
                />

                <form className="pt-3" onSubmit={this.handleSubmit}>
                    {/* email */}
                    <Input
                        title={"Email"}
                        type={"email"} // email tag
                        name={"email"} 
                        // bind 
                        handleChange={this.handleChange}
                        className={this.hasError("email") ? "is-invalid" : ""}
                        errorDiv={this.hasError("email") ? "text-danger" : "d-none"}
                        errorMsg={"Please enter a valid email address"}
                    />

                    {/* password */}
                    <Input
                        title={"Password"}
                        type={"password"} // email tag
                        name={"password"} 
                        // bind 
                        handleChange={this.handleChange}
                        className={this.hasError("password") ? "is-invalid" : ""}
                        errorDiv={this.hasError("password") ? "text-danger" : "d-none"}
                        errorMsg={"Please enter a password"}
                    />

                    <hr />

                    <button className="btn btn-primary">Login</button>
                </form>
            </Fragment>
        );
    }

}