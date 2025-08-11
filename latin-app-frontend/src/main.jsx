import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter> {/* Wrap App with the router */}
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);