import React, { Component } from 'react';
import axios from 'axios';

import ReviewEditor from '../../../components/ReviewEditor.js'

import Layout from '../../../components/Layout.js'

import { useRouter } from 'next/router'

const Review = () => {
	
	const router = useRouter()
	const matchingId = router.query.id
	
	const editor = matchingId ?  <ReviewEditor matchingId={matchingId} showMetadata={true} /> : <></>


	return <Layout title="Review" page="/review" >
		
				{/* Page Heading */}
				<div className="d-sm-flex align-items-center justify-content-between mb-4 titlepadding">
					<h1 className="h3 mb-0 text-gray-800">Review Sentences</h1>
					
				
				</div>

				<div className="card shadow mb-4">
					<div className="card-body">
						{editor}
					</div>
				</div>
				


			</Layout>
}

export default Review


