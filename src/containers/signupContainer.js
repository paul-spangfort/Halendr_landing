import React, { Component } from 'react';
import axios from 'axios';
import Radium from 'radium';
//
const ROOT_URL = 'https://hlp-api.herokuapp.com/';
// const ROOT_URL = 'http://localhost:9090';

const validator = require('email-validator');

const inputStyle = {
  width: 260,
  backgroundColor: 'rgba(80, 80, 80, 0.8)',
  border: 'none',
  height: 58,
  fontSize: 22,
  paddingLeft: 10,
  borderStyle: 'solid',
  borderRadius: 5,
  borderWidth: 4,
  borderColor: 'white',
  color: 'white',
  textAlign: 'center',
};
const buttonStyle = {
  height: 65,
  position: 'relative',
  width: 120,
  border: 'none',
  fontSize: 18,
  top: -3,
  borderStyle: 'solid',
  borderRadius: 5,
  borderWidth: 2,
  borderColor: '#FF4032',
  backgroundColor: '#FF4032',
  backgroundImage: 'url(http://mupit.icm.jhu.edu/MuPIT_Interactive/images/load.gif)',
  backgroundSize: '30px',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  color: '#FF4032',
  left: 5,
};

const styles = {
  base: {
    height: 65,
    position: 'relative',
    width: 120,
    border: 'none',
    fontSize: 18,
    top: -3,
    borderStyle: 'solid',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#FF4032',
    backgroundColor: '#FF4032',
    color: 'white',
    left: 5,
  },
  test: {
    height: 80,
  },
};

@Radium
export default class SignupContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userEmail: '',
      submitted: false,
      badEmail: false,
      waiting: false,
      userExists: false,
    };

    this.onEmailChange = this.onEmailChange.bind(this);
    this.sendSignUpEmail = this.sendSignUpEmail.bind(this);
    this.changeSubmittedState = this.changeSubmittedState.bind(this);
    this.renderForms = this.renderForms.bind(this);
    this.renderReactComponents = this.renderReactComponents.bind(this);
  }

  onEmailChange(event) {
    this.setState({ userEmail: event.target.value });
    this.setState({ userExists: false });
    console.log(this.state.userEmail);
  }

  resetWarning() {
    this.setState({ userExists: false });
    this.setState({ badEmail: false });
  }

  sendSignUpEmail() { // eslint-disable-line
    if (validator.validate(this.state.userEmail)) {
      console.log('email is being posted');
      this.setState({ waiting: true });
      return axios.post(`${ROOT_URL}`, { email: this.state.userEmail }).then((response) => {
        if (response.data === 'user exists') {
          this.setState({ userExists: true });
          this.setState({ waiting: false });
        } else {
          this.setState({ submitted: true });
          this.setState({ userExists: false });
          console.log(response.data);
          this.setState({ waiting: false });
        }
      }).catch((error) => {
        console.log(error);
      });
    } else {
      this.setState({ badEmail: true });
      return '';
    }
  }

  changeSubmittedState() {
    const temp = !this.state.submitted;
    this.setState({ badEmail: false });
    this.setState({ submitted: temp });
    this.setState({ userEmail: '' });
  }

  renderWarning() {
    if (this.state.badEmail) {
      return (
        <div className="warningText">
          <i>Please enter a valid email address!</i>
        </div>
      );
    } else if (this.state.userExists) {
      return (
        <div className="warningText">
          <i>This email has already been registered.</i>
        </div>
      );
    } else {
      return <div />;
    }
  }

  renderModal() {
    return (
      <div className="modalContainer">
        <div className="modalHeader">
          <b>Thanks for signing up!</b>
        </div>
        <div className="divider" />
        <div className="modalText">
         A registration email has been sent to <b>{this.state.userEmail}</b>. Please check your inbox to ensure that your registration was successful.
         </div>
        <div className="modalText">
          <br />
          <b>Didn’t get our email?</b> <br />
        Please check your spam and junk folders in case your email server marked our email as spam.
        </div>
        <button className="modalButton" onClick={this.changeSubmittedState}> Got it! </button>
      </div>
    );
  }

  renderForms() {
    if (!this.state.waiting) {
      return (
        <div className="inputsHolder">
          <input style={inputStyle} type="text" placeholder="Enter your email" onChange={this.onEmailChange} />
          <button style={styles.base} onClick={() => { this.sendSignUpEmail(); }}> SIGN UP </button>
          {this.renderWarning()}
        </div>);
    } else {
      return (
        <div className="inputsHolder">
          <input style={inputStyle} type="text" placeholder="Enter your email" onChange={this.onEmailChange} />
          <button style={buttonStyle}> S </button>
        </div>);
    }
  }

  renderReactComponents() {
    if (!this.state.submitted) {
      return (
        <div>
          {this.renderForms()}
        </div>
      );
    } else {
      return (
        <div>
          {this.renderModal()}
        </div>
      );
    }
  }


  render() {
    return (
      <div id="main">

        <div className="contentBlock top">
          <div className="colorFix" />
          <div className="topText">
            <b>
                Halendr connects you with everything happening around you. Keep up with the things that you love doing, discover new things to do and share experiences with others.
                <br />
            </b>
            <br />
                   We’re not quite ready to launch yet but we will be soon. Sign up today.
                </div>
        </div>

        <div className="contentBlock middle">
          <div id="signupcontainer">
            {this.renderReactComponents()}
          </div>
        </div>

        <div className="contentBlock bottom">
          <div className="launchText">
            <p>Launching 01 September 2017</p>
          </div>
          <div className="whiteBlock">
            <div className="copyright">
                       © Halendr 2017
                    </div>
            <img id="footerLogo" src="images/hLogo1.jpg" alt="" />
          </div>
        </div>

      </div>
    );
  }
  }
