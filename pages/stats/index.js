import React, { Component } from 'react';

import Layout from '../../components/Layout.js'
import SentenceVotingData from '../../components/SentenceVotingData.js';


const Stats = () => {

		
	return <Layout title="Stats" page="/stats" >
		
				<div className="d-sm-flex align-items-center justify-content-between mb-4 titlepadding">
					<h1 className="h3 mb-0 text-gray-800">Statistics</h1>
				</div>

				<div className="card shadow mb-4">
					<div className="card-body">
						<SentenceVotingData />
					</div>
				</div>			

			</Layout>
}

export default Stats
