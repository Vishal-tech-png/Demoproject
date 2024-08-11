import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const sendOtp = (email) => axios.post(`${API_URL}/login`, { email });

export const verifyOtp = (email, otp) => axios.post(`${API_URL}/verify-otp`, { email, otp });

export const resendOtp = (email) => axios.post(`${API_URL}/resendotp`, { email });

export const getMovies = () => axios.get(`${API_URL}/movies`);

export const getShowTimes = (movieId) => axios.get(`${API_URL}/showtimes/${movieId}`);

export const getSeats = (showTimeId) => axios.get(`${API_URL}/seats/${showTimeId}`);

export const bookTicket = (showTimeId, seatNumbers,selectedSeatsids,userId,movieid) => axios.post(`${API_URL}/book-ticket`, { showTimeId, seatNumbers,selectedSeatsids,userId,movieid });

export const getUserTickets = (userId) => axios.post(`${API_URL}/mytickets`,{userId});

export const cancelTicket = (ticketId) => axios.post(`${API_URL}/canceltickets`,{ticketId});