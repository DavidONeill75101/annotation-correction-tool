import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavLink from 'react-bootstrap/NavLink';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import Search from '../components/Search.js'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { faVirus } from '@fortawesome/free-solid-svg-icons'

/* Topbar */
export default class Topbar extends Component {
	constructor(props) {
		super(props)
		this.state = { 
			menuShow: false
		}
	}
	
	// className="d-none d-sm-inline-block mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search"
	
	render() {
		
		return (
	<nav className="tour-search navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
		
		<button id="sidebarToggleTop" className="btn btn-link d-lg-none rounded-circle mr-3 text-secondary" onClick={event => this.props.toggleSidebar()}>
			<FontAwesomeIcon icon={faBars} />
		</button>

		<div style={{width:"100%"}}>
			<Search />
		</div>
		
		<div className="topbar-divider d-none d-sm-block"></div>

		<ul className="navbar-nav ml-auto">
			<li className="nav-item dropdown no-arrow">
				<a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
					data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					<span className="mr-2 d-none d-lg-inline text-gray-600 small">Douglas McGee</span>
					<img className="img-profile rounded-circle"
						src="/undraw_profile.svg" />
				</a>
				
			</li>
		</ul>
		
	</nav>
	)
	}
}
