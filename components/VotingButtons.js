import React, { Component } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faXmark, faPencil, faLink, faSkullCrossbones, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons'


export default class VotingButtons extends Component {

	constructor(props) {
		super(props)
		this.state = {
			upvote_size: 'sm',
            downvote_size: 'sm',
			}
				
        this.upvote = this.upvote.bind(this)
        this.downvote = this.downvote.bind(this)
		this.get_sentence = this.get_sentence.bind(this)
	}


    upvote(event){
        var self = this
        var users_upvoted_list = self.state.users_upvoted.split(',')
        var users_downvoted_list = self.state.users_downvoted.split(',')	
        if (!users_upvoted_list.includes(this.props.user) && !users_downvoted_list.includes(this.props.user)){
                
            const new_users_voted = this.props.user + ',' + this.state.sentence.users_upvoted

            const fetchURL = '/api/update_data/update_users_upvoted?id='+this.props.id+'&usernames='+new_users_voted

            axios.get(fetchURL)
            .then(function (response) {
                const res = response.data
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
            });
            
            axios.get('/api/update_data/upvote?id='+this.props.id)
                .then(function (response) {
                    const res = response.data
                    self.setState({
                        upvotes: res.upvotes,
                        users_upvoted: res.users_upvoted,
                        upvote_size: 'md',
                    })
                })
                .catch(function (error) {
                    console.log(error);
                })
                .then(function () {
                    // always executed
            });

        }else if (users_upvoted_list.includes(this.props.user)) {

            var index = users_upvoted_list.indexOf(this.props.user)

            if (index !== -1) {
                users_upvoted_list.splice(index, 1);
            }
            
            const new_users_voted = users_upvoted_list.join(',')

            const fetchURL = '/api/update_data/update_users_upvoted?id='+this.props.id+'&usernames='+new_users_voted

            axios.get(fetchURL)
            .then(function (response) {
                const res = response.data
                
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
            });


            axios.get('/api/update_data/remove_upvote?id='+this.props.id)
            .then(function (response) {
                const res = response.data	
                self.setState({
                    upvotes: res.upvotes,
                    users_upvoted: res.users_upvoted,
                    upvote_size: 'sm',
                })
                    
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
            });

        }
        this.get_sentence()
        
    }


    downvote(event){
        var self = this
        var users_upvoted_list = self.state.users_upvoted.split(',')	
        var users_downvoted_list = self.state.users_downvoted.split(',')
        if (!users_downvoted_list.includes(this.props.user) && !users_upvoted_list.includes(this.props.user)){
                
            const new_users_voted = this.props.user + ',' + this.state.sentence.users_downvoted

            const fetchURL = '/api/update_data/update_users_downvoted?id='+this.props.id+'&usernames='+new_users_voted

            axios.get(fetchURL)
            .then(function (response) {
                const res = response.data
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
            });
            
            axios.get('/api/update_data/downvote?id='+this.props.id)
                .then(function (response) {
                    const res = response.data
                    self.setState({
                        downvotes: res.downvotes,
                        users_downvoted: res.users_downvoted,
                        downvote_size: 'md',
                    })
                })
                .catch(function (error) {
                    console.log(error);
                })
                .then(function () {
                    // always executed
            });

        }else if (users_downvoted_list.includes(this.props.user)) {

            var index = users_downvoted_list.indexOf(this.props.user)

            if (index !== -1) {
                users_downvoted_list.splice(index, 1);
            }
            
            const new_users_voted = users_downvoted_list.join(',')

            const fetchURL = '/api/update_data/update_users_downvoted?id='+this.props.id+'&usernames='+new_users_voted

            axios.get(fetchURL)
            .then(function (response) {
                const res = response.data
                
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
            });


            axios.get('/api/update_data/remove_downvote?id='+this.props.id)
            .then(function (response) {
                const res = response.data	
                self.setState({
                    downvotes: res.downvotes,
                    users_downvoted: res.users_downvoted,
                    downvote_size: 'sm',
                })
                    
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
            });
        }
        this.get_sentence()
    }


    get_sentence(){
        var self = this

		axios.get('/api/get_data/get_sentence?sentence_id=' + this.props.id)
			.then(function (response) {
				const sentence = response.data
				self.setState( {
					upvotes: sentence.upvotes,
                    downvotes: sentence.downvotes,
                    sentence: sentence,
                    users_downvoted: sentence.users_downvoted,
                    users_upvoted: sentence.users_upvoted,
					
				} )        
                
			})
			.catch(function (error) {
				console.log(error);
			})
			.then(function () {
				// always executed
                var users_upvoted_list = self.state.users_upvoted.split(',')	
                var users_downvoted_list = self.state.users_downvoted.split(',')
                
                if (users_upvoted_list.includes(self.props.user)){
                    self.setState({
                        upvote_size: 'md'
                    })
                }else{
                    self.setState({
                        upvote_size: 'sm'
                    })
                }

                if (users_downvoted_list.includes(self.props.user)){
                    self.setState({
                        downvote_size: 'md'
                    })
                }else{
                    self.setState({
                        downvote_size: 'sm'
                    })
                }

			});        
    }

    
    componentDidMount(){
        this.get_sentence()    
    }
		

	render() {
       
		
		return (
				<div> 
                    <div>
                    <Button size={this.state.upvote_size} variant="success" onClick={this.upvote}>
                        <FontAwesomeIcon icon={faThumbsUp} />
                    </Button><center>{this.state.upvotes}</center>

                    <Button size={this.state.downvote_size} onClick={this.downvote}>
                        <FontAwesomeIcon icon={faThumbsDown} />
                    </Button><center>{this.state.downvotes}</center>
                    </div>
				</div>
		)
	}
}
