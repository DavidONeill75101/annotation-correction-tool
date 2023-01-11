import React, { Component } from 'react';

import { useRouter } from 'next/router'

import Link from 'next/link'

import { useUser } from "@auth0/nextjs-auth0";

import Button from 'react-bootstrap/Button';

import DownvotedSentences from '../../components/DownvotedSentences.js'
import Layout from '../../components/Layout.js'


const ReviewDownvotedSentences = () => {

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

	const editor = user ?  <DownvotedSentences matching_id={matchingId} start={start} end={end} citations={citations} user={user}/> : <div><a href="/api/auth/login">Login</a> to use the tool</div>

	
	return <Layout title="Manual Annotation" page="/review" >
		
				<div className="d-sm-flex align-items-center justify-content-between mb-4 titlepadding">
					<h1 className="h3 mb-0 text-gray-800">Review Sentences</h1>
					<Link href='/collated?range=0-9'>
						<a><Button size="md">Back to Relations</Button></a>
					</Link>
				</div>

				<div className="card shadow mb-4">
					<div className="card-body">
						{editor}
					</div>
				</div>

			</Layout>
}

export default ReviewDownvotedSentences
