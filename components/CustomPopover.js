import React, { Component, useState, useRef } from 'react';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Overlay from 'react-bootstrap/Overlay'
import Popover from 'react-bootstrap/Popover'
import Button from 'react-bootstrap/Button'
import Tooltip from 'react-bootstrap/Tooltip'

export default class CustomPopover extends Component {
	constructor(props) {
		super(props)
		this.state = {
			show: false,
			ignoreHide: false
		}
		
		this.hideTimer = 0;
		this.startHideTimer = this.startHideTimer.bind(this);
		this.show = this.show.bind(this);
		this.hide = this.hide.bind(this);
	}
	
	componentWillUnmount() {
		if (this.hideTimer) {
			clearTimeout(this.hideTimer)
			this.hideTimer = 0
		}
	}
	
	startHideTimer() {
		this.hideTimer = setTimeout(this.hide, 1000)
		this.setState({ignoreHide: false})
	}
	
	show() {
		this.setState({show: true, ignoreHide: true})
	}
	
	hide() {
		if (!this.state.ignoreHide && !this.props.alwaysShow)
			this.setState({show: false})
	}
		
	render() {		
		const popover = (
		  <Popover onMouseEnter={this.show} onMouseLeave={this.startHideTimer}>
			{this.props.popoverContents}
		  </Popover>
		);
		
		return <OverlayTrigger placement="bottom" overlay={popover} show={this.state.show || this.props.alwaysShow}>
			<span onMouseEnter={this.show} onMouseLeave={this.startHideTimer}>{this.props.children}</span>
			</OverlayTrigger>
	}
}
