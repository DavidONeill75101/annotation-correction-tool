import React, { Component } from 'react';
import {Routes, Route, useNavigate} from 'react-router-dom';

import axios from 'axios';

import Link from 'next/link'



import Layout from '../components/Layout.js'
import Button from 'react-bootstrap/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faXmark, faPencil, faLink } from '@fortawesome/free-solid-svg-icons'


export default class Registration extends Component {
	constructor(props) {
		super(props)
		this.state = {
			candidateUsername: null,
			candidatePassword: null
		}

		this.addAccountToDB = this.addAccountToDB.bind(this);
		this.clearCandidateAccount = this.clearCandidateAccount.bind(this);
		this.updateUsername = this.updateUsername.bind(this);
		this.updatePassword = this.updatePassword.bind(this);

	}

	clearCandidateAccount() {
		this.setState({candidateUsername: null, candidatePassword:null})
	}

	addAccountToDB() {
		
		
		const candidateUsername = this.state.candidateUsername
		const candidatePassword = this.state.candidatePassword
		this.clearCandidateAccount()
		
		
		axios.get('/api/create_account', {
			params: {
				username: candidateUsername,
				password: candidatePassword
			}
		})
		.then(function (response) {
			
		})
		.catch(function (error) {
			console.log(error);
		})
		.then(function () {
			// always executed
		});
	}

	updateUsername(event){
		this.setState({candidateUsername:event.target.value})
	}

	updatePassword(event){
		this.setState({candidatePassword:event.target.value})
	}
	
	render() {
		
		
		return (
			<Layout title="Registration" page="/registration" >
			
				<div className="d-sm-flex align-items-center justify-content-between mb-4 titlepadding">
					<h1 className="h3 mb-0 text-gray-800">Register as a user</h1>
					
				</div>

				<input
					type="text"
					placeholder='Username'
					onChange={this.updateUsername}
				/>
				<br></br>
				<br></br>
				<input
					type="password"
					placeholder="Password"
					onChange={this.updatePassword}
				/>
				<br></br>
				<br></br>
				<Button size="sm" onClick={evt => this.addAccountToDB()}>
					<span> Register</span>
				</Button>
				
			</Layout>
		)
	}
}