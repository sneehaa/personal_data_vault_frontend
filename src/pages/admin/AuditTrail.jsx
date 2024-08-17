import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Grid, Paper, Divider, IconButton, TextField, MenuItem, Select, InputLabel, FormControl, CircularProgress, Snackbar, Alert } from '@mui/material';
import { getAuditLogsApi } from "../../apis/api";
import { Info as InfoIcon } from '@mui/icons-material';

const AuditTrail = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('timestamp');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await getAuditLogsApi();
        if (res.data && Array.isArray(res.data)) {
          setLogs(res.data);
          setFilteredLogs(res.data);
        } else {
          setError("Failed to fetch audit logs.");
        }
      } catch (error) {
        setError("Failed to fetch audit logs.");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  useEffect(() => {
    let logsToDisplay = [...logs];

    if (search) {
      logsToDisplay = logsToDisplay.filter(log =>
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.details.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sortBy === 'timestamp') {
      logsToDisplay.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } else {
      logsToDisplay.sort((a, b) => a.action.localeCompare(b.action));
    }

    setFilteredLogs(logsToDisplay);
  }, [search, sortBy, logs]);

  return (
    <Container component="main" maxWidth="lg" sx={{ minHeight: '100vh', py: 8, bgcolor: '#f0f2f5' }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" gutterBottom sx={{ color: '#333', fontWeight: 'bold' }}>
          Audit Trail
        </Typography>
        <TextField
          label="Search"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 2, width: '100%', maxWidth: 600 }}
        />
        <Box sx={{ mb: 2 }}>
          <FormControl sx={{ minWidth: 120, mr: 2 }}>
            <InputLabel id="sort-label">Sort By</InputLabel>
            <Select
              labelId="sort-label"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Sort By"
            >
              <MenuItem value="timestamp">Timestamp</MenuItem>
              <MenuItem value="action">Action</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <Grid item xs={12} sm={6} md={4} key={log._id}>
                <Paper
                  sx={{
                    p: 3,
                    bgcolor: '#ffffff',
                    boxShadow: 4,
                    borderRadius: 2,
                    border: '1px solid #ddd',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 8,
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <InfoIcon sx={{ color: '#1e88e5', mr: 1 }} />
                    <Typography variant="h6" sx={{ color: '#1e88e5', fontWeight: 'bold' }}>
                      Action
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {log.action}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <InfoIcon sx={{ color: '#43a047', mr: 1 }} />
                    <Typography variant="h6" sx={{ color: '#43a047', fontWeight: 'bold' }}>
                      Details
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {log.details}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <InfoIcon sx={{ color: '#e53935', mr: 1 }} />
                    <Typography variant="h6" sx={{ color: '#e53935', fontWeight: 'bold' }}>
                      Timestamp
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    {new Date(log.timestamp).toLocaleString()}
                  </Typography>
                </Paper>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper sx={{ p: 3, bgcolor: '#ffffff', boxShadow: 4, textAlign: 'center', borderRadius: 2 }}>
                <Typography variant="body1" sx={{ color: '#757575' }}>
                  No audit logs found
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AuditTrail;
