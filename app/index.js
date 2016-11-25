import React from 'react';
import { render } from 'react-dom';

if (module.hot) {
  module.hot.accept();
}

const Header = () => (
  <div>Turboclean</div>
);


const App = () => (
  <div>
    <Header/>
    <h1>Hello World!</h1>
  </div>
);

render(<App />, document.getElementById('app'));
