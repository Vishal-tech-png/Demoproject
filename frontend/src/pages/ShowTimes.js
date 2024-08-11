import React, { useEffect, useState } from 'react';
import { useParams, useNavigate,useLocation } from 'react-router-dom';
import { getShowTimes } from '../services/api';
import { Box, Button, CircularProgress, Typography, Grid, Paper, styled } from '@mui/material';

const StyledButton = styled(Button)(({ theme }) => ({
  width: '100%',
  height: '60px',
  borderRadius: '8px',
  margin: theme.spacing(1),
  fontSize: '16px',
  fontWeight: 600,
}));

const ShowTimes = () => {
  const { movieId } = useParams();
  const { state } = useLocation();
  const { movie } = state;
  const [showTimes, setShowTimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getShowTimes(movieId)
      .then(response => {
        setShowTimes(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching showtimes:', error);
        setError('Failed to load showtimes.');
        setLoading(false);
      });
  }, [movieId]);

  const handleShowTimeClick = (showTimeId) => {
    navigate(`/seats/${showTimeId}`, { state: { movie } });
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
        Select a Show Time
      </Typography>
      {error && <Typography color="error" variant="body1">{error}</Typography>}
      <Grid container spacing={2}>
        {showTimes.map(showTime => (
          <Grid item xs={12} sm={6} md={4} key={showTime.id}>
            <StyledButton
              variant="contained"
              color="primary"
              onClick={() => handleShowTimeClick(showTime.id)}
            >
              {showTime.time}
            </StyledButton>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ShowTimes;


















// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getShowTimes, getSeats, bookTicket } from '../services/api';
// import { Box, Button, CircularProgress, Typography, Grid, Paper, styled } from '@mui/material';

// // Styled components for a cleaner look
// const StyledButton = styled(Button)(({ theme }) => ({
//   width: '100%',
//   height: '60px',
//   borderRadius: '8px',
//   margin: theme.spacing(1),
//   fontSize: '16px',
//   fontWeight: 600,
// }));

// const SeatButton = styled(Button)(({ theme, booked, selected }) => ({
//   width: '48px',
//   height: '48px',
//   borderRadius: '4px',
//   margin: theme.spacing(0.5),
//   backgroundColor: booked
//     ? theme.palette.grey[400]
//     : selected
//     ? theme.palette.primary.main
//     : theme.palette.grey[200],
//   color: booked
//     ? theme.palette.grey[600]
//     : selected
//     ? '#fff'
//     : theme.palette.text.primary,
//   '&:hover': {
//     backgroundColor: booked
//       ? theme.palette.grey[400]
//       : selected
//       ? theme.palette.primary.dark
//       : theme.palette.grey[300],
//   },
// }));

// const ShowTimes = () => {
//   const { movieId } = useParams();
//   const [showTimes, setShowTimes] = useState([]);
//   const [seats, setSeats] = useState([]);
//   const [selectedSeats, setSelectedSeats] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     setLoading(true);
//     getShowTimes(movieId)
//       .then(response => {
//         setShowTimes(response.data);
//         setLoading(false);
//       })
//       .catch(error => {
//         console.error('Error fetching showtimes:', error);
//         setError('Failed to load showtimes.');
//         setLoading(false);
//       });
//   }, [movieId]);

//   const handleShowTimeClick = (showTimeId) => {
//     setLoading(true);
//     getSeats(showTimeId)
//       .then(response => {
//         setSeats(response.data);
//         setLoading(false);
//       })
//       .catch(error => {
//         console.error('Error fetching seats:', error);
//         setError('Failed to load seats.');
//         setLoading(false);
//       });
//   };

//   const handleSeatSelect = (seatNumber) => {
//     setSelectedSeats(prev =>
//       prev.includes(seatNumber) ? prev.filter(s => s !== seatNumber) : [...prev, seatNumber]
//     );
//   };

//   const handleBookTicket = (showTimeId) => {
//     if (!showTimeId) {
//       setError('Please select a showtime.');
//       return;
//     }

//     bookTicket(showTimeId, selectedSeats)
//       .then(() => {
//         navigate('/confirmation', { state: { showTimeId, selectedSeats } });
//       })
//       .catch(error => {
//         console.error('Error booking ticket:', error);
//         setError('Failed to book ticket.');
//       });
//   };

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box padding={3}>
//       <Typography variant="h4" gutterBottom>
//         Select a Show Time
//       </Typography>
//       {error && <Typography color="error" variant="body1">{error}</Typography>}
//       <Grid container spacing={2}>
//         {showTimes.map(showTime => (
//           <Grid item xs={12} sm={6} md={4} key={showTime.id}>
//             <StyledButton
//               variant="contained"
//               color="primary"
//               onClick={() => handleShowTimeClick(showTime.id)}
//             >
//               {showTime.time}
//             </StyledButton>
//           </Grid>
//         ))}
//       </Grid>

//       {seats.length > 0 && (
//         <>
//           <Typography variant="h5" gutterBottom marginTop={4}>
//             Select Your Seats
//           </Typography>
//           <Paper elevation={3} style={{ padding: '20px', borderRadius: '8px' }}>
//             <Typography variant="body1" gutterBottom>
//               Click on the seats to select or deselect. Blue seats are available, grey seats are booked.
//             </Typography>
//             <Grid container spacing={1} justifyContent="center">
//               {seats.map(seat => (
//                 <Grid item xs={1.5} key={seat.seat_number}>
//                   <SeatButton
//                     variant="outlined"
//                     booked={seat.booked}
//                     selected={selectedSeats.includes(seat.seat_number)}
//                     onClick={() => handleSeatSelect(seat.seat_number)}
//                     disabled={seat.booked}
//                   >
//                     {seat.seat_number}
//                   </SeatButton>
//                 </Grid>
//               ))}
//             </Grid>
//           </Paper>
//         </>
//       )}

//       <Box marginTop={4} display="flex" justifyContent="center">
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => handleBookTicket(showTimes[0]?.id)}
//           disabled={selectedSeats.length === 0}
//         >
//           Book Tickets
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default ShowTimes;


