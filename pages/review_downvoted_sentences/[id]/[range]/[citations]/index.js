import React, { Component } from 'react';
import axios from 'axios';

import DownvotedSentences from '../../../../../components/DownvotedSentences.js'

import Layout from '../../../../../components/Layout.js'

import { useRouter } from 'next/router'
import { useUser } from "@auth0/nextjs-auth0";


const ReviewDownvotedSentences = () => {

	const { user, error, isLoading } = useUser();
	const router = useRouter()
	
	
	const start = router.query.start
	const end = router.query.end
	

	

	const editor = user ?  <DownvotedSentences start={start} end={end} /> : <div><a href="/api/auth/login">Login</a> to use the tool</div>

	

	
	return <Layout title="Manual Annotation" page="/review" >
		
				{editor}


			</Layout>
}

export default ReviewDownvotedSentences


