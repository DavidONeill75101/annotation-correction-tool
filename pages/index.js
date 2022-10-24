/*
import React, { Component } from 'react';
import Link from 'next/link'
import axios from 'axios';


import Table from 'react-bootstrap/Table'

import Layout from '../components/Layout.js'


export default class annotation_review extends Component {


	constructor(props) {
		super(props)
		this.state = {
			loaded: false,
			collated: [],
			start: 0,
			end: 9

		}
		
		this.refreshCollated = this.refreshCollated.bind(this);

	}

	refreshCollated() {


		var self = this
		
		axios.get('http://127.0.0.1:5000/get_collated?start='+ self.state.start + '&end=' + self.state.end)
			.then(function (response) {
				const collated = response.data
				self.setState({
					collated: collated,
					loaded: true
				})
			})
			.catch(function (error) {
				console.log(error);
			})
			.then(function () {
				// always executed
			});
	}

	componentDidMount() {
		this.refreshCollated()
	}

	render() {

		var contents = 'loading'
		if (this.state.loaded) {
			const rows = this.state.collated.map(c => <tr key={c.matching_id}><td>{c.evidencetype}</td><td>{c.gene_normalized}</td><td>{c.cancer_normalized}</td><td>{c.drug_normalized}</td><td>{c.variant_group}</td><td>{c.citation_count}</td><td><Link href={"/review/"+c.matching_id}><a>Review Sentences</a></Link></td></tr>)

			contents = <Table striped bordered hover>
				<thead>
					<tr>
						<th>Evidence Type</th>
						<th>Gene</th>
						<th>Cancer</th>
						<th>Drug</th>
						<th>Variant</th>
						<th># of Papers</th>
					</tr>
				</thead>
				<tbody>
					{rows}
				</tbody>
			</Table>

		}

		return (
			<Layout title="Documents" page="/annotation_review" >

				<div className="d-sm-flex align-items-center justify-content-between mb-4 titlepadding">
					<h1 className="h3 mb-0 text-gray-800">Annotation Review</h1>

				</div>


				<div className="card shadow mb-4">

					{contents}
					
				</div>

			</Layout>
		)
	}
}


*/

import React, { Component } from 'react';
import Link from 'next/link'
import axios from 'axios';


import Table from 'react-bootstrap/Table'

import Layout from '../components/Layout.js'


export default class annotation_review extends Component {


	constructor(props) {
		super(props)
		
		

	}

	

	render() {

		return (
			<Layout title="Home" page="/" >

				<div className="d-sm-flex align-items-center justify-content-between mb-4 titlepadding">
					<h1 className="h3 mb-0 text-gray-800">CIViCMine Annotation Review</h1>

				</div>


				<div className="card shadow mb-4">

				<Link href={"/collated/0-9"}><a>Get started</a></Link>
					
				</div>

			</Layout>
		)
	}
}
