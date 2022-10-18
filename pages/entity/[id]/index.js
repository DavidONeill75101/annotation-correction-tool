import React, { Component } from 'react';
import { withRouter, useRouter } from 'next/router'
import axios from 'axios';

import AnnotationEditor from '../../../components/AnnotationEditor.js'
import Layout from '../../../components/Layout.js'

import Badge from 'react-bootstrap/Badge';

import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

import { EntityStatus, SynonymStatus } from "@prisma/client";

import chroma from "chroma-js";

function mapListToColors(paletteName,l) {
	const N = l.length
	const scale = chroma.scale(paletteName).domain([0,N], N, 'quantiles');
	
	var colorMap = {}
	l.forEach( (x,i) => { colorMap[x] = scale(i).hex() } )
	
	return colorMap
}

class Page extends Component {
	constructor(props) {
		super(props)
		this.state = {
			entity: false
		}
			
		this.refreshFromDB = this.refreshFromDB.bind(this);
		this.updateSynonymStatusInDB = this.updateSynonymStatusInDB.bind(this);
	}
	
	refreshFromDB() {
		if (!this.props.router.isReady)
			return
		
		const entityId = this.props.router.query.id
		
		var self = this
				
		var fetchURL = '/api/entity_get'
		const params = {entityId:entityId}
		
		axios.get(fetchURL, {
			params: params
		})
		.then(function (response) {
			const entity = response.data
			
			self.setState( {
				entity: entity
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
		this.refreshFromDB()
	}
	
	componentDidUpdate(prevProps) {
		if (this.props.router.query != prevProps.router.query) {
			this.refreshFromDB()
		}
	}
	
	updateEntityStatusInDB(status) {
		var self = this
		axios.get('/api/entity_editstatus', {
			params: {
				entityId: this.state.entity.id,
				status: status
			}
		})
		.then(function (response) {
			self.refreshFromDB()
		})
		.catch(function (error) {
			console.log(error);
		})
		.then(function () {
			// always executed
		});
	}
	
	updateSynonymStatusInDB(entitySynonymId,status) {
		var self = this
		axios.get('/api/entitysynonym_editstatus', {
			params: {
				entitySynonymId: entitySynonymId,
				status: status
			}
		})
		.then(function (response) {
			self.refreshFromDB()
		})
		.catch(function (error) {
			console.log(error);
		})
		.then(function () {
			// always executed
		});
	}
	
	render() {
		if (this.state.entity === false)
			return <>Loading...</>
		
		//const colorMap = mapListToColors('RdYlBu', Object.keys(SynonymStatus) )
		//console.log(colorMap)
		
		const entityStatusToButtonMap = {
			ADDED_FROM_RESOURCE: "success",
			DISABLED_MANUALLY: "danger",
			OBSOLETE: "secondary"
		}
		
		const entityStatusOptions = Object.keys(EntityStatus).map(st => (
				<Dropdown.Item eventKey={st} key={st} active={this.state.entity.status == st} >
					{st}
				</Dropdown.Item>
			)	)
			
		const entityStatusButton = <DropdownButton size="sm" title={this.state.entity.status} variant={entityStatusToButtonMap[this.state.entity.status]} onSelect={(evtKey,evt) => {this.updateEntityStatusInDB(evtKey)}} >
				{entityStatusOptions}
			</DropdownButton>
		
		
		const synonymStatusToButtonMap = {
			ADDED_FROM_RESOURCE: "success",
			ADDED_MANUALLY: "info",
			REMOVED_MANUALLY: "danger",
			OBSOLETE: "secondary"
		}
		
		const synonymsButtons = this.state.entity.synonyms.map(s => {
			
			const synonymStatusOptions = Object.keys(SynonymStatus).map(st => (
				<Dropdown.Item eventKey={st} key={st} active={s.status == st} >
					{st}
				</Dropdown.Item>
			)	)
			
			return <div key={"key_"+s.id} style={{display:"inline-block", padding:"2px"}}>
				<DropdownButton 
					id={"s"+s.id} 
					size="sm" 
					title={s.name} 
					variant={synonymStatusToButtonMap[s.status]} 
					onSelect={(evtKey,evt) => {this.updateSynonymStatusInDB(s.id,evtKey)}}  
					style={{display:"inline"}}>
					{synonymStatusOptions}
				</DropdownButton>
			</div>
		} )
				
		return <Layout title="Woot!" page="/" >
			
					{/* Page Heading */}
					<div className="d-sm-flex align-items-center justify-content-between mb-4 titlepadding">
						<div>
							<h1 className="h3 mb-0 text-gray-800">{this.state.entity.name} </h1>

						
							<Badge bg="dark" style={{color:"white"}}>{this.state.entity.entityType.name}</Badge>{' '}
							<Badge bg="primary" style={{color:"white"}}>{this.state.entity.externalId}</Badge>
						</div>
					</div>
										
					<div className="card shadow mb-4">
						<div className="card-body">
						
						<p>
							{this.state.entity.description}
						</p>
						
								
						<div style={{textAlign:"right"}}>{entityStatusButton}</div>
						</div>
					</div>
						
					<div className="card shadow mb-4">
						<div className="card-header">
							Synonyms
						</div>
						<div className="card-body" >
						{synonymsButtons}
						</div>
					</div>
					

				</Layout>
	}
}

//export default withRouter(Page)

/*const PageWithRouter = (props) => {
	const router = useRouter()
	if (router.isReady)
		return <Page {...props} query={router.query.query} />
	else
		return <></>
}*/

export default withRouter(Page)
