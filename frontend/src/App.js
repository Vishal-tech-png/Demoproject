import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import OtpVerification from './pages/OtpVerification';
import Movies from './pages/Movies';
import ShowTimes from './pages/ShowTimes';
import Confirmation from './pages/Confirmation';
import SeatsSelection from './pages/SeatsSelection';
import TicketCancellation from './pages/TicketCancellation';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';
import Header from './components/Header';
import 'react-toastify/dist/ReactToastify.css';

// Define the theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // You can replace this with your desired primary color
    },
    secondary: {
      main: '#dc004e', // You can replace this with your desired secondary color
    },
    // Add other colors as needed
  },
});

// Layout component that conditionally renders Header
const LayoutWithHeader = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/' || location.pathname === '/otp-verification';
  
  return (
    <>
      {!isAuthPage && <Header />}
      {children}
    </>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<LayoutWithHeader><Login /></LayoutWithHeader>} />
          <Route path="/otp-verification" element={<LayoutWithHeader><OtpVerification /></LayoutWithHeader>} />
          <Route path="/movies" element={<LayoutWithHeader><Movies /></LayoutWithHeader>} />
          <Route path="/showtimes/:movieId" element={<LayoutWithHeader><ShowTimes /></LayoutWithHeader>} />
          <Route path="/mytickits" element={<LayoutWithHeader><TicketCancellation /></LayoutWithHeader>} />
          <Route path="/seats/:showTimeId" element={<LayoutWithHeader><SeatsSelection /></LayoutWithHeader>} />
          <Route path="/confirmation" element={<LayoutWithHeader><Confirmation /></LayoutWithHeader>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
