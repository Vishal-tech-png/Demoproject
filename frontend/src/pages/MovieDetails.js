import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getShowTimes } from '../services/api';
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

function MovieDetails() {
  const { id } = useParams();
  const [showTimes, setShowTimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getShowTimes(id)
      .then((response) => {
        setShowTimes(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching show times:', error);
        setLoading(false);
      });
  }, [id]);

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
        Showtimes
      </Typography>
      <List>
        {showTimes.map((showTime) => (
          <React.Fragment key={showTime.id}>
            <ListItem button component={Link} to={`/booking/${showTime.id}`}>
              <ListItemText primary={showTime.time} secondary={`Available Seats: ${showTime.available_seats}`} />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
      <Button component={Link} to="/" variant="contained" color="primary" sx={{ marginTop: 2 }} disabled={false}>
        Back to Movies
      </Button>
    </Paper>
  );
}

export default MovieDetails;
