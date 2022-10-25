import React, { Component } from 'react';
import Link from 'next/link'
import axios from 'axios';
import Select from 'react-select'

import Table from 'react-bootstrap/Table'

import Layout from '../components/Layout.js'


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

		

	}


	getGenes() {

		var self = this
		
		axios.get('http://127.0.0.1:5000/get_genes')
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
		
		axios.get('http://127.0.0.1:5000/get_cancers')
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
		
		axios.get('http://127.0.0.1:5000/get_drugs')
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

	getEvidenceTypes() {

		var self = this
		
		axios.get('http://127.0.0.1:5000/get_evidence_types')
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
		
		axios.get('http://127.0.0.1:5000/get_variants')
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

	
	handleGeneClick(e){
		this.setState({gene:e.label})
	}

	handleCancerClick(e){
		this.setState({cancer:e.label})
	}

	handleDrugClick(e){
		this.setState({drug:e.label})
	}

	handleEvidenceTypeClick(e){
		this.setState({evidenceType:e.label})
	}

	handleVariantClick(e){
		this.setState({variant:e.label})
	}


	render() {

		

		return (
				<div>
					<div>
						Gene
						<Select options={this.state.genes} onChange={this.handleGeneClick.bind(this)}/>
					</div>
					<div>
						Cancer
						<Select options={this.state.cancers} onChange={this.handleCancerClick.bind(this)}/>

					</div>
					<div>
						Drug
						<Select options={this.state.drugs} onChange={this.handleDrugClick.bind(this)}/>

					</div>
					<div>
						Evidence Type
						<Select options={this.state.evidenceTypes} onChange={this.handleEvidenceTypeClick.bind(this)}/>

					</div>
					<div>
						Variant
						<Select options={this.state.variants} onChange={this.handleVariantClick.bind(this)}/>

					</div>
					<div>
						<Link href={"/collated/0-9/" + this.state.gene + '/' + this.state.cancer + '/' + this.state.drug + '/' + this.state.evidenceType + '/' + this.state.variant + '/'}><a>Apply filters</a></Link>
					</div>
				</div>
				
					
				

		)
	}
}





