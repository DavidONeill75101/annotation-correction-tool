import React, { Component } from 'react';
import Link from 'next/link'

import Layout from '../../../components/Layout.js'
import AnnotationEditor from '../../../components/AnnotationEditor.js'

import { useRouter } from 'next/router'

const Document = () => {
	const router = useRouter()
	const sentenceId = router.query.id
	
	const editor = sentenceId ?  <AnnotationEditor sentenceId={sentenceId} noHeaders={true} /> : <></>

	return <Layout title="Woot!" page="/faqs" >
		
				{/* Page Heading */}
				<div className="d-sm-flex align-items-center justify-content-between mb-4 titlepadding">
					<h1 className="h3 mb-0 text-gray-800">Annotation Editor Demo</h1>
					
				</div>
				

				<div className="card shadow mb-4">
					<div className="card-body">
						{editor}
					</div>
				</div>
				

			</Layout>
}

export default Document
