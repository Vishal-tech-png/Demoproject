import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Container, Paper, CircularProgress } from '@mui/material';
import { verifyOtp, resendOtp } from '../services/api';
import { toast } from 'react-toastify';

const OtpVerification = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loader state for OTP verification
  const [resendLoading, setResendLoading] = useState(false); // Loader state for Resend OTP
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state;

  const handleVerifyOtp = () => {
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    setLoading(true); // Start loading

    verifyOtp(email, otp)
      .then((res) => {
        console.log("res",res);
        toast('Login Successfully!');
        navigate('/movies');
        localStorage.setItem("userId",res.data.results.id);
      })
      .catch((err) => {
        setError('Invalid OTP');
        console.error(err);
      })
      .finally(() => {
        setLoading(false); // Stop loading
      });
  };

  const handleResendOtp = () => {
    setResendLoading(true); // Start loading for Resend OTP

    resendOtp(email)
      .then(() => {
        toast('OTP Sent Successfully!');
      })
      .catch((err) => {
        setError('Error resending OTP');
        console.error(err);
      })
      .finally(() => {
        setResendLoading(false); // Stop loading for Resend OTP
      });
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '10vh' }}>
      <Paper elevation={3} style={{ padding: '2rem', borderRadius: '12px' }}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="50vh"
        >
          <Typography variant="h4" gutterBottom>
            OTP Verification
          </Typography>
          <Typography variant="body1" gutterBottom style={{ marginBottom: '1rem', color: '#6c757d' }}>
            Enter the OTP sent to your email address
          </Typography>
          <TextField
            label="Enter OTP"
            type="text"
            variant="outlined"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            fullWidth
            margin="normal"
            inputProps={{ style: { textAlign: 'center', letterSpacing: '0.3em', fontSize: '1.5rem' } }}
          />
          {error && <Typography color="error" style={{ marginTop: '1rem' }}>{error}</Typography>}
          <Button
            variant="contained"
            color="primary"
            onClick={handleVerifyOtp}
            disabled={loading} // Disable the button while loading
            style={{
              marginTop: '2rem',
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              textTransform: 'none',
              background: '#1976d2',
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify OTP'}
          </Button>
          <Typography
            variant="body2"
            color="textSecondary"
            style={{ marginTop: '1.5rem', cursor: 'pointer' }}
            onClick={handleResendOtp}
          >
            {resendLoading ? <CircularProgress size={20} color="inherit" /> : 'Resend OTP'}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default OtpVerification;
