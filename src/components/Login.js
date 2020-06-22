import React from "react";
import { firebaseApp } from "../utils/firebase";
import { Link, browserHistory } from "react-router";
import Helmet from "react-helmet";

import RaisedButton from "material-ui/RaisedButton";

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
                        <span>EL Creative Academy Polls</span>
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
                  <Helmet title="Login" />
                  <form className="WEQkZc" onSubmit={this.handleSubmit}>
                    <div className="bCAAsb">
                      <section className="aTzEhb">
                        <div className="CxRgyd">
                          <div className="d2CFce cDSmF" role="presentation">
                            <div className="rFrNMe N3Hzgf jjwyfe vHVGub zKHdkd sdJrJc Tyc9J">
                              <div className="aCsJod oJeWuf">
                                <div className="aXBtI Wic03c">
                                  <div className="Xb9hP">
                                    <input
                                      type="email"
                                      className="whsOnd zHQkBf"
                                      tabindex="0"
                                      aria-label="Email"
                                      value={this.state.email}
                                      onChange={this.handleEmailChange}
                                      errorText={this.state.emailError}
                                    />
                                    <div
                                      className="AxOyFc snByac"
                                      aria-hidden="true"
                                    >
                                      Alamat Email
                                    </div>
                                  </div>

                                  <div className="i9lrp mIZh1c"></div>
                                  <div className="OabDMe cXrdqd Y2Zypf"></div>
                                </div>
                              </div>
                            </div>

                            <div className="rFrNMe N3Hzgf jjwyfe vHVGub zKHdkd sdJrJc Tyc9J">
                              <div className="aCsJod oJeWuf">
                                <div className="aXBtI Wic03c">
                                  <div className="Xb9hP">
                                    <input
                                      type="password"
                                      className="whsOnd zHQkBf"
                                      tabindex="0"
                                      aria-label="Password"
                                      value={this.state.password}
                                      onChange={this.handlePasswordChange}
                                      errorText={this.state.passwordError}
                                    />
                                    <div
                                      className="AxOyFc snByac"
                                      aria-hidden="true"
                                    >
                                      Password
                                    </div>

                                    <div className="i9lrp mIZh1c"></div>
                                    <div className="OabDMe cXrdqd Y2Zypf"></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>

                      <div className="vwtvsf">
                        Masuk dengan <a href="#">Google</a> atau{" "}
                        <a href="#">Facebook</a>.<br /> <br />
                        <div className="PrDSKc">
                          Lupa Password?{" "}
                          <a href="/polls/recover">Reset Password</a>. <br />{" "}
                          Belum punya akun?{" "}
                          <a href="/polls/signup">Buat Akun</a>.
                        </div>
                      </div>
                    </div>

                    <div className="zQJV3">
                      <div className="dG5hZc">
                        <div className="qhFLie">
                          <div className="FliLIb DL0QTb">
                            <RaisedButton label="Masuk" type="submit" primary={true} tabindex="0"/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
