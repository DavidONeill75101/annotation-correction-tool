import React, { Component } from 'react';
import axios from 'axios';

import NLPAnnotator from "react-nlp-annotate";


const entity_labels = [
	{
	  id: 1,
	  displayName: "Gene",
	  description: "Definition of a gene"
	},
	{
		id: 2,
		displayName: "Drug",
		description: "Definition of a drug"
	},
	{
	  id: 3,
	  displayName: "Cancer",
	  description: "Definition of a cancer"
	},
	
  ];

  const relation_labels = [
	{
	  id: 1,
	  displayName: "Diagnostic",
	  description: "Definition of diagnostic"
	},
	{
	  id: 2,
	  displayName: "Predisposing",
	  description: "Definition of predisposing"
	},
	{
		id: 3,
		displayName: "Predictive",
		description: "Definition of predictive"
	},
	{
		id: 4,
		displayName: "Prognostic",
		description: "Definition of prognostic"
	 },
  ];


export default class SentenceEditor extends Component {

	constructor(props) {
		super(props)
		this.state = {
			annotated_sentence_id: 0,
			relation_map: {},
			relation_id: 0
			
		}
		
		this.addAnnotationsToDB = this.addAnnotationsToDB.bind(this)
		
	}

	addRelationAnnotationsToDB(output, id){

	}


	addAnnotationsToDB(output){
		console.log(output)

		var self = this

		var fetchSentenceURL = '/api/update_data/add_annotated_sentence'
		var sentenceParams = {text: this.props.sentence}


		axios.get(fetchSentenceURL, {
			params: sentenceParams
		})
		.then(function (response) {
				const annotation_sentence = response.data

				self.setState({
					annotated_sentence_id: annotation_sentence.id
				})
				
				if (output.relationships){
					var relation_map = {}
					output.relationships.forEach((relationship) => {
						
						var fetchRelationsURL = '/api/update_data/add_relation_annotation'
						var relationParams = {
							sentence_id: annotation_sentence.id,
							relation_type_id: relationship.label,
						}
		
						axios.get(fetchRelationsURL, {
							params: relationParams
						})
						.then(function (response) {
							const relation = response.data

							relation_map[relation.id] = [relationship.from, relationship.to]
							

							})
							.catch(function (error) {
								console.log(error);
							})
							.then(function () {
								// always executed
							});
					});
					self.setState({
						relation_map: relation_map,
					})
				}
			})
			.catch(function (error) {
				console.log(error);
			})
			.then(function () {
				

				if (output.sequence){
					var fragments = []
	
					output.sequence.forEach((entity) => {
						if (entity['text'] != ' '){
							fragments.push(entity)
						}
					})
	
					fragments.forEach((entity, index) => {
						if ('label' in entity && entity['label']){
	
	
							var start = 0
							for (var i=0; i<index; i++){
								start = start + fragments[i].text.length + 1
							}
							
							// get relation_id						
							
							var fetchEntityURL = '/api/update_data/add_entity_annotation'
							var entityParams = {start: start, sentence_id: self.state.annotated_sentence_id, entity_type_id: entity['label'], offset: entity['text'].length, relation_annotation_id: 68}
	
							axios.get(fetchEntityURL, {
								params: entityParams
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
					})
				}
			});		

			

			
		
	}

	render() {

		return (
				<div> 
					
					<div>
						<NLPAnnotator
							hotkeysEnabled
							type="label-relationships"
							multipleLabels={false}
							document={this.props.sentence}
							onFinish={this.addAnnotationsToDB}
							entityLabels={entity_labels}
							relationshipLabels={relation_labels}
						/>
					</div> 

				</div>
		)
	}
}
