import React, { Component, useState, useRef } from 'react';
import Link from 'next/link'
import axios from 'axios';

import Popover from 'react-bootstrap/Popover'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import Form from 'react-bootstrap/Form'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faXmark, faPencil, faLink, faSkullCrossbones, faThumbsUp } from '@fortawesome/free-solid-svg-icons'

import CustomPopover from './CustomPopover.js'

export default class EntityAnnotation extends Component {
	constructor(props) {
		super(props)
		this.state = {
			show: true,
			entityTypes: null,
			searchResults: null,
			selectedEntityId: null,
			selectedUnlinkedId: 1,
			searchQuery: this.props.attribs.text,
			editing: false
		}
		
		this.search = this.search.bind(this);
		this.getEntityTypes = this.getEntityTypes.bind(this);
		
		this.annoRef = React.createRef();
	}
	
	search(query) {
		var self = this
		axios.get('/api/synonym_search', {
			params: {
				q: query
			}
		})
		.then(function (response) {
			self.setState( {
				searchResults: response.data,
				selectedEntityId: response.data.length > 0 ? response.data[0].entityId : -1
			} )
		})
		.catch(function (error) {
			console.log(error);
		})
		.then(function () {
			// always executed
		});  
	}
	
	getEntityTypes() {
		var self = this
		axios.get('/api/get_data/get_entity_types')
		.then(function (response) {
			self.setState( {
				entityTypes: response.data
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
		if (this.props.id)
			this.props.passbackRef(this.props.id, this.annoRef)
		
		if (this.props.isCandidate) {
			this.search(this.state.searchQuery)
		}
		
		this.getEntityTypes()
	}
		
	render() {
		const attribText =  JSON.stringify(this.props.attribs)
		
		var title = ''
		var buttons = ''
		var mainText = 'loading...'
		
		
		
		
		if (this.props.isCandidate || this.state.editing) {
			
			
			
			const acceptClick = evt => {
				const selectedEntityIdForDb = this.state.selectedEntityId == -1 ? this.state.selectedUnlinkedId : this.state.selectedEntityId
				
				if (this.state.editing) {
					this.props.edit(this.props.attribs.entityAnnotationId, selectedEntityIdForDb)
					this.setState({editing: false})
				} else {
					this.props.accept(selectedEntityIdForDb)
				}
			}
			
			const acceptButton = <div style={{textAlign:"right", paddingLeft:"3px"}}>
						<Button size="sm" variant="success" onClick={acceptClick} >
							<FontAwesomeIcon icon={faCheck} />
						</Button>
					</div>
					
			const rejectClick = evt => {
				if (this.state.editing) {
					this.setState({editing: false})
				} else {
					this.props.reject(evt)
				}
			}
					
			const rejectButton = <div style={{textAlign:"right", paddingLeft:"3px"}}>
							<Button size="sm" variant="secondary" onClick={rejectClick}>
								<FontAwesomeIcon icon={faXmark} />
							</Button>
						</div>
			
			buttons = <>{acceptButton}{rejectButton}</>
			
			const updateSearchQuery = evt => {
				const searchQuery = evt.target.value
				this.search(searchQuery)
				this.setState({searchQuery:searchQuery})
			}
			
			const searchBar = <Form.Control type="text" placeholder="Enter search query" size="sm" value={this.state.searchQuery} onChange={updateSearchQuery} />
			
			title = searchBar
			
			var entityTypeListGroup = ''
			if (this.state.entityTypes) {
				const entityTypeOptions = this.state.entityTypes.map( et => <option key={et.id} value={et.unlinkedEntityId}>{et.name}</option> )
				
				const selectChange = evt => {
					this.setState({selectedEntityId: -1, selectedUnlinkedId:evt.target.value})
				}
			
				const entityTypeSelect = <Form.Select aria-label="Select entity type" size="sm" onChange={selectChange} value={this.state.selectedUnlinkedId} className="custom-select">
				  {entityTypeOptions}
				</Form.Select>
				
				entityTypeListGroup = <ListGroup.Item
						active={this.state.selectedEntityId==-1} 
						onClick={evt => this.setState({selectedEntityId:-1})}
						>
							<div className="input-group-sm">
								<span>Unlinked: </span>
								{entityTypeSelect}
							</div>
						</ListGroup.Item>
			}
			
			
			var entityOptions = ''
			if (this.state.searchResults) {
				entityOptions = this.state.searchResults.map( s => 
					<ListGroup.Item 
						key={s.entity.externalId}
						active={s.entityId==this.state.selectedEntityId} 
						onClick={evt => this.setState({selectedEntityId:s.entityId})}>
							<div>
								<div>{s.entity.name}</div>
								<div style={{fontWeight:"bold", fontSize: "xx-small", paddingTop:"5px"}}>
									{s.entity.externalId}
								</div>
								<div style={{fontWeight:"bold", fontSize: "xx-small"}}>
									Type: {s.entity.entityType.name}
								</div>
							</div>
						</ListGroup.Item> )
			}
			
			mainText = <>{entityOptions}{entityTypeListGroup}</>
			
		} else {
			
			
			const isAutomated = this.props.attribs.userIsBot
			var approveButton = ''
			if (isAutomated) {
				const acceptClick = evt => {
					this.props.edit(this.props.attribs.entityAnnotationId, this.props.attribs.entityId)
				}
				
				approveButton = <div style={{textAlign:"right", paddingLeft:"3px"}}>
						<Button size="sm" variant="success" onClick={acceptClick}>
							<FontAwesomeIcon icon={faThumbsUp} />
						</Button>
					</div>
			}
			
			const addRelationButton = <div style={{textAlign:"right", paddingLeft:"3px"}}>
							<Button size="sm" variant="outline-dark" onClick={this.props.startRelation}>
								<FontAwesomeIcon icon={faLink} />
							</Button>
						</div>
						
						
			const editClick = evt => {
				this.setState({editing:true,searchQuery:this.props.attribs.text})
				this.search(this.props.attribs.text)
			}
					
			const editButton = <div style={{textAlign:"right", paddingLeft:"3px"}}>
						<Button size="sm" variant="info" onClick={editClick}>
							<FontAwesomeIcon icon={faPencil} />
						</Button>
					</div>
					
			const deleteButton = <div style={{textAlign:"right", paddingLeft:"3px"}}>
							<Button size="sm" variant="danger" onClick={this.props.reject}>
								<FontAwesomeIcon icon={faSkullCrossbones} />
							</Button>
						</div>
		
			
			buttons = <>{approveButton}{addRelationButton}{editButton}{deleteButton}</>
			
			title = <Link href={"/entity/"+this.props.attribs['entityId']}><a style={{color:"#666666"}}>{this.props.attribs['name']}</a></Link>
			
			const automatedText = isAutomated ? <div style={{fontWeight:"bold", textDecoration: "underline", fontSize: "x-small"}}>
					Automated Annotation
				</div> : ''
				
			const externalIdText = this.props.attribs.isUnlinked ? '' : "("+this.props.attribs.externalId+")"
			
			mainText = <>
				<div style={{fontSize: "small"}}>
					{this.props.attribs.description}
				</div>
				<div style={{fontWeight:"bold", fontSize: "x-small", paddingTop:"5px"}}>
					Type: {this.props.attribs.type} {externalIdText}
				</div>
				{automatedText}
			</>
		}
		
		const popoverContents = <>
			<Popover.Header as="h3">
				<div style={{display:"flex", flexDirection: 'row', alignItems: "center" }}>
					<div style={{flexGrow:1}}>
						{title}
					</div>
					<div style={{width:"10px"}}></div>
					{buttons}
					
				</div>
			</Popover.Header>
			<Popover.Body>
				<div style={{maxHeight:"200px", overflowY:"auto" }}>
					{mainText}
				</div>
			</Popover.Body>
		</>
		
		const formattedChildren = <b>{this.props.children}</b>
		
		
		var insideSpan = ''
		if (this.props.disabled) {
			insideSpan = formattedChildren
		} else if (this.props.showJoinRelation) {
			const joinRelation = <>
				<Popover.Body>
					<Button size="sm" variant="outline-dark" onClick={this.props.joinRelation}>
						<FontAwesomeIcon icon={faLink} />
					</Button>
				</Popover.Body>
			</>
		
			insideSpan = <CustomPopover 
							alwaysShow={true} 
							popoverContents={joinRelation}>
								{formattedChildren}
						</CustomPopover>
		} else {
			insideSpan = <CustomPopover 
							alwaysShow={this.props.isCandidate || this.state.editing} 
							popoverContents={popoverContents}>
								{formattedChildren}
						</CustomPopover>
		}
		
		return <span __start={this.props.attribs['__start']} 
				__end={this.props.attribs['__end']}
				__editorkey={this.props.attribs['__editorkey']} 
				ref={this.annoRef}>
					{insideSpan}
			</span>
	}
	
}
