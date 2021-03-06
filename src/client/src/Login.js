import React, { Component } from 'react';
import request from "request";
import { Link, withRouter } from "react-router-dom";
import { history } from './History';
import Cookies from "./Cookies";


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            error: '',
            temp: {},
            serverAddr: this.getServerAddr()
        };

        this.handlePassChange = this.handlePassChange.bind(this);
        this.handleUserChange = this.handleUserChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.dismissError = this.dismissError.bind(this);

    }

    getServerAddr(){
        return process.env.REACT_APP_SERVER_ADDR
    }

    dismissError() {
        this.setState({ error: '' });
    }

    handleSubmit(evt) {

        evt.preventDefault();

        if (!this.state.email) {
            return this.setState({ error: '  Email is required' });
        }

        if (!this.state.password) {
            return this.setState({ error: '  Password is required' });
        }
        const rqt = {
            'email': this.state.email,
            'password': this.state.password
        };
        let url = this.state.serverAddr + "login"
        console.log(url)
        let options = {
            method: "POST",
            uri : url,
            body: JSON.stringify(rqt),
            insecure: true,
            };
        console.log(rqt);
        const self = this;
        request.post(options, function (error, response, body) {
            console.log('error:', error);
            console.log('statusCode:', response && response.statusCode);
            console.log('body:', body);
            if(body === "fail") {
                return self.setState({error: '  Wrong email or password'});

            }
            var after = JSON.parse(body);
            if(after.success === true) {
                // console.log("username: ");
                // console.log(after.UserID);

                Cookies.createCookie("user", after.UserID)
                Cookies.createCookie("email", after.email)
                localStorage.setItem("user", after.UserID);
                localStorage.setItem("email", after.email);
                self.props.updateUser(after.UserID);
                history.push('/Home');
            }
        });
        return this.setState({error: ''});
    }

    handleUserChange(event) {
        this.setState({
            email: event.target.value,
        });
    };

    handlePassChange(event) {
        this.setState({
            password: event.target.value,
        });
    }

    render() {

        return (
            <div className="Login" style={{textAlignVertical: "center", textAlign: "center"}}>
                <form onSubmit={this.handleSubmit}>

                    {
                        this.state.error &&
                        <h3 data-test="error" onClick={this.dismissError} style={{ color: 'red' }}>
                            <button onClick={this.dismissError}>✖</button>
                            {this.state.error}
                        </h3>
                    }
                    <label style={{textAlignVertical: "center", textAlign: "center", fontSize: 64 }}>
                        RollerBall
                        <br />
                    </label>
                    <br />
                    <label style={{textAlignVertical: "center", textAlign: "center", fontSize: 20 }}>
                        Email
                        <br />
                        <input type="text" data="email"
                               value={this.state.email} onChange={this.handleUserChange} />
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
                    <button type="submit" value="Login" data-test="submit" variant="primary">login</button>
                    <br />
                    <br />
                    <Link to="/Register">Register</Link>
                </form>


            </div>
        );
    }
}
export default withRouter(Login);
