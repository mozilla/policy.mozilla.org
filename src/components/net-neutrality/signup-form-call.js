import React from 'react';
import { FormattedMessage } from 'react-intl';
import classnames from "classnames";
import reactGA from 'react-ga';
import submit from '../../lib/submit';

var SignupCall = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      emailInput: "",
      emailInputError: "",
      privacyCheckboxChecked: false,
      privacyCheckboxError: "",
      signupCheckboxChecked: false,
      signupCheckboxError: "",
      submissionError: "",
      submitting: false
    };
  },
  onEmailChange: function(e) {
    this.setState({
      emailInput: e.target.value,
      emailInputError: ""
    });
  },
  onPrivacyChange: function(e) {
    this.setState({
      privacyCheckboxChecked: e.target.checked,
      privacyCheckboxError: ""
    });
  },
  onSignupChange: function(e) {
    this.setState({
      signupCheckboxChecked: e.target.checked,
      signupCheckboxError: ""
    });
  },
  onSubmit: function() {
    var valid = true;

    if (this.state.submitting) {
      return;
    }

    var privacyCheckboxError = "";
    var signupCheckboxError = "";
    var emailError = "";

    if (!this.state.privacyCheckboxChecked) {
      valid = false;
      privacyCheckboxError = 'This field is required.';
      reactGA.event({
        category: "Signup",
        action: "Form Error",
        label: "Privacy Policy Error"
      });
    }
    if (!this.state.signupCheckboxChecked) {
      valid = false;
      signupCheckboxError = 'This field is required.';
      reactGA.event({
        category: "Signup",
        action: "Form Error",
        label: "Signup Policy Error"
      });
    }
    if (!this.state.emailInput.trim()) {
      valid = false;

      emailError = 'This field is required.';
      reactGA.event({
        category: "Signup",
        action: "Form Error",
        label: "Empty Email Error"
      });
    } else if (!this.emailInput.validity.valid) {
      valid = false;

      emailError = 'Please enter a valid email address.';
      reactGA.event({
        category: "Signup",
        action: "Form Error",
        label: "Invalid Email Error"
      });
    }
// Make sure this works with two check boxes
    if (valid) {
      // submit
      this.setState({
        submitting: true,
        submissionError: ""
      });
      submit("/api/signup/basket", {
        url: window.location.href,
        email: this.state.emailInput,
        locale: this.context.intl.locale
      }, () => {
        // signup success
        reactGA.event({
          category: "Signup",
          action: "Submitted the form",
          label: "Net Neutrality"
        });
        this.props.onSuccess();
      }, () => {
        // signup error
        this.setState({
          submitting: false,
          submissionError: "try again later"
        });
      });
    } else {
      this.setState({
        privacyCheckboxError: privacyCheckboxError,
        signupCheckboxError: signupCheckboxError,
        emailInputError: emailError
      });
    }
  },
  render: function() {
    var emailClassName = classnames("email-input", {
      "invalid": !!this.props.emailInputError
    });

    var desktopButtonClassName = classnames(`desktop-button button signup-button`, {
      "submitting": this.state.submitting,
      "arrow": !this.state.submitting
    });

    var mobileButtonClassName = classnames(`mobile-button button signup-button`, {
      "submitting": this.state.submitting,
      "arrow": !this.state.submitting
    });
    var buttonText = this.context.intl.formatMessage({id: 'subscrib_button'});
    if (this.state.submitting) {
      buttonText = ``;
    }

    return (
      <div className="signup-form-background">
        <section>
          <div className="signup-form-container">
            <div>
              <h3>
                {this.context.intl.formatMessage({id: 'join_newsletter'})}
              </h3>
              <p>
                {this.context.intl.formatMessage({id: 'join_newsletter_desc'})}
              </p>
            </div>

            <div>
              <div className="no-wrap">

                <input autoComplete="off" ref={(input) => { this.emailInput = input; }} type='email' className={emailClassName} value={this.state.emailInput} onChange={this.onEmailChange} required placeholder={this.context.intl.formatMessage({id: 'newsletter_placeholder'})}/>

                <button onClick={this.onSubmit} className={desktopButtonClassName}>
                  {buttonText}
                </button>

              </div>
              <p className="error-message">{this.state.emailInputError}</p>
              <p className="error-message">{this.state.submissionError}</p>
              <label>
                <input className="checkbox" autoComplete="off" onChange={this.onSignupChange} value={this.state.signupCheckboxChecked} type="checkbox"></input>
                {this.context.intl.formatMessage({id: 'signup_checkbox'})}
              </label>
              <p className="privacy-error error-message">
                {this.state.signupCheckboxError}
              </p>
              <label>
                <input className="checkbox" autoComplete="off" onChange={this.onPrivacyChange} value={this.state.privacyCheckboxChecked} type="checkbox"></input>
                <FormattedMessage
                  id='newsletter_notice'
                  values={{
                    linkPrivacyNoticeNewsletter: (<a href="https://www.mozilla.org/privacy/websites/">{this.context.intl.formatMessage({id: 'newsletter_link_pn'})}</a>)
                  }}
                />
              </label>
              <p className="privacy-error error-message">
                {this.state.privacyCheckboxError}
              </p>
              <button onClick={this.onSubmit} className={mobileButtonClassName}>
                {buttonText}
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }
});

module.exports = SignupCall;
