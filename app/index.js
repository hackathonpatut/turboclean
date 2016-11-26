require('./style.scss');

import React from 'react';
import { render } from 'react-dom';
import _ from 'lodash';
import request from 'superagent';
//import Swipeout from 'Swipeout';

if (module.hot) {
  module.hot.accept();
}

const Header = () => (
  <header>
    <h1>Turboclean</h1>
    <h2 className="logout">Patu</h2>
  </header>
);

class SingleTask extends React.Component{
  render(){

  }
}

class Tasklist extends React.Component {
  constructor(props) {
    super(props);
  }
  handleClick(){
        console.log("markusÄLÄKATOTÄNNE");
  }
  render() {
    return (
      <main>
        { _.map(this.props.tasks, row =>
          <div className="task">
            <h2>{ row.target }</h2>
            <p>Floor: {row.floor}</p>
            <button className="slider" onClick={this.handleClick}>PRESS TO<br></br>COMPLETE</button>
            <p>Trash: {row.trash}</p>
            <p>Dirtyness: {row.dirtyness}</p>
          </div>)
        }

      </main>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tasks: [] };
  }

  componentDidMount() {
  /*  request.get('/api/targets').end((err,res) => {
      this.setState( { tasks: res.body.data } );
    });
  */

  this.setState({ tasks: [{target: "Room 404", dirtyness: "50%", trash:"80%", floor: "7"},{target: "Room 123", dirtyness:"37%", trash:"30%", floor: "7"}]})

  }

  render() {
    return (
      <div>
        <Header/>
        <Tasklist tasks={ this.state.tasks }/>
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
