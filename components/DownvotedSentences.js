import React, { Component } from 'react';

import Link from 'next/link'

import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table'


export default class DownvotedSentences extends Component {

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

		axios.get('/api/get_data/get_downvoted_sentences?start=' + this.props.start + '&end=' + this.props.end + '&matching_id='+this.props.matching_id + '&user_id=' + this.state.user_id)
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
		
		axios.get('/api/get_data/get_relations?matching_id='+this.props.matching_id + '&start=0&end=1')
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


	get_user(){
		var self = this
		var fetchURL = '/api/get_data/get_user'
		var params = {email: this.props.user.email.split('@')[0]}
		
		axios.get(fetchURL, {
			params: params
		})
		.then(function (response) {
				const user = response.data
				self.setState({
					user_id: user.id,
				})
			})
			.catch(function (error) {
				console.log(error);
			})
			.then(function () {
				// always executed
				self.refreshSentences()
			});
	}

	
	componentDidMount() {
		this.get_user()
	}
	
	
	render() {


		var prev_link = ''
		var next_link = ''
		
		var prev_start = parseInt(this.props.start)-10
		var prev_end = parseInt(this.props.end) - 10

		var next_start = parseInt(this.props.start)+10
		var next_end = parseInt(this.props.end) + 10

		if (prev_start>=0){
			prev_link = <Link href={"/review_downvoted_sentences?id=" + this.props.matching_id + '&range='+ prev_start + '-' + prev_end + '&citations=' + this.props.citations}><a><Button size="md">Previous</Button></a></Link>
		}
		
		if (this.state.sentences.length==9){
			next_link = <Link href={"/review_downvoted_sentences?id=" + this.props.matching_id + '&range=' + next_start + '-' + next_end + '&citations=' + this.props.citations}><a><Button size="md">Next</Button></a></Link>			
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
			if (this.state.sentences.length == 0){
				contents = "You have no sentences to annotate for this relation.  Go to the review section to select sentence annotations which are incorrect before coming here to manually annotate them."
			}else{
				const rows = this.state.sentences.map(s => <tr key={s.sentence.id}><td>{s.sentence.pmid}</td>
				<td>{s.sentence.journal}</td><td>{s.sentence.year}</td>
				<td>{s.sentence.section}</td><td>{s.sentence.subsection}</td>
				<td>{s.sentence.sentence}</td>
				<td><Link href={"/manual_annotation?id=" + s.sentence.id + '&matching_id=' + this.props.matching_id + '&citations' + this.props.citations}><a><Button size="md">Annotate</Button></a></Link></td>
				</tr>)

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
							<div className='float-left'>
								{prev_link}
							</div>

							<div className="float-right">
								{next_link}
							</div>
						</div>
				</div>	
		) 
	}
}
