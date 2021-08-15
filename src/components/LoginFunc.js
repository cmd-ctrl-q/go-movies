import React, { useState, Fragment } from 'react';
import Input from './form-components/Input';
import Alert from './ui-components/Alert';

function LoginFunc(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); 
    const [errors, setErrors] = useState([]);
    const [alert, setAlert] = useState({type: "d-none", message: ""}); 

    const handleSubmit = (e) => {
        e.preventDefault(); 

        // add errors
        if (email === "") {
            errors.push("email");
        }
        if (password === "") {
            errors.push("password");
        }
        // set errors 
        setErrors(errors); 

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

        // validate user 
        fetch(`${process.env.REACT_APP_API_URL}/v1/signin`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    setAlert({type: "alert-danger", message: "Invalid login"});
                } else {
                    handleJWTChange(Object.values(data)[0]);
                    window.localStorage.setItem("jwt", JSON.stringify(Object.values(data)[0]))
                    // redirect user 
                    props.history.push({
                        pathname: "/admin",
                    })
                }
            })
    }

    function handleJWTChange(jwt) {
        props.handleJWTChangeFromParent(jwt);
    }

    function hasError(key) {
        return errors.indexOf(key) !== -1;
    }

    function handleEmail(e) {
        setEmail(e.target.value);
    }

    function handlePassword(e) {
        setPassword(e.target.value);
    }

    return (
        <Fragment>
            <h2>Login</h2>
            <hr />
            <Alert 
                alertType={alert.type}
                alertMessage={alert.message}
            />

            <form className="pt-3" onSubmit={handleSubmit}>
                {/* email */}
                <Input
                    title={"Email"}
                    type={"email"} // email tag
                    name={"email"} 
                    // bind 
                    handleChange={handleEmail()}
                    className={hasError("email") ? "is-invalid" : ""}
                    errorDiv={hasError("email") ? "text-danger" : "d-none"}
                    errorMsg={"Please enter a valid email address"}
                />

                {/* password */}
                <Input
                    title={"Password"}
                    type={"password"} // email tag
                    name={"password"} 
                    // bind 
                    handleChange={handlePassword()}
                    className={hasError("password") ? "is-invalid" : ""}
                    errorDiv={hasError("password") ? "text-danger" : "d-none"}
                    errorMsg={"Please enter a password"}
                />

                <hr />

                <button className="btn btn-primary">Login</button>
            </form>
        </Fragment>
    )
}

export default LoginFunc;