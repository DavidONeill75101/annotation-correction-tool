

import React, { Component } from 'react';
import Link from 'next/link'
import axios from 'axios';


import Table from 'react-bootstrap/Table'

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

				<Link href={"/collated/0-9"}><a>Get started</a></Link>
					
				</div>

			</Layout>
		)
	}
}
