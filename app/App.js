const React = require('react');
const render = require('react-dom');
const _ = require('lodash');
const request = require('superagent');
const moment = require('moment');
const { ArrowTop, Bell } = require('react-bytesize-icons');

const Header = () => (
  <header>
    <h1>Turboclean</h1>
  </header>
);

const Footer = () => (
  <footer>
    <a href="https://github.com/villevuor/turboclean" target="_blank">View code on GitHub</a>
  </footer>
);

class Task extends React.Component{
  constructor(props) {
    super(props);
    this.state = { collapsed: true, completed: false };

    this.toggle = this.toggle.bind(this);
    this.send = this.send.bind(this);
  }

  toggle(){
    this.setState({ collapsed: !this.state.collapsed, completed: false });
  }

  send() {
    request.post('/api/cleanings')
      .set('Content-Type', 'application/json')
      .send(`{"id":"${ this.props.task.id }","cleaner":"Alan"}`)
      .end();
    this.setState({ collapsed: false, completed: true });
  }

  render() {
    const taskClass = (value, other) => {
      if ( value > 100 ) return "alert " + other;
      if ( value > 80 ) return "red " + other;
      if ( value > 60 ) return "orange " + other;
      return "green " + other;
    };

    const priorityLabel = value => {
      if ( value > 100 ) return "Alert";
      if ( value > 80 ) return "High";
      if ( value > 60 ) return "Medium";
      return "Low";
    };

    const collapsedClass = other => ( this.state.completed ? `${other} hide` : (this.state.collapsed ? other : `${other} expanded`) );

    return (
      <div className={ taskClass(this.props.task.dirtyness, collapsedClass('task')) }>
        <div className="click-area" onClick={ this.toggle }></div>
        <h2>Room { this.props.task.name }</h2>
        <p className="label"><span>Priority</span> { priorityLabel(this.props.task.dirtyness) }</p>
        <p><span>Trashbin</span> { this.props.task.trashFullness } %</p>
        <div>{ ( this.props.task.dirtyness < 101 ? <ArrowTop color="#ccc"/> : <Bell color="#f44336"/> ) }</div>
        <div className="details">
          <p><span>Location:</span> 7th floor, east</p>
          <p><span>Last cleaned:</span> { moment( _.head (_.maxBy(this.props.task.cleanings, 'time') ) ).calendar() }</p>
          <p><span>Used after cleaned:</span> { Math.round(this.props.task.usageHours) } hours</p>
          <a onClick={ this.send }>Press to complete</a>
        </div>
      </div>
    );
  }

}

class Tasklist extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <main>
        { _.map(this.props.tasks, row => <Task task={ row } />) }
      </main>
    );
  }
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { targets: [] };

    this.fetchData = this.fetchData.bind(this);
  }

  fetchData() {
    request.get('/api/targets').end((err,res) => {
      this.setState({ targets: res.body });
    });
  }

  componentDidMount() {
    this.fetchData();
    setInterval(this.fetchData, parseInt(10*1000));
  }

  render() {
    return (
      <div>
        <Header/>
        <Tasklist tasks={ this.state.targets }/>
        <Footer/>
      </div>
    );
  }
}
