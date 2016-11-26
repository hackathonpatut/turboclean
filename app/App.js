const React = require('react');
const render = require('react-dom');
const _ = require('lodash');
const request = require('superagent');
// require('./style.scss');

const Header = () => (
  <header>
    <h1>Turboclean</h1>
  </header>
);

class Targets extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <main>
        { _.map(this.props.targets, row => <p>{ row.name }</p>) }
      </main>
    );
  }
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { targets: [] };
  }

  componentDidMount() {
    request.get('/api/targets').end((err,res) => {
      this.setState( { targets: res.body } );
    });
  }

  render() {
    return (
      <div>
        <Header/>
        <Targets targets={ this.state.targets }/>
      </div>
    );
  }
}
