import React, { Component } from 'react';

import Layout from '../../../components/Layout.js'
import Relations from '../../../components/Relations.js'


import { useRouter } from 'next/router'

const Collated = () => {

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

	
	
	const relations = <Relations start={start} end={end}/>
	
	return <Layout title="Relations" page="/relations" >
		
				{/* Page Heading */}
				<div className="d-sm-flex align-items-center justify-content-between mb-4 titlepadding">
					<h1 className="h3 mb-0 text-gray-800">Relations</h1>
				</div>
				

				<div className="card shadow mb-4">
					<div className="card-body">
						{relations}
					</div>
				</div>
				

				

			</Layout>
}

export default Collated
