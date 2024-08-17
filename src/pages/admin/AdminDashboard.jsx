import React from 'react';
import { Container, Typography, Box, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

// Styled component for buttons
const CustomButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  fontSize: '1rem',
  textTransform: 'none',
  borderRadius: '8px',
  boxShadow: theme.shadows[2],
}));

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleManageUsers = () => {
    navigate('/admin/manage-users');
  };

  const handleManageData = () => {
    navigate('/admin/manage-data');
  };

  const handleAuditTrail = () => {
    navigate('/admin/audit-trails');
  };

  return (
    <Container component="main" maxWidth="lg" sx={{ bgcolor: '#e8f5e9', minHeight: '100vh', py: 8 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom sx={{ color: '#004d40', fontWeight: 'bold' }}>
          Admin Dashboard
        </Typography>
        <Typography variant="h6" paragraph sx={{ color: '#004d40', mb: 4 }}>
          Manage users, data, and application settings from here.
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <CustomButton
              variant="contained"
              fullWidth
              onClick={handleManageUsers}
              sx={{ bgcolor: '#0288d1', '&:hover': { bgcolor: '#0277bd' }, mb: 2 }}
            >
              Manage Users
            </CustomButton>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <CustomButton
              variant="contained"
              fullWidth
              onClick={handleManageData}
              sx={{ bgcolor: '#00897b', '&:hover': { bgcolor: '#00796b' }, mb: 2 }}
            >
              Manage Data
            </CustomButton>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <CustomButton
              variant="contained"
              fullWidth
              onClick={handleAuditTrail}
              sx={{ bgcolor: '#ff7043', '&:hover': { bgcolor: '#ff5722' }, mb: 2 }}
            >
              Audit Trail
            </CustomButton>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AdminDashboard;
