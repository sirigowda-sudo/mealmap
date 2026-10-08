import {
  Box,
  Button,
  Typography,
  IconButton,
  TextField,
  Alert,
  Snackbar,
  Grid,
  FormControlLabel,
  Checkbox,
  InputAdornment,
} from "@mui/material";
import React, { useState } from "react";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { apiList, invokeApi } from "../../services/apiServices";
import { config } from "../../config/config";
import loginImage from "../../assets/login-bg-img.jpg";
import logo from "../../assets/logo/meal-map-logo.png";
import LoginIcon from "@mui/icons-material/Login";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cookies, setCookie] = useCookies();
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  // Login API
  const handleLogin = async () => {
    setLoading(true);

    let params = {
      email: username,
      password: password,
    };

    try {
      let response = await invokeApi(
        config.mealMap + apiList.userLogin,
        params,
        cookies
      );

      if (response?.status >= 200 && response?.status < 300) {
        if (response.data.responseCode === "200") {
          setCookie(
            config.cookieName,
            JSON.stringify({
              token: response.data.token,
              loginUserId: response.data.userId,
            }),
            { path: "/", maxAge: 3000000, sameSite: "strict" }
          );
          navigate("/Dashboard");
        } else if (response.data.responseCode === "HE001") {
          showSnackbar(
            "Invalid credentials. Please check your email and password.",
            "error"
          );
        } else {
          showSnackbar(
            "Something went wrong while login. Please try again later!",
            "error"
          );
        }
      } else if (
        response.data.responseMessage.includes("Password missMatch", "error")
      ) {
        showSnackbar("Password mismatch. Please check your password.", "error");
      } else if (
        response.data.responseMessage.includes("No user found", "error")
      ) {
        showSnackbar("No user found with the provided email.", "error");
      } else {
        showSnackbar(
          "Something went wrong while login. Please try again later!!",
          "error"
        );
      }
    } catch (error) {
      console.error("Error during login:", error);
      showSnackbar("Something went wrong. Please try again later!!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid
      sx={{
        width: "100%",
        // height: "100vh",
        backgroundColor: "#181e37",
        overflow: "hidden",
      }}
    >
      <Grid container sx={{ minHeight: "100vh" }}>
        {/* Left Side - Login Form */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            backgroundColor: "#181e37",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            color: "#fff",
            p: 8,
            borderRadius: "0px 20px 20px 0px",
            backdropFilter: "blur(6px)",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)",
          }}
        >
          <Box>
            <img src={logo} alt="Logo" style={{ width: 200, height: "auto" }} />
          </Box>

          <Box sx={{ width: "100%", maxWidth: 350 }}>
            {/* Avatar Placeholder */}
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                border: "2px solid #fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mx: "auto",
                mb: 3,
              }}
            >
              <AccountCircle sx={{ fontSize: 80, color: "#fff" }} />
            </Box>

            {/* Username */}
            <TextField
              placeholder="Username"
              fullWidth
              variant="outlined"
              sx={{
                mb: 2,
                input: { color: "#fff" },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                  backgroundColor: "transparent",
                  color: "#fff",
                  "& fieldset": { borderColor: "#777" },
                  "&:hover fieldset": { borderColor: "#fff" },
                },
              }}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle sx={{ color: "#bbb" }} />
                  </InputAdornment>
                ),
              }}
            />

            {/* Password */}
            <TextField
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              variant="outlined"
              sx={{
                mb: 2,
                input: { color: "#fff" },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                  backgroundColor: "transparent",
                  color: "#fff",
                  "& fieldset": { borderColor: "#777" },
                  "&:hover fieldset": { borderColor: "#fff" },
                },
              }}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "#bbb" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePasswordVisibility}>
                      {showPassword ? (
                        <Visibility sx={{ color: "#bbb" }} />
                      ) : (
                        <VisibilityOff sx={{ color: "#bbb" }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Login Button */}
            <Button
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: "#ff007f",
                borderRadius: "20px",
                height: 50,
                fontWeight: "bold",
                mt: 1,
                "&:hover": { backgroundColor: "#e60073" },
              }}
              onClick={handleLogin}
            >
              <LoginIcon sx={{ mr: 1 }} /> LOGIN
            </Button>

            {/* Remember Me & Forgot Password */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 2,
              }}
            >
              <FormControlLabel
                control={<Checkbox size="small" sx={{ color: "#fff" }} />}
                label={
                  <Typography variant="body2" sx={{ color: "#fff" }}>
                    Remember me
                  </Typography>
                }
              />

              <Typography
                component="a"
                href="#"
                sx={{
                  color: "#FFF",
                  textDecoration: "underline",
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Forgot your password?
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Right Side - Image with Overlay */}
        <Grid
          item
          xs={12}
          md={8}
          sx={{
            position: "relative",
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            color: "#fff",
            p: 6,
            textAlign: "right",
          }}
        >
          <img
            src={loginImage}
            alt="Login Background"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "fill",
              zIndex: 1,
            }}
          />

          <Box sx={{ maxWidth: 450, zIndex: 1 }}>
            <Typography gutterBottom sx={{ fontSize: 60, fontWeight: "bold" }}>
              Welcome
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, mt: -2 }}>
              Access your account to manage your profile, track progress, and
              explore new features tailored just for you
            </Typography>

            <Typography sx={{ color: "#FFFAF0" }}>
              Not a member?{" "}
              <Typography
                component="a"
                href="#"
                sx={{
                  color: "#FFF",
                  textDecoration: "underline",
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Sign up now
              </Typography>
            </Typography>
          </Box>
        </Grid>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={2000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          sx={{ width: "auto" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: "auto", fontSize: { xs: "14px" } }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Grid>
    </Grid >
  );
};

export default Login;
