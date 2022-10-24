import React, { Component } from 'react';
import axios from 'axios';

import ReviewEditor from '../../../../../components/ReviewEditor.js'

import Layout from '../../../../../components/Layout.js'

import { useRouter } from 'next/router'
import { useUser } from "@auth0/nextjs-auth0";


const Review = () => {

	const { user, error, isLoading } = useUser();
	const router = useRouter()
	const matchingId = router.query.id
	const range = router.query.range

	var start
	var end

	if (typeof range == "undefined"){
		start = 0
		end = 9
	}else{
		start = range.split('-')[0]
		end = range.split('-')[1]
	}

	const citations = router.query.citations

	
	const editor = user ?  <ReviewEditor matchingId={matchingId} showMetadata={true} start={start} end={end} citations={citations} /> : <div><a href="/api/auth/login">Login</a> to use the tool</div>

	user.app_metadata = user.app_metadata || {};
	
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


