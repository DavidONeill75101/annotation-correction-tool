import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
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
					<span className="mr-2 d-none d-lg-inline text-gray-600 small">
						{user ? (<a href="/api/auth/logout"><Button size="sm">Logout</Button></a>) : (<a href="/api/auth/login"><Button size="sm">Login</Button></a>)}
					</span>
				</a>
			</li>
		</ul>
	</nav>
  );
}
