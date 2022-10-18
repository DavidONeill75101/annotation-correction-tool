import React, { Component } from 'react';
import { withRouter, useRouter } from 'next/router'
import axios from 'axios';

import AnnotationEditor from '../../components/AnnotationEditor.js'
import Layout from '../../components/Layout.js'

class Page extends Component {
	constructor(props) {
		super(props)
		this.state = {
			searchResults: false
		}
			
		this.refreshFromDB = this.refreshFromDB.bind(this);
	}
	
	refreshFromDB() {
		var self = this
		
		const query = this.props.query.join('/')
		
		var fetchURL = '/api/sentencesearch'
		const params = {q:query}
		
		axios.get(fetchURL, {
			params: params
		})
		.then(function (response) {
			const sentences = response.data
			
			self.setState( {
				searchResults: sentences
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
	
	componentDidUpdate(prevProps) {
		if (this.props.query != prevProps.query) {
			this.refreshFromDB()
			console.log('update!')
		}
	}
	
	render() {
		if (this.state.searchResults === false)
			return <>Loading...</>
		
		const editors = this.state.searchResults.map( (e,i) => <div key={'editor_'+e.id} className="card shadow mb-4">
						<div className="card-body">
							<AnnotationEditor editorkey={'editor_'+i} sentenceId={e.id} showMetadata={true} noHeaders={true} />
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

//export default withRouter(Page)

const PageWithRouter = (props) => {
	const router = useRouter()
	if (router.isReady)
		return <Page {...props} query={router.query.query} />
	else
		return <></>
}

export default PageWithRouter
