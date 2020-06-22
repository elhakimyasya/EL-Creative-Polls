import React from "react";
import { Link, browserHistory } from "react-router";
import { firebaseApp } from "../utils/firebase";
import * as firebase from "firebase"; //needed for fb, google providers
import Helmet from "react-helmet";

import FontIcon from "material-ui/FontIcon";
import Paper from "material-ui/Paper";
import { FlatButton } from "material-ui";

class Home extends React.Component {
  handleFacebook(e) {
    e.preventDefault();
    const provider = new firebase.auth.FacebookAuthProvider();
    firebaseApp
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        //console.log('Facebook login success');
        browserHistory.push("/polls/dashboard");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleGoogle(e) {
    e.preventDefault();
    const provider = new firebase.auth.GoogleAuthProvider();
    firebaseApp
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        //console.log('Google login success');
        browserHistory.push("/polls/dashboard");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <div className="row">
        <div className="col-sm-4 text-center m-auto">
          <Helmet title="Home" />

          <Paper
            style={{
              borderRadius: "8px",
              padding: "20px",
            }}
          >
            <h4 className="card-title text-center mb-4 mt-1">Masuk Dengan</h4>
            <hr />

            <div className="d-flex justify-content-center form_container">
              <FlatButton
                onClick={this.handleFacebook}
                secondary={true}
                icon={<FontIcon className="fa fa-facebook-f" />}
              />
              <FlatButton
                onClick={this.handleGoogle}
                secondary={true}
                icon={<FontIcon className="fa fa-google" />}
              />
              {/* <Link >
                <FlatButton
                onClick="/polls/login"
                  secondary={true}
                  icon={<FontIcon className="fa fa-envelope-o" />}
                />
              </Link> */}
            </div>

            <div className="mt-4">
              <div className="d-flex justify-content-center links">
                Belum punya Akun?{" "}
                <Link to="/polls/signup" className="ml-2">
                  Daftar Sekarang
                </Link>
              </div>
            </div>
          </Paper>
        </div>
      </div>
    );
  }
}

export default Home;
