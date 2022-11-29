import React, { Component } from 'react';

import { useUser } from "@auth0/nextjs-auth0";

import Layout from '../components/Layout.js'


export default function Settings() {
 
  return (
    
	<Layout title="Settings" page="/settings" >
			
			<div className="d-sm-flex align-items-center justify-content-between mb-4 titlepadding">
				<h1 className="h3 mb-0 text-gray-800">Settings</h1>			
			</div>
			
	</Layout>
   
  )
}