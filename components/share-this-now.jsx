var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <div className="share-this-now">
        <div>
          <span className="title">Share This Now</span> <div className="social"> <div className="circle"><i className="fa fa-envelope"></i></div> <div className="circle"><i className="fa fa-facebook"></i></div> <div className="circle"><i className="fa fa-twitter"></i></div></div><span className="text">We need your help to spread the word about how encryption protects our privacy.</span>
        </div>
      </div>
    );
  }
});