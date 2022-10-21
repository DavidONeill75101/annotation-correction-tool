import React, { Component } from 'react';
import axios from 'axios';

import Popover from 'react-bootstrap/Popover'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faXmark, faPencil, faLink } from '@fortawesome/free-solid-svg-icons'

import CustomPopover from '../components/CustomPopover.js'

export default class RelationAnnotation extends Component {
	constructor(props) {
		super(props)
		this.state = {
			relationTypes: null,
			selectedRelationTypeId: null
		}
		
		this.titleRef = React.createRef();
		
		this.handleResize = this.handleResize.bind(this);
		this.fetchRelationTypes = this.fetchRelationTypes.bind(this);
	}
	
	fetchRelationTypes() {
		var self = this
		axios.get('/api/relationtype_get', {
			params: {
				
			}
		})
		.then(function (response) {
			self.setState( {
				relationTypes: response.data
			} )
		})
		.catch(function (error) {
			console.log(error);
		})
		.then(function () {
			// always executed
		});  
	}
	
	
	componentDidMount () {
		//if (this.props.relation.isCandidate)
		console.log("fetchign")
		this.fetchRelationTypes()
		console.log(this.state.relationTypes)
		this.handleResize(null)
		
		window.addEventListener("resize", this.handleResize);
	}
	
	handleResize(event) {
		this.setState({'windowWidth':window.innerWidth})
	}
	
	render() {
		var srcTop = 100
		var srcLeft = 100
		var dstTop = 200
		var dstLeft = 200
		var titleWidth = 50
		var titleHeight = 20
		if (this.props.src && this.props.src.current && this.props.dst && this.props.dst.current && this.titleRef && this.titleRef.current) {
			srcTop = this.props.src.current.offsetTop //+ this.props.src.current.offsetHeight/2
			srcLeft = this.props.src.current.offsetLeft + this.props.src.current.offsetWidth/2
			
			dstTop = this.props.dst.current.offsetTop //+ this.props.dst.current.offsetHeight / 2
			dstLeft = this.props.dst.current.offsetLeft + this.props.dst.current.offsetWidth/2
			
			titleWidth = this.titleRef.current.offsetWidth
			titleHeight = this.titleRef.current.offsetHeight
			
			//this.setState({srcTop: srcTop, srcLeft:srcLeft, dstTop:dstTop, dstLeft:dstLeft, titleWidth:titleWidth, titleHeight:titleHeight})
		}
		
		//const width = this.state.dstLeft - this.state.srcLeft
		//const height = this.state.dstTop - this.state.srcTop
		
		const above = 30
		
		const middle = (dstLeft + srcLeft) / 2
		
		const top = srcTop < dstTop ? srcTop - above : dstTop - above
		const left = srcLeft < dstLeft ? srcLeft : dstLeft
		const width = srcLeft < dstLeft ? (dstLeft-srcLeft) : (srcLeft-dstLeft)
				
		const srcLine = {background: this.props.color, borderRadius: this.props.borderRadius+"px", position:"absolute", top:top+"px", left: (srcLeft-this.props.width/2)+"px", width: this.props.width+"px", height: (srcTop-top)+"px"}
		
		const dstLine = {background: this.props.color, borderRadius: this.props.borderRadius+"px", position:"absolute", top:top+"px", left: (dstLeft-this.props.width/2)+"px", width: this.props.width+"px", height: (dstTop-top)+"px"}
		
		const acrossLine = {background: this.props.color, borderRadius: this.props.borderRadius+"px", position:"absolute", top:top+"px", left: left+"px", width: width+"px", height: this.props.width+"px"}
				
		const acceptButton = <div style={{textAlign:"right", paddingLeft:"3px"}}>
						<Button size="sm" variant="success" onClick={evt => this.props.accept(this.state.selectedRelationTypeId)}>
							<FontAwesomeIcon icon={faCheck} />
						</Button>
					</div>
					
		const rejectButton = <div style={{textAlign:"right", paddingLeft:"3px"}}>
						<Button size="sm" variant="danger" onClick={this.props.reject}>
							<FontAwesomeIcon icon={faXmark} />
						</Button>
					</div>
					
		var relationType, relationBody
		
		if (this.props.relation.isCandidate) {
			relationType = "Select relation type"
			
			if (this.state.relationTypes) {
				relationBody = this.state.relationTypes.map( rt => 
				<ListGroup.Item 
					key={rt.id} 
					className="d-flex justify-content-between align-items-start" 
					style={{paddingLeft:"0px"}} 
					active={rt.id==this.state.selectedRelationTypeId} 
					onClick={evt => this.setState({selectedRelationTypeId:rt.id})}>
						<div className="ms-2 me-auto">
							<div className="fw-bold">{rt.name}</div>
							<div style={{fontWeight:"bold", fontSize: "xx-small", paddingTop:"5px"}}>
								{rt.description}
							</div>
						</div>
					</ListGroup.Item> )
			} else {
				relationBody = "Loading..."
			}
		} else {
			relationType = this.props.relation.relationType.name
			relationBody = this.props.relation.relationType.description
		}
		
		const popoverContents = <>
			<Popover.Header as="h3">
				<div style={{display:"flex", flexDirection: 'row' }}>
					<div style={{flexGrow:1}}>
						{relationType}
					</div>
					
					{acceptButton}
					{rejectButton}
					
				</div>
			</Popover.Header>
			<Popover.Body>
				<div style={{fontSize: "small"}}>
					{relationBody}
				</div>
			</Popover.Body>
		</>
		
		const title = {color: "white", background: "#FFABAB", borderRadius: "5px", padding: "4px", fontSize:"x-small", display:"inline", position:"absolute", top:(top-titleHeight/2)+"px", left:(middle-titleWidth/2)+"px"}
		
		
		return <>
			<div style={srcLine} />
			<div style={dstLine} />
			<div style={acrossLine} />
			<div style={title} ref={this.titleRef}><CustomPopover popoverContents={popoverContents} alwaysShow={this.props.relation.isCandidate}>{relationType}</CustomPopover></div>
		</>
	}
}

RelationAnnotation.defaultProps = {
	width: "4",
	borderRadius: "5",
	color: "#FFABAB"
}
