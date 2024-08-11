import React, { useEffect, useState } from 'react';
import { useParams, useNavigate,useLocation } from 'react-router-dom';
import { getSeats, bookTicket } from '../services/api';
import { Box, Button, CircularProgress, Typography, Grid, Paper, styled } from '@mui/material';
import { toast } from 'react-toastify';

const SeatButton = styled(Button)(({ theme, booked, selected }) => ({
  width: '48px',
  height: '48px',
  borderRadius: '4px',
  margin: theme.spacing(0.5),
  backgroundColor: booked
    ? theme.palette.grey[400]
    : selected
    ? theme.palette.primary.main
    : theme.palette.grey[200],
  color: booked
    ? theme.palette.grey[600]
    : selected
    ? '#fff'
    : theme.palette.text.primary,
  '&:hover': {
    backgroundColor: booked
      ? theme.palette.grey[400]
      : selected
      ? theme.palette.primary.dark
      : theme.palette.grey[300],
  },
}));

const SeatsSelection = () => {
  const { showTimeId } = useParams();
  const { state } = useLocation();
  const { movie } = state;
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedSeatsids, setSelectedSeatsids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  var userId = localStorage.getItem("userId");

  useEffect(() => {
    setLoading(true);
    getSeats(showTimeId)
      .then(response => {
        setSeats(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching seats:', error);
        setError('Failed to load seats.');
        setLoading(false);
      });
  }, [showTimeId]);

  const handleSeatSelect = (seatNumber,seatid) => {
    setSelectedSeats(prev =>
      prev.includes(seatNumber) ? prev.filter(s => s !== seatNumber) : [...prev, seatNumber]
    );
    setSelectedSeatsids(prev =>
      prev.includes(seatid) ? prev.filter(s => s !== seatid) : [...prev, seatid]
    );
  };

  const handleBookTicket = () => {
    if (selectedSeats.length === 0) {
      setError('Please select at least one seat.');
      return;
    }

    bookTicket(showTimeId, selectedSeats,selectedSeatsids,userId,movie.id)
      .then(() => {
          navigate('/confirmation', { state: { showTimeId, selectedSeats,userId,movie } });
      })
      .catch(error => {
        console.error('Error booking ticket:', error);
        setError('Failed to book ticket.');
      });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>
        Select Your Seats
      </Typography>
      {error && <Typography color="error" variant="body1">{error}</Typography>}
      <Paper elevation={3} style={{ padding: '20px', borderRadius: '8px' }}>
        <Typography variant="body1" gutterBottom>
          Click on the seats to select or deselect. Blue seats are selected, Grey seats are booked. And White seat are available for booking
        </Typography>
        <Grid container spacing={1} justifyContent="center">
          {seats.map(seat => (
            <Grid item xs={1.5} key={seat.seat_number}>
              <SeatButton
                variant="outlined"
                booked={seat.is_tickit_booked != 0}
                selected={selectedSeats.includes(seat.seat_number)}
                onClick={() => handleSeatSelect(seat.seat_number,seat.id)}
                disabled={seat.is_tickit_booked != 0}
              >
                {seat.seat_number}
              </SeatButton>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Box marginTop={4} display="flex" justifyContent="center">
        <Button
          variant="contained"
          color="primary"
          onClick={handleBookTicket}
        >
          Book Tickets
        </Button>
      </Box>
    </Box>
  );
};

export default SeatsSelection;
