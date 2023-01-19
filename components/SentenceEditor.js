import React, { Component } from 'react';
import axios from 'axios';

import {TokenAnnotator, TextAnnotator} from 'react-text-annotate'

import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import Router from 'next/router';
import { LocalConvenienceStoreOutlined, ThreeSixtySharp } from '@material-ui/icons';
 

export default class SentenceEditor extends Component {

	constructor(props) {
		super(props)
		this.state = {
			tag: 'gene',
			value: [],
			gene_annotations: [{text:'No Gene', value:-1, single_text:'No Entity'}],
			cancer_annotations: [{text:'No Cancer', value:-1, single_text:'No Entity'}],
			drug_annotations: [{text:'No Drug', value:-1, single_text: 'No Entity'}],
			variant_annotations: [{text:'No Variant', value:-1, single_text:'No Entity'}],
			candidate_gene: -1,
			candidate_cancer: -1,
			candidate_drug: -1,		
			candidate_evidence_type: 'diagnostic',
			candidate_variant: 'No Variant',
			candidate_annotation_variant: 'No Variant',
			candidate_variant_group: 'No Variant Group',
			candidate_entity_type: 0,
			relations: [],
			variants: [],
			error_message: '',
			entity_links: [],
			variant_entities: [],
			genes: [],
			cancers: [],
			drugs: [],

			candidate_entity_text: 'No Entity',
			candidate_true_entity_name: 'No Name', 
		}


		this.getGenes = this.getGenes.bind(this);
		this.getCancers = this.getCancers.bind(this);
		this.getDrugs = this.getDrugs.bind(this);
		this.getVariantEntities = this.getVariantEntities.bind(this);

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
		this.update_candidate_entity_type = this.update_candidate_entity_type.bind(this)
		this.update_candidate_entity_text = this.update_candidate_entity_text.bind(this)
		this.update_candidate_true_entity_name = this.update_candidate_true_entity_name.bind(this)

		this.add_relation_annotation = this.add_relation_annotation.bind(this)
		this.remove_relation_annotation = this.remove_relation_annotation.bind(this)

		this.add_entity_link = this.add_entity_link.bind(this)
		this.remove_entity_link = this.remove_entity_link.bind(this)

		this.get_gene_synonym = this.get_gene_synonym.bind(this)
		this.get_cancer_synonym = this.get_cancer_synonym.bind(this)
		this.get_drug_synonym = this.get_drug_synonym.bind(this)
		this.get_variant_synonym = this.get_variant_synonym.bind(this)

		this.add_annotations_to_db = this.add_annotations_to_db.bind(this)
		this.add_user_annotation_to_db = this.add_user_annotation_to_db.bind(this)
		this.add_relation_annotations_to_db = this.add_relation_annotations_to_db.bind(this)
		this.add_entity_annotation_to_db = this.add_entity_annotation_to_db.bind(this)
		this.add_entity_links_to_db = this.add_entity_links_to_db.bind(this)

		this.get_other_user_annotations = this.get_other_user_annotations.bind(this)

	}

	getGenes() {

		var self = this
		
		axios.get('/api/get_data/get_genes')
			.then(function (response) {
				const res = response.data
				var genes = []
				res.forEach(element => {
					genes.push({'value':element, 'label':element})
				});
				self.setState({
					genes: genes,
				})
			})
			.catch(function (error) {
				console.log(error);
			})
			.then(function () {
				// always executed
			});
	}


	getCancers() {

		var self = this
		
		axios.get('/api/get_data/get_cancers')
			.then(function (response) {
				const res = response.data
				var cancers = []
				res.forEach(element => {
					cancers.push({'value':element, 'label':element})
				});
				self.setState({
					cancers: cancers,	
				})
			})
			.catch(function (error) {
				console.log(error);
			})
			.then(function () {
				// always executed
			});
	}


	getDrugs() {

		var self = this
		
		axios.get('/api/get_data/get_drugs')
			.then(function (response) {
				const res = response.data
				var drugs = []
				res.forEach(element => {
					drugs.push({'value':element, 'label':element})
				});
				self.setState({
					drugs: drugs,
				})
			})
			.catch(function (error) {
				console.log(error);
			})
			.then(function () {
				// always executed
			});
	}


	getVariantEntities() {

		var self = this
		
		axios.get('/api/get_data/get_variants')
			.then(function (response) {
				const res = response.data
				var variant_entities = []
				res.forEach(element => {
					variant_entities.push({'value':element, 'label':element})
				});				
				self.setState({
					variant_entities: variant_entities,
				})
			})
			.catch(function (error) {
				console.log(error);
			})
			.then(function () {
				// always executed
			});
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
					

					if (drug!='No Drug'){
						self.setState({
							suggested_drug: drug,
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
				axios.get('/api/get_data/get_synonym?drug='+ item['tokens'].join(' '))
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
				
				axios.get('/api/get_data/get_synonym?variant='+ item['tokens'].join(' '))
				.then(function (response) {
					const res = response.data
					if (res.length==2){
						variant_annotations.push({text: item['tokens'].join(' ') + ' (' + res[1] + ')', value:index, 'single_text': item['tokens'].join(' ')})
						self.setState({
							variant_annotations: variant_annotations
						})
					}else{
						variant_annotations.push({text: item['tokens'].join(' ') + ' (no synonym)', value:index, 'single_text': item['tokens'].join(' ')})
						self.setState({
							variant_annotations: variant_annotations
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

	update_candidate_entity_type(e){
		
		var self = this

		self.setState({
			candidate_entity_type: e.target.value
		})

	}


	update_candidate_entity_text(e){
		var self = this

		self.setState({
			candidate_entity_text: e.target.value
		})

	}


	update_candidate_true_entity_name(e){
		var self = this

		self.setState({
			candidate_true_entity_name: e.target.value
		})
	}


	get_variant_synonym(){

		var self = this

		var variant_text = ''
		this.state.variant_annotations.forEach(function(item){
			if (item['value']==self.state.candidate_annotation_variant){
				variant_text = item['single_text']
			}
		})

		if (typeof variant_text == 'undefined'){
			variant_text = 'unknown'
		}

		var fetchURL = '/api/get_data/get_synonym'

		var params = {variant: variant_text}

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
						'variant': self.state.candidate_annotation_variant,
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
						'variant': self.state.candidate_annotation_variant,
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


	add_entity_link(){
		
		var self = this

		const entity_types = ['Gene', 'Cancer', 'Drug', 'Variant']

		var entity_links = self.state.entity_links
		entity_links.push({id:entity_links.length, entity_type:entity_types[self.state.candidate_entity_type], entity_text: self.state.value[self.state.candidate_entity_text].tokens.join(' '), true_name: self.state.candidate_true_entity_name})
		self.setState({
			entity_links: entity_links
		})
	
	}

	remove_entity_link(id){
		var entity_links = this.state.entity_links

		entity_links.forEach(function(item, index){
			if (item['id']==id){
				entity_links.splice(index, 1)
			}
		})

		entity_links.forEach(function(item, index){
			item['id'] = index
		})

		this.setState({
			entity_links: entity_links
		})
	}


	add_entity_annotation_to_db(relation_annotation_id, entity_annotation_id){
		var entity_type_ids = {'gene':1, 'cancer':2, 'drug':3, 'variant':4}
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

						if (typeof item.variant == 'string'){
							self.add_entity_annotation_to_db(relation_annotation_id, item.variant)
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
				self.add_entity_links_to_db()
			},
			function(error) {

			}
			);
	}


	add_entity_links_to_db(){
		var self = this
		
		let promise = new Promise(function(resolve, reject) {
			self.state.entity_links.forEach(function(item, index){

				var fetchURL = '/api/update_data/add_entity_link'
		
				var params = {entity_type:item.entity_type, entity_text: item.entity_text, true_name: item.true_name}
				
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
		this.getGenes()
		this.getCancers()
		this.getDrugs()
		this.getVariantEntities()	
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
		<td>{(r.variant>-1) ? this.state.value[r.variant].tokens.join(' ') : 'No Variant'}</td>
		<td>{r.evidence_type}</td>
		<Button className="w-100 mt-1" onClick={() => this.remove_relation_annotation(r.id)}>Remove</Button></tr>)

		relation_table = <Table striped bordered hover>
			<thead>
				<tr>
					<th className="w-20">Gene</th>
					<th className="w-20">Cancer</th>
					<th className="w-20">Drug</th>
					<th className="w-20">Variant</th>
					<th className="w-20">Evidence Type</th>
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
						</div>
						
		}

		const annotations_complete_button = <Button className="mt-1 float-right" size="md" onClick={this.add_annotations_to_db}>
												Annotations Complete
											</Button>

		const gene_options = this.state.gene_annotations.map(g => <option value={g.value}>{g.text}</option>)
		const cancer_options = this.state.cancer_annotations.map(c => <option value={c.value}>{c.text}</option>)
		const drug_options = this.state.drug_annotations.map(d => <option value={d.value}>{d.text}</option>)
		const variant_annotation_options = this.state.variant_annotations.map(v => <option value={v.value}>{v.text}</option>)

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
		const variant_annotation_selector = <select onChange={this.update_candidate_annotation_variant} value={this.state.candidate_annotation_variant} className="w-100">{ variant_annotation_options }</select>

		const relation_selector_table = <Table striped bordered hover>
		<thead>
			<tr>
				<th className="w-20">Gene</th>
				<th className="w-20">Cancer</th>
				<th className="w-20">Drug</th>
				<th className="w-20">Variant</th>
				<th className="w-20">Evidence Type</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>{ gene_selector }</td>
				<td>{ cancer_selector }</td>
				<td>{ drug_selector }</td>
				<td>{variant_annotation_selector }</td>
				<td>{ evidence_selector }</td>
			</tr>
		</tbody>
		</Table>


		const entity_types = [{text:'Gene', value:0}, {text:'Cancer', value:1}, {text:'Drug', value:2}, {text:'Variant', value:3}]
		const entity_type_options = entity_types.map(e => <option value={e.value}>{e.text}</option>)
		const entity_type_selector = <select onChange={this.update_candidate_entity_type} value={this.state.candidate_entity_type} className="w-100">{ entity_type_options }</select>
		

		const gene_entity_options = this.state.gene_annotations.map(g => <option value={g.value}>{g.single_text}</option>)
		const cancer_entity_options = this.state.cancer_annotations.map(c => <option value={c.value}>{c.single_text}</option>)
		const drug_entity_options = this.state.drug_annotations.map(d => <option value={d.value}>{d.single_text}</option>)
		const variant_annotation_entity_options = this.state.variant_annotations.map(v => <option value={v.value}>{v.single_text}</option>)
	
		var text_options = []
		var true_entity_options = []
		if(this.state.candidate_entity_type==0){
			text_options = gene_entity_options
			true_entity_options = this.state.genes
		}else if (this.state.candidate_entity_type==1){
			text_options = cancer_entity_options
			true_entity_options = this.state.cancers
		}else if (this.state.candidate_entity_type==2){
			text_options = drug_entity_options
			true_entity_options = this.state.drugs
		}else if (this.state.candidate_entity_type==3){
			text_options = variant_annotation_entity_options
			true_entity_options = this.state.variant_entities
		}

		
		const true_entity_options_list = true_entity_options.map(e => <option value={e.value}>{e.label}</option>)
		
		var entity_text_selector = <select onChange={this.update_candidate_entity_text} value={this.state.candidate_entity_text} className="w-100">{ text_options }</select>
		var true_entity_selector = <select onChange={this.update_candidate_true_entity_name} value={this.state.candidate_true_entity_name} className="w-100">{ true_entity_options_list }</select>

		const entity_link_table = <Table striped bordered hover>
			<thead>
				<tr>
					<th className="w-25">Entity Type</th>
					<th className="w-25">Entity Text</th>
					<th className="w-25">Real Name</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>{ entity_type_selector }</td>
					<td>{ entity_text_selector }</td>
					<td>{ true_entity_selector }</td>
				</tr>
			</tbody>
		</Table>

		var entity_link_review_table = ''
		const entity_link_rows = this.state.entity_links.map(e => 
		<tr>
		<td>{e.entity_type}</td>
		<td>{e.entity_text}</td>
		<td>{e.true_name}</td>
		<Button className="w-100 mt-1" onClick={() => this.remove_entity_link(e.id)}>Remove</Button></tr>)

		entity_link_review_table = <Table striped bordered hover>
		<thead>
			<tr>
				<th className="w-25">Entity Type</th>
				<th className="w-25">Entity Text</th>
				<th className="w-25">Real Name</th>
			</tr>
		</thead>
		<tbody>
			{entity_link_rows}
		</tbody>
		</Table>

		var entity_link_contents = ' '
		if (this.state.entity_links.length>0){
			entity_link_contents = <div>
						{entity_link_review_table}
						</div>			
		}


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
						<div className="mt-5 w-100 float-left">

							{ relation_selector_table }

							<h5 className="mt-1 float-left">{ this.state.error_message }</h5>

							<Button className="mb-3 float-right" size="md" onClick={this.get_gene_synonym}>
								Add Relation
							</Button>

							<div className="mt-5">
								{ relation_contents }
							</div>

						</div>

						<div className="mt w-100 float-right">
							<div className="mt-5">

								{ entity_link_table }	

								<Button className="mb-3 float-right" size="md" onClick={this.add_entity_link}>
									Add Entity Link
								</Button>		

								<div className="mt-5">
									{ entity_link_contents }
								</div>


							</div>
						</div>
					</div>

					

					
					
				</div>
		)
	}
}
