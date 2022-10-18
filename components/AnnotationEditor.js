import React, { Component, useState, useRef } from 'react';
import axios from 'axios';

import EntityAnnotation from './EntityAnnotation.js'
import RelationAnnotation from './RelationAnnotation.js'

const validHTMLTags = ["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "big", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "label", "legend", "li", "link", "main", "map", "mark", "meta", "meter", "nav", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "small", "source", "span", "strike", "strong", "style", "sub", "summary", "sup", "svg", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"];

function onMouseUp(evt) {
	
}

function spanContainsSpan(parentSpan, childSpan) {
	const parentStart = parentSpan[0]
	const parentEnd = parentSpan[0] + parentSpan[1]
	
	const childStart = childSpan[0]
	const childEnd = childSpan[0] + childSpan[1]
	
	const contains = (parentStart <= childStart && childEnd <= parentEnd)
	
	return contains
}

function intersectsButNotContains(spanA, spanB) {
	const startA = spanA[0]
	const endA = spanA[0] + spanA[1]
	
	const startB = spanB[0]
	const endB = spanB[0] + spanB[1]
	
	const startBInsideA = (startA < startB && startB < endA)
	const endBInsideA = (startA < endB && endB < endA)
	
	const intersects = ( startBInsideA && !endBInsideA ) || ( !startBInsideA && endBInsideA )
	
	return intersects
}

function sortSpan(a, b) {
	// Input spans are [start, length, tag, attribs]
	
	// Sort so that earlier span come first
	const sortByStart = a[0] - b[0] 
	if (sortByStart != 0)
		return sortByStart
	
	// Sort so that longer span (that start at the same location) come first
	const sortByLength = b[1] - a[1] 
	if (sortByLength != 0)
		return sortByLength
	
	// If the span location & length match, then sort by the tag
	const sortByTag = a[2] == b[2] ? (a[2] < b[2] ? -1 : 1) : 0 
	return sortByTag
}



export default class AnnotationEditor extends Component {
	constructor(props) {
		super(props)
		this.state = {
			//txt: "The quick brown fox jumped over the lazy dog",
			//spans: [ [4,5,'b',{}], [16,3,'b',{}] ]
			
			loaded: false,
			candidateEntity: null,
			candidateRelation: null,
			startedRelation: null,
			windowWidth: 0,
			refs: {}
			}
			
		this.editorkey = 'key_'+this.props.editorkey
			
		this.mouseUp = this.mouseUp.bind(this);
		this.refreshFromDB = this.refreshFromDB.bind(this);
		this.addEntityAnnotationToDB = this.addEntityAnnotationToDB.bind(this);
		this.addRelationAnnotationToDB = this.addRelationAnnotationToDB.bind(this);
		this.editEntityAnnotationInDB = this.editEntityAnnotationInDB.bind(this);
		this.deleteEntityAnnotationFromDB = this.deleteEntityAnnotationFromDB.bind(this);
		this.deleteRelationAnnotationFromDB = this.deleteRelationAnnotationFromDB.bind(this);
		this.startRelation = this.startRelation.bind(this);
		this.joinRelation = this.joinRelation.bind(this);
		this.clearCandidateEntity = this.clearCandidateEntity.bind(this);
		this.clearCandidateRelation = this.clearCandidateRelation.bind(this);
		this.spansToTree = this.spansToTree.bind(this);
		this.receiveRef = this.receiveRef.bind(this);
		
	}
	
	receiveRef(id, ref) {
		this.setState(prevState => {
		  let refs = Object.assign({}, prevState.refs);
		  refs[id] = ref;
		  return { refs };
		})
	}
	
	spansToTree(txt, spans, offset=0, tag='div', attribs={}) {
		spans = spans.slice().sort(sortSpan)
		
		var head = txt
		if (spans.length > 0) {
			var firstSpanStart = spans[0][0]
			head = txt.substring(0,firstSpanStart)
		}
		
		var children = [head] //head.trim() != '' ? [head] : []
		while (spans.length > 0) {
			var currentSpan = spans.shift()
			
			var isSubspan = spans.map(x => spanContainsSpan(currentSpan, x))
			
			var subspans = spans.filter( (x,i) => isSubspan[i] )
			spans = spans.filter( (x,i) => !isSubspan[i] )
			
			const currentSpanStart = currentSpan[0]
			const currentSpanEnd = currentSpan[0] + currentSpan[1]
			var tail = ''
			if (spans.length > 0) {
				const nextSpanStart = spans[0][0]
				tail = txt.substring(currentSpanEnd, nextSpanStart)
			} else {
				tail = txt.substring(currentSpanEnd)
			}
			
			const subtext = txt.substring(currentSpanStart,currentSpanEnd)
			
			//if (subtext.trim() != '') {
				subspans = subspans.map( x => [ x[0]-currentSpanStart, x[1], x[2], x[3] ] )
				
				var childElem = this.spansToTree(subtext, subspans, offset+currentSpan[0], currentSpan[2], currentSpan[3])
				
				children.push(childElem)
			//}
			
			//if (tail.trim() != '')
				children.push(tail)
		}
		
		attribs['__editorkey'] = this.editorkey
		attribs['__start'] = offset
		attribs['__end'] = offset + txt.length
		attribs['key'] = tag + '_' + offset + '_' + txt.length
		attribs['text'] = txt
		
		// Convert some keys over to their React equivalents
		const remapKeys = (o,r) => {
			Object.keys(r).map( k => {
				if (k in o) {
					const newK = r[k]
					o[newK] = o[k]
					delete o[k]
				}
			} )
			return o
		}
		
		const reactKeyRemap = {'cellspacing':'cellSpacing', 'cellpadding':'cellPadding', 'colspan':'colSpan', 'rowspan':'rowSpan'}
		
		attribs = remapKeys(attribs, reactKeyRemap)
		
		// Style cannot be a string here (so quick fix to remove it)
		if ('style' in attribs) {
			delete attribs['style']
		}
		
		var elem
		if (tag == 'EntityAnnotation') {
			const disabled = this.state.candidateRelation || this.state.startedRelation == attribs['entityAnnotationId']
			const showJoinRelation = this.state.startedRelation && this.state.startedRelation != attribs['entityAnnotationId']
			
			elem = <EntityAnnotation 
						key={attribs['key']} 
						id={attribs['entityAnnotationId']} 
						passbackRef={this.receiveRef} 
						reject={evt => this.deleteEntityAnnotationFromDB(attribs)} 
						edit={this.editEntityAnnotationInDB}
						startRelation={evt => this.startRelation(attribs)} 
						joinRelation={evt => this.joinRelation(attribs)}
						showJoinRelation={showJoinRelation}
						disabled={disabled} 
						attribs={attribs}>{children}</EntityAnnotation>
		} else if (tag == 'CandidateAnnotation') {
			elem = <EntityAnnotation 
						key={attribs['key']} 
						reject={this.clearCandidateEntity} 
						accept={this.addEntityAnnotationToDB} 
						isCandidate={true} 
						attribs={attribs}>{children}</EntityAnnotation>
		} else if (tag == 'sec') {
			elem = <div {...attribs}>{children}</div>
		} else if (tag == 'article-title' && !this.props.noHeaders) {
			elem = <h2 {...attribs}>{children}</h2>
		} else if (tag == 'title' && !this.props.noHeaders) {
			elem = <h3 {...attribs} style={{display: "inline"}}>{children}</h3>
		} else if (tag == 'label' && !this.props.noHeaders) {
			elem = <h4 {...attribs} style={{display: "inline", paddingRight: "5px"}}>{children}</h4>
		} else if (tag == 'abstract-label' && !this.props.noHeaders) {
			elem = <h5 {...attribs} style={{display: "inline", paddingRight: "5px"}}>{children}</h5>
		} else if (tag == 'caption' && !this.props.noHeaders) {
			elem = <h5 {...attribs}>{children}</h5>
		} else if (validHTMLTags.includes(tag)) {
			elem = React.createElement(tag, attribs, children)
		} else {
			elem = <React.Fragment key={attribs['key']}>{children}</React.Fragment>
		}

		return elem
	}
	
	clearCandidateEntity() {
		this.setState({candidateEntity: null})
	}
	
	clearCandidateRelation() {
		this.setState({candidateRelation: null})
	}
	
	mouseUp(evt) {
		var selection = null
		if (window.getSelection) {
			selection = window.getSelection();
		}
		else if (document.getSelection) {
			selection = document.getSelection();
		} else if (document.selection) {
			selection = document.selection.createRange().text;
		}
		
		const hasKey = (node,key) => (node.hasAttribute && node.hasAttribute(key))
		const valueMatches = (node,key,val) => (hasKey(node,key) && node.getAttribute(key) == val)
		
		var selectionStart = -1
		if (selection.anchorNode) {
			if (selection.anchorNode.previousSibling) {
				const startNode = selection.anchorNode.previousSibling
				if (hasKey(startNode,'__end') && valueMatches(startNode,'__editorkey',this.editorkey)) {
					const elementOffset = parseInt(startNode.getAttribute('__end'))
					selectionStart = selection.anchorOffset + elementOffset
				}
			} else {
				const startNode = selection.anchorNode.parentNode
				if (hasKey(startNode,'__start') && valueMatches(startNode,'__editorkey',this.editorkey)) {
					const elementOffset = parseInt(startNode.getAttribute('__start'))
					selectionStart = selection.anchorOffset + elementOffset
				}
			}
		}
		
		var selectionEnd = -1
		if (selection.focusNode) {
			if (selection.focusNode.previousSibling) {
				const endNode = selection.focusNode.previousSibling
				if (hasKey(endNode,'__end') && valueMatches(endNode,'__editorkey',this.editorkey)) {
					const elementOffset = parseInt(endNode.getAttribute('__end'))
					selectionEnd = selection.focusOffset + elementOffset
				}
			} else {
				const endNode = selection.focusNode.parentNode
				if (hasKey(endNode,'__start') && valueMatches(endNode,'__editorkey',this.editorkey)) {
					const elementOffset = parseInt(endNode.getAttribute('__start'))
					selectionEnd = selection.focusOffset + elementOffset
				}
			}
		}
		
		if (selectionStart > selectionEnd) {
			[selectionStart, selectionEnd] = [selectionEnd, selectionStart]
		}
				
		if (selectionStart > -1 && selectionEnd > -1 && selectionStart < selectionEnd) {
			var newSpans = this.state.spans//.slice()
			const newSpan = [selectionStart,selectionEnd-selectionStart,'CandidateAnnotation',{}]
			
			//newSpans = newSpans.filter( s => !intersectsButNotContains(s, newSpan) )
			
			//newSpans.push( newSpan )
			
			this.setState({candidateEntity:newSpan})
			
			//this.setState({spans:newSpans})
			
			//this.addSpanToDB(newSpan)
		}
		//const startNodeOffset = 
		//
	}
	
	startRelation(attribs) {
		this.setState({startedRelation: attribs['entityAnnotationId'], candidateEntity:null})
	}
	
	joinRelation(attribs) {
		const candidateRelation = {
			isCandidate: true,
			srcId:this.state.startedRelation,
			dstId:attribs['entityAnnotationId']}
		this.setState({candidateRelation:candidateRelation, startedRelation: null, candidateEntity:null})
	}
	
	deleteEntityAnnotationFromDB(attribs) {
		var self = this
		axios.get('/api/annotation_delete', {
			params: {
				entityAnnotationId: attribs.entityAnnotationId
			}
		})
		.then(function (response) {
			self.refreshFromDB()
		})
		.catch(function (error) {
			console.log(error);
		})
		.then(function () {
			// always executed
		});
	}
	
	deleteRelationAnnotationFromDB(relationAnnotation) {
		var self = this
		axios.get('/api/relation_delete', {
			params: {
				relationAnnotationId: relationAnnotation.id
			}
		})
		.then(function (response) {
			self.refreshFromDB()
		})
		.catch(function (error) {
			console.log(error);
		})
		.then(function () {
			// always executed
		});
	}
	
	addRelationAnnotationToDB(relationTypeId) {
		const candidateRelation = this.state.candidateRelation
		this.clearCandidateRelation()
		
		var self = this
		axios.get('/api/relation_add', {
			params: {
				documentid: this.state.documentid,
				relationTypeId: relationTypeId,
				srcId: candidateRelation.srcId,
				dstId: candidateRelation.dstId
			}
		})
		.then(function (response) {
			self.refreshFromDB()
		})
		.catch(function (error) {
			console.log(error);
		})
		.then(function () {
			// always executed
		});
	}
	
	addEntityAnnotationToDB(entityId) {
		const span = this.state.candidateEntity
		this.clearCandidateEntity()
		
		const attribs = span[3]
		
		var self = this
		axios.get('/api/annotation_add', {
			params: {
				documentid: this.state.documentid,
				start: span[0],
				end: span[0]+span[1],
				entityId: entityId,
				name: attribs.text
			}
		})
		.then(function (response) {
			self.refreshFromDB()
		})
		.catch(function (error) {
			console.log(error);
		})
		.then(function () {
			// always executed
		});
	}
	
	editEntityAnnotationInDB(entityAnnotationId,entityId) {
		var self = this
		axios.get('/api/annotation_edit', {
			params: {
				entityAnnotationId: entityAnnotationId,
				entityId: entityId
			}
		})
		.then(function (response) {
			self.refreshFromDB()
		})
		.catch(function (error) {
			console.log(error);
		})
		.then(function () {
			// always executed
		});
	}
	
	refreshFromDB() {
		var self = this
		
		var fetchURL = '/api/document_get'
		var params = {documentId: this.props.documentId}
		if (this.props.sentenceId) {
			fetchURL = '/api/sentence_get'
			params = {sentenceId: this.props.sentenceId}
		}
		
		axios.get(fetchURL, {
			params: params
		})
		.then(function (response) {
			const doc = response.data
			
			self.setState( {
				documentid: doc.id,
				pmid: doc.pmid,
				pmcid: doc.pmcid,
				txt: doc.contents,
				spans: doc.entityAnnotations.concat(doc.formatting),
				relations: doc.relationAnnotations,
				offset: doc.offset,
				loaded: true
			} )
		})
		.catch(function (error) {
			console.log(error);
		})
		.then(function () {
			// always executed
		});  
	}
	
	componentDidMount() {
		document.addEventListener("mouseup", this.mouseUp);
		
		this.refreshFromDB()
	}
	
	componentWillUnmount() {
	// Make sure to remove the DOM listener when the component is unmounted.
		document.removeEventListener("mouseup", this.mouseUp);
	}
	
	render() {
		if (!this.state.loaded)
			return <div>Loading...</div>
		//const mytext = <>The quick <b>brown</b> fox jumped over the lazy dog</>
		
		var spans_with_candidate = this.state.spans.slice()
		if (this.state.candidateEntity)
			spans_with_candidate.push(this.state.candidateEntity)
				
		const spans_minus_offset = spans_with_candidate.map( s => [s[0]-this.state.offset,s[1],s[2],s[3]] )
		var tree = this.spansToTree(this.state.txt, spans_minus_offset, this.state.offset)
		
		const getEntity = entityId => entityId in this.state.refs ? this.state.refs[entityId] : null
		
		
		var relations_with_candidate = this.state.relations.slice()
		if (this.state.candidateRelation)
			relations_with_candidate.push(this.state.candidateRelation)
		
		const rejectRelation = r => r.isCandidate ? this.clearCandidateRelation() : this.deleteRelationAnnotationFromDB(r)
		
		const relations = relations_with_candidate.map( r => <RelationAnnotation 
			key={r.srcId+'_'+r.dstId} 
			src={getEntity(r.srcId)} 
			dst={getEntity(r.dstId)} 
			relation={r} 
			accept={this.addRelationAnnotationToDB}
			reject={evt => rejectRelation(r)}
			windowWidth={this.state.windowWidth} /> )
		
		var docMetadata = ''
		if (this.props.showMetadata) {
			
			const pmidText = this.state.pmid ? <p style={{marginBottom: "0px"}}>PMID: <a href={"https://pubmed.ncbi.nlm.nih.gov/"+this.state.pmid} target="_blank">{this.state.pmid}</a></p> : null
			
			const pmcidText = this.state.pmcid ? <p>PMCID: <a href={"https://www.ncbi.nlm.nih.gov/pmc/articles/PMC"+this.state.pmcid} target="_blank">{this.state.pmcid}</a></p> : null
			
			docMetadata = <div style={{textAlign: "right", fontSize: "small"}}>
				{pmidText}
				{pmcidText}
			</div>
		}
		
		return <div>{docMetadata}{tree}{relations}</div>
	}
}
