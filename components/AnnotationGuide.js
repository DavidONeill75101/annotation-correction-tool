import React, { Component } from 'react';

import Link from 'next/link'

import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table'
import { Col, Container, Row } from 'react-bootstrap';




export default class AnnotationGuide extends Component {

	constructor(props) {
		super(props)
		this.state = {
					
		}
		
        this.get_user = this.get_user.bind(this);
        this.update_read_guide = this.update_read_guide.bind(this);
        this.create_user = this.create_user.bind(this);
		
	}


    create_user(){
        var self = this

        const fetchURL = '/api/update_data/add_user?email=' + this.props.user

        axios.get(fetchURL)
            .then(function (response) {
                const res = response.data
                self.setState({
                    user: res
                })
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
            });
    }


    get_user(){
        var self = this

        const fetchURL = '/api/get_data/get_user?email=' + this.props.user

        axios.get(fetchURL)
            .then(function (response) {
                const res = response.data

                if (res == '') {
                    self.create_user()
                }else{
                    self.setState({
                        user: res
                    })
                }
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
            });
    }


    update_read_guide(){


        var self = this

        const fetchURL = '/api/update_data/read_guide?user_id=' + this.state.user.id

        axios.get(fetchURL)
            .then(function (response) {
                const res = response.data
                
                self.setState({
                    user: res
                })
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
            });   
    }


    componentDidMount(){
        
        this.get_user()
    }

	
	


	render() {

		
        var declaration = <Button className='mb-5' size="sm" onClick={this.update_read_guide}>
                                Confirm that I have read and understood the annotation guide
                          </Button>

        if (this.state.user && this.state.user.read_guide) {
            declaration = ''
        }


		return (
            <div>

                { declaration }
                
                <div className="d-sm-flex align-items-center justify-content-between mb-4 titlepadding">
                    <h1 className="h1 mb-0 text-gray-800">CIViCMine Annotation Guidelines</h1>					
                </div>

                <div>
                    The goal of CIViCmine is to identify papers that contain evidence items that should be curated into the CIViC database. 
                    CIViCmine focuses on individual sentences from these papers (due to the current limit of text mining technology). 
                    It is a supervised machine learning system and so requires annotated sentences to learn from.
                </div>

                <br></br>

                <div>
                    The annotation process has already been carried out, and the machine learning tool has made predictions.  
                    The goal of this review tool is to determine whether these predictions are accurate or not, with the goal of taking these corrections and using them to retrain the machine learning model.  
                    You can select to view the sentences associated to any evidence item which has been predicted by CIViCMine and provide a "thumbs up" or a "thumbs down" for each sentence.
                    A <strong>"thumbs up"</strong> indicates that you believe the sentence accurately indicates the given relation.
                    A <strong>"thumbs down"</strong> indicates that you believe the sentence does not accurately indicate the given relation.
                </div>

                <br></br>
                <div>
                    An evidence item will contain entities and an evidence type.
                    You must decide whether these entities are associated with a Diagnostic, Prognostic/Predictive or Predisposing evidence item, or no evidence item at all. 
                    It may be possible that entities are associated in multiple evidence types (e.g. Diagnostic and Prognostic/Predictive). 
                    Below is a summary of the key points required for the four types of evidence types. 
                    There is then an outline of several example sentences and additional notes on annotation.
                </div>

                <br></br>
                <div>
                    The sentences will contain multiple entities of different types including genes, cancer types and drugs. 
                    The sentence will also mention an aberration associated with the gene. 
                    This may be a amino acid substitution (e.g. V600E), a deletion, amplification, methylation or change of expression. 
                    However the specific aberration does not form part of this stage of annotation.
                </div>

                <br></br>
                
                <div>
                    <h2 className="h2 mb-0 text-gray-800">Evidence Types</h2>			
                </div>

                <br></br>

                <div>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Evidence Type</th>
                                <th>Entities</th>
                                <th>Description</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Diagnostic</td>
                                <td>Gene & Cancer</td>
                                <td>Describes a genomic/transcriptomic aberration that is essential in diagnosing that type of cancer or a subtype of that cancer.</td>
                            </tr>

                            <tr>
                                <td>Prognostic</td>
                                <td>Gene & Cancer</td>
                                <td>Describes a genomic/transcriptomic aberration that correlates with survival/outcome for a particular cancer type without a particular drug.</td>
                            </tr>

                            <tr>
                                <td>Predictive</td>
                                <td>Gene, Cancer & Drug</td>
                                <td>Describes a genomic/transcriptomic aberration that correlates with survival/outcome for a particular cancer type with a particular drug.</td>
                            </tr>

                            <tr>
                                <td>Predisposing</td>
                                <td>Gene & Cancer</td>
                                <td>Describes a genomic/transcriptomic aberration that affects the risk of developing a type of cancer</td>
                            </tr>

                        </tbody>
                    </Table>
                </div>

                <br></br>

                <div>
                    <div>
                        <h2 className="h2 mb-0 text-gray-800">Sentence Examples</h2>			
                    </div>
                </div>

                <br></br>

                <div>
                    This section outlines several example sentences that contain the different evidence types outlined above. 
                    The various entities in each sentence are in bold.
                </div>

                <br></br>

                <div>
                    <div>
                        <h3 className="h3 mb-0 text-gray-800">Diagnostic</h3>			
                    </div>
                </div>

                <br></br>

                <div>
                    Expression of <strong>CD-117</strong> is the diagnostic marker for <strong>GIST</strong> and is the transmembrane tyrosine kinase receptor also known as <strong>KIT</strong> or <strong>c-KIT</strong> (PMID: 17229322)
                </div>

                <br></br>

                <div>
                    <div>
                        <h3 className="h3 mb-0 text-gray-800">Prognostic / Predictive</h3>			
                    </div>
                </div>

                <br></br>

                <div>
                    <strong>MLH1</strong> expression after chemotherapy is an independent predictive factor for poor disease-free survival and may, therefore, define a group of patients with drug-resistant <strong>breast cancer</strong>. (PMID: 10623697)
                </div>

                <div>
                    <div>
                        <h3 className="h3 mb-0 text-gray-800">Predisposing</h3>			
                    </div>
                </div>

                <br></br>

                <div>
                    Transforming growth factor beta1 gene (<strong>TGFB1</strong>) variant Leu10Pro (L10P) has previously been implicated in <strong>prostate</strong> cancer risk and radiation-induced side-effects. (PMID: 19039592) 
                </div>
            </div>
		)
	}
}
