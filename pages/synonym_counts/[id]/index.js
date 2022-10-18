import React, { Component } from 'react';
import Link from 'next/link'
import axios from 'axios';

import Table from 'react-bootstrap/Table'

import Layout from '../../../components/Layout.js'
import { withRouter } from 'next/router'

import Badge from 'react-bootstrap/Badge';

import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Pagination from 'react-bootstrap/Pagination'

import { EntityStatus, SynonymStatus } from "@prisma/client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink } from '@fortawesome/free-solid-svg-icons'

class Page extends Component {
	constructor(props) {
		super(props)
		this.state = {
			page: 0,
			per_page: 50,
			synonyms: [],
			loaded: false
		}
			
		this.refreshFromDB = this.refreshFromDB.bind(this);
		this.updateEntityStatusInDB = this.updateEntityStatusInDB.bind(this);
		this.updateSynonymStatusInDB = this.updateSynonymStatusInDB.bind(this);
		this.changePage = this.changePage.bind(this);
		this.renderRow = this.renderRow.bind(this);
	}
	
	refreshFromDB(page) {
		if (!this.props.router.isReady)
			return
		
		const entityTypeId = this.props.router.query.id
		
		var self = this
		axios.get('/api/synonym_counts', {
			params: {
				offset: page * this.state.per_page,
				limit: this.state.per_page,
				entityTypeId: entityTypeId
			}
		})
		.then(function (response) {
			const synonyms = response.data
			self.setState( {
				synonyms: synonyms,
				loaded: true
			} )
		})
		.catch(function (error) {
			console.log(error);
		})
		.then(function () {
			// always executed
		});  
	}
	
	componentDidMount() {
		this.refreshFromDB(this.state.page)
	}
	
	componentDidUpdate(prevProps) {
		if (this.props.router.query != prevProps.router.query) {
			this.refreshFromDB(this.state.page)
		}
	}
	
	updateEntityStatusInDB(synonymIndex, entityId, status) {
		this.state.synonyms[synonymIndex].entity.status = status
		this.setState({synonyms: this.state.synonyms})
		
		var self = this
		axios.get('/api/entity_editstatus', {
			params: {
				entityId: entityId,
				status: status
			}
		})
		.then(function (response) {
			self.refreshFromDB(this.state.page)
		})
		.catch(function (error) {
			console.log(error);
		})
		.then(function () {
			// always executed
		});
	}
	
	updateSynonymStatusInDB(synonymIndex, entitySynonymId,status) {
		this.state.synonyms[synonymIndex].status = status
		this.setState({synonyms: this.state.synonyms})
		
		var self = this
		axios.get('/api/entitysynonym_editstatus', {
			params: {
				entitySynonymId: entitySynonymId,
				status: status
			}
		})
		.then(function (response) {
			self.refreshFromDB(this.state.page)
		})
		.catch(function (error) {
			console.log(error);
		})
		.then(function () {
			// always executed
		});
	}
	
	renderRow(synonymIndex, synonym) {
		const entityStatusToButtonMap = {
			ADDED_FROM_RESOURCE: "success",
			DISABLED_MANUALLY: "danger",
			OBSOLETE: "secondary"
		}
		
		const entityStatusOptions = Object.keys(EntityStatus).map(st => (
				<Dropdown.Item eventKey={st} key={st} active={synonym.entity.status == st} >
					{st}
				</Dropdown.Item>
			)	)
			
		const entityStatusButton = <DropdownButton size="sm" title={synonym.entity.name} variant={entityStatusToButtonMap[synonym.entity.status]} onSelect={(evtKey,evt) => {this.updateEntityStatusInDB(synonymIndex,synonym.entity.id, evtKey)}} >
				{entityStatusOptions}
			</DropdownButton>
			
		const synonymStatusToButtonMap = {
			ADDED_FROM_RESOURCE: "success",
			ADDED_MANUALLY: "info",
			REMOVED_MANUALLY: "danger",
			OBSOLETE: "secondary"
		}
			
		const synonymStatusOptions = Object.keys(SynonymStatus).map(st => (
			<Dropdown.Item eventKey={st} key={st} active={synonym.status == st} >
				{st}
			</Dropdown.Item>
		)	)
		
		const synonymStatusButton = <div key={"key_"+synonym.id} style={{display:"inline-block", padding:"2px"}}>
			<DropdownButton 
				id={"s"+synonym.id} 
				size="sm" 
				title={synonym.name} 
				variant={synonymStatusToButtonMap[synonym.status]} 
				onSelect={(evtKey,evt) => {this.updateSynonymStatusInDB(synonymIndex,synonym.id,evtKey)}}  
				style={{display:"inline"}}>
				{synonymStatusOptions}
			</DropdownButton>
		</div>
			
		const entityLink = <Link href={"/entity/"+synonym.entity.id}><a><FontAwesomeIcon icon={faLink} /></a></Link>
			
		// <td></td>
		return <tr key={synonym.id}>
			<td>{entityLink}</td>
			<td><Badge bg="primary" style={{color:"white"}}>{synonym.entity.entityType.name}</Badge></td>
			<td>{entityStatusButton}</td>
			<td>{synonymStatusButton}</td>
			<td>{synonym._count.entityAnnotations}</td>
		</tr>
	}
	
	changePage(page) {
		this.setState({page:page, loaded:false})
		this.refreshFromDB(page)
	}
	
	render() {
		
		var contents = 'loading'
		if (this.state.loaded) {
			const rows = this.state.synonyms.map((s,i) => this.renderRow(i,s))
			
			const pagination = <Pagination>
				<Pagination.First onClick={evt => this.changePage(1)} />
				<Pagination.Prev onClick={evt => this.changePage(this.state.page-1)} />
				<Pagination.Ellipsis />

				<Pagination.Item onClick={evt => this.changePage(this.state.page-2)}>{this.state.page-2}</Pagination.Item>
				<Pagination.Item onClick={evt => this.changePage(this.state.page-1)}>{this.state.page-1}</Pagination.Item>
				<Pagination.Item active>{this.state.page}</Pagination.Item>
				<Pagination.Item onClick={evt => this.changePage(this.state.page+1)}>{this.state.page+1}</Pagination.Item>
				<Pagination.Item onClick={evt => this.changePage(this.state.page+2)}>{this.state.page+2}</Pagination.Item>

				<Pagination.Ellipsis />
				<Pagination.Next onClick={evt => this.changePage(this.state.page+1)} />
			</Pagination>
			
			//<Pagination.Item>{20}</Pagination.Item>
			//<Pagination.Last />
			
			contents = <><Table striped bordered hover>
				<thead>
					<tr>
						<th></th>
						<th>Type</th>
						<th>Entity</th>
						<th>Synonym</th>
						<th>Count</th>
					</tr>
				</thead>
				<tbody>
					{rows}
				</tbody>
			</Table>
			{pagination}
			</>
		}
		
		return (
			<Layout title="Documents" page="/" >
			
				<div className="d-sm-flex align-items-center justify-content-between mb-4 titlepadding">
					<h1 className="h3 mb-0 text-gray-800">Synonym Counts</h1>
					
				</div>
				

				<div className="card shadow mb-4">
		
					{contents}

				</div>

			</Layout>
		)
	}
}

export default withRouter(Page)