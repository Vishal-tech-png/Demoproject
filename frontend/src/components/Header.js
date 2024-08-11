// src/components/Header.js

import React,{useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Header = () => {
  const navigate = useNavigate();
  var userid = localStorage.getItem("userId");
  useEffect(() => {
     if(!userid){
      navigate("/");
     }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    window.location.href = '/'; 
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          <Link to="/movies" style={{ textDecoration: 'none', color: 'white' }}>
            Book Movie
          </Link>
        </Typography>
        <Button color="inherit" component={Link} to="/mytickits">
          My Tickets
        </Button>
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

