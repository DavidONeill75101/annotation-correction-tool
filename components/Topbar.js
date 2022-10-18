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
				
		<div className="topbar-divider d-none d-sm-block"></div>

		<ul className="navbar-nav ml-auto">
			<li className="nav-item dropdown no-arrow">
				<a className="nav-link dropdown-toggle" href="/registration" as="/registration" id="userDropdown" role="button"
					data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					<span className="mr-2 d-none d-lg-inline text-gray-600 small">Register</span>
					
				</a>
				
			</li>

			<li className="nav-item dropdown no-arrow">
				<a className="nav-link dropdown-toggle" href="/login" as="/login" id="userDropdown" role="button"
					data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					<span className="mr-2 d-none d-lg-inline text-gray-600 small">Login</span>

				</a>
				
			</li>
		</ul>
		
	</nav>
	)
	}
}
