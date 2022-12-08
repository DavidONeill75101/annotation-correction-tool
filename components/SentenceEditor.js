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
			gene_annotations: [{text:'No Gene', value:-1}],
			cancer_annotations: [{text:'No Cancer', value:-1}],
			drug_annotations: [{text:'No Drug', value:-1}],
			candidate_gene: -1,
			candidate_cancer: -1,
			candidate_drug: -1,		
			candidate_evidence_type: 'diagnostic',
			candidate_variant: 'No Variant',
			relations: [],
			variants: [],
			error_message: '',
		}

		this.get_variants = this.get_variants.bind(this)
		
		this.update_value = this.update_value.bind(this)
		this.update_tag = this.update_tag.bind(this)

		this.update_candidate_gene = this.update_candidate_gene.bind(this)
		this.update_candidate_cancer = this.update_candidate_cancer.bind(this)
		this.update_candidate_drug = this.update_candidate_drug.bind(this)
		this.update_candidate_evidence_type = this.update_candidate_evidence_type.bind(this)
		this.update_candidate_variant = this.update_candidate_variant.bind(this)

		this.add_relation_annotation = this.add_relation_annotation.bind(this)
		this.remove_relation_annotation = this.remove_relation_annotation.bind(this)

		this.add_annotations_to_db = this.add_annotations_to_db.bind(this)
		this.add_user_annotation_to_db = this.add_user_annotation_to_db.bind(this)
		this.add_relation_annotations_to_db = this.add_relation_annotations_to_db.bind(this)
		this.add_entity_annotation_to_db = this.add_entity_annotation_to_db.bind(this)

		this.get_other_user_annotations = this.get_other_user_annotations.bind(this)

	}


	get_other_user_annotations(){

		var self = this
		
		var params = {sentence_id: this.props.sentence_id}
		
		axios.get('/api/get_data/admin_calls/get_sentence_annotations_with_synonyms', {
			params: params
		})
			.then(function (response) {
				const res = response.data
				if(typeof res[0]!='undefined'){
					var gene = res[0].relations[0].gene.name
					var cancer = res[0].relations[0].cancer.name
					var drug = res[0].relations[0].drug.name
					var evidence_type = res[0].relations[0].relationType.name
					var variant = res[0].relations[0].variant.name

					if (drug!='No Drug'){
						self.setState({
							suggested_drug: drug,
						})
					}

					if (variant!='No Variant'){
						self.setState({
							suggested_variant: variant,
						})
					}
					
					self.setState({
						suggested_gene: gene,
						suggested_cancer: cancer,
						suggested_evidence_type: evidence_type,
					})
				}
				
			})
			.catch(function (error) {
				console.log(error);
			})
			.then(function () {
				// always executed
			});
	}


	get_variants(){
		var self = this
		
		axios.get('/api/get_data/get_variants')
			.then(function (response) {
				const res = response.data
				var variants = [{'value':'No Variant', 'label':'No variant'}]
				res.forEach(element => {
					if (element != 'nan'){
						variants.push({'value':element, 'label':element})
					}

				});				
				self.setState({
					variants: variants,
				})
			})
			.catch(function (error) {
				console.log(error);
			})
			.then(function () {
				// always executed
			});
	}


	update_value(value){

		var self = this
		
		var gene_annotations = [{text:'No Gene', value:-1}]
		var cancer_annotations = [{text:'No Cancer', value:-1}]
		var drug_annotations = [{text:'No Drug', value:-1}]

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

	update_candidate_variant(e){
		var self = this

		self.setState({
			candidate_variant: e.target.value
		})
	}


	add_relation_annotation(){

		var self = this

		var gene_text = ''
		this.state.gene_annotations.forEach(function(item){
			if (item['value']==self.state.candidate_gene){
				gene_text = item['text']
			}
		})

		var cancer_text = ''
		this.state.cancer_annotations.forEach(function(item){
			if (item['value']==self.state.candidate_cancer){
				cancer_text = item['text']
			}
		})

		var drug_text = ''
		this.state.drug_annotations.forEach(function(item){
			if (item['value']==self.state.candidate_drug){
				drug_text = item['text']
			}
		})

		var fetchURL = '/api/get_data/get_synonyms'
		var params = {gene_name:gene_text, cancer_name:cancer_text, drug_name:drug_text, variant_name:this.state.candidate_variant}
		
		axios.get(fetchURL, {
			params: params
		})
		.then(function (response) {
				var res = response.data

				if (res!='Entity Error'){

					var relations = self.state.relations

					if (self.state.candidate_gene!=-1 && 
						self.state.candidate_cancer!=-1 && 
						self.state.candidate_evidence_type!='predictive' && 
						self.state.candidate_drug == -1){
						relations.push({'id': relations.length,
									'gene':self.state.candidate_gene, 
									'cancer':self.state.candidate_cancer,
									'drug':self.state.candidate_drug,
									'evidence_type':self.state.candidate_evidence_type,
									'variant': self.state.candidate_variant,
									'gene_id': res.gene_id,
									'cancer_id': res.cancer_id,
									'drug_id': res.drug_id,
									'variant_id': res.variant_id
									})

									self.setState({
							relations: relations,
							error_message: '',
							})
					}else if (self.state.candidate_gene!=-1 &&
						self.state.candidate_cancer!=-1 &&
						self.state.candidate_drug!=-1 &&
						self.state.candidate_evidence_type=='predictive'){
						relations.push({'id': relations.length,
									'gene':self.state.candidate_gene, 
									'cancer':self.state.candidate_cancer,
									'drug':self.state.candidate_drug,
									'evidence_type':self.state.candidate_evidence_type,
									'variant': self.state.candidate_variant,
									'gene_id': res.gene_id,
									'cancer_id': res.cancer_id,
									'drug_id': res.drug_id,
									'variant_id': res.variant_id
								})

									self.setState({
							relations: relations,
							error_message: '',
							})
					}else{
						self.setState({
							error_message: 'Invalid Relation'
						})
					}	
				}else{
					self.setState({
						error_message: 'Incorrect entity annotations'
					})
				}
			})
			.catch(function (error) {
				console.log(error);
			})
			.then(function () {
				// always executed
				
			});

		
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
		
				var params = {user_annotation_id:self.state.user_annotation_id, relation_type_id:evidence_type_ids[item.evidence_type], gene: item['gene_id'], cancer: item['cancer_id'], drug: item['drug_id'], variant: item['variant_id']}

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

	componentDidMount(){
		this.get_variants()
		this.get_other_user_annotations()
	}

	
	render() {

		var suggestion = ''
		if (typeof this.state.suggested_gene != 'undefined'){
			if(this.state.suggested_evidence_type == 'predictive'){
				suggestion = 'Suggestion based on other users - a predictive relationship between ' + this.state.suggested_gene + ', ' + this.state.suggested_cancer + ' and ' + this.state.suggested_drug

			}else{
				suggestion = 'Suggestion based on other users - a ' + this.state.suggested_evidence_type + ' relationship between ' + this.state.suggested_gene + ' and ' + this.state.suggested_cancer
			}
		}

		const tag_colours = {'gene':'#FF9900', 'cancer':'#38E54D', 'drug':'#FDFF00'}

		var relation_table = ''
		const relation_rows = this.state.relations.map(r => 
		<tr><td>{(r.gene>-1) ? this.state.value[r.gene].tokens.join(' ') : 'No Gene'}</td>
		<td>{(r.cancer>-1) ? this.state.value[r.cancer].tokens.join(' ') : 'No Cancer'}</td>
		<td>{(r.drug>-1) ? this.state.value[r.drug].tokens.join(' ') : 'No Drug'}</td>
		<td>{r.evidence_type}</td>
		<td>{r.variant}</td>
		<Button className="w-100 mt-1" onClick={() => this.remove_relation_annotation(r.id)}>Remove</Button></tr>)

		relation_table = <Table striped bordered hover>
			<thead>
				<tr>
					<th className="w-20">Gene</th>
					<th className="w-20">Cancer</th>
					<th className="w-20">Drug</th>
					<th className="w-20">Evidence Type</th>
					<th className="w-20">Variant</th>
					<th className="w-20">Remove Relation</th>
				</tr>
			</thead>
			<tbody>
				{relation_rows}
			</tbody>
		</Table>																			
		
		var relation_contents = ' '
		if (this.state.relations.length>0){
			relation_contents = <div>
						{relation_table}
						<Button className="mt-1 float-right" size="sm" onClick={this.add_annotations_to_db}>
							Annotations Complete
						</Button></div>
						
		}

		const gene_options = this.state.gene_annotations.map(g => <option value={g.value}>{g.text}</option>)
		const cancer_options = this.state.cancer_annotations.map(c => <option value={c.value}>{c.text}</option>)
		const drug_options = this.state.drug_annotations.map(d => <option value={d.value}>{d.text}</option>)
		const variant_options = this.state.variants.map(v => <option value={v.value}>{v.label}</option>)

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
		const variant_selector = <select onChange={this.update_candidate_variant} value={this.state.candidate_variant} className="w-100">{ variant_options }</select>

		const selector_table = <Table striped bordered hover>
		<thead>
			<tr>
				<th className="w-20">Gene</th>
				<th className="w-20">Cancer</th>
				<th className="w-20">Drug</th>
				<th className="w-20">Evidence Type</th>
				<th className="w-20">Variant</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>{ gene_selector }</td>
				<td>{ cancer_selector }</td>
				<td>{ drug_selector }</td>
				<td>{ evidence_selector }</td>
				<td>{ (variant_selector) ? variant_selector : ''}</td>
			</tr>
		</tbody>
		</Table>


		return (
				<div> 

					<div>

						<div className='mb-5'>
							<strong>{ suggestion }</strong>
						</div>

						<select
							onChange={this.update_tag}
							value={this.state.tag}
							className="mb-2"
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

						<h5 className="mt-1 float-left">{ this.state.error_message }</h5>

						<Button className="mt-1 mb-2 float-right" size="sm" onClick={this.add_relation_annotation}>
							Add relation
						</Button>

					</div>
					
					<div>
						
						{relation_contents}
					
					</div>
									
				</div>
		)
	}
}
