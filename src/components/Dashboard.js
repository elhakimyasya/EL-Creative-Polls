import React from "react";
import { Link } from "react-router";
import { firebaseApp } from "../utils/firebase";
import Helmet from "react-helmet";

import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import IconButton from "material-ui/IconButton";
import Dialog from "material-ui/Dialog";
import Paper from "material-ui/Paper";
import Divider from "material-ui/Divider";
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
      <FlatButton
        label="Cancel"
        primary={false}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Delete"
        primary={true}
        onTouchTap={this.handleDelete}
      />,
    ];

    let pollsUIs = this.state.polls.map((poll) => {
      return (
        <div key={poll.id}>
          <RaisedButton label="Hapus" secondary={true} tabindex="0" tooltip={<span>Hapus</span>} onTouchTap={() => this.handleOpen(poll.id)} />
          <Link to={`/polls/poll/${poll.id}`}>
            <FlatButton
              label={poll.title}
              style={{ textAlign: "left", width: "50%" }}
            />
          </Link>
          <Divider />
        </div>
      );
    });

    return (
      <div className="H2SoFe LZgQXe TFhTPc">
        <div className="RAYh1e LZgQXe qmmlRd">
          <div className="xkfVF">
            <div className="Aa1VU">
              <div className="Lth2jb">
                <div className="v8vQje">
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path d="M3,22V8H7V22H3M10,22V2H14V22H10M17,22V14H21V22H17Z" />
                  </svg>
                </div>
              </div>

              <div className="JhUD8d SQNfcc vLGJgb">
                <div className="zWl5kd">
                  <div className="DRS7Fe bxPAYd k6Zj8d">
                    <div className="jXeDnc">
                      <h1 className="ahT6S">
                        <span>Polling Anda</span>
                      </h1>
                      <div className="Y4dIwd">
                        <span>
                          Silahkan Masuk dengan Email, Google, atau Facebook.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pwWryf bxPAYd" role="presentation">
                <div className="Wxwduf Us7fWe JhUD8d" role="presentation">
                  <Helmet title="Dashboard" />
                  <Dialog
                    actions={actions}
                    modal={false}
                    open={this.state.dialogOpen}
                    onRequestClose={this.handleClose}
                  >
                    Delete "{this.poll2DeleteTitle}"?
                  </Dialog>
                  {pollsUIs}

                  <Loading loading={this.state.loading} />
                  <div className="bCAAsb">
                    <div className="vwtvsf">
                      Masuk dengan <a href="#">Google</a> atau{" "}
                      <a href="#">Facebook</a>.<br /> <br />
                      <div className="PrDSKc">
                        Lupa Password?{" "}
                        <a href="/polls/recover">Reset Password</a>. <br />{" "}
                        Belum punya akun? <a href="/polls/signup">Buat Akun</a>.
                      </div>
                    </div>
                  </div>
                  <div className="zQJV3">
                    <div className="dG5hZc">
                      <div className="qhFLie">
                        <a href="/polls/new" className="FliLIb DL0QTb">
                          <RaisedButton
                            label="Buat Polling"
                            primary={true}
                            tabindex="0"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
