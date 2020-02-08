import React, { Component } from "react";
import Signin from "./Signin.jsx";
import Signup from "./Signup.jsx";
import { compose } from "redux";
import { connect } from "react-redux";
import {blue} from "@material-ui/core/colors";

class Auth extends Component {
  constructor(props) {
    super(props);

    this.state = {
      btn: true
    };

    this.renderSignin = this.renderSignin.bind(this);
    this.renderSignup = this.renderSignup.bind(this);
  }

  renderSignup() {
    this.setState({ btn: false });
    console.log(this.state);
  }

  renderSignin() {
    this.setState({ btn: true });
    console.log(this.state);
  }

  render() {
    return (
      <div className="modal-block col-sm-12 col-md-8 col-lg-6 col-xl-4" style={{backgroundcolor:blue}}>
        <img
          className="imgSize"
          src={"https://store-images.s-microsoft.com/image/apps.14212.9007199266419762.56b9557e-4dc3-49a7-a9be-5fc3204dba85.5fd31f8e-651a-473d-9720-b03f777bd33c?mode=scale&q=90&h=300&w=300"}
          alt={"Microsoft lock"}
        />
        <div >
          {/* <button id="stylingButton" className="btn btn-primary"></button> */}
          {/* this one is not rly a button ^ it's to fill empty space*/}
          <button
            id="loginButton"
            className="btn btn-primary"
            onClick={this.renderSignin}
          >
            SIGNIN
          </button>
          <button
            id="signupButton"
            className="btn btn-primary"
            onClick={this.renderSignup}
          >
            SIGNUP
          </button>

          {this.state.btn ? <Signin history={this.props.history}/> : <Signup history={this.props.history} />}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { state };
}

export default compose(
  connect(
    mapStateToProps,
    {}
  )
)(Auth);
