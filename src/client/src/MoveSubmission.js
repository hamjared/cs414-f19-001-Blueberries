import React, { Component } from 'react';
import request from "request";
import Cookies from "./Cookies";

class MoveSubmission extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            value: "",
            serverAddr: this.getServerAddr(),
            // oldX: "",
            // oldY: "",
            // newX: "",
            // newY: "",
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    getServerAddr(){
        return process.env.REACT_APP_SERVER_ADDR
    }
    handleChange(event) {
        this.setState({
            value: event.target.value,
        })
    }
    handleSubmit(event) {
        console.log(event.target);

        //console.log(event.target.oldX);
        console.log(this.state);

        const oldX = this.state.value[0];
        const oldY = this.state.value[2];
        const newX = this.state.value[4];
        const newY = this.state.value[6];
        const rqt = {
            "id": this.state.id,
            "player": Cookies.readCookie("email"),
            "oldX": oldX,
            "oldY": oldY,
            "newX": newX,
            "newY": newY

        };

        let url = this.state.serverAddr + 'move'
        let options = {
            method: "POST",
            uri : url,
            body: JSON.stringify(rqt),
            insecure: true,
        };

        console.log("options: ",options);

        request.post(options, function (error, response, body) {
            event.persist();

            console.log('error:', error);
            console.log('statusCode:', response && response.statusCode);
            console.log('body:', JSON.parse(body));
            this.props.getGames();
        });
        event.persist();

    }

    render() {
        return (
            <form onSubmit={this.handleSubmit} style={{fontSize: "20px"}}>
                <label>
                    Enter "oldX, oldY, newX, newY":
                    <input type="text" value={this.state.value} onChange={this.handleChange} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        );
    }
}
export default MoveSubmission;