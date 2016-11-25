require('./style.scss');

import React from 'react';
import { render } from 'react-dom';
import _ from 'lodash';
import request from 'superagent';


if (module.hot) {
  module.hot.accept();
}

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

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { targets: [] };
  }

  componentDidMount() {
    request.get('/api/targets').end((err,res) => {
      this.setState( { targets: res.body.data } );
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

render(<App />, document.getElementById('app'));
