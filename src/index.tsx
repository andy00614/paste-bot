import React from 'react';
import { render } from 'react-dom';
import App from './App';
import '@fontsource/roboto';
import { initJsStore } from './db/idb_service';

render(<App />, document.getElementById('root'));

initJsStore();
