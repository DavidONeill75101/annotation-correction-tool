import React, { Component } from 'react';
import { useRouter } from 'next/router'
import Button from 'react-bootstrap/Button';
import { useUser } from "@auth0/nextjs-auth0";
import Layout from '../../../../../../../../components/Layout.js'
import Relations from '../../../../../../../../components/Relations.js'
import Filter from '../../../../../../../../components/FilterDetails.js'


const Collated = () => {

	const { user, error, isLoading } = useUser();
	const router = useRouter()
	const range = router.query.range
	const gene = router.query.gene
	const cancer = router.query.cancer
	const drug = router.query.drug
	const evidence_type = router.query.evidence_type
	const variant = router.query.variant
	
	var start
	var end

	if (typeof range == "undefined"){
		start = 0
		end = 9
	}else{
		start = range.split('-')[0]
		end = range.split('-')[1]
	}
	
	const relations = user ? <Relations start={start} end={end} gene={gene} cancer={cancer} drug={drug} evidence_type={evidence_type} variant={variant}/> : <div><a href="/api/auth/login"><Button size="sm">Login</Button></a> to use the tool</div>
	const filter = user ? <div className="card shadow mb-4"><div className="card-body"><Filter /></div></div> : <></>
		
	return <Layout title="Relations" page="/relations" >
		
				<div className="d-sm-flex align-items-center justify-content-between mb-4 titlepadding">
					<h1 className="h3 mb-0 text-gray-800">CIViCMine Annotation Review</h1>
				</div>

				{filter}
								
				<div className="card shadow mb-4">
					<div className="card-body">
						{relations}
					</div>
				</div>			

			</Layout>
}

export default Collated
