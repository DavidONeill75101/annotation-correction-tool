import React, { Component, useState, useRef } from 'react';

import Link from 'next/link'

import axios from 'axios';

import parse from 'html-react-parser'

import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'

import VotingButtons from './VotingButtons';


export default class ReviewEditor extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loaded: false,
			sentences: [],
			relation: [],
			relation_loaded: false,	
		}
	}
	

	refreshSentences(){

		var self = this

		axios.get('/api/get_data/get_sentences?start=' + this.props.start + '&end=' + this.props.end + '&matching_id='+this.props.matchingId)
			.then(function (response) {
				const sentences = response.data
				self.setState( {
					sentences: sentences,
					loaded: true
				} )
			})
			.catch(function (error) {
				console.log(error);
			})
			.then(function () {
				// always executed
			});
		
		axios.get('/api/get_data/get_relations?matching_id='+this.props.matchingId + '&start=0&end=1')
		.then(function (response) {
			const relation = response.data
			self.setState( {
				relation: relation,
				relation_loaded: true
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
		this.refreshSentences()
	}
	
	
	render() {

		var prev_link = ''
		var next_link = ''
		
		var prev_start = parseInt(this.props.start)-10
		var prev_end = parseInt(this.props.end) - 10

		var next_start = parseInt(this.props.start)+10
		var next_end = parseInt(this.props.end) + 10

		if (prev_start>=0){
			prev_link = <Link href={"/review?id=" + this.props.matchingId + '&range='+ prev_start + '-' + prev_end + '&citations=' + this.props.citations}><a><Button size="md">Previous</Button></a></Link>
		}
		
		if (next_start < this.props.citations){
			next_link = <Link href={"/review?id=" + this.props.matchingId + '&range=' + next_start + '-' + next_end + '&citations=' + this.props.citations}><a><Button size="md">Next</Button></a></Link>			
		}

		var relation_contents = ''

		if (this.state.relation_loaded) {
			const relation_rows = this.state.relation.map(c => <tr key={c.matching_id}><td>{c.evidencetype}</td><td>{c.gene}</td><td>{c.cancer}</td><td>{c.drug}</td><td>{c.variant_group}</td><td>{c.citation_count}</td></tr>)
			relation_contents = <Table striped bordered hover>
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
					{relation_rows}
				</tbody>
			</Table>
		}
		
		var contents = 'loading...'

		if (this.state.loaded) {

			

			const rows = this.state.sentences.map(s => <tr key={s.id}><td><a href={'https://pubmed.ncbi.nlm.nih.gov/' + s.pmid + '/'}>{s.pmid}</a></td>
			<td>{s.journal}</td><td>{s.year}</td>
			<td>{s.section}</td><td>{s.subsection}</td>
			<td>{parse(s.formatted)}</td>			
			<td><VotingButtons id={s.id} user={this.props.user}></VotingButtons></td></tr>)

			

			contents = <Table striped bordered hover>
				<thead>
					<tr>
						<th>PMID</th>
						<th>Journal</th>
						<th>Year</th>
						<th>Section</th>
						<th>Subsection</th>
						<th>Sentence</th>
						
					</tr>
				</thead>
				<tbody>
					{rows}
				</tbody>
			</Table>
		}
		
	
		return (
			
				<div>
						<div>
							{ relation_contents }
						</div>
						
						<div className="scrollableComponent mt-5">
							{contents}
						</div>
						
						<div>
							<div className='float-left mt-3'>
								{prev_link}
							</div>

							<div className="float-right mt-3">
								{next_link}
							</div>
						</div>
				</div>	
		) 
	}
}
