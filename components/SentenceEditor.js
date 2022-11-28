import React, { Component } from 'react';
import axios from 'axios';

import {TokenAnnotator, TextAnnotator} from 'react-text-annotate'

import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import Router from 'next/router';
 

export default class SentenceEditor extends Component {

	constructor(props) {
		super(props)
		this.state = {
			tag: 'gene',
			value: [],
			gene_annotations: [{text:'N/A', value:-1}],
			cancer_annotations: [{text:'N/A', value:-1}],
			drug_annotations: [{text:'N/A', value:-1}],
			candidate_gene: -1,
			candidate_cancer: -1,
			candidate_drug: -1,		
			candidate_evidence_type: 'diagnostic',
			relations: [],
		}
		
		this.update_value = this.update_value.bind(this)
		this.update_tag = this.update_tag.bind(this)

		this.update_candidate_gene = this.update_candidate_gene.bind(this)
		this.update_candidate_cancer = this.update_candidate_cancer.bind(this)
		this.update_candidate_drug = this.update_candidate_drug.bind(this)
		this.update_candidate_evidence_type = this.update_candidate_evidence_type.bind(this)

		this.add_relation_annotation = this.add_relation_annotation.bind(this)
		this.remove_relation_annotation = this.remove_relation_annotation.bind(this)

		this.add_annotations_to_db = this.add_annotations_to_db.bind(this)
		this.add_user_annotation_to_db = this.add_user_annotation_to_db.bind(this)
		this.add_relation_annotations_to_db = this.add_relation_annotations_to_db.bind(this)
		this.add_entity_annotation_to_db = this.add_entity_annotation_to_db.bind(this)

	}


	update_value(value){

		var self = this
		
		var gene_annotations = [{text:'N/A', value:-1}]
		var cancer_annotations = [{text:'N/A', value:-1}]
		var drug_annotations = [{text:'N/A', value:-1}]

		value.forEach(function(item, index){
			if (item['tag']=='gene'){
				gene_annotations.push({text: item['tokens'].join(' '), value:index})
			}else if (item['tag']=='cancer'){
				cancer_annotations.push({text: item['tokens'].join(' '), value:index})
			}else if (item['tag']=='drug'){
				drug_annotations.push({text: item['tokens'].join(' '), value:index})
			}
		})

		self.setState({
			value: value,
			gene_annotations: gene_annotations,
			cancer_annotations: cancer_annotations,
			drug_annotations: drug_annotations,
		})

	}


	update_tag(e){
		var self = this
		self.setState({
		 	tag: e.target.value
		})
	}


	update_candidate_gene(e){
		var self = this


		self.setState({
		 	candidate_gene: e.target.value
		})
	}


	update_candidate_cancer(e){
		var self = this
		self.setState({
		 	candidate_cancer: e.target.value
		})
	}


	update_candidate_drug(e){
		var self = this
		self.setState({
		 	candidate_drug: e.target.value
		})
	}


	update_candidate_evidence_type(e){
		var self = this
		self.setState({
		 	candidate_evidence_type: e.target.value
		})
	}


	add_relation_annotation(){

		var relations = this.state.relations

		relations.push({'id': relations.length,
						'gene':this.state.candidate_gene, 
						'cancer':this.state.candidate_cancer,
						'drug':this.state.candidate_drug,
						'evidence_type':this.state.candidate_evidence_type})

		this.setState({
			relations: relations,
		})
	}


	remove_relation_annotation(id){
		var relations = this.state.relations

		relations.forEach(function(item, index){
			if (item['id']==id){
				relations.splice(index, 1)
			}
		})

		relations.forEach(function(item, index){
			item['id'] = index
		})

		this.setState({
			relations: relations
		})
	}


	add_entity_annotation_to_db(relation_annotation_id, entity_annotation_id){
		var entity_type_ids = {'gene':1, 'cancer':2, 'drug':3}
		var annotation = this.state.value[entity_annotation_id]

		var entity_type_id = entity_type_ids[annotation.tag]
		var offset = annotation.tokens.join(' ').length

		var start = this.props.sentence.split(' ').slice(0, annotation.start).join(' ').length + 1
	
		var fetchURL = '/api/update_data/add_entity_annotation'
		var params = {relation_annotation_id:relation_annotation_id, entity_type_id:entity_type_id, start: start, offset: offset}

		
		axios.get(fetchURL, {
			params: params
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


	add_relation_annotations_to_db(){
		
		var self = this

		let promise = new Promise(function(resolve, reject) {
			self.state.relations.forEach(function(item, index){
				var fetchURL = '/api/update_data/add_relation_annotation'

				var evidence_type_ids = {'diagnostic': 1, 'predisposing': 2, 'predictive': 3, 'prognostic': 4}
		
				var params = {user_annotation_id:self.state.user_annotation_id, relation_type_id:evidence_type_ids[item.evidence_type]}

				axios.get(fetchURL, {
					params: params
				})
				.then(function (response) {
						const relation_annotation = response.data
						const relation_annotation_id = relation_annotation.id
						if (typeof item.gene == 'string'){
							self.add_entity_annotation_to_db(relation_annotation_id, item.gene)
						}

						if (typeof item.cancer == 'string'){
							self.add_entity_annotation_to_db(relation_annotation_id, item.cancer)
						}

						if (typeof item.drug == 'string'){
							self.add_entity_annotation_to_db(relation_annotation_id, item.drug)
						}

						
					})
					.catch(function (error) {
						console.log(error);
					})
					.then(function () {
						// always executed
						
					});

			})
			resolve() 
			reject()  
		});
			
		promise.then(
		 	function(value) {
				Router.back()
			},
			function(error) {

			}
			);
	}


	add_user_annotation_to_db(){

		var self = this

		var fetchURL = '/api/update_data/add_user_annotation'
		var params = {sentence_id:self.props.sentence_id, user_id:self.state.user_id}

		axios.get(fetchURL, {
			params: params
		})
		.then(function (response) {
				const user_annotation = response.data
				self.setState({
					user_annotation_id: user_annotation.id
				})
				
			})
			.catch(function (error) {
				console.log(error);
			})
			.then(function () {
				// always executed
				self.add_relation_annotations_to_db()
			});
	}


	add_annotations_to_db(){
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
				self.add_user_annotation_to_db()
			});
	}

	
	render() {

		const tag_colours = {'gene':'#FF9900', 'cancer':'#38E54D', 'drug':'#FDFF00'}

		var relation_contents = ''
		const relation_rows = this.state.relations.map(r => <tr><td>{(r.gene>-1) ? this.state.value[r.gene].tokens.join(' ') : 'N/A'}</td><td>{(r.cancer>-1) ? this.state.value[r.cancer].tokens.join(' ') : 'N/A'}</td><td>{(r.drug>-1) ? this.state.value[r.drug].tokens.join(' ') : 'N/A'}</td><td>{r.evidence_type}</td><Button className="w-100 mt-1" onClick={() => this.remove_relation_annotation(r.id)}>Remove</Button></tr>)
		relation_contents = <Table striped bordered hover>
			<thead>
				<tr>
					<th className="w-20">Gene</th>
					<th className="w-20">Cancer</th>
					<th className="w-20">Drug</th>
					<th className="w-20">Evidence Type</th>
					<th className="w-20">Remove Relation</th>
				</tr>
			</thead>
			<tbody>
				{relation_rows}
			</tbody>
		</Table>

		const gene_options = this.state.gene_annotations.map(g => <option value={g.value}>{g.text}</option>)
		const cancer_options = this.state.cancer_annotations.map(c => <option value={c.value}>{c.text}</option>)
		const drug_options = this.state.drug_annotations.map(d => <option value={d.value}>{d.text}</option>)

		const evidence_type_options = 
			<>
				<option value='diagnostic'>diagnostic</option>
				<option value='predisposing'>predisposing</option>
				<option value='predictive'>predictive</option>
				<option value='prognostic'>prognostic</option>
			</>

		const gene_selector = <select onChange={this.update_candidate_gene} value={this.state.candidate_gene} className="w-100">{ gene_options }</select>
		const cancer_selector = <select onChange={this.update_candidate_cancer} value={this.state.candidate_cancer} className="w-100">{ cancer_options }</select>
		const drug_selector = <select onChange={this.update_candidate_drug} value={this.state.candidate_drug} className="w-100">{ drug_options }</select>
		const evidence_selector = <select onChange={this.update_candidate_evidence_type} value={this.state.candidate_evidence_type} className="w-100">{ evidence_type_options }</select>

		const selector_table = <Table striped bordered hover>
		<thead>
			<tr>
				<th className="w-25">Gene</th>
				<th className="w-25">Cancer</th>
				<th className="w-25">Drug</th>
				<th className="w-25">Evidence Type</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>{ gene_selector }</td>
				<td>{ cancer_selector }</td>
				<td>{ drug_selector }</td>
				<td>{ evidence_selector }</td>
			</tr>
		</tbody>
		</Table>


		return (
				<div> 

					<div>
						<select
							onChange={this.update_tag}
							value={this.state.tag}
							className="mb-5"
						>
							<option value="gene">gene</option>
							<option value="cancer">cancer</option>
							<option value="drug">drug</option>
						</select>
						
						<TokenAnnotator
						tokens={this.props.sentence.split(' ')}
						value={this.state.value}
						onChange={this.update_value}
						getSpan={span => ({
							...span,
							tag: this.state.tag,
							color: tag_colours[this.state.tag],
						})}
						/>
					</div>

					<div className="mt-5">

						{ selector_table }

						<Button className="mt-1 float-right" size="sm" onClick={this.add_relation_annotation}>
							Add relation
						</Button>

					</div>
					
					<div>
						<h3 className="mt-5">Relations</h3>
						{relation_contents}

						<Button className="mt-1 float-right" size="sm" onClick={this.add_annotations_to_db}>
							Annotations Complete
						</Button>
						
					</div>
									
				</div>
		)
	}
}
