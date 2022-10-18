import React, { Component } from 'react';
import Link from 'next/link'
import axios from 'axios';

import Table from 'react-bootstrap/Table'

import Layout from '../../components/Layout.js'

import Badge from 'react-bootstrap/Badge';

import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Pagination from 'react-bootstrap/Pagination'

import { EntityStatus } from "@prisma/client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink } from '@fortawesome/free-solid-svg-icons'

export default class MainPage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			page: 0,
			per_page: 50,
			entities: [],
			loaded: false
		}
			
		this.refreshFromDB = this.refreshFromDB.bind(this);
		this.updateEntityStatusInDB = this.updateEntityStatusInDB.bind(this);
		this.changePage = this.changePage.bind(this);
		this.renderRow = this.renderRow.bind(this);
	}
	
	refreshFromDB(page) {
		var self = this
		axios.get('/api/entity_counts', {
			params: {
				offset: page * this.state.per_page,
				limit: this.state.per_page
			}
		})
		.then(function (response) {
			const entities = response.data
			self.setState( {
				entities: entities,
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
	
	updateEntityStatusInDB(entityIndex, entityId, status) {
		this.state.entities[entityIndex].status = status
		this.setState({entities: this.state.entities})
		
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
	
	renderRow(entityIndex, entity) {
		const entityStatusToButtonMap = {
			ADDED_FROM_RESOURCE: "success",
			DISABLED_MANUALLY: "danger",
			OBSOLETE: "secondary"
		}
		
		const entityStatusOptions = Object.keys(EntityStatus).map(st => (
				<Dropdown.Item eventKey={st} key={st} active={entity.status == st} >
					{st}
				</Dropdown.Item>
			)	)
			
		const entityStatusButton = <DropdownButton size="sm" title={entity.name} variant={entityStatusToButtonMap[entity.status]} onSelect={(evtKey,evt) => {this.updateEntityStatusInDB(entityIndex,entity.id, evtKey)}} >
				{entityStatusOptions}
			</DropdownButton>
			
		const entityLink = <Link href={"/entity/"+entity.id}><a><FontAwesomeIcon icon={faLink} /></a></Link>
			
		// <td></td>
		return <tr key={entity.id}>
			<td>{entityLink}</td>
			<td><Badge bg="primary" style={{color:"white"}}>{entity.entityType.name}</Badge></td>
			<td>{entityStatusButton}</td>
			<td>{entity._count.entityAnnotations}</td>
		</tr>
	}
	
	changePage(page) {
		this.setState({page:page, loaded:false})
		this.refreshFromDB(page)
	}
	
	render() {
		
		var contents = 'loading'
		if (this.state.loaded) {
			const rows = this.state.entities.map((e,i) => this.renderRow(i,e))
			
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
					<h1 className="h3 mb-0 text-gray-800">Entity Counts</h1>
					
				</div>
				

				<div className="card shadow mb-4">
		
					{contents}

				</div>

			</Layout>
		)
	}
}

