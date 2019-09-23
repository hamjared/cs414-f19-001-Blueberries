import React, { Component } from 'react';
import App from "./App";
import request from "request";

class Register extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            username: '',
            password: '',
            error: '',
        };

        this.handlePassChange = this.handlePassChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleUserChange = this.handleUserChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.dismissError = this.dismissError.bind(this);
    }

    dismissError() {
        this.setState({ error: '' });
    }

    handleSubmit(evt) {
        evt.preventDefault();

        if (!this.state.email) {
            return this.setState({ error: ' Email is required' });
        }
        if (!this.state.username) {
            return this.setState({ error: ' Username is required' });
        }
        if (!this.state.password) {
            return this.setState({ error: '  Password is required' });
        }
        request('http://localhost:4567/login', function (error, response, body) {
            console.log('error:', error);
            console.log('statusCode:', response && response.statusCode);
            console.log('body:', body);
        });
        return this.setState({ error: '' });
    }

    handleEmailChange(event) {
        this.setState({
            email: event.target.value,
        });
    };

    handleUserChange(event) {
        this.setState({
            password: event.target.value,
        });
    }

    handlePassChange(event) {
        this.setState({
            password: event.target.value,
        });
    }

    render() {
        return (
            <div className="Register" style={{textAlignVertical: "center", textAlign: "center"}}>
                <form onSubmit={this.handleSubmit}>

                    {
                        this.state.error &&
                        <h3 data-test="error" onClick={this.dismissError}>
                            <button onClick={this.dismissError}>✖</button>
                            {this.state.error}
                        </h3>
                    }
                    <label style={{textAlignVertical: "center", textAlign: "center", fontSize: 64 }}>
                        RollerBall Registration
                        <br />
                    </label>
                    <br />
                    <label style={{textAlignVertical: "center", textAlign: "center", fontSize: 20 }}>
                        Email
                        <br />
                        <input type="text" data="email"
                               value={this.state.email} onChange={this.handleEmailChange} />
                    </label>
                    <br />
                    <label style={{textAlignVertical: "center", textAlign: "center", fontSize: 20 }}>
                        Username
                        <br />
                        <input type="Username" data="Username"
                               value={this.state.username} onChange={this.handleUserChange} />
                    </label>
                    <br />
                    <label style={{textAlignVertical: "center", textAlign: "center", fontSize: 20 }}>
                        Password
                        <br />
                        <input type="password" data="password"
                               value={this.state.password} onChange={this.handlePassChange} />
                    </label>
                    <br />
                    <br />

                    <button type="submit" value="Register" data-test="submit" />
                </form>

            </div>
        );
    }
}
export default Register;