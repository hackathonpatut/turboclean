const React = require('react');
const render = require('react-dom');
const _ = require('lodash');
const request = require('superagent');
const moment = require('moment');
const { ArrowBottom } = require('react-bytesize-icons');

const Header = () => (
  <header>
    <h1>Turboclean</h1>
  </header>
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
      switch (value) {
        case value > 0.67:
          return "red " + other;
        case value > 0.33:
          return "orange " + other;
        default:
          return "green " + other;
      }
    };

    const collapsedClass = other => ( this.state.completed ? `${other} hide` : (this.state.collapsed ? other : `${other} expanded`) );

    return (
      <div className={ taskClass(this.props.task.dirtyness, collapsedClass('task')) }>
        <h2 onClick={ this.toggle }>Room { this.props.task.name }</h2>
        <p><span>Trash:</span> { this.props.task.trashFullness } %</p>
        <p><span>Dirtiness:</span> { this.props.task.dirtyness } %</p>
        <div onClick={ this.toggle }>
          <ArrowBottom color="#ccc"/>
        </div>
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
  }

  componentDidMount() {
    request.get('/api/targets').end((err,res) => {
      this.setState({ targets: res.body });
    });
  }

  render() {
    return (
      <div>
        <Header/>
        <Tasklist tasks={ this.state.targets }/>
      </div>
    );
  }
}
