import React, { Component } from 'react';
import axios from 'axios';

import AnnotationEditor from '../components/AnnotationEditor.js'
import Layout from '../components/Layout.js'

export default class SearchPage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			entities: false,
			searchResults: [],
		}
			
		this.refreshFromDB = this.refreshFromDB.bind(this);
	}
	
	refreshFromDB() {
		var self = this
		
		var fetchURL = '/api/entityannotation_search'
		const params = {}
		
		axios.get(fetchURL, {
			params: params
		})
		.then(function (response) {
			const entities = response.data
			
			self.setState( {
				entities: entities,
				loaded: true
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
		this.refreshFromDB()
	}
	
	render() {
		if (!this.state.loaded)
			return <>Loading...</>
		
		const editors = this.state.entities.map( (e,i) => <div key={'editor_'+e.sentenceId} className="card shadow mb-4">
						<div className="card-body">
							<AnnotationEditor editorkey={'editor_'+i} sentenceId={e.sentenceId} showMetadata={true} />
						</div>
					</div> )

		return <Layout title="Woot!" page="/faqs" >
			
					{/* Page Heading */}
					<div className="d-sm-flex align-items-center justify-content-between mb-4 titlepadding">
						<h1 className="h3 mb-0 text-gray-800">Annotation Editor Demo</h1>
						
					</div>
					

					
							{editors}
						
					

				</Layout>
	}
}

