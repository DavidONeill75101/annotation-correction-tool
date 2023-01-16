import React, { Component } from 'react';
import axios from 'axios';

import {TokenAnnotator, TextAnnotator} from 'react-text-annotate'

import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import Router from 'next/router';
import { ThreeSixtySharp } from '@material-ui/icons';
 

export default class SentenceEditor extends Component {

	constructor(props) {
		super(props)
		this.state = {
			tag: 'gene',
			value: [],
			gene_annotations: [{text:'No Gene', value:-1}],
			cancer_annotations: [{text:'No Cancer', value:-1}],
			drug_annotations: [{text:'No Drug', value:-1}],
			variant_annotations: [{label:'No Variant', value:-1}],
			candidate_gene: -1,
			candidate_cancer: -1,
			candidate_drug: -1,		
			candidate_evidence_type: 'diagnostic',
			candidate_variant: 'No Variant',
			candidate_annotation_variant: 'No Variant',
			candidate_variant_group: 'No Variant Group',
			relations: [],
			variants: [],
			error_message: '',
			variant_relations: [],
		}

		this.get_variants = this.get_variants.bind(this)
		
		this.update_value = this.update_value.bind(this)
		this.update_tag = this.update_tag.bind(this)

		this.update_candidate_gene = this.update_candidate_gene.bind(this)
		this.update_candidate_cancer = this.update_candidate_cancer.bind(this)
		this.update_candidate_drug = this.update_candidate_drug.bind(this)
		this.update_candidate_evidence_type = this.update_candidate_evidence_type.bind(this)
		this.update_candidate_variant = this.update_candidate_variant.bind(this)
		this.update_candidate_annotation_variant = this.update_candidate_annotation_variant.bind(this)
		this.update_candidate_variant_group = this.update_candidate_variant_group.bind(this)

		this.add_relation_annotation = this.add_relation_annotation.bind(this)
		this.remove_relation_annotation = this.remove_relation_annotation.bind(this)

		this.add_variant = this.add_variant.bind(this)
		this.remove_variant = this.remove_variant.bind(this)

		this.get_gene_synonym = this.get_gene_synonym.bind(this)
		this.get_cancer_synonym = this.get_cancer_synonym.bind(this)
		this.get_drug_synonym = this.get_drug_synonym.bind(this)
		this.get_variant_synonym = this.get_variant_synonym.bind(this)

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
		var variant_annotations = [{text:'No Variant', value: -1}]

		value.forEach(function(item, index){

			if (item['tag']=='gene'){
				const fetchURL = '/api/get_data/get_synonym?gene='+ item['tokens'].join(' ')
				
				axios.get(fetchURL)
				.then(function (response) {
					const res = response.data

					if (res.length==2){
						gene_annotations.push({text: item['tokens'].join(' ') + ' (' + res[1] + ')', value:index, 'single_text': item['tokens'].join(' ')})
						self.setState({
							gene_annotations: gene_annotations
						})
					}else{
						gene_annotations.push({text: item['tokens'].join(' ') + ' (no synonym)', value:index, 'single_text': item['tokens'].join(' ')})
						self.setState({
							gene_annotations: gene_annotations
						})
					}
					
				})
				.catch(function (error) {
					console.log(error);
				})
				.then(function () {
					// always executed
					

				});
			}else if (item['tag']=='cancer'){
				axios.get('/api/get_data/get_synonym?cancer='+ item['tokens'].join(' '))
				.then(function (response) {
					const res = response.data
					if (res.length==2){
						cancer_annotations.push({text: item['tokens'].join(' ') + ' (' + res[1] + ')', value:index, 'single_text': item['tokens'].join(' ')})
						self.setState({
							cancer_annotations: cancer_annotations
						})
					}else{
						cancer_annotations.push({text: item['tokens'].join(' ') + ' (no synonym)', value:index, 'single_text': item['tokens'].join(' ')})
						self.setState({
							cancer_annotations: cancer_annotations
						})
					}
				})
				.catch(function (error) {
					console.log(error);
				})
				.then(function () {
					// always executed
					
				});
			}else if (item['tag']=='drug'){
				axios.get('/api/get_data/get_synonym?cancer='+ item['tokens'].join(' '))
				.then(function (response) {
					const res = response.data
					if (res.length==2){
						drug_annotations.push({text: item['tokens'].join(' ') + ' (' + res[1] + ')', value:index, 'single_text': item['tokens'].join(' ')})
						self.setState({
							drug_annotations: drug_annotations
						})
					}else{
						drug_annotations.push({text: item['tokens'].join(' ') + ' (no synonym)', value:index, 'single_text': item['tokens'].join(' ')})
						self.setState({
							drug_annotations: drug_annotations
						})
					}
				})
				.catch(function (error) {
					console.log(error);
				})
				.then(function () {
					// always executed
					
				});
			}else if (item['tag']=='variant'){
				variant_annotations.push({label: item['tokens'].join(' ') , value:index, 'single_text': item['tokens'].join(' ')})
				self.setState({
					variant_annotations: variant_annotations
				})
				
			}
				
		})
		
		self.setState({
			value: value,
			
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


	update_candidate_annotation_variant(e){
		var self = this

		self.setState({
			candidate_annotation_variant: e.target.value
		})
	}


	update_candidate_variant_group(e){
		var self = this

		self.setState({
			candidate_variant_group: e.target.value
		})
	}


	get_variant_synonym(){
		
		var self = this

		var fetchURL = '/api/get_data/get_synonym'

		var params = {variant: this.state.candidate_variant}

		axios.get(fetchURL, {
			params: params
		})
		.then(function (response) {

				var res = response.data
				if(res=='no synonym'){
					self.setState({
						current_variant_id: 41
					})
				}else{
					self.setState({
						current_variant_id: res[0]
					})
				}
			})
			.catch(function (error) {
				console.log(error);
			})
			.then(function () {
				// always executed
				self.add_relation_annotation()
			});
	}

	get_drug_synonym(){
		
		var self = this

		var drug_text = ''
		this.state.drug_annotations.forEach(function(item){
			if (item['value']==self.state.candidate_drug){
				drug_text = item['single_text']
			}
		})

		if (typeof drug_text == 'undefined'){
			drug_text = 'unknown'
		}

		var fetchURL = '/api/get_data/get_synonym'

		var params = {drug: drug_text}

		axios.get(fetchURL, {
			params: params
		})
		.then(function (response) {

				var res = response.data
				if(res=='no synonym'){
					self.setState({
						current_drug_id: 22674
					})
				}else{
					self.setState({
						current_drug_id: res[0]
					})
				}
			})
			.catch(function (error) {
				console.log(error);
			})
			.then(function () {
				// always executed
				self.get_variant_synonym()
			});
	}


	get_cancer_synonym(){
		
		var self = this

		var cancer_text = ''
		this.state.cancer_annotations.forEach(function(item){
			if (item['value']==self.state.candidate_cancer){
				cancer_text = item['single_text']
			}
		})

		if (typeof cancer_text == 'undefined'){
			cancer_text = 'unknown'
		}

		var fetchURL = '/api/get_data/get_synonym'

		var params = {cancer: cancer_text}

		axios.get(fetchURL, {
			params: params
		})
		.then(function (response) {

				var res = response.data
				if(res=='no synonym'){
					self.setState({
						current_cancer_id: 2058
					})
				}else{
					self.setState({
						current_cancer_id: res[0]
					})
				}
			})
			.catch(function (error) {
				console.log(error);
			})
			.then(function () {
				// always executed
				self.get_drug_synonym()
			});

	}

	get_gene_synonym(){
		
		var self = this

		var gene_text = ''
		this.state.gene_annotations.forEach(function(item){
			if (item['value']==self.state.candidate_gene){
				gene_text = item['single_text']
			}
		})

		if (typeof gene_text == 'undefined'){
			gene_text = 'unknown'
		}

		var fetchURL = '/api/get_data/get_synonym'

		var params = {gene: gene_text}

		axios.get(fetchURL, {
			params: params
		})
		.then(function (response) {

				var res = response.data
				if(res=='no synonym'){
					self.setState({
						current_gene_id: 19370
					})
				}else{
					self.setState({
						current_gene_id: res[0]
					})
				}
			})
			.catch(function (error) {
				console.log(error);
			})
			.then(function () {
				// always executed
				self.get_cancer_synonym()
			});

	}


	add_relation_annotation(){

		var self = this

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
						'gene_id': self.state.current_gene_id,
						'cancer_id': self.state.current_cancer_id,
						'drug_id': self.state.current_drug_id,
						'variant_id': self.state.current_variant_id
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
						'gene_id': self.state.current_gene_id,
						'cancer_id': self.state.current_cancer_id,
						'drug_id': self.state.current_drug_id,
						'variant_id': self.state.current_variant_id
					})

						self.setState({
							relations: relations,
							error_message: '',
						})
		
		}else{
			self.setState({
				error_message: 'Invalid Relation - see annotation guide for further details of valid relations'
			})
		}
		
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


	add_variant(){
		
		var self = this

		var variant_relations = self.state.variant_relations

		variant_relations.push({id:variant_relations.length, variant: self.state.candidate_annotation_variant, variant_group: self.state.candidate_variant_group})

		self.setState({
			variant_relations: variant_relations
		})

	}

	remove_variant(id){
		var variant_relations = this.state.variant_relations

		variant_relations.forEach(function(item, index){
			if (item['id']==id){
				variant_relations.splice(index, 1)
			}
		})

		variant_relations.forEach(function(item, index){
			item['id'] = index
		})

		this.setState({
			variant_relations: variant_relations
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
				// Router.back()
				self.add_variant_annotations_to_db()
			},
			function(error) {

			}
			);
	}


	add_variant_annotations_to_db(){
		var self = this
		
		let promise = new Promise(function(resolve, reject) {
			self.state.variant_relations.forEach(function(item, index){

				var fetchURL = '/api/update_data/add_variant_annotation'
		
				var params = {user_annotation_id:self.state.user_annotation_id, variant_name: self.state.value[item.variant].tokens.join(' '), variant_group: item.variant_group}
				
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

		const tag_colours = {'gene':'#FF9900', 'cancer':'#38E54D', 'drug':'#FDFF00', 'variant':'#00dfff'}

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
		

		var variant_relation_table = ''
		const variant_relation_rows = this.state.variant_relations.map(v => 
		<tr><td>{this.state.value[v.variant].tokens.join(' ')}</td>
		<td>{v.variant_group}</td>
		<Button className="w-100 mt-1" onClick={() => this.remove_variant(v.id)}>Remove</Button>
		</tr>)

		variant_relation_table = <Table striped bordered hover>
		<thead>
			<tr>
				<th className="w-20">Variant</th>
				<th className="w-20">Variant Group</th>
			</tr>
		</thead>
		<tbody>
			{variant_relation_rows}
		</tbody>
		</Table>	

		var variant_relation_contents = ' '
		if (this.state.variant_relations.length>0){
			variant_relation_contents = <div>
				{variant_relation_table}
			</div>
		}




		var relation_contents = ' '
		if (this.state.relations.length>0){
			relation_contents = <div>
						{relation_table}
						<Button className="mt-1 float-right" size="md" onClick={this.add_annotations_to_db}>
							Annotations Complete
						</Button></div>
						
		}

		var annotation_contents = ' '
		if (this.state.relations.length > 0 && this.state.variant_relations.length > 0){
			annotation_contents = <div>
				<div className="float-left mt-3 w-50">
					{relation_table}
				</div>
				<div className="float-right mt-3 w-30">
					{variant_relation_table}
				</div>
				<br></br>
				{/* <Button className="mt-1 float-right" size="md" onClick={this.add_annotations_to_db}>
							Annotations Complete
				</Button> */}
			</div>
		}else if (this.state.relations.length > 0 && this.state.variant_relations.length == 0){
			annotation_contents = <div>
				<div className="float-left mt-3 w-50">
					{relation_table}
				</div>
				{/* <div className="float-right mt-3 w-50">
					{variant_relation_table}
				</div> */}
				<br></br>
				{/* <Button className="mt-1 float-right" size="md" onClick={this.add_annotations_to_db}>
							Annotations Complete
				</Button> */}
			</div>
		}else if (this.state.relations.length == 0 && this.state.variant_relations.length > 0){
			annotation_contents = <div>
				{/* <div className="float-left mt-3 w-50">
					{relation_table}
				</div> */}
				<div className="float-right mt-3 w-30">
					{variant_relation_table}
				</div>
				<br></br>
				{/* <Button className="mt-1 float-right" size="md" onClick={this.add_annotations_to_db}>
							Annotations Complete
				</Button> */}
			</div>
		}

		const annotations_complete_button = <Button className="mt-1 float-right" size="md" onClick={this.add_annotations_to_db}>
												Annotations Complete
											</Button>

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
				<th className="w-20">Variant Group</th>
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



		const variant_annotation_options = this.state.variant_annotations.map(v => <option value={v.value}>{v.label}</option>)
		const variant_group_options = this.state.variants.map(v => <option value={v.value}>{v.label}</option>)

		const variant_annotation_selector = <select onChange={this.update_candidate_annotation_variant} value={this.state.candidate_annotation_variant} className="w-100">{ variant_annotation_options }</select>
		const variant_group_selector = <select onChange={this.update_candidate_variant_group} value={this.state.candidate_variant_group} className="w-100">{ variant_group_options }</select>

		const variant_selector_table = <Table striped bordered hover>
		<thead>
			<tr>
				<th className="w-20">Variant</th>
				<th className="w-20">Variant Group</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>{ (variant_annotation_selector) ? variant_annotation_selector : ''}</td>
				<td>{ (variant_group_selector) ? variant_group_selector : ''}</td>
			</tr>
		</tbody>
		</Table>

		const tag_selector = <select
									onChange={this.update_tag}
									value={this.state.tag}
									className="mb-2"
								>
									<option value="gene">gene</option>
									<option value="cancer">cancer</option>
									<option value="drug">drug</option>
									<option value="variant">variant</option>
								</select>


		return (
				<div> 

					

						<div className='mb-5'>
							<strong>{ suggestion }</strong>
						</div>

						
						<div className='mb-3'>
							<div className="float-left">
								<strong>Select an entity type before highlighting text: { tag_selector }</strong>
							</div>
							<div className="float-right">
								{ annotations_complete_button }
							</div>
						</div>

						<br></br>
						<br></br>
						<br></br>
						
						<div className="mt-3">
							<TokenAnnotator
							tokens={this.props.sentence.split(/([_\W])/).filter(i => i!=' ')}
							value={this.state.value}
							onChange={this.update_value}
							getSpan={span => ({

								...span,
								tag: this.state.tag,
								color: tag_colours[this.state.tag],
							})}
							/>
						</div>
					

					<div>
						<div className="mt-5 w-50 float-left">

							{ selector_table }

							<h5 className="mt-1 float-left">{ this.state.error_message }</h5>

							<Button className="mb-3 float-right" size="md" onClick={this.get_gene_synonym}>
								Add Biomarker Relation
							</Button>

						</div>

						<div className="mt w-30 float-right">
							<div className="mt-5">

								{ variant_selector_table }	

								<Button className="mt-4 mb-3 float-right" size="md" onClick={this.add_variant}>
									Add Variant
								</Button>		

							</div>
						</div>
					</div>

					
					
					{/* <div className="mt-5 w-50 float-left">
						
						{relation_contents}
					
					</div>

					<div className="mt-5 w-50 float-right">
						
						{variant_relation_contents}
					
					</div> */}

					<div className="mt-5">
						{ annotation_contents }
					</div>

					
				</div>
		)
	}
}
