import React, { Component } from 'react';

import axios from 'axios';

import { Bar } from "react-chartjs-2";
import { HeatMapGrid } from 'react-grid-heatmap'
import Chart from 'chart.js/auto';


export default class SentenceVotingData extends Component {
	constructor(props) {
		super(props)
		this.state = {
            chart_selection: '0'
			
		}		

        this.generate_downvote_evidencetype_chart = this.generate_downvote_evidencetype_chart.bind(this)
        this.get_downvote_data = this.get_downvote_data.bind(this)

        this.generate_upvote_evidencetype_chart = this.generate_upvote_evidencetype_chart.bind(this)
        this.get_upvote_data = this.get_upvote_data.bind(this)

        this.generate_upvoted_sentences_chart = this.generate_upvoted_sentences_chart.bind(this)
        this.get_upvoted_sentences = this.get_upvoted_sentences.bind(this)

        this.generate_downvote_gene_chart = this.generate_downvote_gene_chart.bind(this)
        this.generate_downvote_cancer_chart = this.generate_downvote_cancer_chart.bind(this)
        this.generate_downvote_drug_chart = this.generate_downvote_drug_chart.bind(this)
        this.generate_downvote_variant_chart = this.generate_downvote_variant_chart.bind(this)

        this.generate_upvote_gene_chart = this.generate_upvote_gene_chart.bind(this)
        this.generate_upvote_cancer_chart = this.generate_upvote_cancer_chart.bind(this)
        this.generate_upvote_drug_chart = this.generate_upvote_drug_chart.bind(this)
        this.generate_upvote_variant_chart = this.generate_upvote_variant_chart.bind(this)

        this.get_inter_annotator_agreements = this.get_inter_annotator_agreements.bind(this)

        this.update_chart_selection = this.update_chart_selection.bind(this)
		
	}


    get_inter_annotator_agreements(){
        var self = this
        
        const fetchURL = '/api/get_data/admin_calls/get_user_voting_data'

        axios.get(fetchURL)
            .then(function (response) {
                const res = response.data

                var agreements = []
                
                res.forEach(function(user1){

                    var user_agreements = []
                        
                    res.forEach(function(user2){

                        var sentences_0 = [user1.upvoted_sentences.concat(user1.downvoted_sentences).map(s => s.sentenceId)]
                        var sentences_1 = [user2.upvoted_sentences.concat(user2.downvoted_sentences).map(s => s.sentenceId)]
                        const intersection = sentences_0[0].filter(value => sentences_1[0].includes(value))       
                                    
                        var num_agreements = 0    

                        user1.upvoted_sentences.forEach(function(upvoted_sentence){
                            if (user2.upvoted_sentences.some(s => s.sentenceId === upvoted_sentence.sentenceId)){
                                num_agreements = num_agreements + 1
                            } 
                        })

                        user1.downvoted_sentences.forEach(function(downvoted_sentence){
                            if (user2.downvoted_sentences.some(s => s.sentenceId === downvoted_sentence.sentenceId)){
                                num_agreements = num_agreements + 1
                            } 
                        })

                        
                        user_agreements.push({'x':user1.id, 'y': user2.id, 'value':num_agreements/intersection.length})

                        

                    })
                    agreements.push(user_agreements)
                    })   
                
                var data = []
                var labels = []

                agreements.forEach(function(row){
                    labels.push(row[0].x)
                    var row_data = []
                    row.forEach(function(column){
                        if(!isNaN(column.value)){
                            row_data.push(parseFloat(column.value).toFixed(2))
                        }
                        
                    })
                    data.push(row_data)
                })

                self.setState({
                    inter_annotator_labels: labels,
                    inter_annotator_data: data,
                })

            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
                
            });
    }


    get_upvoted_sentences(){
        var self = this
        
        const fetchURL = '/api/get_data/admin_calls/get_sentence_voting_data'

        axios.get(fetchURL)
            .then(function (response) {
                const res = response.data
                var ids = []
                var upvote_counts = []
                var downvote_counts = []

                res.forEach(function(sentence){
                    ids.push('ID ' + sentence['id'])
                    upvote_counts.push(sentence['_count']['user_upvotes'])
                    downvote_counts.push(sentence['_count']['user_downvotes'])
                })

                self.setState({
                    sentence_ids: ids,
                    upvote_counts: upvote_counts,
                    downvote_counts: downvote_counts,
                })
                
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
                self.generate_upvoted_sentences_chart()
            });
    }


    generate_upvoted_sentences_chart(){
        const labels = this.state.sentence_ids

        this.setState({
            sentence_votes_chart: {
                labels: labels,
                datasets: [
                  {
                    label: "Upvotes",
                    backgroundColor: "#A30F0F",
                    borderColor: "#A30F0F",
                    data: this.state.upvote_counts,
                  },
                  {
                    label: "Downvotes",
                    backgroundColor: "#0072a3",
                    borderColor: "#0072a3",
                    data: this.state.downvote_counts,
                  }
                ],
                
            }
        })

    }


    get_upvote_data(){
        var self = this
        
        const fetchURL = '/api/get_data/admin_calls/get_upvotes_admin'

        axios.get(fetchURL)
            .then(function (response) {
                const res = response.data

                var evidence_type_counts = {'Diagnostic':0, 'Predisposing': 0, 'Prognostic': 0, 'Predictive': 0}

                res.forEach(function(sentence){
                    evidence_type_counts[sentence.evidence_type] ++
                })

                var gene_counts = {}

                res.forEach(function(sentence){
                    if(sentence.gene in gene_counts){
                        gene_counts[sentence.gene] ++
                    }else{
                        gene_counts[sentence.gene] = 0
                    }
                })

                var cancer_counts = {}

                res.forEach(function(sentence){
                    if(sentence.cancer in cancer_counts){
                        cancer_counts[sentence.cancer] ++
                    }else{
                        cancer_counts[sentence.cancer] = 0
                    }
                })

                var drug_counts = {}

                res.forEach(function(sentence){
                    if(sentence.drug in drug_counts){
                        drug_counts[sentence.drug] ++
                    }else{
                        if(!isNaN(sentence.drug)){
                            drug_counts[sentence.drug] = 0
                        }   
                    }
                })

                var variant_counts = {}

                res.forEach(function(sentence){
                    if(sentence.variant_group in variant_counts){
                        variant_counts[sentence.variant_group] ++
                    }else{
                        variant_counts[sentence.variant_group] = 0
                    }
                })

                self.setState({
                    upvote_evidencetype_counts: evidence_type_counts,
                    upvote_gene_counts: gene_counts,
                    upvote_cancer_counts: cancer_counts,
                    upvote_drug_counts: drug_counts,
                    upvote_variant_counts: variant_counts,
                })
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
                self.generate_upvote_evidencetype_chart()
                self.generate_upvote_gene_chart()
                self.generate_upvote_cancer_chart()
                self.generate_upvote_drug_chart()
                self.generate_upvote_variant_chart()
            });
    }


    generate_upvote_evidencetype_chart(){
        const labels = Object.keys(this.state.upvote_evidencetype_counts)

        this.setState({
            upvote_evidencetype_chart: {
                labels: labels,
                datasets: [
                  {
                    label: "Number of Upvotes Attributed to Each Evidence Type",
                    backgroundColor: "#A30F0F",
                    borderColor: "#A30F0F",
                    data: Object.values(this.state.upvote_evidencetype_counts),
                  },
                ],
              }
        })
    }


    generate_upvote_gene_chart(){
        const labels = Object.keys(this.state.upvote_gene_counts)

        this.setState({
            upvote_gene_chart: {
                labels: labels,
                datasets: [
                  {
                    label: "Number of Upvotes Attributed to Each Gene",
                    backgroundColor: "#A30F0F",
                    borderColor: "#A30F0F",
                    data: Object.values(this.state.upvote_gene_counts),
                  },
                ],
              }
        })
    }


    generate_upvote_cancer_chart(){
        const labels = Object.keys(this.state.upvote_cancer_counts)

        this.setState({
            upvote_cancer_chart: {
                labels: labels,
                datasets: [
                  {
                    label: "Number of Upvotes Attributed to Each Cancer",
                    backgroundColor: "#A30F0F",
                    borderColor: "#A30F0F",
                    data: Object.values(this.state.upvote_cancer_counts),
                  },
                ],
              }
        })
    }


    generate_upvote_drug_chart(){
        const labels = Object.keys(this.state.upvote_drug_counts)

        this.setState({
            upvote_drug_chart: {
                labels: labels,
                datasets: [
                  {
                    label: "Number of Upvotes Attributed to Each Drug",
                    backgroundColor: "#A30F0F",
                    borderColor: "#A30F0F",
                    data: Object.values(this.state.upvote_drug_counts),
                  },
                ],
              }
        })
    }


    generate_upvote_variant_chart(){
        const labels = Object.keys(this.state.upvote_variant_counts)

        this.setState({
            upvote_variant_chart: {
                labels: labels,
                datasets: [
                  {
                    label: "Number of Upvotes Attributed to Each Variant",
                    backgroundColor: "#A30F0F",
                    borderColor: "#A30F0F",
                    data: Object.values(this.state.upvote_variant_counts),
                  },
                ],
              }
        })
    }


    get_downvote_data(){
        var self = this
        
        const fetchURL = '/api/get_data/admin_calls/get_downvotes_admin'

        axios.get(fetchURL)
            .then(function (response) {
                const res = response.data

                var evidence_type_counts = {'Diagnostic':0, 'Predisposing': 0, 'Prognostic': 0, 'Predictive': 0}

                res.forEach(function(sentence){
                    evidence_type_counts[sentence.evidence_type] ++
                })

                var gene_counts = {}

                res.forEach(function(sentence){
                    if(sentence.gene in gene_counts){
                        gene_counts[sentence.gene] ++
                    }else{
                        gene_counts[sentence.gene] = 0
                    }
                })

                var cancer_counts = {}

                res.forEach(function(sentence){
                    if(sentence.cancer in cancer_counts){
                        cancer_counts[sentence.cancer] ++
                    }else{
                        cancer_counts[sentence.cancer] = 0
                    }
                })

                var drug_counts = {}

                res.forEach(function(sentence){
                    if(sentence.drug in drug_counts){
                        drug_counts[sentence.drug] ++
                    }else{
                        if(!isNaN(sentence.drug)){
                            drug_counts[sentence.drug] = 0
                        }   
                    }
                })

                var variant_counts = {}

                res.forEach(function(sentence){
                    if(sentence.variant_group in variant_counts){
                        variant_counts[sentence.variant_group] ++
                    }else{
                        variant_counts[sentence.variant_group] = 0
                    }
                })

                self.setState({
                    downvote_evidencetype_counts: evidence_type_counts,
                    downvote_gene_counts: gene_counts,
                    downvote_cancer_counts: cancer_counts,
                    downvote_drug_counts: drug_counts,
                    downvote_variant_counts: variant_counts,
                })
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
                self.generate_downvote_evidencetype_chart()
                self.generate_downvote_gene_chart()
                self.generate_downvote_cancer_chart()
                self.generate_downvote_drug_chart()
                self.generate_downvote_variant_chart()
            });
    }


    generate_downvote_evidencetype_chart(){
        const labels = Object.keys(this.state.downvote_evidencetype_counts)

        this.setState({
            downvote_evidencetype_chart: {
                labels: labels,
                datasets: [
                  {
                    label: "Number of Downvotes Attributed to Each Evidence Type",
                    backgroundColor: "#A30F0F",
                    borderColor: "#A30F0F",
                    data: Object.values(this.state.downvote_evidencetype_counts),
                  },
                ],
              }
        })
    }


    generate_downvote_gene_chart(){
        const labels = Object.keys(this.state.downvote_gene_counts)

        this.setState({
            downvote_gene_chart: {
                labels: labels,
                datasets: [
                  {
                    label: "Number of Downvotes Attributed to Each Gene",
                    backgroundColor: "#A30F0F",
                    borderColor: "#A30F0F",
                    data: Object.values(this.state.downvote_gene_counts),
                  },
                ],
              }
        })
    }


    generate_downvote_cancer_chart(){
        const labels = Object.keys(this.state.downvote_cancer_counts)

        this.setState({
            downvote_cancer_chart: {
                labels: labels,
                datasets: [
                  {
                    label: "Number of Downvotes Attributed to Each Cancer",
                    backgroundColor: "#A30F0F",
                    borderColor: "#A30F0F",
                    data: Object.values(this.state.downvote_cancer_counts),
                  },
                ],
              }
        })
    }


    generate_downvote_drug_chart(){
        const labels = Object.keys(this.state.downvote_drug_counts)

        this.setState({
            downvote_drug_chart: {
                labels: labels,
                datasets: [
                  {
                    label: "Number of Downvotes Attributed to Each Drug",
                    backgroundColor: "#A30F0F",
                    borderColor: "#A30F0F",
                    data: Object.values(this.state.downvote_drug_counts),
                  },
                ],
              }
        })
    }


    generate_downvote_variant_chart(){
        const labels = Object.keys(this.state.downvote_variant_counts)

        this.setState({
            downvote_variant_chart: {
                labels: labels,
                datasets: [
                  {
                    label: "Number of Downvotes Attributed to Each Variant",
                    backgroundColor: "#A30F0F",
                    borderColor: "#A30F0F",
                    data: Object.values(this.state.downvote_variant_counts),
                  },
                ],
              }
        })
    }


    update_chart_selection(e){
		var self = this

		self.setState({
		 	chart_selection: e.target.value
		})
	}


    componentDidMount(){
        this.get_downvote_data()
        this.get_upvote_data()
        this.get_upvoted_sentences()
        this.get_inter_annotator_agreements()
        
    }
    

	render() {

        const chart_options = 
			<>
				<option value='0'>Number of Downvotes Attributed to Each Evidence Type</option>
                <option value='1'>Number of Downvotes Attributed to Each Gene</option>
                <option value='2'>Number of Downvotes Attributed to Each Cancer</option>
                <option value='3'>Number of Downvotes Attributed to Each Drug</option>
                <option value='4'>Number of Downvotes Attributed to Each Variant Group</option>
				<option value='5'>Number of Upvotes Attributed to Each Evidence Type</option>
                <option value='6'>Number of Upvotes Attributed to Each Gene</option>
                <option value='7'>Number of Upvotes Attributed to Each Cancer</option>
                <option value='8'>Number of Upvotes Attributed to Each Drug</option>
                <option value='9'>Number of Upvotes Attributed to Each Variant Group</option>
                <option value='10'>Sentence Votes</option>
                <option value='11'>Inter-Annotator Agreement Heatmap For Every User</option>			
			</>

        var downvote_evidencetype_chart = (this.state.downvote_evidencetype_chart) ? <Bar data={this.state.downvote_evidencetype_chart} /> : <></>
        var upvote_evidencetype_chart = (this.state.upvote_evidencetype_chart) ? <Bar data={this.state.upvote_evidencetype_chart} /> : <></>

        var downvote_gene_chart = (this.state.downvote_gene_chart) ? <Bar data={this.state.downvote_gene_chart} /> : <></>
        var downvote_cancer_chart = (this.state.downvote_cancer_chart) ? <Bar data={this.state.downvote_cancer_chart} /> : <></>
        var downvote_drug_chart = (this.state.downvote_drug_chart) ? <Bar data={this.state.downvote_drug_chart} /> : <></>
        var downvote_variant_chart = (this.state.downvote_variant_chart) ? <Bar data={this.state.downvote_variant_chart} /> : <></>

        var upvote_gene_chart = (this.state.upvote_gene_chart) ? <Bar data={this.state.upvote_gene_chart} /> : <></>
        var upvote_cancer_chart = (this.state.upvote_cancer_chart) ? <Bar data={this.state.upvote_cancer_chart} /> : <></>
        var upvote_drug_chart = (this.state.upvote_drug_chart) ? <Bar data={this.state.upvote_drug_chart} /> : <></>
        var upvote_variant_chart = (this.state.upvote_variant_chart) ? <Bar data={this.state.upvote_variant_chart} /> : <></>

        var sentence_votes_chart = (this.state.sentence_votes_chart) ? <Bar data={this.state.sentence_votes_chart} /> : <></>
        var interannotator_chart = (this.state.inter_annotator_data) ? 
        <HeatMapGrid 

            data={this.state.inter_annotator_data} 
            xLabels={this.state.inter_annotator_labels} 
            yLabels={this.state.inter_annotator_labels} 
            cellRender={(x, y, value) => (
                <div title={`Pos(${x}, ${y}) = ${value}`}>{value}</div>
              )}
              
            cellStyle={(_x, _y, ratio) => ({
            background: `rgb(163, 15, 15, ${ratio})`,
            fontSize: "2rem",
            color: `rgb(0, 0, 0, ${ratio / 2 + 0.4})`
            })}
            cellHeight="5rem"
            cellWidth="5rem"
            xLabelsPos="top"
            yLabelsPos="left"
            square
        
        /> : <></>
        
		var charts = [downvote_evidencetype_chart, downvote_gene_chart, downvote_cancer_chart, downvote_drug_chart, downvote_variant_chart, upvote_evidencetype_chart, upvote_gene_chart, upvote_cancer_chart, upvote_drug_chart, upvote_variant_chart, sentence_votes_chart, interannotator_chart]
        
        const chart_selector = <select onChange={this.update_chart_selection} value={this.state.chart_selection} className="w-100">{ chart_options }</select>
		
    
		return (
				<div>
						{ chart_selector }

                        <div>
                        { charts[parseInt(this.state.chart_selection)]}
                        </div>   
				</div>
		)
	}
}
