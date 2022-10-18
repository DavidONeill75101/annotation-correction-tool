import React, { Component } from 'react';
import Link from 'next/link'
import axios from 'axios';

import Table from 'react-bootstrap/Table'

import Layout from '../components/Layout.js'

export default class MainPage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loaded: false,
			documents: []
			}
			
		this.refreshFromDB = this.refreshFromDB.bind(this);
	}
	
	refreshFromDB() {
		var self = this
		axios.get('/api/document_list')
		.then(function (response) {
			const documents = response.data
			self.setState( {
				documents: documents,
				loaded: true
			} )
		})
		.catch(function (error) {
			console.log(error);
		})
		.then(function () {
			// always executed
		});  
	}
	
	componentDidMount() {
		this.refreshFromDB()
	}
	
	render() {
		
		var contents = 'loading'
		if (this.state.loaded) {
			const rows = this.state.documents.map(d => <tr key={d.id}><td><Link href={"/doc/"+d.id}><a>{d.id}</a></Link></td><td>{d.title}</td></tr>)
			
			contents = <Table striped bordered hover>
				<thead>
					<tr>
						<th>#</th>
						<th>Title</th>
					</tr>
				</thead>
				<tbody>
					{rows}
				</tbody>
			</Table>
		}
		
		return (
			<Layout title="Documents" page="/" >
			
				<div className="d-sm-flex align-items-center justify-content-between mb-4 titlepadding">
					<h1 className="h3 mb-0 text-gray-800">Annotation Editor Demo</h1>
					
				</div>
				

				<div className="card shadow mb-4">
		
					{contents}

				</div>

			</Layout>
		)
	}
}

