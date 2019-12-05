import React, { Component } from 'react';
import {Link, withRouter} from "react-router-dom";
import Modal from 'react-modal';
import request from "request";
import Cookies from "./Cookies";



class Invite extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            gamesSent: [],
            gamesPending: [],
            invite: '',
            error: '',
            games: '',

        };

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.updateGames = this.updateGames.bind(this);
        this.handleInviteChange = this.handleInviteChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderPending = this.renderPending.bind(this);
        this.renderSent = this.renderSent.bind(this);
        this.handleReject = this.handleReject.bind(this);
        this.handleAccept = this.handleAccept.bind(this);




    }

    getServerAddr(){
        return process.env.REACT_APP_SERVER_ADDR
    }

    componentDidMount() {

    }


    updateGames(){
        console.log('games:', this.props.games);

        let email = localStorage.getItem("email");
        // localStorage.getItem("email") ? email = localStorage.getItem("email") : email = "alex@email.com";
        if(Cookies.readCookie('email') != null){
            email = Cookies.readCookie('email')
        }
        else{
            email = "alex@email.com"
        }
        const rqt = {
            "email" : email,
        };
        let url = this.state.serverAddr + "getGame"
        // let url = "http://localhost:4567/getGame"

        let options = {
            method: "GET",
            uri : url,
            body: JSON.stringify(rqt),
            insecure: true,
        };
        console.log('games option:', options);

        const self = this;
        request.post(options, function (error, response, body) {
            console.log('games body:', JSON.parse(body).sent);
            if(body != undefined) {
                console.log('error:', error);
                console.log('statusCode:', response && response.statusCode);
                console.log('body:', JSON.parse(body));
                console.log('Retrieved game');
                self.setState({games: JSON.parse(body)});
                self.setState({gamesSent: JSON.parse(body).sent})
                self.setState({gamesPending: JSON.parse(body).pending})
            }
        });
        console.log('after games:', this.state.games);
        console.log('sent games:', this.state.gamesSent);
        console.log('pending games:', this.state.gamesPending);

        // if(this.props.games === undefined){
        //     return
        // }
        // this.setState({gamesSent: this.props.games.sent})
        // this.setState({gamesPending: this.props.games.pending})
        // console.log('games:', this.props.games);

    }


    openModal(){
        this.setState({modalIsOpen:true})
        this.updateGames()
    }
    closeModal(){
        this.setState({modalIsOpen:false})
    }

    renderSent(){

        return this.state.gamesSent.map((data, index) => {
            const {id, p1, p2} = data //destructuring
            return (
                <tr key={id}>
                    <td>{id}</td>
                    <th className="space"></th>
                    <th className="space"></th>
                    <th className="space"></th>
                    <th className="space"></th>
                    <td>{p1}</td>
                    <th className="space"></th>
                    <th className="space"></th>
                    <th className="space"></th>
                    <th className="space"></th>
                    <th className="space"></th>
                    <th className="space"></th>
                    <th className="space"></th>
                    <th className="space"></th>
                    <th className="space"></th>
                    <th className="space"></th>
                    <th className="space"></th>
                    <th className="space"></th>
                    <td>{p2}</td>
                </tr>
            )
        })
    }

    renderPending(){

        return this.state.gamesPending.map((data, index) => {
            const {id, p1, p2} = data //destructuring
            return (
                <tr key={id}>
                    <td>{id}</td>
                    <th className="space"></th>
                    <th className="space"></th>
                    <th className="space"></th>
                    <th className="space"></th>
                    <td>{p1}</td>
                    <th className="space"></th>
                    <th className="space"></th>
                    <th className="space"></th>
                    <th className="space"></th>
                    <th className="space"></th>
                    <th className="space"></th>
                    <th className="space"></th>
                    <th className="space"></th>
                    <th className="space"></th>
                    <th className="space"></th>
                    <th className="space"></th>
                    <th className="space"></th>
                    <td>{p2}</td>
                    <th className="space"></th>
                    <th className="space"></th>
                    <th className="space"></th>
                    <th className="space"></th>
                    <th className="space"></th>
                    <th className="space"></th>
                    <button onClick={i => this.handleAccept(id)}>Accept</button>
                    <button onClick={i => this.handleReject(id)}>Reject</button>
                </tr>
            )
        })
    }

    handleReject(id) {
        console.log('The button was clicked.');
        let url = this.state.serverAddr + "acceptInvite"
        let options = {
            method: "POST",
            uri: url,
            body: JSON.stringify({id}),
            insecure: true,
        };
        request.post(options, function (error, response, body) {
            if(body != undefined) {
                console.log('error:', error);
                console.log('statusCode:', response && response.statusCode);
                console.log('body:', JSON.parse(body));
                console.log('Retrieved game');
            }
        });
    }

    handleAccept(id) {
        console.log('id: ', id);
        const rqt = {
            'id': JSON.stringify(id)
        };
         let url = this.state.serverAddr + "acceptInvite"
        // let url = "http://localhost:4567/acceptInvite"
        let options = {
            method: "POST",
            uri: url,
            body: JSON.stringify(rqt),
            insecure: true,
        };
        console.log('options: ', options);
        request.post(options, function (error, response, body) {
            console.log('body: ', body);
            if(body != undefined) {
                console.log('error:', error);
                console.log('statusCode:', response && response.statusCode);
                console.log('body:', JSON.parse(body));
                console.log('START game');
            }
        });
    }

    handleInviteChange(event) {
        console.log('invite:', this.state.invite);
        this.setState({
            invite: event.target.value,
        });
    }

    handleSubmit(evt) {
        // if (!this.state.invite) {
        //     return this.setState({ error: '  invite is required' });
        // }
        console.log('in submit:', this.state.invite);

        evt.preventDefault();
        let email = localStorage.getItem("email");
        if(Cookies.readCookie('email') != null){
            email = Cookies.readCookie('email')
        }
        const rqt = {
            "p1": email,
            "p2": this.state.invite
        };
        let url = this.state.serverAddr + "sendInvite"
        // let url = "http://localhost:4567/sendInvite"

        let options = {
            method: "POST",
            uri : url,
            body: JSON.stringify(rqt),
            insecure: true,
        };
        request.post(options, function (error, response, body) {
            if(body != undefined) {
                console.log('error:', error);
                console.log('statusCode:', response && response.statusCode);
                console.log('body:', JSON.parse(body));
            }
        });
    }

    render() {

        return (

            <div className="Home" style={{textAlignVertical: "center", textAlign: "center"}}>
                <button onClick={this.openModal}>Invite</button>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    contentLabel = "Invite"
                >
                    <button onClick={this.closeModal}>Close Invite Screen</button>
                    <button onClick={this.updateGames}>Update</button>
                    <br/>
                    <br/>

                    <form onSubmit={this.handleSubmit}>

                        <label style={{textAlignVertical: "center", textAlign: "center", fontSize: 20 }}>
                            Send an Invitation
                            <br />
                            <input type="invite" data="invite"
                                   value={this.state.invite} onChange={this.handleInviteChange} />
                        </label>
                        <button type="submit" value="inviteSend" data-test="submit" variant="primary">Invite</button>
                        <br/>
                    </form>
                    <br/>
                    <br/>
                    <label style ={{fontWeight: 'bold', fontSize: 20}}>Sent</label>
                    <table >
                        <thead>
                        <tr>
                            <th>Game ID</th>
                            <th className="space"></th>
                            <th className="space"></th>
                            <th className="space"></th>
                            <th className="space"></th>
                            <th>Player 1</th>
                            <th className="space"></th>
                            <th className="space"></th>
                            <th className="space"></th>
                            <th className="space"></th>
                            <th className="space"></th>
                            <th className="space"></th>
                            <th className="space"></th>
                            <th className="space"></th>
                            <th className="space"></th>
                            <th className="space"></th>
                            <th className="space"></th>
                            <th className="space"></th>
                            <th>Player 2</th>
                        </tr>
                        </thead>
                        <tbody>
                            {this.renderSent()}
                        </tbody>
                    </table>
                    <br/>
                    <br/>

                    <label  style ={{fontWeight: 'bold', fontSize: 20}}>Pending</label>
                    <table >
                        <thead>
                        <tr>
                            <th>Game ID</th>
                            <th className="space"></th>
                            <th className="space"></th>
                            <th className="space"></th>
                            <th className="space"></th>
                            <th>Player 1</th>
                            <th className="space"></th>
                            <th className="space"></th>
                            <th className="space"></th>
                            <th className="space"></th>
                            <th className="space"></th>
                            <th className="space"></th>
                            <th className="space"></th>
                            <th className="space"></th>
                            <th className="space"></th>
                            <th className="space"></th>
                            <th className="space"></th>
                            <th className="space"></th>
                            <th>Player 2</th>
                        </tr>
                        </thead>
                        <tbody>
                            {this.renderPending()}
                        </tbody>
                    </table>

                </Modal>


            </div>
        );
    }
}
export default withRouter(Invite);
