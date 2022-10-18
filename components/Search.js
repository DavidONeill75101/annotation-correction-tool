import React, { Component, Fragment } from 'react';
import axios from 'axios';
import Router from 'next/router'
import AsyncSelect from 'react-select/async';
import { components, MultiValueGenericProps } from 'react-select';

import Form from 'react-bootstrap/Form';
import Popover from 'react-bootstrap/Popover'

import CustomPopover from './CustomPopover.js'

const MultiValueLabel = (props,onChange) => {
	const index = props.data.index
	const label = props.data.label
	const params = props.data.params
	
	const autoOrManual = params['autoOrManual']
	
	const autoOrManualOptions = <Form>
		<Form.Check
            type="radio"
            label="Auto annotations"
            value="auto"
			checked={autoOrManual=='auto'}
			onChange={evt => onChange(index,'autoOrManual','auto')}
          />
		<Form.Check
            type="radio"
            label="Manual annotations"
            value="manual"
			checked={autoOrManual=='manual'}
			onChange={evt => onChange(index,'autoOrManual','manual')}
          />
		<Form.Check
            type="radio"
            label="Either"
            value="either"
			checked={autoOrManual=='either'}
			onChange={evt => onChange(index,'autoOrManual','either')}
          />
	</Form>
	
	const labelWithAutoManual = autoOrManual == 'either' ? label : label + ' : ' + autoOrManual
	
	const popoverContents = <>
			<Popover.Header as="h3">
				<div style={{display:"flex", flexDirection: 'row', alignItems: "center" }}>
					<div style={{flexGrow:1}}>
						{label}
					</div>
					<div style={{width:"10px"}}></div>
					
				</div>
			</Popover.Header>
			<Popover.Body>
				<div style={{maxHeight:"200px", overflowY:"auto" }}>
					{autoOrManualOptions}
				</div>
			</Popover.Body>
		</>
	
	return (
		<CustomPopover
			popoverContents={popoverContents}>
			<components.MultiValueLabel {...props}>{labelWithAutoManual}</components.MultiValueLabel>
		</CustomPopover>
	)
}

export default class Search extends Component {
	constructor(props) {
		super(props)
		this.state = {
			chosen: []
			}
			
		this.showGeneralSearch = false
			
		this.search = this.search.bind(this);
		this.fetchOptions = this.fetchOptions.bind(this);
		this.onSearchChange = this.onSearchChange.bind(this);
		this.onParamsChange = this.onParamsChange.bind(this);
	}
	
	onSearchChange(chosen) {
		var chosenWithIndex = []
		chosen.forEach( (c,i) => {
			c['index'] = i
			c.params['autoOrManual'] = c.params['autoOrManual'] ? c.params['autoOrManual'] : 'either'
			chosenWithIndex.push(c)
		})
		
		this.setState({chosen:chosenWithIndex})
	}
	
	onParamsChange(index,key,value) {
		const copyOfChosen = this.state.chosen.map( src => {
			var copy = {}
			Object.assign(copy, src);
			return copy
		})
		
		copyOfChosen[index].params[key] = value
		this.setState({chosen: copyOfChosen})
	}
	
	fetchOptions(query, callback) {
		var fetchURL = '/api/searchbar'
		const params = {q: query}
		
		axios.get(fetchURL, {
			params: params
		})
		.then(function (response) {
			const searchResults = response.data
			
			callback(searchResults)
		})
		.catch(function (error) {
			console.log(error);
		})
		.then(function () {
			// always executed
		});
	}
	
	search() {
		if (this.state.chosen.length > 0) {
			const chosenValuesWithAutoManual = this.state.chosen.map(c => c.value+':'+c.params['autoOrManual'])
			const query = chosenValuesWithAutoManual.join('|')
			
			const url = "/sentencesearch/" + query
			Router.push("/sentencesearch/[...query]",url)
		}
	}
	
	render() {
		const loadOptions = (inputValue,callback) => {
			this.fetchOptions(inputValue, callback)
		};
		
		const MultiValueLabelMaker = props => MultiValueLabel(props,this.onParamsChange)
		
		const searchBox = <AsyncSelect
			loadOptions={loadOptions}
			isMulti={true}
			components={{
				DropdownIndicator:() => null, 
				IndicatorSeparator: () => null,
				MultiValueLabel: MultiValueLabelMaker
			}}
			onChange={this.onSearchChange}
			onKeyDown={evt => { if (evt.code == 'Enter') this.search() }}
			instanceId="searchbar"
			value={this.state.chosen}
		/>
		
		return searchBox
	}
}

