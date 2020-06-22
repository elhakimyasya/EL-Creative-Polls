import React from 'react';
import { firebaseApp } from '../utils/firebase';
import { browserHistory } from 'react-router';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Paper from 'material-ui/Paper';
import Helmet from "react-helmet";

class New extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            titleError: '',
            options: [
                { option: '', optionError: '' },
                { option: '', optionError: '' }
            ]
        };

        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAddOption = this.handleAddOption.bind(this);
        this.formIsInvalid = this.formIsInvalid.bind(this);
    }

    handleTitleChange(e) {
        this.setState({ title: e.target.value });
    }

    handleOptionChange(i, e) {
        let options = this.state.options;
        options[i].option = e.target.value;
        this.setState({ options: options });
    }

    handleSubmit(e) {
        e.preventDefault();

        if (this.formIsInvalid()) {
            return;
        }

        //pollData has the form
        // {
        //     title: 'a title',
        //     'a poll option': 0,
        //     'a different poll option': 0
        // }

        const pollData = this.state.options.reduce((a, op) => {
            const key = op.option.trim();
            a[key] = 0;
            return a;
        }, { title: this.state.title.trim() })

        //user ID
        const uid = firebaseApp.auth().currentUser.uid;

        // Get a key for a new Poll.
        const newPollKey = firebaseApp.database().ref().child('polls').push().key;

        // Write the new poll's data simultaneously in the polls list and the user's polls list.
        var updates = {};
        updates[`/polls/${newPollKey}`] = pollData;
        updates[`/user-polls/${uid}/${newPollKey}`] = true;

        firebaseApp.database().ref().update(updates);

        browserHistory.push(`/polls/poll/${newPollKey}`);
    }

    handleAddOption() {
        let options = this.state.options;
        options.push({ option: '', optionError: '' });

        this.setState({ options }); //es6 shorthand for { options: options }
    }

    render() {

        let options = this.state.options.map((option, i) => {
            return (
                <div key={i}>
                    <br />
                    <TextField
                        floatingLabelText={`Option ${i + 1}`}
                        value={this.state.options[i].option}
                        onChange={this.handleOptionChange.bind(this, i)}
                        errorText={this.state.options[i].optionError}
                        />
                </div>
            );
        });

        return (
            <div className="row">
                <div className="col-sm-12 text-xs-center">

                    <Helmet title="New Poll" />

                    <Paper>
                        <br /><br />
                        <h2>New Poll</h2>

                        <form onSubmit={this.handleSubmit}>

                            <TextField
                                floatingLabelText="Title"
                                value={this.state.title}
                                onChange={this.handleTitleChange}
                                errorText={this.state.titleError}
                                />

                            {options}

                            <br />
                            <FloatingActionButton
                                mini={true}
                                secondary={true}
                                onTouchTap={this.handleAddOption} >
                                <ContentAdd />
                            </FloatingActionButton>

                            <br /><br />
                            <RaisedButton
                                label="Create"
                                type="submit"
                                primary={true}
                                />
                        </form>

                        <br /><br />
                    </Paper>
                </div>
            </div>
        );
    }

    componentWillUnmount() {

    }

    //firebase keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"
    //option must not be named "title", TODO: better data structure in firebase
    //options must be different, firebase removes dups keys automatically
    //more robust validation is done firebase-side
    formIsInvalid() {

        let isInvalid = false;
        const regex = /[\.#\$\/\[\]]/;
        const title = this.state.title.trim();

        if (title.length === 0) {
            this.setState({ titleError: 'Title must no be empty.' })
            isInvalid = true;
        } else if (title.match(regex)) {
            this.setState({ titleError: `Title can't contain ".", "#", "$", "/", "[", or "]"` })
            isInvalid = true;
        } else {
            this.setState({ title: title, titleError: '' })
        }

        this.state.options.forEach((o, i) => {

            let options = this.state.options;
            let thisOption = o.option.trim();

            if (thisOption.length === 0) {
                options[i] = { option: thisOption, optionError: 'This option must not be empty.' }
                this.setState({ options: options });
                isInvalid = true;
            } else if (thisOption.match(regex)) {
                options[i] = { option: thisOption, optionError: `Options can't contain ".", "#", "$", "/", "[", or "]"` }
                this.setState({ options: options });
                isInvalid = true;
            } else {

                if (thisOption === 'title') { //can't have option with key "title"
                    thisOption = 'Title';
                }

                options[i] = { option: thisOption, optionError: '' }
                this.setState({ options: options });
            }
        });

        return isInvalid;
    }
}

export default New;
