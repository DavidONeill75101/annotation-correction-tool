import React, { Component } from 'react';

import Link from 'next/link'

import Button from 'react-bootstrap/Button'

import Layout from '../components/Layout.js'


export default class annotation_review extends Component {

	constructor(props) {
		super(props)
	}
	

	render() {

		return (
			<Layout title="Home" page="/" >

				<div className="d-sm-flex align-items-center justify-content-between mb-4 titlepadding">
					<h1 className="h3 mb-0 text-gray-800">CIViCMine Annotation Review</h1>
				</div>

				<div className="card shadow mb-4">
					<div className="card-body">
						Welcome to the CIViCMine Annotation Review Tool. <br></br> <br></br>
						Review relations extracted made by the CIViCMine machine learning tool to help refine the tool. <br></br><br></br>
						<Link href={"/collated/0-9/ / / / / /"}>
							<a><Button size="lg">
								Get Started
							</Button></a>
						</Link>
					</div>					
				</div>		
								
			</Layout>
		)
	}
}
