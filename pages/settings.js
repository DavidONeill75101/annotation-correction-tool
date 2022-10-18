import React, { Component } from 'react';

import Layout from '../components/Layout.js'

export default class Settings extends Component {
	constructor(props) {
		super(props)
		this.state = {}
	}
	
	render() {
		
		
		return (
			<Layout title="Settings" page="/settings" >
			
				<div className="d-sm-flex align-items-center justify-content-between mb-4 titlepadding">
					<h1 className="h3 mb-0 text-gray-800">Settings</h1>
					
				</div>
				
			</Layout>
		)
	}
}