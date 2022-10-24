import React, { Component } from 'react';

import Layout from '../components/Layout.js'



import { useUser } from "@auth0/nextjs-auth0";


export default function Settings() {
  const { user, error, isLoading } = useUser();
  const user_details = JSON.stringify(user)
  

  
  return (
    

	<Layout title="Settings" page="/settings" >
			
			<div className="d-sm-flex align-items-center justify-content-between mb-4 titlepadding">
				<h1 className="h3 mb-0 text-gray-800">Settings</h1>
				
			</div>
			
	</Layout>

   
  );
}