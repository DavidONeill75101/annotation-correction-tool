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
				
        
		this.get_sentence = this.get_sentence.bind(this)
        this.create_user = this.create_user.bind(this)

        this.upvote_sentence = this.upvote_sentence.bind(this)
        this.add_upvote = this.add_upvote.bind(this)
        this.delete_upvote = this.delete_upvote.bind(this)

        this.downvote_sentence = this.downvote_sentence.bind(this)
        this.add_downvote = this.add_downvote.bind(this)
        this.delete_downvote = this.delete_downvote.bind(this)        

	}


    delete_upvote(){
        var self = this
        const fetchURL = 'http://localhost:3000/api/update_data/delete_upvote?user_id=' + this.state.user_id + '&sentence_id=' + this.props.id
        
        axios.get(fetchURL)
        .then(function (response) {
            const res = response.data   
                   
        })
        .catch(function (error) {
            console.log(error);
        })
        .then(function () {
            // always executed
           self.get_sentence()
        });
    }

    add_upvote(){
        var self = this
        const fetchURL = 'http://localhost:3000/api/update_data/add_upvote?user_id=' + this.state.user_id + '&sentence_id=' + this.props.id

       
        axios.get(fetchURL)
        .then(function (response) {
            const res = response.data   
            
            if (res[0]=='error'){
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

    create_user(){
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

    upvote_sentence(){
        var self = this
        
        const username = this.props.user.split('@')[0]

        const fetchURL = '/api/get_data/get_user?email=' + username
        
        axios.get(fetchURL)
        .then(function (response) {
            const res = response.data
            self.setState({
                user_id: res.id
            })

            if (res==''){
                
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


    delete_downvote(){
        var self = this
        const fetchURL = 'http://localhost:3000/api/update_data/delete_downvote?user_id=' + this.state.user_id + '&sentence_id=' + this.props.id
        
        axios.get(fetchURL)
        .then(function (response) {
            const res = response.data   
                   
        })
        .catch(function (error) {
            console.log(error);
        })
        .then(function () {
            // always executed
           self.get_sentence()
        });
    }


    add_downvote(){
        var self = this

        const fetchURL = 'http://localhost:3000/api/update_data/add_downvote?user_id=' + this.state.user_id + '&sentence_id=' + this.props.id

        
       
        axios.get(fetchURL)
        .then(function (response) {
            const res = response.data   
            
            if (res[0]=='error'){
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


    downvote_sentence(){
        var self = this
        
        const username = this.props.user.split('@')[0]

        const fetchURL = '/api/get_data/get_user?email=' + username
        
        axios.get(fetchURL)
        .then(function (response) {
            const res = response.data
            self.setState({
                user_id: res.id
            })

            if (res==''){
                
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


    get_sentence(){
        var self = this

		axios.get('/api/get_data/get_sentence?sentence_id=' + this.props.id)
			.then(function (response) {
				const sentence = response.data

                console.log(sentence)
                
                if (typeof sentence.user_upvotes == 'undefined'){
                    self.setState( {
                        upvotes: 0,
                    } ) 
                }else{
                    self.setState( {
                        upvotes: sentence.user_upvotes.length,
                    } ) 
                    
                }

                if (typeof sentence.user_downvotes == 'undefined'){
                    self.setState( {
                        downvotes: 0,
                    } ) 
                }else{
                    self.setState( {
                        downvotes: sentence.user_downvotes.length,
                    } ) 
                }

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
                    <Button size={this.state.upvote_size} variant="success" onClick={this.upvote_sentence}>
                        <FontAwesomeIcon icon={faThumbsUp} />
                    </Button><center>{this.state.upvotes}</center>

                    <Button size={this.state.downvote_size} onClick={this.downvote_sentence}>
                        <FontAwesomeIcon icon={faThumbsDown} />
                    </Button><center>{this.state.downvotes}</center>
                    </div>
				</div>
		)
	}
}
