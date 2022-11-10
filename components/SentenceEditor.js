import React, { Component } from 'react';
import SelectionHighlighter from 'react-highlight-selection';
import ReactDOM from "react-dom";
import axios from 'axios';
import parse from 'html-react-parser'





export default class SentenceEditor extends Component {

	constructor(props) {
		super(props)
		this.state = {
			
			}
				
		this.selectionHandler = this.selectionHandler.bind(this);
		this.refreshEntityAnnotations = this.refreshEntityAnnotations.bind(this);
		this.refreshSentenceFromDB = this.refreshSentenceFromDB.bind(this);
	}

	selectionHandler(selection){
		//pass
	}



	refreshEntityAnnotations(){
		var self = this
		const fetchURL = '/api/get_data/get_entity_annotations'
		var params = {sentence_id:this.props.sentence_id}

		axios.get(fetchURL, {
			params: params
		})
		.then(function (response) {
				const entity_annotations = response.data
				self.setState({
					entity_annotations: entity_annotations,
					
				})

				
			})
			.catch(function (error) {
				console.log(error);
			})
			.then(function () {
				// always executed
				
				
			});

	}

	refreshSentenceFromDB() {
		var self = this
		
		var fetchURL = '/api/get_data/get_sentence'
		var params = {sentence_id: this.props.sentence_id}
		
		
		axios.get(fetchURL, {
			params: params
		})
		.then(function (response) {
			const sentence = response.data
			
			self.setState( {
				txt: sentence.sentence,
				formatted_txt: sentence.formatted,
			} )

		})
		.catch(function (error) {
			console.log(error);
		})
		.then(function () {
			// always executed
		});  
		

	}


	

	
	componentDidMount(){
		this.refreshSentenceFromDB()
		//this.refreshEntityAnnotations()
	}

	
	

	render() {

		
		
		return (
				<div> 
						<SelectionHighlighter
							text={this.state.formatted_txt}

							selectionHandler={this.selectionHandler}
        
      					/>		
					
				</div>
		)
	}
}
