import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './routers/router';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { AuthProvider } from './context/AuthContext'; 

import './index.css';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </Provider>
);
