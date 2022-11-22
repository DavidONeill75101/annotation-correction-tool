import React, { Component, useState, useEffect } from 'react';
import Layout from '../../../components/Layout.js'
import SentenceEditor from '../../../components/SentenceEditor.js'
import { useRouter } from 'next/router'
import Button from 'react-bootstrap/Button';
import useAxios from 'axios-hooks'


function Sentence() {
	const router = useRouter()
	const sentence_id = router.query.id

	var fetchURL = '/api/get_data/get_sentence?sentence_id=' + String(sentence_id)
	
	const [{ data, loading, error }, refetch] = useAxios(
		fetchURL
	  )
	
	
	
	const editor = data ? <SentenceEditor sentence_id={sentence_id} sentence={data.sentence}></SentenceEditor> : <></>

	
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

export default Sentence;