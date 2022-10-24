import React, { Component } from 'react';

import Layout from '../../../components/Layout.js'
import Relations from '../../../components/Relations.js'


import { useRouter } from 'next/router'

import { useUser } from "@auth0/nextjs-auth0";


const Collated = () => {

	const { user, error, isLoading } = useUser();
	const router = useRouter()
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

	
	
	const relations = user ? <Relations start={start} end={end}/> : <div><a href="/api/auth/login">Login</a> to use the tool</div>


	
	
	return <Layout title="Relations" page="/relations" >
		
				{/* Page Heading */}
				<div className="d-sm-flex align-items-center justify-content-between mb-4 titlepadding">
					<h1 className="h3 mb-0 text-gray-800">CIViCMine Annotation Review</h1>
				</div>
				

				<div className="card shadow mb-4">
					<div className="card-body">
						{relations}
						
					</div>
				</div>
				

				

			</Layout>
}

export default Collated
