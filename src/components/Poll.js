import React from 'react';
import { firebaseApp } from '../utils/firebase';
import Helmet from "react-helmet";

import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Paper from 'material-ui/Paper';
import { Chart } from 'react-google-charts';
import Loading from './Loading';

class Poll extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            options: [], //of the form [{'some option': 34}]
            voted: localStorage.getItem(this.props.params.pollId) ? true : false,
            showSnackbar: false,
            loading: true
        };
    }

    componentWillMount() {
        this.pollRef = firebaseApp.database().ref(`polls/${this.props.params.pollId}`);
        this.pollRef.on('value', ((snapshot) => {
            const dbPoll = snapshot.val();

            const options = Object.keys(dbPoll).reduce((a, key) => {
                if (key !== 'title') {
                    a.push({ [key]: dbPoll[key] }); //[key] is an es6 computed property name
                }
                return a;
            }, []);

            this.setState({ title: dbPoll.title, options: options, loading: false })
        })).bind(this);
    }

    componentWillUnmount() {
        this.pollRef.off();
    }

    handleVote(option) {
        let currentCount = this.state.options.filter(o => {
            return o.hasOwnProperty(option);
        })[0][option];

        firebaseApp.database().ref().update({ [`polls/${this.props.params.pollId}/${option}`]: currentCount += 1 })
        localStorage.setItem(this.props.params.pollId, 'true');
        this.setState({ voted: true, showSnackbar: true });
    }

    render() {
        //[["Task","Hours per Day"],["Work",11],["Eat",2],["Commute",2],["Watch TV",2],["Sleep",7]]
        const data = this.state.options.map(option => {
            return [Object.keys(option)[0], option[Object.keys(option)[0]]];
        });
        data.unshift(['option', 'votes']);

        //let isAuthUser = getLocalUserId() ? true : false;
        let isAuthUser = firebaseApp.auth().currentUser ? true : false;

        let addOptionUI;
        if (isAuthUser) {
            addOptionUI = (
                <div>
                    <a href={`/polls/update/${this.props.params.pollId}`} >
                        <FloatingActionButton
                            mini={true}
                            secondary={true}
                            >
                            <ContentAdd />
                        </FloatingActionButton>
                    </a>
                </div>
            );
        }

        let optionsUI = this.state.options.map(option => {
            return (
                <div key={Object.keys(option)[0]}>
                    <RaisedButton
                        label={Object.keys(option)[0]}
                        onTouchTap={() => this.handleVote(Object.keys(option)[0])}
                        style={{ width: '90%' }}
                        disabled={this.state.voted}
                        secondary={true}
                        />
                    <br /><br />
                </div>
            );
        });

        return (
            <div className="row">
                <div className="col-sm-12 text-xs-center">

                    <Helmet title={this.state.title} />

                    <Snackbar
                        open={this.state.showSnackbar}
                        message="Thanks for your vote!"
                        autoHideDuration={4000}
                        />

                    <Paper>
                        <br /><br />
                        <h2>{this.state.title}</h2>
                        <br />

                        <Loading loading={this.state.loading} />

                        {optionsUI}

                        {addOptionUI}

                        <br />
                        <Chart
                            chartTitle="DonutChart"
                            chartType="PieChart"
                            width="100%"
                            data={data}
                            options={{ is3D: 'true' }}
                            />

                        <br /><br />

                    </Paper>
                </div>
            </div>
        );
    }
}

export default Poll;
