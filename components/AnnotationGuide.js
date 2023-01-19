import React, { Component } from 'react';

import Link from 'next/link'

import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table'


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
                
                <div>
                    <div>
                        <h1 className="h1 mb-0 text-gray-800 mb-2">BLUF</h1>			
                    </div>

                    <ul className="mt-3">
                        <li> <a href="http://bionlp.bcgsc.ca/civicmine/">CIViCMine</a> is a BioNLP platform which predicts relations between genes, cancers and drugs.</li>
                        <li>Some of these predictions are incorrect - it is your mission is to review them.</li>
                        <li>A prediction is made based upon a sentence annotation and consists of a cancer, gene, drug (optional) and type of relation.</li>
                        <li>If the sentence annotation is valid for the given relation then give it a "thumbs up".</li>
                        <li>If not, give it a "thumbs down".</li>
                        <li>If you know how the incorrect annotation should be fixed, you can manually annotate the sentence to identify the true relation.</li>
                        <li>To manually annotate, highlight the entities in the sentence and their types.</li>
                        <li>Then add relations between these entities along with the type of relation.</li>
                    </ul>
                </div>

                <br></br>

                <div>
                    <h2 className="h2 mb-3 text-gray-800">Why?</h2>
                </div>

                <div>
                    The <a href="http://bionlp.bcgsc.ca/civicmine/">CIViCMine</a> BioNLP platform predicts relations between genes, cancers and drugs.
                    By identifying these relations in biomedical literature the tool hopes to aid the field of precision oncology, the main benefit being that researchers do not need to trawl through many research papers to identify relations.
                    Simply, CIViCMine does the heavy lifting by predicting these relations automatically.
                    As with all machine learning tools, however, CIViCMine inevitably makes inaccurate predictions.
                    The purpose of this application is to review these predictions and make corrections if necessary.
                    With these reviews and corrections, new training data can be generated to improve the CIViCMine training process and ultimately produce more accurate predictions.
                </div>

                <br></br>

                <div>
                    <h2 className="h2 mb-3 text-gray-800">What?</h2>
                </div>
                
                <div>
                    <ul>
                        <li>In order to make accurate judgements of CIViCMine predictions, it is necessary to understand what types of relations exist.</li>
                        <li>The CIViCMine tool reads a sentence taken from biomedical literature and identifies whether it illustrates the presence of a relation.</li>
                        <li>A relation will consist of entities and an evidence type.</li>
                        <li>An entity can be a type of gene, cancer or drug which is present in the sentence.</li>
                        <li>An evidence type outlines the type of relationship which exists between these entities.</li>
                        <li>The table below demonstrates the types of relation which can exist.</li>
                    </ul>

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

                    These types of relation can be observed in the examples of sentence annotations below, with highlighted text denoting an entity.
                    This tool allows you to observe such examples, and decide whether they are correct or not.

                    <br></br>

                    <div className="mt-3">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Evidence Type</th>
                                    <th>Sentence</th>                                    
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Diagnostic</td>
                                    <td>Expression of <strong>CD-117</strong> is the diagnostic marker for <strong>GIST</strong> and is the transmembrane tyrosine kinase receptor also known as <strong>KIT</strong> or <strong>c-KIT</strong> (PMID: 17229322)</td>
                                </tr>

                                <tr>
                                    <td>Diagnostic</td>
                                    <td>Thus, the methylation status of <strong>RUNX3</strong>  may be a better diagnostic marker for <strong>bladder cancer</strong> than previously described markers. (PMID: 19662195)</td>
                                </tr>

                                <tr>
                                    <td>Diagnostic</td>
                                    <td>These findings suggested that the copy number deletions of <strong>SMAD4</strong> were frequent in <strong>CRC</strong> patients from China and had the potential to serve as a diagnostic indicator, alone or in combination with other markers, for <strong>CRC</strong>. (PMID: 25400417)</td>
                                </tr>

                                <tr>
                                    <td>Diagnostic</td>
                                    <td>The T1799A <strong>BRAF</strong> mutation occurs exclusively in PTC and PTC-derived <strong>anaplastic thyroid cancer</strong> and is a specific diagnostic marker for this cancer when identified in cytological and histological specimens. (PMID: 15947100)</td>
                                </tr>

                                <tr>
                                    <td>Diagnostic</td>
                                    <td>The discovery of the activating V617F mutation in the <strong>JAK2</strong> tyrosine kinase in a high proportion of patients with Ph- chronic myeloproliferative diseases (<strong>CMPD</strong>) represents a diagnostic breakthrough for these disorders. (PMID: 16825501)</td>
                                </tr>

                                <tr>
                                    <td>Prognostic/Predictive</td>
                                    <td><strong>MLH1</strong> expression after chemotherapy is an independent predictive factor for poor disease-free survival and may, therefore, define a group of patients with drug-resistant <strong>breast cancer</strong>. (PMID: 10623697)</td>
                                </tr>


                                <tr>
                                    <td>Prognostic</td>
                                    <td>In <strong>neuroblastoma</strong>, <strong>HDAC8</strong> expression was prognostic for an unfavorable outcome (PMID: 26200462)</td>
                                </tr>

                                <tr>
                                    <td>Prognostic</td>
                                    <td><strong>EGFR</strong> R497K polymorphism is a favorable prognostic factor for advanced <strong>lung cancer</strong>. (PMID: 18726117)</td>
                                </tr>

                                <tr>
                                    <td>Prognostic</td>
                                    <td>In conclusion, <strong>VARS2</strong> V552V may be considered as a prognostic factor for survival in patients with early <strong>breast cancer</strong>. (PMID: 20503108)</td>
                                </tr>

                                <tr>
                                    <td>Predictive</td>
                                    <td>Translational research has established a significant correlation between genomic amplification and high expression of <strong>HER2/neu</strong> in advanced <strong>breast cancer</strong>, and response and clinical benefit from <strong>trastuzumab</strong> (PMID: 15928656)</td>
                                </tr>

                                <tr>
                                    <td>Prognostic/Predictive</td>
                                    <td>A study to determine whether DNA polymorphism of <strong>ERCC1</strong> has predictive value in head and neck cancer patients showed that polymorphic variation in DNA repair genes (<strong>XPD</strong> and <strong>XRCC1</strong>, not <strong>ERCC1</strong>) is a powerful prognostic factor for the response to <strong>cisplatin</strong> in <strong>SCCHN</strong> patients  (PMID: 2453006)</td>
                                </tr>

                                <tr>
                                    <td>Predictive</td>
                                    <td><strong>Ganetespib</strong> is highly efficacious in vivo in a <strong>leukemia</strong> survival model expressing activated <strong>JAK2</strong> V617F. (PMID:21533169)</td>
                                </tr>

                                <tr>
                                    <td>Predictive</td>
                                    <td>The findings of this pilot study suggest that the <strong>cyclin D1</strong> A870G and the <strong>EGF</strong> A61G polymorphisms may be useful molecular markers for predicting clinical outcome in CRC patients treated with single-agent <strong>Cetuximab</strong>. (PMID: 16788380)</td>
                                </tr>

                                <tr>
                                    <td>Predictive</td>
                                    <td>Transforming growth factor beta1 gene (<strong>TGFB1</strong>) variant Leu10Pro (L10P) has previously been implicated in <strong>prostate cancer</strong> risk and radiation-induced side-effects. (PMID: 19039592) [because of side effects]</td>
                                </tr>

                                <tr>
                                    <td>Predisposing</td>
                                    <td>Transforming growth factor beta1 gene (<strong>TGFB1</strong>) variant Leu10Pro (L10P) has previously been implicated in <strong>prostate cancer</strong> risk and radiation-induced side-effects. (PMID: 19039592) </td>
                                </tr>

                                <tr>
                                    <td>Predisposing</td>
                                    <td>The <strong>MTHFR</strong> C677T and DeltaDNMT3B C-149T polymorphisms confer different risks for right- and left-sided <strong>colorectal cancer</strong>. (PMID: 19326430)</td>
                                </tr>

                                <tr>
                                    <td>Predisposing</td>
                                    <td>For example, mutations of <strong>BRCA1</strong> which increase the risk of early-onset <strong>breast cancer</strong> include a wide variety of missense, truncating and deletion mutations  (PMID: 21532833)</td>
                                </tr>

                                <tr>
                                    <td>Predisposing</td>
                                    <td>Germ line loss-of-function mutations of <strong>LKB1</strong> are associated with Peutz-Jeghers syndrome (PJS), a disease characterized by gastrointestinal neoplasms marked by a high risk of <strong>pancreatic cancer</strong>  (PMID: 24281221)</td>
                                </tr>

                                <tr>
                                    <td>Predisposing</td>
                                    <td>Recently, a missense polymorphism predicting p.A331S in <strong>RASSF1A</strong> was associated with an increased risk of <strong>breast cancer</strong> and early-onset <strong>breast cancer</strong> in <strong>BRCA1</strong> and <strong>BRCA2</strong> mutation carriers. (PMID: 20361264)</td>
                                </tr>

                                <tr>
                                    <td>Predisposing</td>
                                    <td>Furthermore, compared with noncarriers, <strong>APC</strong> I1307K carriers had increased numbers of adenomas and <strong>colorectal cancers</strong> per patient (P=.03), as well as a younger age at diagnosis. (PMID: 9973276)</td>
                                </tr>

                                <tr>
                                    <td>Predisposing</td>
                                    <td>Clinical correlates and long-term prognostic relevance of the <strong>JAK2</strong>(V617F) mutation was studied in 150 patients with <strong>essential thrombocythaemia</strong> (ET) from a single institution and followed for a median of 11.4 years (PMID: 16197451)</td>
                                </tr>

                            </tbody>
                        </Table>
                    </div>


                    <div>
                        <h2 className="h2 mb-3 text-gray-800">How?</h2>
                    </div>

                    <div className="mt-3">
                        <h4 className="h4 mb-2 text-gray-800">Reviewing Predictions</h4>
                        <ul>
                            <li>The <em>Annotation Review</em> section displays every relation which has been predicted by CIViCMine.</li>
                            <li>You can filter this list to only view specific types of relation, based upon your areas of expertise.</li>
                            <li>Select the relation which you wish to examine by clicking <em>Review Predictions</em></li>
                            <li>You will be presented with the sentences in which this relation was identified.</li>
                            <li>For each sentence, you have the ability to either <em>upvote</em> or <em>downvote</em>, signifying whether you believe this sentence indicates the presence of the relation accurately.</li>
                            <li><em>Upvote</em> the sentence if you believe that the entity annotations are correct and that the correct evidence type has been identified.</li>
                            <li>If you identify the sentence annotation as incorrect and you know how it should be fixed, you can manually annotate the sentence to rectify this.</li>
                        </ul>

                        <h4 className="h4 mb-2 text-gray-800">Manual Annotation</h4>
                        <ul>
                            <li>Return to the <em>Annotation Review</em> section and select to annotate sentences for a particular relation.</li>
                            <li>You will be presented with all the sentences associated with this particular relation which you have <em>downvoted</em>.</li>
                            <li>Pick a sentence to manually annotate.</li>
                            <li>When annotating a sentence, you will begin by identifying entities.  To do this, select the type of entity you wish to identify using the dropdown menu and then highlight the area of text which displays the entity.</li>
                            <li>You can highlight gene, cancer, drug or variant entities.</li>
                            <li>Next you will be able to create a relation between these entities.</li>
                            <li>To define a relation, select the entities and evidence type from the dropdown menus - these will only be populated with the entities that you have highlighted.</li>
                            <li>The dropdown menus will also indicate whether the entity you have chosen has a more well-known synonym.</li>
                            <li>Select to add the relation using the button below, ensuring that the relation follows the rules described above - e.g. a predictive relation must have a gene, cancer and drug entity identified.</li>
                            <li>If you have highlighted an entity in the text and you would like to specify its more commonly known synonym, you can add an entity link.</li>
                            <li>This can be done by looking at the entity link table, selecting the entity you highlighted and the more common synonym.</li>
                            <li>Once you are satisfied that you have identified all entities and relations, you can save your annotations.</li>
                        </ul>
                    </div>

                </div>
               
            </div>
		)
	}
}
