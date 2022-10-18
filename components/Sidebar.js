import React, { Component } from 'react';
import Collapse from 'react-bootstrap/Collapse';

import MyToolTip from './MyToolTip'

import Link from 'next/link'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faViruses } from '@fortawesome/free-solid-svg-icons'
import { faTachometerAlt } from '@fortawesome/free-solid-svg-icons'
import { faPrescriptionBottleAlt } from '@fortawesome/free-solid-svg-icons'
import { faVials } from '@fortawesome/free-solid-svg-icons'
import { faChessKnight } from '@fortawesome/free-solid-svg-icons'
import { faCamera } from '@fortawesome/free-solid-svg-icons'
import { faHandshake } from '@fortawesome/free-solid-svg-icons'
import { faNotesMedical } from '@fortawesome/free-solid-svg-icons'
import { faStethoscope } from '@fortawesome/free-solid-svg-icons'
import { faSyringe } from '@fortawesome/free-solid-svg-icons'
import { faDna } from '@fortawesome/free-solid-svg-icons'
import { faMicroscope } from '@fortawesome/free-solid-svg-icons'
import { faChartBar } from '@fortawesome/free-solid-svg-icons'
import { faChartLine } from '@fortawesome/free-solid-svg-icons'
import { faPenFancy } from '@fortawesome/free-solid-svg-icons'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { faHeadSideVirus } from '@fortawesome/free-solid-svg-icons'
import { faBrain } from '@fortawesome/free-solid-svg-icons'
import { faRandom } from '@fortawesome/free-solid-svg-icons'
import { faQuestion } from '@fortawesome/free-solid-svg-icons'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import { faAddressCard } from '@fortawesome/free-solid-svg-icons'
import { faEnvelopeOpenText } from '@fortawesome/free-solid-svg-icons'
import { faLandmark } from '@fortawesome/free-solid-svg-icons'
import { faCommentAlt } from '@fortawesome/free-solid-svg-icons'
import { faCircleNodes } from '@fortawesome/free-solid-svg-icons'

import entityTypes from '../lib/entityTypes.json'
import relationTypes from '../lib/relationTypes.json'

export default class Sidebar extends Component {
	constructor(props) {
		super(props)
				
		var collapseOpen = {'entities':false,'relations':false}
		
		this.state = { 
			collapseOpen: collapseOpen
		}
		
		this.toggleGroup = this.toggleGroup.bind(this);
		this.renderEntityTypes = this.renderEntityTypes.bind(this);
		this.renderRelationTypes = this.renderRelationTypes.bind(this);
		
		this.container = React.createRef()
	}
	
	toggleGroup(g) {
		var collapseOpen = {'entities':false,'relations':false}
		
		if (g != null)
			collapseOpen[g] = !this.state.collapseOpen[g]
		
		this.setState({collapseOpen: collapseOpen})
	}
	
	renderRelationTypes() {
		const groupIcon = faCircleNodes
		const groupOpen = this.state.collapseOpen['relations']
		const groupArrow = groupOpen ? faAngleDown : faAngleRight
		const groupActive = false //allEntityPages.includes(this.props.page)
		const subLinks = relationTypes.map( (p,i) => <Link href={`/entity_counts/${p.id}`} key={"subentitylink_"+i} prefetch={false}><a className={"collapse-item" + (this.props.page == `/entity/${p.name}/all` ? ' active' : '')}><MyToolTip text="TODO: Insert description here" container={this.container}><div>{p.name}</div></MyToolTip></a></Link> )
		
		const relationlinks = 
			<MyToolTip text="Lists of relations extracted from research articles" container={this.container}>
			<li className={groupActive ? "nav-item active" : "nav-item"}>
				<a className="nav-link" href="#" onClick={event => { this.toggleGroup('relations'); event.preventDefault() } } aria-controls="example-collapse-text"
	aria-expanded={false}>
					<span className="icon" style={{marginRight: "0.25rem"}}>
						<FontAwesomeIcon className="sideicon" icon={groupIcon} fixedWidth width="0" />
					</span>
					<span> Relations</span>
					<div className="arrow" style={{"float":"right"}}>
						<FontAwesomeIcon icon={groupArrow} fixedWidth width="0" />
					</div>
				</a>
				<Collapse in={groupOpen}>
					<div className="collapsebox">
						<div className="bg-white py-2 collapse-inner rounded" style={{wordWrap:"break-word"}} >
							{subLinks}
						</div>
					</div>
				</Collapse>
			  </li>
			  </MyToolTip>
			  
		return relationlinks
	}
	
	
	renderEntityTypes() {
		const groupIcon = faCommentAlt
		const groupOpen = this.state.collapseOpen['entities']
		const groupArrow = groupOpen ? faAngleDown : faAngleRight
		const groupActive = false //allEntityPages.includes(this.props.page)
		const subLinks = entityTypes.map( (p,i) => <Link href={`/entity_counts/${p.id}`} key={"subentitylink_"+i} prefetch={false}><a className={"collapse-item" + (this.props.page == `/entity/${p.name}/all` ? ' active' : '')}><MyToolTip text="TODO: Insert description here" container={this.container}><div>{p.name}</div></MyToolTip></a></Link> )
		
		const entitylinks = 
			<MyToolTip text="Lists of different biomedical entities (e.g. Drugs) mentioned in published articles" container={this.container}>
			<li className={groupActive ? "nav-item active" : "nav-item"}>
				<a className="nav-link" href="#" onClick={event => { this.toggleGroup('entities'); event.preventDefault() } } aria-controls="example-collapse-text"
	aria-expanded={false}>
					<span className="icon" style={{marginRight: "0.25rem"}}>
						<FontAwesomeIcon className="sideicon" icon={groupIcon} fixedWidth width="0" />
					</span>
					<span> Entities</span>
					<div className="arrow" style={{"float":"right"}}>
						<FontAwesomeIcon icon={groupArrow} fixedWidth width="0" />
					</div>
				</a>
				<Collapse in={groupOpen}>
					<div className="collapsebox">
						<div className="bg-white py-2 collapse-inner rounded" style={{wordWrap:"break-word"}} >
							{subLinks}
						</div>
					</div>
				</Collapse>
			  </li>
			  </MyToolTip>
			  
		return entitylinks
	}
	
	render() {
		
		const hover = {
			
			'& a': {
				textDecoration: 'none',
				color: '#0000ee',
			},
			':hover': {
				color: '#0000ff',
			}
		};
		
		const showClass = this.props.responsiveShow || this.props.responsiveShow ? "sidebar-responsive-show" : "sidebar-responsive-hide"
		
		const relationlinks = this.renderRelationTypes()
				
		const entitylinks = this.renderEntityTypes()
		
		
		return (
	<ul className={"navbar-nav bg-gradient-primary sidebar sidebar-dark accordion " + showClass} id="accordionSidebar" style={{position:"relative"}} ref={this.container}>

		{/* Sidebar - Brand */}
		<Link href="/" prefetch={false}>
			<a className="sidebar-brand d-flex align-items-center justify-content-center">
				<div>
					<FontAwesomeIcon icon={faLandmark} />
				</div>
				<div className="sidebar-brand-text mx-2">{this.props.projectName}</div>
			</a>
		</Link>

		{/* Divider */}
		<hr className="sidebar-divider my-0" />

		{/* Nav Item - Dashboard */}
		<MyToolTip text="Overview of the coronavirus literature" container={this.container}>
			<li className={this.props.page=='/' ? "nav-item active" : "nav-item"}>
				<Link href="/index" as="/" prefetch={false}>
					<a className="nav-link">
						<span style={{marginRight: "0.25rem"}} >
							<FontAwesomeIcon className="sideicon" icon={faTachometerAlt} fixedWidth width="0" />
						</span>
						<span> Dashboard</span>
					</a>
				</Link>
			</li>
		</MyToolTip>

		{/* Divider */}
		<hr className="sidebar-divider my-0" />
		
		<div className="tour-trending m-0 p-0">
		<MyToolTip text="Articles from the last two weeks that are receiving attention in the media and on social media" container={this.container}>
			<li className={this.props.page=='/trending' ? "nav-item active mb-0" : "nav-item mb-0"}>
				<Link href="/trending" as="/trending" prefetch={false}>
					<a className="nav-link">
						<span style={{marginRight: "0.25rem"}}>
							<FontAwesomeIcon className="sideicon" icon={faChartLine} fixedWidth width="0" />
						</span>
						<span> Trending</span>
					</a>
				</Link>
			</li>
		</MyToolTip>
		</div>
		
		<hr className="sidebar-divider my-0" />
		
		<div className="tour-categories my-0">
			
			{relationlinks}
			
			<hr className="sidebar-divider my-0" />
			
			{entitylinks}
			
			<hr className="sidebar-divider my-0" />
			
			<MyToolTip text="A set of frequently asked questions to answer common inquiries about CoronaCentral and the methods used to build it." container={this.container}>
				<li className={this.props.page=='/faqs' ? "nav-item active" : "nav-item"}>
					<Link href="/faqs" as="/faqs" prefetch={false}>
						<a className="nav-link">
							<span style={{marginRight: "0.25rem"}}>
								<FontAwesomeIcon className="sideicon" icon={faQuestionCircle} fixedWidth width="0" />
							</span>
							<span> FAQs</span>
						</a>
					</Link>
				</li>
			</MyToolTip>
		</div>

		<div className="tour-categories my-0">
			
			
			
			<hr className="sidebar-divider my-0" />
			
			
			
			<hr className="sidebar-divider my-0" />
			
			<MyToolTip text="A set of frequently asked questions to answer common inquiries about CoronaCentral and the methods used to build it." container={this.container}>
				<li className={this.props.page=='/annotation_review' ? "nav-item active" : "nav-item"}>
					<Link href="/annotation_review" as="/annotation_review" prefetch={false}>
						<a className="nav-link">
							<span style={{marginRight: "0.25rem"}}>
								<FontAwesomeIcon className="sideicon" icon={faQuestionCircle} fixedWidth width="0" />
							</span>
							<span> Annotation Review</span>
						</a>
					</Link>
				</li>
			</MyToolTip>
		</div>
		

	</ul>
		)
	}
}
