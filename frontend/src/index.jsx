import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { store } from './store/store'
import { getMe } from './store/slices/authSlice'
import './index.css'

// Validate token on app load
const token = localStorage.getItem('token');
if (token) {
  // Validate token by calling getMe
  store.dispatch(getMe()).catch(() => {
    // If token is invalid, clear it
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)

