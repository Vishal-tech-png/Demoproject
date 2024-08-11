import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';

const SuccessIcon = () => (
  <svg
    width="100"
    height="100"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ color: '#4CAF50', marginBottom: '20px' }}
  >
    <path
      fill="currentColor"
      d="M9 16.17L4.83 12 3.41 13.41 9 19 21 7 19.59 5.59 9 16.17z"
    />
  </svg>
);

const Confirmation = () => {
  const { state } = useLocation();
  const { showTimeId, selectedSeats, movie } = state;
  const navigate = useNavigate();

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" textAlign="center">
      <Paper elevation={3} style={{ padding: '30px', borderRadius: '10px', maxWidth: '500px', width: '100%' }}>
        <SuccessIcon />
        <Typography variant="h4" gutterBottom>
          Ticket Confirmed!
        </Typography>
        <Box display="flex" flexDirection="column" alignItems="center" marginBottom="20px">
          <img
            src={movie.image}
            alt={movie.title}
            style={{
              width: '100%',
              maxHeight: '300px',  // Limit the height to avoid large images
              objectFit: 'cover',
              borderRadius: '10px',
              marginBottom: '15px',
            }}
          />
          <Typography variant="h6" gutterBottom>
            {movie.title}
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            Genre: {movie.genre}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Show Time: {showTimeId}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Seats: {selectedSeats.join(', ')}
          </Typography>
        </Box>
        <Button variant="contained" color="primary" onClick={() => navigate('/movies')}>
          Go to Home
        </Button>
      </Paper>
    </Box>
  );
};

export default Confirmation;
