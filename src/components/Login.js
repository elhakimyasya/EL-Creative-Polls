import React from "react";
import { firebaseApp } from "../utils/firebase";
import { Link, browserHistory } from "react-router";
import Helmet from "react-helmet";

import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import Paper from "material-ui/Paper";

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      emailError: "",
      passwordError: "",
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const email = this.state.email.trim();
    const password = this.state.password.trim();

    firebaseApp
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        browserHistory.push("/polls/dashboard");
      })
      .catch((error) => {
        if (error.code === "auth/wrong-password") {
          this.setState({ passwordError: error.message, emailError: "" });
        } else {
          this.setState({ emailError: error.message, passwordError: "" });
        }

        //console.log(error);
      });
  }

  render() {
    return (
      <div className="row">
        <div className="col-sm-4 text-center m-auto">
          <Helmet title="Masuk" />

          <Paper
            style={{
              borderRadius: "8px",
              padding: "20px",
            }}
          >
            <h4 className="card-title text-center mb-4 mt-1">Masuk</h4>
            <hr/>
            <div className="d-flex justify-content-center form_container">
              <form onSubmit={this.handleSubmit}>
                <div className="input-group">
                  <div className="input-group-append">
                    <TextField
                      floatingLabelText="Email"
                      value={this.state.email}
                      onChange={this.handleEmailChange}
                      errorText={this.state.emailError}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <div className="input-group-append">
                    <TextField
                      floatingLabelText="Password"
                      value={this.state.password}
                      onChange={this.handlePasswordChange}
                      type="password"
                      errorText={this.state.passwordError}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-center mt-3 login_container">
                  <RaisedButton label="Masuk" type="submit" primary={true} />
                </div>
              </form>
            </div>

            <div className="mt-4">
              <div className="d-flex justify-content-center links">
                Belum punya Akun?{" "}
                <Link to="/polls/signup" className="ml-2">
                  Daftar
                </Link>
              </div>
              <div className="d-flex justify-content-center links">
                <Link to="/polls/recover" className="ml-2">
                  Lupa Password
                </Link>
              </div>
            </div>
          </Paper>
        </div>
      </div>
    );
  }
}

export default Login;
