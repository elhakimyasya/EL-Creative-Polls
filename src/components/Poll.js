import React from "react";
import { firebaseApp } from "../utils/firebase";
import Helmet from "react-helmet";

import RaisedButton from "material-ui/RaisedButton";
import Snackbar from "material-ui/Snackbar";
import Paper from "material-ui/Paper";
import { Chart } from "react-google-charts";
import Loading from "./Loading";
import { FlatButton } from "material-ui";

class Poll extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      options: [], //of the form [{'some option': 34}]
      voted: localStorage.getItem(this.props.params.pollId) ? true : false,
      showSnackbar: false,
      loading: true,
    };
  }

  componentWillMount() {
    this.pollRef = firebaseApp
      .database()
      .ref(`EL-Creative-Polls/${this.props.params.pollId}`);
    this.pollRef
      .on("value", (snapshot) => {
        const dbPoll = snapshot.val();

        const options = Object.keys(dbPoll).reduce((a, key) => {
          if (key !== "title") {
            a.push({ [key]: dbPoll[key] }); //[key] is an es6 computed property name
          }
          return a;
        }, []);

        this.setState({
          title: dbPoll.title,
          options: options,
          loading: false,
        });
      })
      .bind(this);
  }

  componentWillUnmount() {
    this.pollRef.off();
  }

  handleVote(option) {
    let currentCount = this.state.options.filter((o) => {
      return o.hasOwnProperty(option);
    })[0][option];

    firebaseApp
      .database()
      .ref()
      .update({
        [`EL-Creative-Polls/${this.props.params.pollId}/${option}`]: (currentCount += 1),
      });
    localStorage.setItem(this.props.params.pollId, "true");
    this.setState({ voted: true, showSnackbar: true });
  }

  render() {
    //[["Task","Hours per Day"],["Work",11],["Eat",2],["Commute",2],["Watch TV",2],["Sleep",7]]
    const data = this.state.options.map((option) => {
      return [Object.keys(option)[0], option[Object.keys(option)[0]]];
    });
    data.unshift(["option", "votes"]);

    //let isAuthUser = getLocalUserId() ? true : false;
    let isAuthUser = firebaseApp.auth().currentUser ? true : false;

    let addOptionUI;
    if (isAuthUser) {
      addOptionUI = (
        <div>
          <a href={`/EL-Creative-Polls/update/${this.props.params.pollId}`}>
            <RaisedButton
              mini={true}
              secondary={true}
              label="Tambah Pilihan Lainnya"
            />
          </a>
        </div>
      );
    }

    let optionsUI = this.state.options.map((option) => {
      return (
        <div className="input-group justify-content-center">
          <div className="input-group-append" key={Object.keys(option)[0]}>
            <FlatButton
              label={Object.keys(option)[0]}
              onClick={() => this.handleVote(Object.keys(option)[0])}
              style={{ width: "100%" }}
              disabled={this.state.voted}
              secondary={true}
            />
          </div>
        </div>
      );
    });

    return (
      <div className="row">
        <div className="col-sm-12 text-center m-auto">
          <Helmet title={this.state.title} />

          <Snackbar
            open={this.state.showSnackbar}
            message="Terimakasih atas Polling anda!"
            autoHideDuration={4000}
          />

          <Paper
            style={{
              borderRadius: "8px",
              padding: "20px",
            }}
          >
            <h4 className="card-title text-center mb-4 mt-1">
              {this.state.title}
            </h4>
            <hr />

            <Loading loading={this.state.loading} />

            <div className="d-flex flex-column justify-content-center">
              {optionsUI}
            </div>

            <div className="m-5">{addOptionUI}</div>

            <Chart
              chartTitle="DonutChart"
              chartType="PieChart"
              width="100%"
              data={data}
              options={{ is3D: "true" }}
            />
          </Paper>
        </div>
      </div>
    );
  }
}

export default Poll;
