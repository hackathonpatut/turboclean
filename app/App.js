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
    this.state = { collapsed: true };

    this.toggle = this.toggle.bind(this);
  }

  toggle(){
    this.setState({ collapsed: !this.state.collapsed });
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

    const collapsedClass = other => ( this.state.collapsed ? other : `${other} expanded` );

    return (
      <div onClick={ this.toggle } className={ taskClass(this.props.task.dirtyness, collapsedClass('task')) }>
        <h2>Room { this.props.task.name }</h2>
        <p><span>Trash:</span> { this.props.task.trashFullness } %</p>
        <p><span>Dirtyness:</span> { this.props.task.dirtyness } %</p>
        <ArrowBottom color="#ccc"/>
        <div className="details">
          <p><span>Location:</span> 7th floor, east</p>
          <p><span>Last cleaned:</span> { moment( this.props.task.updatedAt ).calendar() }</p>
          <p><span>Used after cleaned:</span> XXX</p>
          <a onClick={ this.handleClick }>Press to complete</a>
        </div>
      </div>
    );
  }

}

class Tasklist extends React.Component {
  constructor(props) {
    super(props);
  }

  toggle(event){

  }

  handleClick(){

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
      console.log(res.body);
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
