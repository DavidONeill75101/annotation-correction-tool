import React, { Component } from 'react';
import axios from 'axios';
import NLPAnnotator from "react-nlp-annotate";


const entity_labels = [
	{
	  id: 'Gene',
	  displayName: "Gene",
	  description: "Definition of a gene"
	},
	{
	  id: "Cancer",
	  displayName: "Cancer",
	  description: "Definition of a cancer"
	},
	{
	   id: "Drug",
	   displayName: "Drug",
	   description: "Definition of a drug"
	}
  ];


  const relation_labels = [
	{
	  id: 'Diagnostic',
	  displayName: "Diagnostic",
	  description: "Definition of diagnostic"
	},
	{
	  id: "Predisposing",
	  displayName: "Predisposing",
	  description: "Definition of predisposing"
	},
	{
		id: "Predictive",
		displayName: "Predictive",
		description: "Definition of predictive"
	},
	{
		id: "Prognostic",
		displayName: "Prognostic",
		description: "Definition of prognostic"
	 },
  ];


export default class SentenceEditor extends Component {

	constructor(props) {
		super(props)
		
	}

	render() {

		console.log(this.props.sentence)		
		return (
				<div> 
					
					<div>
						<NLPAnnotator
							hotkeysEnabled
							type="label-relationships"
							multipleLabels={false}
							document={this.props.sentence}
							onChange={(output) => {
							
							}}
							onFinish={(output) => {
							console.log(output)
							}}
								entityLabels={entity_labels}
							relationshipLabels={relation_labels}
						/>
					</div> 

				</div>
		)
	}
}
