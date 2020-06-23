import React from "react";
import { firebaseApp } from "../utils/firebase";
import { browserHistory } from "react-router";
import Helmet from "react-helmet";

import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import Paper from "material-ui/Paper";
import Loading from "./Loading";
import { FlatButton } from "material-ui";

class Update extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      options: [],
      originalCount: 0,
      loading: true,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAddOption = this.handleAddOption.bind(this);
    this.formIsInvalid = this.formIsInvalid.bind(this);
  }

  componentWillMount() {
    this.pollRef = firebaseApp
      .database()
      .ref(`polls/${this.props.params.pollId}`);
    this.pollRef
      .on("value", (snapshot) => {
        const dbPoll = snapshot.val();

        const options = Object.keys(dbPoll).reduce((a, key) => {
          if (key !== "title") {
            a.push({ option: [key], optionError: "" }); //[key]is es6 computed property name
          }
          return a;
        }, []);

        //to start with a new option
        options.push({ option: "", optionError: "" });

        this.setState({
          title: dbPoll.title,
          options: options,
          originalCount: options.length - 1,
          loading: false,
        });
      })
      .bind(this);
  }

  componentWillUnmount() {
    this.pollRef.off();
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

    const newOptionsArray = this.state.options.reduce((a, op, i) => {
      if (i >= this.state.originalCount) {
        const key = op.option.trim();
        a.push(key);
      }
      return a;
    }, []);

    const updates = {};

    newOptionsArray.forEach((option) => {
      updates[`polls/${this.props.params.pollId}/${option}`] = 0;
    });

    firebaseApp.database().ref().update(updates);

    browserHistory.push(`/EL-Creative-Polls/poll/${this.props.params.pollId}`);
  }

  handleAddOption() {
    let options = this.state.options;
    options.push({ option: "", optionError: "" });

    this.setState({ options: options });
  }

  render() {
    let options = this.state.options.map((option, i) => {
      return (
        <div className="input-group">
          <div className="input-group-append" key={i}>
            <TextField
              floatingLabelText={`Pilihan ${i + 1}`}
              value={this.state.options[i].option}
              onChange={this.handleOptionChange.bind(this, i)}
              errorText={this.state.options[i].optionError}
              disabled={i < this.state.originalCount ? true : false}
              autoFocus={i === this.state.originalCount ? true : false} //focus on the new element for better user experience
            />
          </div>
        </div>
      );
    });

    return (
      <div className="row">
        <div className="col-sm-4 text-center m-auto">
          <Helmet title="Perbarui Polling" />

          <Paper
            style={{
              borderRadius: "8px",
              padding: "20px",
            }}
          >
            <h4 className="card-title text-center mb-4 mt-1">
              Tambah Pilihan Polling
            </h4>
            <hr />

            <Loading loading={this.state.loading} />

            <div className="d-flex justify-content-center form_container">
              <form onSubmit={this.handleSubmit}>
                <div className="input-group">
                  <div className="input-group-append">
                    <TextField
                      floatingLabelText="Judul Polling"
                      value={this.state.title}
                      disabled={true}
                    />
                  </div>
                </div>

                {options}

                <div className="d-flex justify-content-center mt-3 login_container">
                  <span className="ml-1 mr-1">
                    <FlatButton
                      label="Tambah Pilihan"
                      onClick={this.handleAddOption}
                      primary={true}
                    />
                  </span>

                  <span className="ml-1 mr-1">
                    <RaisedButton
                      label="Perbarui"
                      type="submit"
                      primary={true}
                    />
                  </span>
                </div>
              </form>
            </div>
          </Paper>
        </div>
      </div>
    );
  }

  //firebase keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"
  //option must not be named "title", TODO: better data structure in firebase
  //options must be different, firebase removes dups keys automatically
  //more robust validation is done firebase-side
  formIsInvalid() {
    let isInvalid = false;
    const regex = /[\.#\$\/\[\]]/;

    this.state.options.forEach((o, i) => {
      if (i >= this.state.originalCount) {
        let options = this.state.options;
        let thisOption = o.option.trim();

        if (thisOption.length === 0) {
          options[i] = {
            option: thisOption,
            optionError: "Pilihan ini tidak boleh kosong.",
          };
          this.setState({ options: options });
          isInvalid = true;
        } else if (thisOption.match(regex)) {
          options[i] = {
            option: thisOption,
            optionError: `Pilihan ini tidak boleh terdiri dari karakter ".", "#", "$", "/", "[", or "]"`,
          };
          this.setState({ options: options });
          isInvalid = true;
        } else {
          if (thisOption === "judul") {
            //can't have option with key "title"
            thisOption = "Judul";
          }

          options[i] = { option: thisOption, optionError: "" };
          this.setState({ options: options });
        }
      }
    });

    return isInvalid;
  }
}

export default Update;
