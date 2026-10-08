import React, { useEffect, useState } from "react";
import {
  Divider,
  Grid,
  InputLabel,
  Paper,
  TextField,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
} from "@mui/material";
import Header from "../common/Header";
import Sidenav from "../common/Sidenav";
import { apiList, invokeApi } from "../../../../services/apiServices";
import { config } from "../../../../config/config";
import { useCookies } from "react-cookie";
import IconSidenav from "../common/IconSidenav";

function MyProfile() {
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [password, setPassword] = useState("");
  const [newPasswordHelperText, setNewPasswordHelperText] = useState("");
  const [newPasswordNameError, setNewPasswordNameError] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cookies] = useCookies();
  const [showSideNav, setShowSideNav] = useState(false);
  const isMobileScreen = useMediaQuery("(min-width:360px) and (max-width:500px)");

  const toggleSideNav = () => {
    setShowSideNav(!showSideNav);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setError(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (newPassword !== password) {
      setError("Passwords do not match");
      return;
    }

 
    handleCloseDialog();
  };

  const handleOldPasswordChange = (event) => {
    setOldPassword(event.target.value);
    setError(null);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
    setError(null);
  };

  const handleConfirmPasswordChange = (event) => {
    setPassword(event.target.value);
    setError(null);
  };

  useEffect(() => {
    profileData();
  }, []);

  const profileData = async () => {
    const id = cookies[config.cookieName]?.loginUserId;
    const params = {
      id: id,
    };

    try {
      const response = await invokeApi(
        config.mealMap + apiList.getUser,
        params,
        cookies
      );

    
      if (response?.status >= 200 && response?.status < 300) {
        if (response.data.responseCode === "200") {
          // Set state variables with fetched data
          setFullName(response.data.users.name);
          setEmail(response.data.users.email);
          setPhone(response.data.users.phoneNumber);
        } else if (response.data.responseCode === "400") {
          alert(response.data.responseCode);
        }
      }
    } catch (error) {
      
      alert("Something went wrong. Please try again later!!");
    }
  };

  const profilePage = async () => {
    const params = {
      password: password,
    };

    try {
      const response = await invokeApi(
        config.mealMap + apiList.changePassword,
        params,
        cookies,
    
      );

      if (response?.status >= 200 && response?.status < 300) {
        if (response.data.responseCode === "200") {
          // Handle success
        
          alert(response.data.responseCode);
        } else if (response.data.responseCode === "400") {
          alert(response.data.responseCode);
        }
      }
    } catch (error) {
    
      alert("Something went wrong. Please try again later!!");
    }
  };

  return (
    <div>
      <Grid sx={{ display: "flex" }}>
        {isMobileScreen ? (
          <IconSidenav />
        ) : showSideNav ? (
          <IconSidenav />
        ) : (
          <Sidenav />
        )}
        <Grid component="main" sx={{ width: "100%", px: 1 }}>
          <Header toggleSideNav={toggleSideNav} />
          <Grid
            sx={{
              width: "100%",
              px: isMobileScreen ? 1 : 5,
            }}
          >
            <form onSubmit={handleSubmit}>
              <Paper
                sx={{
                  padding: isMobileScreen ? 2 : "50px",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    color: "#1D1A57",
                    marginBottom: "20px",
                    fontSize: isMobileScreen ? 15 : 30,
                  }}
                >
                  MY PROFILE
                </Typography>
                <Divider sx={{ backgroundColor: "black" }}></Divider>

                <Grid container spacing={2} sx={{ marginTop: "20px" }}>
                  {/* Full Name */}
                  <Grid item md={6} xs={12}>
                    <InputLabel
                      sx={{
                        fontWeight: "bold",
                        my: 1,
                        fontSize: isMobileScreen ? 12 : 14,
                      }}
                    >
                      Name*:
                    </InputLabel>
                    <TextField
                      placeholder="Enter Full Name"
                      fullWidth
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      inputProps={{
                        style: {
                          height: isMobileScreen ? "1px" : "8px",
                          fontSize: isMobileScreen ? 12 : 14,
                        },
                      }}
                    />
                  </Grid>

                  {/* Email */}
                  <Grid item md={6} xs={12}>
                    <InputLabel
                      sx={{ fontWeight: "bold", my: 1,        fontSize: isMobileScreen ? 12 : 14, }}
                    >
                      Email*:
                    </InputLabel>
                    <TextField
                      placeholder="admin@mealMap.com"
                      fullWidth
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      inputProps={{
                        style: {
                          height: isMobileScreen ? "1px" : "8px",
                          fontSize: isMobileScreen ? 12 : 14,
                        },
                      }}
                    />
                  </Grid>

                  {/* Phone */}
                  <Grid item md={6} xs={12}>
                    <InputLabel
                      sx={{ fontWeight: "bold", my: 1,        fontSize: isMobileScreen ? 12 : 14,}}
                    >
                      Phone*:
                    </InputLabel>
                    <TextField
                      placeholder="Enter Phone"
                      fullWidth
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      inputProps={{
                        style: {
                          height: isMobileScreen ? "1px" : "8px",
                          fontSize: isMobileScreen ? 12 : 14,
                        },
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Submit Button */}
                <Grid
                  item
                  md={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: isMobileScreen ? "center" : "flex-end",
                  }}
                >
                  <Button
                    onClick={handleOpenDialog}
                    sx={{
                      mr: 2,
                      my: 2,
                      px: 2,
                      fontSize: isMobileScreen ? 10 : 12,
                      background: "#1d1a57",
                      color: "#FFF",
                      fontWeight: 600,
                      "&:hover": { background: "#1d1a57", color: "#FFF" },
                    }}
                  >
                    Change Password
                  </Button>
                  <Button
                    type="submit"
                    sx={{
                      my: 2,
                      px: 2,
                      fontSize: isMobileScreen ? 10 : 12,
                      background: "#1d1a57",
                      color: "#FFF",
                      fontWeight: 600,
                      "&:hover": { background: "#1d1a57", color: "#FFF" },
                    }}
                  >
                    Submit
                  </Button>
                </Grid>
              </Paper>
            </form>
          </Grid>

          {/* Change Password Dialog */}
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle sx={{ fontWeight: "bold" }}>
              Change Password
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                {/* Old Password */}
                <Grid item xs={12}>
                  <InputLabel sx={{ fontWeight: "bold" }}>
                    Old Password
                  </InputLabel>
                  <TextField
                    placeholder="Enter your old password"
                    fullWidth
                    variant="outlined"
                    autoComplete="new-password"
                    value={oldPassword}
                    onChange={handleOldPasswordChange}
                  />
                </Grid>

                {/* New Password */}
                <Grid item xs={12}>
                  <InputLabel sx={{ fontWeight: "bold" }}>
                    New Password
                  </InputLabel>
                  <TextField
                    placeholder="Enter your new password"
                    fullWidth
                    variant="outlined"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => {
                      handleNewPasswordChange(e);
                      setNewPasswordHelperText("");
                      setNewPasswordNameError(false);

                      //  validation for new password
                      const newPasswordValue = e.target.value;

                      if (!newPasswordValue) {
                        setNewPasswordHelperText("Please enter a new password");
                        setNewPasswordNameError(true);
                      } else if (newPasswordValue.length < 8) {
                        setNewPasswordHelperText(
                          "Password must be at least 8 characters long"
                        );
                        setNewPasswordNameError(true);
                      } else {
                        setNewPasswordHelperText("");
                        setNewPasswordNameError(false);
                      }
                    }}
                  />
                  {newPasswordNameError && (
                    <Typography sx={{ color: "red" }}>
                      {newPasswordHelperText}
                    </Typography>
                  )}
                </Grid>

                {/* Confirm Password */}
                <Grid item xs={12}>
                  <InputLabel sx={{ fontWeight: "bold" }}>
                    Confirm Password
                  </InputLabel>
                  <TextField
                    placeholder="Confirm your password"
                    fullWidth
                    variant="outlined"
                    autoComplete="new-password"
                    value={password}
                    onChange={handleConfirmPasswordChange}
                  />
                  {error && (
                    <Typography sx={{ color: "red" }}>{error}</Typography>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary" onClick={profilePage}>
                Save Changes
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    </div>
  );
}

export default MyProfile;
