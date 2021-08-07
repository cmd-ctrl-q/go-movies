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
            }
        }
        // do binding to lift state 
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = (e) => {
        let value = this.target.value; 
        let name = this.target.name;

        // prevState prevents the loss of previous state
        this.setState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }

    // do logic to validate data, provide feedback if problem, 
    // then make request to backend which will try to authenticate.
    handleSubmit = (e) => {
        // prevents action of an element
        // like sending a request.
        // use like:
        // onSubmit={this.handleSubmit}
        e.preventDefault();
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