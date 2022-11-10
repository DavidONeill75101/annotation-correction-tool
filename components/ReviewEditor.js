import React, { Component, useState, useRef } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faXmark, faPencil, faLink, faSkullCrossbones, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import parse from 'html-react-parser'

const validHTMLTags = ["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "big", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "label", "legend", "li", "link", "main", "map", "mark", "meta", "meter", "nav", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "small", "source", "span", "strike", "strong", "style", "sub", "summary", "sup", "svg", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"];


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
			prev_link = <Link href={"/review/" + this.props.matchingId + '/'+ prev_start + '-' + prev_end + '/' + this.props.citations}><a><Button size="md">Previous</Button></a></Link>
		}
		
		if (next_start < this.props.citations){
			next_link = <Link href={"/review/" + this.props.matchingId + '/' + next_start + '-' + next_end + '/' + this.props.citations}><a><Button size="md">Next</Button></a></Link>			
		}

		const upvote = (event, id, users_upvoted) => {
			var users_voted_list = users_upvoted.split(',')	
			
			if (users_voted_list.includes(this.props.user)){
				axios.get('/api/update_data/remove_upvote?id='+id)
				.then(function (response) {
					const res = response.data
				})
				.catch(function (error) {
					console.log(error);
				})
				.then(function () {
					// always executed
				});

				var index = users_voted_list.indexOf(this.props.user);
				if (index !== -1) {
				users_voted_list.splice(index, 1);
				}
				
				const new_users_voted = users_voted_list.join(',')

				const fetchURL = '/api/update_data/update_users_upvoted?id='+id+'&usernames='+new_users_voted

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

				axios.get('/api/update_data/upvote?id='+id)
				.then(function (response) {
					const res = response.data
				})
				.catch(function (error) {
					console.log(error);
				})
				.then(function () {
					// always executed
				});
				
				const new_users_voted = this.props.user + ',' + users_upvoted

				const fetchURL = '/api/update_data/update_users_upvoted?id='+id+'&usernames='+new_users_voted

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


		const downvote = (event, id, users_downvoted) => {
			
			var users_voted_list = users_downvoted.split(',')	
			
			if (users_voted_list.includes(this.props.user)){
				axios.get('/api/update_data/remove_downvote?id='+id)
				.then(function (response) {
					const res = response.data	
				})
				.catch(function (error) {
					console.log(error);
				})
				.then(function () {
					// always executed
				});

				var index = users_voted_list.indexOf(this.props.user);
				if (index !== -1) {
				users_voted_list.splice(index, 1);
				}
				
				const new_users_voted = users_voted_list.join(',')

				const fetchURL = '/api/update_data/update_users_downvoted?id='+id+'&usernames='+new_users_voted

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
				axios.get('/api/update_data/downvote?id='+id)
				.then(function (response) {
					const res = response.data
				})
				.catch(function (error) {
					console.log(error);
				})
				.then(function () {
					// always executed
				});
				
				const new_users_voted = this.props.user + ',' + users_downvoted

				const fetchURL = '/api/update_data/update_users_downvoted?id='+id+'&usernames='+new_users_voted

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
			const rows = this.state.sentences.map(s => <tr key={s.id}><td>{s.pmid}</td>
			<td>{s.journal}</td><td>{s.year}</td>
			<td>{s.section}</td><td>{s.subsection}</td>
			<td>{parse(s.formatted)}</td>
			
			<td><Button size="sm" variant="success" onClick={event => upvote(event, s.id, s.users_upvoted)}>
				<FontAwesomeIcon icon={faThumbsUp} />
			</Button><center>{s.upvotes}</center></td>

			<td><Button size="sm" onClick={event => downvote(event, s.id, s.users_downvoted)}>
				<FontAwesomeIcon icon={faThumbsDown} />
			</Button><center>{s.downvotes}</center></td></tr>)

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
						<div>
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
