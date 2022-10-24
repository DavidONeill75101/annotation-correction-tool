import React, { Component } from 'react';

import Layout from '../components/Layout.js'
import Instructions from '../components/Instructions.js'

export default class UserGuide extends Component {
	constructor(props) {
		super(props)
		this.state = {}
	}
	


	render() {
		
		
		
		return (
			<Layout title="User Guide" page="/user_guide" >
			
				<div className="d-sm-flex align-items-center justify-content-between mb-4 titlepadding">
					<h1 className="h3 mb-0 text-gray-800">User Guide</h1>
					
				</div>
				
				<div className="card shadow mb-4">
					<div className="card-body">
						<Instructions />
					</div>
				</div>
			</Layout>
		)
	}
}