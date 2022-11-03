import React, { Component, useState, useRef } from 'react';
import Overlay from 'react-bootstrap/Overlay'
import Tooltip from 'react-bootstrap/Tooltip'


export default function MyToolTip(props) {
	const [show, setShow] = useState(false);
	const target = useRef(null);
	const tooltipText = props.text

	return (
		<>
			<span ref={target} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
				{props.children}
			</span>
			<Overlay target={target.current} show={show} placement="right" container={props.container}>
				{(props) => <Tooltip id="overlay-example" {...props}>
						{tooltipText}
					</Tooltip>
				}
			</Overlay>
		</>
	);
}
