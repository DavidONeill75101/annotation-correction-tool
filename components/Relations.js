import React, { Component } from 'react';

import Link from 'next/link'

import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table'
import { param } from 'malgo-brat-frontend-editor/client/src/util';


export default class Relations extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loaded: false,
			collated: [],
			start: this.props.start,
			end: this.props.end,
			evidence_type: this.props.evidence_type,
			gene: this.props.gene,
			cancer: this.props.cancer,
			drug: this.props.drug,
			variant: this.props.variant,
		}		
		this.refreshCollated = this.refreshCollated.bind(this);
		this.check_read_guide = this.check_read_guide.bind(this);
	}


	refreshCollated() {

		var self = this
		var fetchURL = '/api/get_data/get_relations'
		var params = {start:self.state.start, end:self.state.end}

		if(this.state.gene!=" "){
			params['gene'] = this.state.gene
		}

		if(this.state.cancer!=" "){
			params['cancer'] = this.state.cancer
		}

		if(this.state.drug!=" "){
			params['drug'] = this.state.drug
		}
		
		if(this.state.evidence_type!=" "){
			params['evidence_type'] = this.state.evidence_type
		}

		if(this.state.variant!=" "){
			params['variant_group'] = this.state.variant
		}
		
		axios.get(fetchURL, {
			params: params
		})
		.then(function (response) {
				const collated = response.data
				self.setState({
					collated: collated,
					loaded: true
				})
			})
			.catch(function (error) {
				console.log(error);
			})
			.then(function () {
				// always executed
			});
	}


	check_read_guide(){
		var self = this

		const fetchURL = '/api/get_data/get_user?email=' + this.props.username

        axios.get(fetchURL)
            .then(function (response) {
                const res = response.data
                self.setState({
                    read_guide: res.read_guide
                })
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
            });
	}


	componentDidMount() {
		this.refreshCollated()
		this.check_read_guide()
	}


	render() {

		var contents = 'loading...'
		var prev_link = ''
		var next_link = ''		
		
		if (this.state.loaded) {

			var rows = ''

			if (this.state.read_guide==1){
				rows = this.state.collated.map(c => <tr key={c.matching_id}>
					<td>{c.evidencetype}</td>
					<td>{c.gene}</td><td>{c.cancer}</td>
					<td>{c.drug}</td><td>{c.variant_group}</td>
					<td>{c.citation_count}</td>
					<td><Link href={"/review?id="+c.matching_id+'&range=0-9&citations='+c.citation_count}>
							<a><Button size="sm">Review Predictions</Button></a>
						</Link></td>
					<td><Link href={'/review_downvoted_sentences?id=' + c.matching_id + '&range=0-9&citations=' + c.citation_count}>
						<a><Button size="sm">Annotate Sentences</Button></a>
						</Link></td>
					</tr>)
			}else{
				rows = this.state.collated.map(c => <tr key={c.matching_id}>
					<td>{c.evidencetype}</td>
					<td>{c.gene}</td><td>{c.cancer}</td>
					<td>{c.drug}</td><td>{c.variant_group}</td>
					<td>{c.citation_count}</td>
					<td><Link href="/annotation_guide">
						<a><Button size="sm">Read Annotation Guide</Button></a>
						</Link></td>
					</tr>)
			}
			
			if (this.state.collated.length>0){
				contents = <Table striped bordered hover>
								<thead>
									<tr>
										<th>Evidence Type</th>
										<th>Gene</th>
										<th>Cancer</th>
										<th>Drug</th>
										<th>Variant</th>
										<th># of Papers</th>
									</tr>
								</thead>
								<tbody>
									{rows}
								</tbody>
							</Table>
			}else{
				contents = "There are no relations which match the filters you have applied"
			}
			
			var prev_start = parseInt(this.state.start)-10
			var prev_end = parseInt(this.state.end) - 10

			var next_start = parseInt(this.state.start)+10
			var next_end = parseInt(this.state.end) + 10

			var param_string = ''

			if (typeof this.state.gene!='undefined'){
				param_string = param_string + '&gene=' + this.state.gene
			}

			if (typeof this.state.cancer!='undefined'){
				param_string = param_string + '&cancer=' + this.state.cancer
			}

			if (typeof this.state.drug!='undefined'){
				param_string = param_string + '&drug=' + this.state.drug
			}

			if (typeof this.state.evidence_type!='undefined'){
				param_string = param_string + '&evidence_type=' + this.state.evidence_type
			}

			if (typeof this.state.variant!='undefined'){
				param_string = param_string + '&variant=' + this.state.variant
			}

			if (prev_start>=0){
				prev_link = <Link href={"/collated?range="+prev_start + '-' + prev_end + param_string}><a><Button size="md">Previous</Button></a></Link>
			}

			if (this.state.collated.length == 9){
				next_link = <Link href={"/collated?range="+next_start + '-' + next_end + param_string}><a><Button size="md">Next</Button></a></Link>
			}
		}


		return (
				<div>
						<div className='scrollableComponent'>
							{contents}
						</div>
						
						<div>
							<div className='float-left mt-3'>
								{prev_link}
							</div>

							<div className="float-right mt-3">
								{next_link}
							</div>
						</div>
				</div>
		)
	}
}
