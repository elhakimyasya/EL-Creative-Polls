import React from "react";
import { Link, browserHistory } from "react-router";
import { firebaseApp } from "../utils/firebase";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import FlatButton from "material-ui/FlatButton";
import getMuiTheme from "material-ui/styles/getMuiTheme";

const muiTheme = getMuiTheme({
  fontFamily: "'Google Sans', Quicsand, Lato, Roboto, 'Segoe UI', sans-serif",
});

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: null !== firebaseApp.auth().currentUser, //currentUser is null when not loggedin
    };
  }

  componentWillMount() {
    firebaseApp.auth().onAuthStateChanged((user) => {
      this.setState({
        loggedIn: null !== user, //user is null when not loggedin
      });
    });
  }

  handleLogout() {
    firebaseApp
      .auth()
      .signOut()
      .then(
        () => {
          //console.log("sign out succesful");
          browserHistory.push("/EL-Creative-Polls/");
        },
        (error) => {
          console.log(error);
        }
      );
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="container">
          <div className="row">
            <div className="col-sm-12 text-right">
              <div className="m-2">
                <span>
                  {this.state.loggedIn ? (
                    <Link to="/EL-Creative-Polls/dashboard">
                      <FlatButton label="Polling Saya" primary={true} />
                    </Link>
                  ) : (
                    ""
                  )}
                </span>

                <span>
                  {this.state.loggedIn ? (
                    <FlatButton
                      onClick={this.handleLogout}
                      label="Keluar"
                      secondary={true}
                    />
                  ) : (
                    ""
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12 text-center mb-5 mt-5">
              <h2>
                <a
                  style={{
                    color: "#000",
                    textDecoration: "none",
                  }}
                  href={this.state.loggedIn ? "/EL-Creative-Polls/dashboard" : "/EL-Creative-Polls/"}
                >
                  EL Creative Academy Polls
                </a>
              </h2>
            </div>
          </div>

          {this.props.children}

          <div className="row">
            <div className="col-sm-12 text-center mt-5 mb-5" style={{fontSize: ".9em"}}>
                © 2020 EL Creative Developers - <a href="https://www.elcreativeacademy.com/">EL Creative Academy</a> | <a href="https://github.com/elhakimyasya"> Yasya El Hakim</a>
              </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
