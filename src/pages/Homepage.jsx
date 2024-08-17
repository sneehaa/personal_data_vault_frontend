import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Box, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Homepage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      setUser({ role: 'Guest User' }); // Set role to Guest User if no user data is found
    }
  }, []);

  const handleAddData = () => {
    if (user && user.role !== 'Guest User') {
      navigate('/create_data');
    } else {
      toast.error("Login or Register Before Adding Data", {
        onClose: () => navigate('/login')
      });
    }
  };

  const handleViewData = () => {
    if (user && user.role !== 'Guest User') {
      navigate('/view-data');
    } else {
      toast.error("Login or Register Before Viewing Data", {
        onClose: () => navigate('/login')
      });
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, marginTop: 8 }}>
        <Typography variant="h4" gutterBottom align="center">
          Welcome to Your Personal Data Vault, {user ? user.firstName : 'Guest'}!
        </Typography>
        <Typography variant="h6" paragraph align="center">
          Here you can securely manage and view your personal data.
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} md={5}>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#388e3c' }, marginBottom: 2 }}
              fullWidth
              startIcon={<AddIcon />}
              onClick={handleAddData}
            >
              Add New Data
            </Button>
          </Grid>
          <Grid item xs={12} md={5}>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#388e3c' } }}
              fullWidth
              startIcon={<VisibilityIcon />}
              onClick={handleViewData}
            >
              View Data
            </Button>
          </Grid>
        </Grid>
        <Box mt={4} textAlign="center">
          {!user ? (
            <Button
              variant="outlined"
              sx={{ color: '#4caf50', borderColor: '#4caf50', padding: '8px 16px' }}
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          ) : null}
        </Box>
      </Paper>
    </Container>
  );
};

export default Homepage;
