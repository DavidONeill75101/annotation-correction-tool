import React, { Component } from 'react';
import Link from 'next/link'
import axios from 'axios';


import Table from 'react-bootstrap/Table'

import Layout from '../components/Layout.js'


export default class Relations extends Component {


	constructor(props) {
		super(props)
		this.state = {
			loaded: false,
			collated: [],
			start: this.props.start,
			end: this.props.end

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
		var prev_link = ''
		var next_link = ''
		
		if (this.state.loaded) {
			const rows = this.state.collated.map(c => <tr key={c.matching_id}><td>{c.evidencetype}</td><td>{c.gene_normalized}</td><td>{c.cancer_normalized}</td><td>{c.drug_normalized}</td><td>{c.variant_group}</td><td>{c.citation_count}</td><td><Link href={"/review/"+c.matching_id+'/0-9/'+c.citation_count}><a>Review Sentences</a></Link></td></tr>)

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
		
		var prev_start = parseInt(this.state.start)-10
		var prev_end = parseInt(this.state.end) - 10

		var next_start = parseInt(this.state.start)+10
		var next_end = parseInt(this.state.end) + 10

		if (prev_start>=0){
			prev_link = <Link href={"/collated/"+prev_start + '-' + prev_end}><a>Previous</a></Link>
		}

		
		next_link = <Link href={"/collated/"+next_start + '-' + next_end}><a>Next</a></Link>


		

		}

		return (
				<div>

					<div>
						{contents}
					</div>

					<div>
						{prev_link}
					</div>
					
					<div>
						{next_link}
					</div>
					
				</div>

		)
	}
}



