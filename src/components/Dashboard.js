import React from "react";
import { Link } from "react-router";
import { firebaseApp } from "../utils/firebase";
import Helmet from "react-helmet";

import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import IconButton from "material-ui/IconButton";
import Dialog from "material-ui/Dialog";
import Paper from "material-ui/Paper";
import Loading from "./Loading";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dialogOpen: false,
      loading: true,
      polls: [], //items like { id: 34324, title: 'sdf'}
    };

    this.poll2Delete = "";
    this.poll2DeleteTitle = "";

    this.handleClose = this.handleClose.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentWillMount() {
    //const uid = getLocalUserId();

    firebaseApp.auth().onAuthStateChanged((user) => {
      if (user) {
        //this can get called after componentWillUnmount, make sure its there to avoid errors

        const uid = user.uid;

        this.userPollsRef = firebaseApp.database().ref(`user-polls/${uid}`);

        //check if user has no polls to quit loading indicator
        this.userPollsRef.once("value").then((snapshot) => {
          if (!snapshot.hasChildren()) {
            if (this.mounted) {
              this.setState({ loading: false });
            }
          }
        });

        this.userPollsRef
          .on("child_added", (newPollIdSnapshot) => {
            const pollId = newPollIdSnapshot.key;

            firebaseApp
              .database()
              .ref(`polls/${pollId}/title`)
              .once("value")
              .then((snapshot) => {
                const title = snapshot.val();

                const polls = this.state.polls;
                polls.push({ title: title, id: pollId });

                if (this.mounted) {
                  this.setState({
                    polls: polls,
                    loading: false,
                  });
                }
              });
          })
          .bind(this);

        this.userPollsRef
          .on("child_removed", (removedPollIdSnapshot) => {
            const pollId = removedPollIdSnapshot.key;
            const polls = this.state.polls.filter((poll) => poll.id !== pollId);

            if (this.mounted) {
              this.setState({
                polls: polls,
              });
            }
          })
          .bind(this);
      }
    });

    this.mounted = true; //the callbacks above can be called after componentWillUnmount(), to avoid errors, check
  }

  componentWillUnmount() {
    this.userPollsRef.off();
    this.mounted = false;
  }

  handleOpen(pollId) {
    this.setState({ dialogOpen: true });
    this.poll2Delete = pollId;
    this.poll2DeleteTitle = this.state.polls.find(
      (poll) => poll.id === this.poll2Delete
    ).title;
  }

  handleClose() {
    this.setState({ dialogOpen: false });
  }

  handleDelete() {
    // updating to null deletes
    const updates = {};
    updates[`/polls/${this.poll2Delete}`] = null;
    updates[
      `/user-polls/${firebaseApp.auth().currentUser.uid}/${this.poll2Delete}`
    ] = null;

    firebaseApp.database().ref().update(updates);

    this.setState({ dialogOpen: false });
  }

  render() {
    const actions = [
      <div className="m-2">
        <FlatButton label="Tidak" primary={false} onClick={this.handleClose} />
        <FlatButton label="Ya" primary={true} onClick={this.handleDelete} />
      </div>,
    ];

    let pollsUIs = this.state.polls.map((poll) => {
      return (
        <div key={poll.id} className="mb-1 mt-1">
          <IconButton
            iconClassName="fa fa-trash"
            tooltip={<span>Hapus</span>}
            onClick={() => this.handleOpen(poll.id)}
          />
          <Link to={`/polls/poll/${poll.id}`}>
            <FlatButton
              label={poll.title}
              style={{ textAlign: "left", width: "80%" }}
            />
          </Link>
        </div>
      );
    });

    return (
      <div className="row">
        <div className="col-sm-8 text-center m-auto">
          <Helmet title="Dashboard" />

          <Paper
            style={{
              borderRadius: "8px",
              padding: "20px",
            }}
          >
            <h4 className="card-title text-center mb-4 mt-1">
              Polling yang anda buat:
            </h4>
            <hr />

            <Dialog
              actions={actions}
              modal={false}
              open={this.state.dialogOpen}
              onRequestClose={this.handleClose}
            >
              Apakah anda ingin menghapus Polling "{this.poll2DeleteTitle}"?
            </Dialog>

            <Link to="/polls/new">
              <RaisedButton label="Buat Polling Baru" primary={true} />
            </Link>

            <Loading loading={this.state.loading} />

            <div className="mt-3 mb-3">{pollsUIs}</div>
          </Paper>
        </div>
      </div>
    );
  }
}

export default Dashboard;
