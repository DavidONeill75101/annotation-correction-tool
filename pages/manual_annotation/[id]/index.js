import React, { Component } from 'react';
import Layout from '../../../components/Layout.js'
import SenEditor from '../../../components/SenEditor.js'
import SentenceEditor from '../../../components/SentenceEditor.js'
import { useRouter } from 'next/router'
import Button from 'react-bootstrap/Button';



const Sentence = () => {

	const router = useRouter()
	const sentence_id = router.query.id
	
	//const editor = 	<SenEditor sentence_id={sentence_id}></SenEditor>
	const editor = <SentenceEditor sentence_id={sentence_id}></SentenceEditor>

	return <Layout title="Manual Annotation" page="/manual_annotation" >
		
				<div>
				<Button className='float-right mb-3' onClick={() => router.back()}>Back to Sentences</Button>

				</div>
				
				<div className="card shadow mb-4 float-right">
					<div className="card-body">
						{editor}
					</div>
				</div>

			</Layout>
}

export default Sentence
