import React, { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  useTheme,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import signup from "../assets/images/register.png";
import { registerApi } from "../apis/api";
import zxcvbn from "zxcvbn";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Register = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      const result = zxcvbn(value);
      setPasswordStrength(result.score);
    }
  }, []);

  const togglePasswordVisibility = useCallback(() => setShowPassword((prev) => !prev), []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (passwordStrength < 2) {
        toast.error("Please choose a stronger password.");
        return;
      }

      setLoading(true);

      try {
        const res = await registerApi(formValues);

        if (res.data.success) {
          toast.success("Registration successful! Please check your email to verify your account.");
          navigate("/login");
        } else {
          const message = res.data.message.includes("email")
            ? "The email address you entered is already in use. Please try another one."
            : res.data.message || "An error occurred. Please try again.";
          toast.error(message);
        }
      } catch (error) {
        const message = error.response?.data?.message || "An unexpected error occurred. Please try again later.";
        toast.error(`Error: ${error.response.data.message}`);

      } finally {
        setLoading(false);
      }
    },
    [formValues, passwordStrength, navigate]
  );

  return (
    <Container component="main" maxWidth="xs" sx={{ '@media (min-width:600px)': { maxWidth: 'sm' } }}>
      <CssBaseline />
      <Box
        sx={{
          mt: 8,
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <img src={signup} alt="Register" height={100} width={100} />
        <Typography component="h1" variant="h5" sx={{ color: theme.palette.primary.main, mb: 1, fontWeight: 'bold' }}>
          Register
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
          Create your account to start exploring our amazing collection!
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            {["firstName", "lastName", "email"].map((field) => (
              <Grid item xs={12} key={field}>
                <TextField
                  autoComplete={field === "email" ? "email" : "given-name"}
                  name={field}
                  required
                  fullWidth
                  id={field}
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  autoFocus={field === "firstName"}
                  value={formValues[field]}
                  onChange={handleChange}
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
                  aria-describedby={`${field}-helper`}
                  helperText={
                    field === "email"
                      ? "We'll never share your email with anyone else."
                      : ""
                  }
                />
              </Grid>
            ))}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="new-password"
                value={formValues.password}
                onChange={handleChange}
                helperText={`Password strength: ${["Weak", "Fair", "Good", "Strong"][passwordStrength] || "Unknown"}`}
                error={passwordStrength < 2}
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
                aria-describedby="password-helper"
                FormHelperTextProps={{
                  sx: {
                    color: passwordStrength < 2 ? theme.palette.error.main : theme.palette.text.secondary,
                    fontSize: '0.75rem',
                  },
                }}
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
            {loading ? "Signing Up..." : "Sign Up"}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/login" style={{ color: theme.palette.primary.main, textDecoration: 'none', fontWeight: 'bold' }}>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
