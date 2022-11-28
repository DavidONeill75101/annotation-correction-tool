import React, { Component } from 'react';

import axios from 'axios';

import Button from 'react-bootstrap/Button'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons'


export default class VotingButtons extends Component {

    constructor(props) {
        super(props)
        this.state = {
            up_variant: 'secondary',
            down_variant: 'secondary',
        }

        this.get_sentence = this.get_sentence.bind(this)
        this.create_user = this.create_user.bind(this)
        this.get_user = this.get_user.bind(this)
        this.set_colour = this.set_colour.bind(this)

        this.upvote_sentence = this.upvote_sentence.bind(this)
        this.add_upvote = this.add_upvote.bind(this)
        this.delete_upvote = this.delete_upvote.bind(this)

        this.downvote_sentence = this.downvote_sentence.bind(this)
        this.add_downvote = this.add_downvote.bind(this)
        this.delete_downvote = this.delete_downvote.bind(this)

    }


    delete_upvote() {

        var self = this
        const fetchURL = 'http://localhost:3000/api/update_data/delete_upvote?user_id=' + this.state.user_id + '&sentence_id=' + this.props.id

        axios.get(fetchURL)
            .then(function (response) {
                const res = response.data
                self.setState({
                    up_variant: 'secondary',
                })

            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
                self.get_sentence()
            });
    }


    add_upvote() {

        var self = this
        const fetchURL = 'http://localhost:3000/api/update_data/add_upvote?user_id=' + this.state.user_id + '&sentence_id=' + this.props.id

        axios.get(fetchURL)
            .then(function (response) {
                const res = response.data

                if (res[0] == 'error') {
                    self.delete_upvote()
                }

            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
                self.get_sentence()
            });

    }


    create_user() {

        var self = this
        const username = this.props.user.split('@')[0]

        const fetchURL = '/api/update_data/add_user?email=' + username

        axios.get(fetchURL)
            .then(function (response) {
                const res = response.data
                self.setState({
                    user_id: res.id
                })
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
            });
    }


    set_colour() {
        
        if (this.state.upvoted_users.includes(this.state.user_id)){
            this.setState({
                up_variant: 'success',
            })
        }

        if (this.state.downvoted_users.includes(this.state.user_id)){
            this.setState({
                down_variant: 'danger',
            })
        }
    }


    get_user() {

        var self = this
        const username = this.props.user.split('@')[0]

        const fetchURL = '/api/get_data/get_user?email=' + username

        axios.get(fetchURL)
            .then(function (response) {
                const res = response.data
                self.setState({
                    user_id: res.id
                })
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
                self.set_colour()
            });
    }
    

    upvote_sentence() {

        var self = this

        const username = this.props.user.split('@')[0]

        const fetchURL = '/api/get_data/get_user?email=' + username

        if (this.state.downvoted_users.includes(this.state.user_id)){
            this.delete_downvote()
        }

        axios.get(fetchURL)
            .then(function (response) {
                const res = response.data
                self.setState({
                    user_id: res.id
                })

                if (res == '') {

                    self.create_user()
                }
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
                self.add_upvote()
            });
    }


    delete_downvote() {

        var self = this

        const fetchURL = 'http://localhost:3000/api/update_data/delete_downvote?user_id=' + this.state.user_id + '&sentence_id=' + this.props.id

        axios.get(fetchURL)
            .then(function (response) {
                const res = response.data
                self.setState({
                    down_variant: 'secondary',
                })

            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
                self.get_sentence()
            });
    }


    add_downvote() {

        var self = this

        const fetchURL = 'http://localhost:3000/api/update_data/add_downvote?user_id=' + this.state.user_id + '&sentence_id=' + this.props.id

        if (this.state.upvoted_users.includes(this.state.user_id)){
            this.delete_upvote()
        }

        axios.get(fetchURL)
            .then(function (response) {
                const res = response.data

                if (res[0] == 'error') {
                    self.delete_downvote()
                }

            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
                self.get_sentence()
            });
    }


    downvote_sentence() {

        var self = this

        const username = this.props.user.split('@')[0]

        const fetchURL = '/api/get_data/get_user?email=' + username

        axios.get(fetchURL)
            .then(function (response) {
                const res = response.data
                self.setState({
                    user_id: res.id
                })

                if (res == '') {

                    self.create_user()
                }
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed


                self.add_downvote()

            });
    }


    get_sentence() {

        var self = this

        axios.get('/api/get_data/get_sentence?sentence_id=' + this.props.id)
            .then(function (response) {
                const sentence = response.data

                if (typeof sentence.user_upvotes == 'undefined') {
                    self.setState({
                        upvotes: 0,
                    })
                } else {
                    var upvoted_users = []

                    sentence.user_upvotes.forEach(function (item, index) {
                        upvoted_users.push(item['userId'])
                    });

                    self.setState({
                        upvotes: sentence.user_upvotes.length,
                        upvoted_users: upvoted_users,
                    })

                }

                if (typeof sentence.user_downvotes == 'undefined') {
                    self.setState({
                        downvotes: 0,
                    })
                } else {
                    var downvoted_users = []

                    sentence.user_downvotes.forEach(function (item, index) {
                        downvoted_users.push(item['userId'])
                    });

                    self.setState({
                        downvotes: sentence.user_downvotes.length,
                        downvoted_users: downvoted_users,
                    })
                }

            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed

                self.get_user()
            });
    }


    componentDidMount() {
        this.get_sentence()
    }


    render() {
        

        return (
            <div>
                <div>
                <Button size={this.state.upvote_size} variant={this.state.up_variant} onClick={this.upvote_sentence}>
                    <FontAwesomeIcon icon={faThumbsUp} />
                </Button><center>{this.state.upvotes}</center>

                <Button size={this.state.downvote_size} variant={this.state.down_variant} onClick={this.downvote_sentence}>
                    <FontAwesomeIcon icon={faThumbsDown} />
                </Button><center>{this.state.downvotes}</center>
            </div>
            </div>
        )
    }
}
