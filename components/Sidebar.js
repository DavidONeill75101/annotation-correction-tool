import React, { Component } from 'react';

import Link from 'next/link'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faPaintbrush, faDna, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

import MyToolTip from './MyToolTip'


export default class Sidebar extends Component {
	constructor(props) {
		super(props)
		this.container = React.createRef()
	}
	
	
	render() {
				
		const showClass = this.props.responsiveShow || this.props.responsiveShow ? "sidebar-responsive-show" : "sidebar-responsive-hide"
			
		
		return (
			<ul className={"navbar-nav bg-gradient-primary sidebar sidebar-dark accordion " + showClass} id="accordionSidebar" style={{position:"relative"}} ref={this.container}>

				<Link href="/" prefetch={false}>
					<a className="sidebar-brand d-flex align-items-center justify-content-center">
						<div>
							<FontAwesomeIcon icon={faDna} />
						</div>
						<div className="sidebar-brand-text mx-1">CIViCMine Annotation Review</div>
					</a>
				</Link>

				<div className="tour-categories my-0">	
					<hr className="sidebar-divider my-0" />		
						<hr className="sidebar-divider my-0" />
					<MyToolTip text="Review the relations extracted from documents in CIViCMine" container={this.container}>
						<li className={this.props.page=='/annotation_review' ? "nav-item active" : "nav-item"}>
							<Link href="/" prefetch={false}>
								<a className="nav-link">
									<span style={{marginRight: "0.25rem"}}>
										<FontAwesomeIcon className="sideicon" icon={faPaintbrush} fixedWidth width="0" />
									</span>
									<span> Annotation Review</span>
								</a>
							</Link>
						</li>
					</MyToolTip>
				</div>

		
				<div className="tour-categories my-0">	
					<hr className="sidebar-divider my-0" />		
						<hr className="sidebar-divider my-0" />
					<MyToolTip text="Get to know the annotation criteria" container={this.container}>
						<li className={this.props.page=='/annotation_guide' ? "nav-item active" : "nav-item"}>
							<Link href="/annotation_guide" prefetch={false}>
								<a className="nav-link">
									<span style={{marginRight: "0.25rem"}}>
										<FontAwesomeIcon className="sideicon" icon={faQuestionCircle} fixedWidth width="0" />
									</span>
									<span> Annotation Guide</span>
								</a>
							</Link>
						</li>
					</MyToolTip>
				</div>

				<div className="tour-categories my-0">	
					<hr className="sidebar-divider my-0" />		
						<hr className="sidebar-divider my-0" />
					<MyToolTip text="Customise your settings" container={this.container}>
						<li className={this.props.page=='/settings' ? "nav-item active" : "nav-item"}>
							<Link href="/settings" as="/settings" prefetch={false}>
								<a className="nav-link">
									<span style={{marginRight: "0.25rem"}}>
										<FontAwesomeIcon className="sideicon" icon={faGear} fixedWidth width="0" />
									</span>
									<span> Settings</span>
								</a>
							</Link>
						</li>
					</MyToolTip>
				</div>
			</ul>
		)
	}
}
