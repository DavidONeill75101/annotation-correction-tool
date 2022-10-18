import React, { Component } from 'react';


export default class LightHeader extends Component {
	constructor(props) {
		super(props) //since we are extending className Table so we have to use super in order to override Component className constructor
		
		
	}
		
	render() {
		return <header className="page-header page-header-light bg-light mb-0">
					<div className="container-xl px-4">
						<div className="page-header-content pt-4">
							<div className="row align-items-center justify-content-between">
								<div className="col-auto mt-4">
									<h1 className="page-header-title">
										<div className="page-header-icon"><i data-feather="layout"></i></div>
										{this.props.title}
									</h1>
									<div className="page-header-subtitle">{this.props.subtitle}</div>
								</div>
							</div>
						</div>
					</div>
				</header>
	}
}
