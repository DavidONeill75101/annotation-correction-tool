import React, { Component, useState, useRef } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faCheck, faXmark, faPencil, faLink, faSkullCrossbones, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons'


import Table from 'react-bootstrap/Table'


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

		axios.get('http://127.0.0.1:5000/get_sentences?start=0&end=10&matching_id='+this.props.matchingId)
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

		
		axios.get('http://127.0.0.1:5000/get_collated?matching_id='+this.props.matchingId)
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

		const upvote = (event, id) => {
			axios.get('http://127.0.0.1:5000/upvote_sentence?id='+id)
			.then(function (response) {
				const res = response.data
				console.log(res)
			})
			.catch(function (error) {
				console.log(error);
			})
			.then(function () {
				// always executed
			});
			window.location.reload(false)
		}

		const downvote = (event, id) => {
			axios.get('http://127.0.0.1:5000/downvote_sentence?id='+id)
			.then(function (response) {
				const res = response.data
				console.log(res)
			})
			.catch(function (error) {
				console.log(error);
			})
			.then(function () {
				// always executed
			});
			window.location.reload(false)

		}

		var relation_contents = 'loading'
		if (this.state.relation_loaded) {
			const relation_rows = this.state.relation.map(c => <tr key={c.matching_id}><td>{c.evidencetype}</td><td>{c.gene_normalized}</td><td>{c.cancer_normalized}</td><td>{c.drug_normalized}</td><td>{c.variant_group}</td><td>{c.citation_count}</td></tr>)

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

		var contents = 'loading'
		if (this.state.loaded) {
		const rows = this.state.sentences.map(s => <tr key={s.id}><td>{s.pmid}</td>
		<td>{s.journal}</td><td>{s.year}</td>
		<td>{s.section}</td><td>{s.subsection}</td>
		<td>{s.sentence}</td>
		<td><Button size="sm" variant="success" onClick={event => upvote(event, s.id)}>
			<FontAwesomeIcon icon={faThumbsUp} />
		</Button><center>{s.upvotes}</center></td>
		<td><Button size="sm" variant="danger" onClick={event => downvote(event, s.id)}>
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

			
				<div className="d-sm-flex align-items-center justify-content-between mb-4 titlepadding">
					
					{contents}
				</div>		
		) 
	}
}
