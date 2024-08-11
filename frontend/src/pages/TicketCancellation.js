import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Grid, Card, CardContent, CardMedia } from '@mui/material';
import { getUserTickets, cancelTicket } from '../services/api';
import { toast } from 'react-toastify';

const TicketCancellation = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  var userid = localStorage.getItem("userId");

  useEffect(() => {
    setLoading(true);
    getdatas();
  }, []);

const getdatas = () =>{
  getUserTickets(userid)
  .then(response => {
    setTickets(response.data);
    setLoading(false);
  })
  .catch(error => {
    console.error('Error fetching user tickets:', error);
    setError('Failed to load tickets.');
    setLoading(false);
  });
}

  const handleCancelTicket = (ticketId) => {
    cancelTicket(ticketId)
      .then(() => {
        setTickets(tickets.filter(ticket => ticket.id !== ticketId));
        toast('Ticket canceled successfully!');
        getdatas();
      })
      .catch(error => {
        console.error('Error canceling ticket:', error);
        setError('Failed to cancel ticket.');
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
    <Box padding={2}>
      {error && <Typography color="error">{error}</Typography>}
      <Typography variant="h4" gutterBottom>
        Your Tickets
      </Typography>
      <Grid container spacing={3}>
        {tickets.map(ticket => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={ticket.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={ticket.image} // Use the correct property name for the image
                alt={ticket.title}
              />
              <CardContent>
                <Typography variant="h6">{ticket.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Genre: {ticket.genre}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Showtime: {ticket.time}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Seats: {ticket.seat_number}
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleCancelTicket(ticket.tickit_booked_id)}
                  fullWidth
                  style={{ marginTop: '10px' }}
                >
                  Cancel Ticket
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TicketCancellation;
