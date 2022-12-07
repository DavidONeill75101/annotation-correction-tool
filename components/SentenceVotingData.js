import React, { Component } from 'react';

import axios from 'axios';

import { Line, Bar, Histogram} from "react-chartjs-2";
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

        this.generate_inter_annotator_agreement_chart = this.generate_inter_annotator_agreement_chart.bind(this)
        this.get_inter_annotator_agreements = this.get_inter_annotator_agreements.bind(this)

        this.update_chart_selection = this.update_chart_selection.bind(this)
		
	}


    generate_inter_annotator_agreement_chart(){
        
        

        // this.setState({
        //     interannotator_chart: {
        //         labels: ['1', '2', '3', '4', '5', '6'],
        //         datasets: [
        //           {
        //             label: "InterAnnotator Scores",
        //             backgroundColor: "#A30F0F",
        //             borderColor: "#A30F0F",
        //             data: this.state.inter_annotator_agreements,
        //           },
                  
        //         ],
                
        //     }
        // })
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
                    

                    var num_agreements = 0

                 
                    

                    user1.upvoted_sentences.forEach(function(upvoted_sentence1){

                        user2.upvoted_sentences.forEach(function())

                        //console.log(user2.upvoted_sentences.findIndex(s => s.sentenceId === parseInt(upvoted_sentence.id)))
                        // if(user2.upvoted_sentences.some(s => s.sentenceId === upvoted_sentence.id)){
                        //     num_agreements = num_agreements + 1
                        // }
                        // if(user2.upvoted_sentences.includes(upvoted_sentence)){
                        //     num_agreements = num_agreements + 1
                        // }
                    })

                    user1.downvoted_sentences.forEach(function(downvoted_sentence){
                        // if(user2.downvoted_sentences.includes(downvoted_sentence)){
                        //     num_agreements = num_agreements + 1
                        // }
                    })

                    user_agreements.push({'x':user1.id, 'y': user2.id, 'value':num_agreements})


                })
                agreements.push(user_agreements)
                })   
                         
                console.log(agreements)
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
                self.generate_inter_annotator_agreement_chart()
            });



        // axios.get(fetchURL)
        //     .then(function (response) {
        //         const res = response.data

        //         var num_agreements = [] 

        //         res.forEach(function(pair){

        //             var individual_agreements = 0
        //             var sentences_0 = [pair[0]['upvoted_sentences'].concat(pair[0]['downvoted_sentences']).map(s => s.sentenceId)]
        //             var sentences_1 = [pair[1]['upvoted_sentences'].concat(pair[1]['downvoted_sentences']).map(s => s.sentenceId)]
        //             const intersection = sentences_0[0].filter(value => sentences_1[0].includes(value))            
                                    



        //             pair[0]['upvoted_sentences'].forEach(function(upvoted_sentence){
                        
                        
        //                 if (pair[1]['upvoted_sentences'].some(s => s['sentenceId'] === upvoted_sentence.sentenceId)){
        //                     individual_agreements++

        //                 }

        //             })

        //             pair[0]['downvoted_sentences'].forEach(function(downvoted_sentence){
                        

        //                 if (pair[1]['downvoted_sentences'].some(s => s['sentenceId'] === downvoted_sentence.sentenceId)){
        //                     individual_agreements++
        //                 }

        //             })

        //             num_agreements.push(individual_agreements/intersection.length)
        //         })

        //         self.setState({
        //             inter_annotator_agreements: num_agreements,
        //         })             
        //     })
        //     .catch(function (error) {
        //         console.log(error);
        //     })
        //     .then(function () {
        //         // always executed
        //         self.generate_inter_annotator_agreement_chart()
        //     });
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

                var counts = {'Diagnostic':0, 'Predisposing': 0, 'Prognostic': 0, 'Predictive': 0}

                res.forEach(function(item){
                    counts[item.evidence_type] ++
                })

                self.setState({
                    upvote_evidencetype_counts: counts
                })
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
                self.generate_upvote_evidencetype_chart()
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


    get_downvote_data(){
        var self = this
        
        const fetchURL = '/api/get_data/admin_calls/get_downvotes_admin'

        axios.get(fetchURL)
            .then(function (response) {
                const res = response.data

                var counts = {'Diagnostic':0, 'Predisposing': 0, 'Prognostic': 0, 'Predictive': 0}

                res.forEach(function(item){
                    counts[item.evidence_type] ++
                })

                self.setState({
                    downvote_evidencetype_counts: counts
                })
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
                self.generate_downvote_evidencetype_chart()
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
				<option value='1'>Number of Upvotes Attributed to Each Evidence Type</option>
                <option value='2'>Sentence Votes</option>
                <option value='3'>Inter-Annotator Agreement</option>
                
				
			</>

        var downvote_evidencetype_chart = (this.state.downvote_evidencetype_chart) ? <Bar data={this.state.downvote_evidencetype_chart} /> : <></>
        var upvote_evidencetype_chart = (this.state.upvote_evidencetype_chart) ? <Bar data={this.state.upvote_evidencetype_chart} /> : <></>
        var sentence_votes_chart = (this.state.sentence_votes_chart) ? <Bar data={this.state.sentence_votes_chart} /> : <></>
        var interannotator_chart = (this.state.interannotator_chart) ? <Bar data={this.state.interannotator_chart} /> : <></>
        

		var charts = [downvote_evidencetype_chart, upvote_evidencetype_chart, sentence_votes_chart, interannotator_chart]
        
        
        const chart_selector = <select onChange={this.update_chart_selection} value={this.state.chart_selection} className="w-100">{ chart_options }</select>
		
        
		return (
				<div>
						{ chart_selector }
                        
                        { charts[parseInt(this.state.chart_selection)]}
				</div>
		)
	}
}
