import React, { Component } from 'react';

import axios from 'axios';

import { Line, Bar } from "react-chartjs-2";
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

        this.update_chart_selection = this.update_chart_selection.bind(this)
		
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
        
    }
    

	render() {

        const chart_options = 
			<>
				<option value='0'>Number of Downvotes Attributed to Each Evidence Type</option>
				<option value='1'>Number of Upvotes Attributed to Each Evidence Type</option>
                
				
			</>

        var downvote_evidencetype_chart = (this.state.downvote_evidencetype_chart) ? <Bar data={this.state.downvote_evidencetype_chart} /> : <></>
        var upvote_evidencetype_chart = (this.state.upvote_evidencetype_chart) ? <Bar data={this.state.upvote_evidencetype_chart} /> : <></>
		var charts = [downvote_evidencetype_chart, upvote_evidencetype_chart]
        
        
        const chart_selector = <select onChange={this.update_chart_selection} value={this.state.chart_selection} className="w-100">{ chart_options }</select>
		
        
		return (
				<div>
						{ chart_selector }
                        
                        { charts[parseInt(this.state.chart_selection)]}
				</div>
		)
	}
}
