import React, { Component } from 'react';


import { useUser } from "@auth0/nextjs-auth0";

import Button from 'react-bootstrap/Button';

import Layout from '../../components/Layout.js'
import AnnotationGuide from '../../components/AnnotationGuide.js';

const Guide = () => {

	const { user, error, isLoading } = useUser();

	var guide = user ? <AnnotationGuide user={user.nickname} /> : <div><a href="/api/auth/login"><Button size="sm">Login</Button></a> to view the annotation guide</div>

	return (
		<Layout title="Annotation Guide" page="/annotation_guide" >

			<div className="card shadow mb-4">
				<div className="card-body">
					{guide}
				</div>
			</div>

		</Layout>
	)
}

export default Guide
