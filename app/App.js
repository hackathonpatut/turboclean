const React = require('react');
const render = require('react-dom');
const _ = require('lodash');
const request = require('superagent');
// require('./style.scss');

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
            <div className="emergencyColor"> </div>
            <button className="slider" onClick={this.handleClick}>PRESS TO<br></br>COMPLETE</button>
            <div className="taskInfo">
              <h2>{ row.target }</h2>
              <p>Floor: {row.floor}</p>
              <p>Trash: {row.trash}</p>
              <p>Dirtyness: {row.dirtyness}</p>
            </div>
          </div>)
        }
      </main>
    );
  }
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tasks: [] };
  }

  componentDidMount() {
    
    request.get('/api/targets').end((err,res) => {
      //this.setState( { targets: res.body } );
      console.log(res.body);
    });
    
    this.setState({ tasks: [
      {target: "Room 715", dirtyness: "50%", trash:"80%", floor: "7"},
      {target: "Room 726", dirtyness:"37%", trash:"30%", floor: "7"},
      {target: "Room 602", dirtyness:"43%", trash:"50%", floor: "6"}
     ]});
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
