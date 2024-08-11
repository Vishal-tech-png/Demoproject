import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSeats } from '../services/api';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  CircularProgress,
  Box,
  Button,
  Divider,
} from '@mui/material';

function Booking() {
  const { showTimeId } = useParams();
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSeats(showTimeId)
      .then((response) => {
        setSeats(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching seats:', error);
        setLoading(false);
      });
  }, [showTimeId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
      <Typography variant="h4" gutterBottom>
        Seat Booking
      </Typography>
      <List>
        {seats.map((seat) => (
          <React.Fragment key={seat.id}>
            <ListItem>
              <ListItemText primary={`Seat ${seat.seat_number}`} secondary={seat.is_booked ? 'Booked' : 'Available'} />
              <Button
                variant="contained"
                color="primary"
                disabled={seat.is_booked}
                component={Link}
                to={`/book/${seat.id}`}
              >
                {seat.is_booked ? 'Booked' : 'Book Now'}
              </Button>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
      <Button component={Link} to="/" variant="contained" color="primary" sx={{ marginTop: 2 }}>
        Back to Movies
      </Button>
    </Paper>
  );
}

export default Booking;
