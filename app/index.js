require('./style.scss');

import React from 'react';
import { render } from 'react-dom';

if (module.hot) {
  module.hot.accept();
}

const Header = () => (
  <header>
    <h1>Turboclean</h1>
  </header>
);

const Main = () => (
  <main>
    <p>Turboclean</p>
  </main>
);

const App = () => (
  <div>
    <Header/>
    <Main/>
  </div>
);

render(<App />, document.getElementById('app'));
