import React, { Component } from 'react';

import Link from 'next/link'

import axios from 'axios';

import Select from 'react-select'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'

import Button from 'react-bootstrap/Button';
import { Col, Container, Row } from 'react-bootstrap';


export default class Relations extends Component {

	constructor(props) {
		super(props)
		this.state = {
			genes: [],
			cancers: [],
			drugs: [],
			evidenceTypes: [],
			variants: [],
			gene: ' ',
			cancer: ' ',
			drug: ' ',
			evidenceType: ' ',
			variant:' ',			
		}
		
		this.getGenes = this.getGenes.bind(this);
		this.getCancers = this.getCancers.bind(this);
		this.getDrugs = this.getDrugs.bind(this);
		this.getEvidenceTypes = this.getEvidenceTypes.bind(this);
		this.getVariants = this.getVariants.bind(this);
		
		
		this.handleOnGeneSelect = this.handleOnGeneSelect.bind(this);
		this.handleOnCancerSelect = this.handleOnCancerSelect.bind(this);
		this.handleOnDrugSelect = this.handleOnDrugSelect.bind(this);
		this.formatResult = this.formatResult.bind(this);
	}


	getGenes() {

		var self = this
		
		axios.get('/api/get_data/get_genes')
			.then(function (response) {
				const res = response.data
				var genes = []
				res.forEach(function (value, i) {
					genes.push({'id':i, 'name':value})	
				}	)
				
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
				res.forEach(function (value, i) {
					cancers.push({'id':i, 'name':value})	
				}	)
				
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
				res.forEach(function (value, i) {
					drugs.push({'id':i, 'name':value})	
				}	)
				
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


	getEvidenceTypes() {

		var self = this
		
		axios.get('/api/get_data/get_evidence_types')
			.then(function (response) {
				const res = response.data
				var evidenceTypes = []
				res.forEach(element => {
					evidenceTypes.push({'value':element, 'label':element})
				});
				self.setState({
					evidenceTypes: evidenceTypes,
				})
			})
			.catch(function (error) {
				console.log(error);
			})
			.then(function () {
				// always executed
			});
	}


	getVariants() {

		var self = this
		
		axios.get('/api/get_data/get_variants')
			.then(function (response) {
				const res = response.data
				var variants = []
				res.forEach(element => {
					variants.push({'value':element, 'label':element})
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


	componentDidMount() {
		this.getGenes()
		this.getCancers()
		this.getDrugs()
		this.getEvidenceTypes()
		this.getVariants()		
	}


	handleEvidenceTypeClick(e){
		this.setState({evidenceType:e.label})
	}


	handleVariantClick(e){
		this.setState({variant:e.label})
	}


	handleOnGeneSelect(item){
		// the item selected
		this.setState({gene:item.name})
	}


	handleOnCancerSelect(item){
		// the item selected
		this.setState({cancer:item.name})
	}


	handleOnDrugSelect(item){
		// the item selected
		this.setState({drug:item.name})
	}


	formatResult(item){
		return (
		<>
			<span style={{ display: 'block', textAlign: 'left' }}>{item.name}</span>
		</>
		)
	}


	render() {

		var param_string = ''

		if (this.state.gene!=' '){
			param_string = param_string + '&gene=' + this.state.gene
		}

		if (this.state.cancer!=' '){
			param_string = param_string + '&cancer=' + this.state.cancer
		}

		if (this.state.drug!=' '){
			param_string = param_string + '&drug=' + this.state.drug
		}

		if (this.state.evidenceType!=' '){
			param_string = param_string + '&evidence_type=' + this.state.evidenceType
		}

		if (this.state.variant!=' '){
			param_string = param_string + '&variant=' + this.state.variant
		}


		return (
				<div>

					 

					<Container>
						
						<Row>
							<Col>Gene</Col>
							<Col>Cancer</Col>
							<Col>Drug</Col>
							<Col>Evidence Type</Col>
							<Col>Variant</Col>
						</Row>
						
						<Row>

							<Col>
								<ReactSearchAutocomplete
										items={this.state.genes}
										onSelect={this.handleOnGeneSelect}
										placeholder={"Search..."}
										formatResult={this.formatResult}
										showIcon={false}
										styling={
											{
											borderRadius: "5px",
											height: "37px",
											color: "#999999",
											zIndex: 1,
											}
										}
									/>						
							</Col>

							<Col>
								<ReactSearchAutocomplete
									items={this.state.cancers}
									onSelect={this.handleOnCancerSelect}
									placeholder={"Search..."}
									formatResult={this.formatResult}
									showIcon={false}
									styling={
										{
										borderRadius: "5px",
										height: "37px",
										color: "#999999",
										zIndex: 1,									
										}
									}
								/>
							</Col>

							<Col>
								<ReactSearchAutocomplete
									items={this.state.drugs}
									onSelect={this.handleOnDrugSelect}
									placeholder={"Search..."}
									formatResult={this.formatResult}
									showIcon={false}
									styling={
										{
										borderRadius: "5px",
										height: "37px",
										color: "#999999",
										zIndex: 1,
										}
									}
								/>
							</Col>

							<Col><Select options={this.state.evidenceTypes} onChange={this.handleEvidenceTypeClick.bind(this)}/></Col>

							<Col><Select options={this.state.variants} onChange={this.handleVariantClick.bind(this)}/></Col>

						</Row>

						<br></br>

						<Row>
							<Col><Link href={"/collated?range=0-9" + param_string}><a><Button size="md">Apply filters</Button></a></Link></Col>
						</Row>

					</Container>

					
				</div>
		)
	}
}
