import React, { Component } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faXmark, faPencil, faLink, faSkullCrossbones, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons'





export default class VotingButtons extends Component {

	constructor(props) {
		super(props)
		this.state = {
			
			}
				
        this.upvote = this.upvote.bind(this)
        this.downvote = this.downvote.bind(this)
		this.get_sentence = this.get_sentence.bind(this)
	}

    upvote(event){
        var users_upvoted_list = this.state.sentence.users_upvoted.split(',')	
        var users_downvoted_list = this.state.sentence.users_downvoted.split(',')
        
        if (users_upvoted_list.includes(this.props.user)){
            axios.get('/api/update_data/remove_upvote?id='+this.props.id)
            .then(function (response) {
                const res = response.data
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
            });

            var index = users_upvoted_list.indexOf(this.props.user);
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

           	
            window.location.reload(false)


        }else{
            if (!users_downvoted_list.includes(this.props.user)){
                    axios.get('/api/update_data/upvote?id='+this.props.id)
                .then(function (response) {
                    const res = response.data
                })
                .catch(function (error) {
                    console.log(error);
                })
                .then(function () {
                    // always executed
                });
                
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
                
                    window.location.reload(false)

            }
            
        }
    }

    downvote(event){
        var users_upvoted_list = this.state.sentence.users_upvoted.split(',')	
        var users_downvoted_list = this.state.sentence.users_downvoted.split(',')

			if (users_downvoted_list.includes(this.props.user)){
				axios.get('/api/update_data/remove_downvote?id='+this.props.id)
				.then(function (response) {
					const res = response.data	
                      
				})
				.catch(function (error) {
					console.log(error);
				})
				.then(function () {
					// always executed
				});

				var index = users_downvoted_list.indexOf(this.props.user);
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
				
                
                    window.location.reload(false)


			}else{
                
				if (!users_upvoted_list.includes(this.props.user)){
					axios.get('/api/update_data/downvote?id='+this.props.id)
					.then(function (response) {
						const res = response.data
					})
					.catch(function (error) {
						console.log(error);
					})
					.then(function () {
						// always executed
					});
					
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
                    window.location.reload(false)
                    
					
				}

			}
    }

    get_sentence(){
        var self = this

		axios.get('/api/get_data/get_sentence?sentence_id=' + this.props.id)
			.then(function (response) {
				const sentence = response.data
				self.setState( {
					upvotes: sentence.upvotes,
                    downvotes: sentence.downvotes,
                    sentence: sentence
					
				} )        
                
			})
			.catch(function (error) {
				console.log(error);
			})
			.then(function () {
				// always executed
			});
        
        
    }

    

    componentDidMount(){
        this.get_sentence()
        
        
    }
		

	render() {
       
		
		return (
				<div> 
                    <div>
                    <Button size="sm" variant="secondary" onClick={this.upvote}>
                        <FontAwesomeIcon icon={faThumbsUp} />
                    </Button><center>{this.state.upvotes}</center>

                    <Button size="sm" variant="secondary" onClick={this.downvote}>
                        <FontAwesomeIcon icon={faThumbsDown} />
                    </Button><center>{this.state.downvotes}</center>
                    </div>
					
                   

							
				</div>
		)
	}
}
