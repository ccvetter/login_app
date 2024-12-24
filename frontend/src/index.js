import React from 'react';
import ReactDOM from 'react-dom/client';
import './output.css';
import App from './App';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000/api/v1/';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.xsrfHeaderName = "x-csrftoken";
axios.defaults.xsrfCookieName = "csrftoken";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
