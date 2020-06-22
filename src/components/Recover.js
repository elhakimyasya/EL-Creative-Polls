import React from "react";
import { firebaseApp } from "../utils/firebase";
import Helmet from "react-helmet";

import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import Paper from "material-ui/Paper";

class Recover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      emailError: "",
      currentStep: 1,
    };

    this.handleEmailSubmit = this.handleEmailSubmit.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  handleEmailSubmit(e) {
    e.preventDefault();
    const email = this.state.email.trim();

    firebaseApp
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        this.setState({ currentStep: 2 });
      })
      .catch((error) => {
        this.setState({ emailError: error.message });
        //console.log(error);
      });
  }

  render() {
    let step = (
      <div className="d-flex justify-content-center form_container">
        <form onSubmit={this.handleEmailSubmit}>
          <h4 className="card-title text-center mb-4 mt-1">Lupa Password</h4>
          <hr />

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

          <div className="d-flex justify-content-center mt-3 login_container">
            <RaisedButton
              label="Kirim Verifikasi Email"
              type="submit"
              primary={true}
            />
          </div>
        </form>
      </div>
    );

    if (this.state.currentStep === 2) {
      step = (
        <h5 className="card-title text-center mb-4 mt-1">
          Email Verifikasi berhasil dikirim
        </h5>
      );
    }

    return (
      <div className="row">
        <div className="col-sm-4 text-center m-auto">
          <Helmet title="Lupa Password" />

          <Paper
            style={{
              borderRadius: "8px",
              padding: "20px",
            }}
          >
            {step}
          </Paper>
        </div>
      </div>
    );
  }
}

export default Recover;
