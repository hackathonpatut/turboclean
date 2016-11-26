require("./Assets/style.scss");

var React = require('react');
var ReactDOM = require('react-dom');

var App = require('./App.js');

var AppElem = React.createElement(App);

ReactDOM.render(AppElem, document.getElementById('app'));
