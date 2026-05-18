import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Main from '../main/Main';

import * as ROUTES from '../../constants/routes';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../../theme';

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path={ROUTES.HOME} element={<Main />} />
        <Route path={ROUTES.MAIN} element={<Main />} />
        <Route path="*" element={<Navigate to={ROUTES.MAIN} />} />
      </Routes>
    </Router>
  </ThemeProvider>
);

export default App;
