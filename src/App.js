import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';
import Routes from './routes.js';

function App() {  
  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  );
}

export default App;