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

import { useUser } from "@auth0/nextjs-auth0"


export default function TopBar() {
  const { user } = useUser();
  return (

    <nav className="tour-search navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
				
		<div className="topbar-divider d-none d-sm-block"></div>

		<ul className="navbar-nav ml-auto">
			
			<li className="nav-item dropdown no-arrow">
				<a className="nav-link dropdown-toggle" href="/api/auth/login" as="/login" id="userDropdown" role="button"
					data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					<span className="mr-2 d-none d-lg-inline text-gray-600 small">{user ? (
            <a href="/api/auth/logout">Logout</a>
          ) : (
            <a href="/api/auth/login">Login</a>
          )}</span>

				</a>
				
			</li>
		</ul>
		
	</nav>
  
  );
}
