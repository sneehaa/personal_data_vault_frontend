import React, { useState, useCallback, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Button,
  Box,
  Container,
  CssBaseline,
  Grid,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
  useTheme,
  Paper
} from "@mui/material";
import { toast } from "react-toastify";
import loginImage from "../assets/images/login.png";
import { loginApi } from "../apis/api";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const emailVerified = query.get('emailVerified');

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (emailVerified === 'true') {
      toast.success("Email verified successfully. Please log in.");
    } else if (emailVerified === 'false') {
      toast.error("Email verification failed or expired. Please try again.");
    }
  }, [emailVerified]);

  const handleChangeEmail = useCallback((e) => setEmail(e.target.value), []);
  const handleChangePassword = useCallback((e) => setPassword(e.target.value), []);
  const togglePasswordVisibility = useCallback(() => setShowPassword(prev => !prev), []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        const res = await loginApi({ email, password });
        if (res.data.success) {
          toast.success("Login successful!");
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.userData));
          
          navigate(res.data.userData.role === 'admin' ? "/admin/dashboard" : "/");
        } else {
          toast.error(res.data.message || "An error occurred. Please try again.");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred during login.");
      } finally {
        setLoading(false);
      }
    },
    [email, password, navigate]
  );

  return (
    <Container component="main" maxWidth="xs" sx={{ '@media (min-width:600px)': { maxWidth: 'sm' } }}>
      <CssBaseline />
      <Paper elevation={3} sx={{ p: 3, display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: theme.palette.background.paper, borderRadius: 2, boxShadow: 3 }}>
        <img src={loginImage} alt="Login" height={100} width={100} />
        <Typography component="h1" variant="h5" sx={{ color: theme.palette.primary.main, mb: 1, fontWeight: 'bold' }}>
          Login
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
          Log into your account
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={handleChangeEmail}
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: "1rem",
                  },
                  "& .MuiOutlinedInput-input": {
                    fontSize: "0.875rem",
                  },
                }}
                helperText="We'll never share your email with anyone else."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                onChange={handleChangePassword}
                variant="outlined"
                size="small"
                sx={{
                  transition: "all 0.3s ease",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: "1rem",
                  },
                  "& .MuiOutlinedInput-input": {
                    fontSize: "0.875rem",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                helperText="Enter your password"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disableElevation
            sx={{
              mt: 4,
              mb: 2,
              backgroundColor: "#4caf50",
              borderRadius: "22px",
              "&:hover": { backgroundColor: "#388e3c" },
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textTransform: "none",
              transition: "background-color 0.3s ease",
            }}
            disabled={loading}
          >
            {loading && <CircularProgress size={24} sx={{ position: "absolute" }} />}
            {loading ? "Logging In..." : "Login"}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/register" style={{ color: theme.palette.primary.main, textDecoration: 'none', fontWeight: 'bold' }}>
                Don't have an account? Sign up
              </Link>
            </Grid>
          </Grid>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/forgot-password" style={{ color: theme.palette.primary.main, textDecoration: 'none', fontWeight: 'bold' }}>
                Forgot password?
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
