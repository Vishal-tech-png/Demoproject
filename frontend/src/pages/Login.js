import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { sendOtp } from '../services/api';
import { toast } from 'react-toastify';

const BackgroundContainer = styled(Box)({
  backgroundImage: 'url(https://source.unsplash.com/random)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const LoginContainer = styled(Paper)({
  padding: '40px',
  maxWidth: '400px',
  width: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '12px',
  boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.15)',
});

const StyledTextField = styled(TextField)({
  marginBottom: '20px',
  '& .MuiInputBase-input': {
    fontSize: '1.2rem',
    padding: '12px',
  },
  '& .MuiInputLabel-root': {
    fontSize: '1rem',
  },
});

const LoginButton = styled(Button)({
  marginTop: '20px',
  padding: '12px 0',
  fontSize: '1.1rem',
  fontWeight: 'bold',
  backgroundColor: '#1976d2',
  color: '#fff',
  borderRadius: '8px',
  boxShadow: '0px 4px 12px rgba(25, 118, 210, 0.4)',
  '&:hover': {
    backgroundColor: '#115293',
    boxShadow: '0px 4px 15px rgba(25, 118, 210, 0.6)',
  },
});

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);  // Start loading
    sendOtp(email)
      .then(() => {
        toast('OTP sent to your email!');
        navigate('/otp-verification', { state: { email } });
      })
      .catch((err) => {
        setError('Error sending OTP');
        console.error(err);
      })
      .finally(() => {
        setLoading(false);  // Stop loading
      });
  };

  return (
    <BackgroundContainer>
      <LoginContainer>
        <Typography variant="h4" align="center" gutterBottom>
          Welcome Back
        </Typography>
        <Typography variant="h6" align="center" gutterBottom style={{ marginBottom: '20px', color: '#666' }}>
          Ticket Booking App
        </Typography>
        <StyledTextField
          fullWidth
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label="Email"
          type="email"
          error={!!error}
          helperText={error}
        />
        <LoginButton
          fullWidth
          variant="contained"
          onClick={handleLogin}
          disabled={loading}  // Disable button while loading
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
        </LoginButton>
      </LoginContainer>
    </BackgroundContainer>
  );
};

export default LoginPage;
