import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
  Typography,
  Pagination,
  MenuItem,
  Select,
  InputAdornment,
  useMediaQuery,
  Card,
  Avatar,
  IconButton,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Visibility,
  VisibilityOff,
  PasswordOutlined as PasswordOutlinedIcon, // Import the new icon
} from "@mui/icons-material";
import { useCookies } from "react-cookie";
import { useLocation } from "react-router-dom";
import { config } from "../../../../../config/config";
import { apiList, invokeApi } from "../../../../../services/apiServices";
import SideNav from "../../common/Sidenav";
import Header from "../../common/Header";
import NavigatedComponent from "../NavigatedComponent";
import IconSidenav from "../../common/IconSidenav";

function UsersList() {
  const [cookies] = useCookies();
  const location = useLocation();
  const isMobileScreen = useMediaQuery("(max-width:500px)");
  const isSmallScreen = useMediaQuery("(min-width:1024px) and (max-width:1440px)");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(isMobileScreen ? 5 : 10);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogEdit, setOpenDialogEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [rows, setRows] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [showSideNav, setShowSideNav] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showChangeNewPassword, setShowChangeNewPassword] = useState(false);
  const [showChangeConfirmPassword, setShowChangeConfirmPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [editFormErrors, setEditFormErrors] = useState({});

  // NEW: State for password change dialog and form
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [passwordFormData, setPasswordFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [passwordFormErrors, setPasswordFormErrors] = useState({});

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    usn: "",
    role: "",
  });

  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    usn: "",
  });

  const toggleSideNav = () => {
    setShowSideNav(!showSideNav);
  };

  useEffect(() => {
    setLoading(true);
    fetchTableData();
  }, []);

  const fetchTableData = async () => {
    try {
      const response = await invokeApi(
        config.mealMap + apiList.getUsers,
        {},
        cookies
      );

      if (response?.status === 200) {
        setRows(response.data.users);
      } else {
        showSnackbar("Failed to fetch users", "error");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      showSnackbar("Error fetching users", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleUser = async (id) => {
    const params = {
      id: id,
    };
    try {
      const response = await invokeApi(
        config.mealMap + apiList.getUser,
        params,
        cookies
      );

      if (response?.status === 200) {
        const userData = response.data.users;

        setEditFormData({
          name: userData.name,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          usn: userData.usn || "",
        });
        setOpenDialogEdit(true);
      } else {
        showSnackbar("Failed to fetch user details", "error");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      showSnackbar("Error fetching user details", "error");
    }
  };

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (password) => {
    // At least 8 characters, one uppercase, one lowercase, one number and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  // NEW: Validation for password change
  const validatePasswordChangeForm = (data) => {
    const errors = {};
    if (!data.oldPassword.trim()) {
      errors.oldPassword = "Current password is required";
    }
    if (!data.newPassword.trim()) {
      errors.newPassword = "New password is required";
    } else if (!validatePassword(data.newPassword)) {
      errors.newPassword = "New password must be at least 8 characters with uppercase, lowercase, number and special character";
    }
    if (!data.confirmNewPassword.trim()) {
      errors.confirmNewPassword = "Please confirm new password";
    } else if (data.newPassword !== data.confirmNewPassword) {
      errors.confirmNewPassword = "Passwords do not match";
    }
    return errors;
  };

  const validateForm = (data, isEdit = false) => {
    const errors = {};

    if (!data.name.trim()) {
      errors.name = "Name is required";
    }

    if (!data.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(data.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!isEdit) {
      if (!data.password) {
        errors.password = "Password is required";
      } else if (!validatePassword(data.password)) {
        errors.password = "Password must be at least 8 characters with uppercase, lowercase, number and special character";
      }

      if (!data.confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
      } else if (data.password !== data.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    }

    if (!data.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else if (!validatePhone(data.phoneNumber)) {
      errors.phoneNumber = "Please enter a valid 10-digit phone number starting with 6, 7, 8, or 9";
    }

    if (data.role === "Student" && !data.usn.trim()) {
      errors.usn = "USN is required for students";
    }

    return errors;
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when field is updated
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleEditFormChange = (field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when field is updated
    if (editFormErrors[field]) {
      setEditFormErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // NEW: Handle password form change
  const handlePasswordFormChange = (field, value) => {
    setPasswordFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when field is updated
    if (passwordFormErrors[field]) {
      setPasswordFormErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate form
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      // Prepare data for API call
      const userData = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
        usn: formData.role === "Student" ? formData.usn : "",
      };

      const response = await invokeApi(
        config.mealMap + apiList.userAdd,
        userData,
        cookies
      );

      if (response?.status === 200) {
        showSnackbar("User added successfully", "success");
        setOpenDialog(false);
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          phoneNumber: "",
          usn: "",
          role: "Student",
        });
        setFormErrors({});
        fetchTableData();
      } else {
        showSnackbar("Failed to add user", "error");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      showSnackbar("Error adding user", "error");
    }
  };

  const handleViewEdit = async (id) => {
    const item = rows.find((row) => row.id === id);
    if (item) {
      setSelectedRow(item);
      await fetchSingleUser(id);
    }
  };

  // NEW: Handle password change
  const handleOpenPasswordDialog = (id) => {
    const user = rows.find((row) => row.id === id);
    setSelectedRow(user);
    setOpenPasswordDialog(true);
  };

  const handleClosePasswordDialog = () => {
    setOpenPasswordDialog(false);
    setPasswordFormData({
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setPasswordFormErrors({});
  };

  const handlePasswordChangeSubmit = async (event) => {
    event.preventDefault();

    const errors = validatePasswordChangeForm(passwordFormData);
    if (Object.keys(errors).length > 0) {
      setPasswordFormErrors(errors);
      return;
    }

    try {
      const data = {
        id: selectedRow.id,
        oldPassword: passwordFormData.oldPassword,
        newPassword: passwordFormData.newPassword,
      };

      const response = await invokeApi(
        config.mealMap + apiList.changePassword,
        data,
        cookies
      );

      if (response?.status === 200) {
        showSnackbar("Password updated successfully", "success");
        handleClosePasswordDialog();
      } else {
        showSnackbar(response?.data?.message || "Failed to change password", "error");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      showSnackbar("Error changing password", "error");
    }
  };

  const handleSaveChanges = async () => {
    // Validate form
    const errors = validateForm(editFormData, true);
    if (Object.keys(errors).length > 0) {
      setEditFormErrors(errors);
      return;
    }

    try {
      // Prepare data for API call
      const userData = {
        id: selectedRow.id,
        name: editFormData.name,
        email: editFormData.email,
        phoneNumber: editFormData.phoneNumber,
      };

      const response = await invokeApi(
        config.mealMap + apiList.updateUser,
        userData,
        cookies
      );

      if (response?.status === 200) {
        showSnackbar("User updated successfully", "success");
        setOpenDialogEdit(false);
        setEditFormErrors({});
        fetchTableData();
      } else {
        showSnackbar("Failed to update user", "error");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      showSnackbar("Error updating user", "error");
    }
  };

  const handleUserDelete = async () => {
    const params = {
      id: deleteItemId,
    };
    try {
      const response = await invokeApi(
        config.mealMap + apiList.deleteUser,
        params,
        cookies
      );

      if (response?.status === 200) {
        showSnackbar("User deleted successfully", "success");
        setOpenDeleteDialog(false);
        setRows(rows.filter((row) => row.id !== deleteItemId));
      } else {
        showSnackbar("Failed to delete user", "error");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      showSnackbar("Error deleting user", "error");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseDialog = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      usn: "",
      role: "Student",
    });
    setFormErrors({});
    setOpenDialog(false);
  };

  const handleCloseDialogEdit = () => {
    setEditFormErrors({});
    setOpenDialogEdit(false);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // NEW: Handlers for password change dialog
  const handleClickShowOldPassword = () => {
    setShowOldPassword(!showOldPassword);
  };
  const handleClickShowChangeNewPassword = () => {
    setShowChangeNewPassword(!showChangeNewPassword);
  };
  const handleClickShowConfirmNewPassword = () => {
    setShowChangeConfirmPassword(!showChangeConfirmPassword);
  };

  const filteredRows = rows.filter((row) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      row.name.toLowerCase().includes(searchLower) ||
      (row.email && row.email.toLowerCase().includes(searchLower)) ||
      (row.phoneNumber && row.phoneNumber.includes(searchLower)) ||
      (row.usn && row.usn.toLowerCase().includes(searchLower)) ||
      (row.role && row.role.toLowerCase().includes(searchLower))
    );
  });

  const columns = [
    { id: "slNo", label: "Sl. No", width: "10%" },
    { id: "name", label: "Name", width: "20%" },
    { id: "phoneNo", label: "Phone Number", width: "15%" },
    { id: "email", label: "Email", width: "15%" },
    { id: "usn", label: "USN", width: "15%" },
    { id: "createdBy", label: "Created By", width: "15%" },
    { id: "createdDate", label: "Created Date", width: "15%" },
    { id: "actions", label: "Actions", width: "10%" },
  ];

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleOpenDeleteDialog = (id) => {
    setOpenDeleteDialog(true);
    setDeleteItemId(id);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getAvatarColor = (name) => {
    const colors = [
      "linear-gradient(135deg, #4a6bff 0%, #38bdf8 100%)",
      "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
      "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
      "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <>
      <Grid sx={{ display: "flex", minHeight: '100vh', background: '#f8fafc' }}>
        {isMobileScreen ? <IconSidenav /> : showSideNav ? <IconSidenav /> : <SideNav />}
        <Grid component="main" sx={{ width: "100%", flex: 1 }}>
          <Header toggleSideNav={toggleSideNav} />
          <Box sx={{ p: isMobileScreen ? 2 : 3 }}>
            <NavigatedComponent pathname={location.pathname} />

            {/* Page Header */}
            <Box sx={{ my: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography variant="h4" sx={{
                    fontWeight: 700,
                    color: '#1a1a2e',
                    mb: 1,
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    User Management
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#666' }}>
                    Manage system users and their permissions
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenDialog(true)}
                  sx={{
                    background: 'linear-gradient(135deg, #4a6bff 0%, #38bdf8 100%)',
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    fontWeight: 600,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #3b57d0 0%, #0ea5e9 100%)'
                    }
                  }}
                >
                  Add New User
                </Button>
              </Box>
            </Box>

            {/* Search Card */}
            <Card sx={{
              mb: 3,
              p: 2.5,
              borderRadius: 3,
              boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
            }}>
              <TextField
                fullWidth
                size="medium"
                placeholder="Search users..."
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#4a6bff" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  background: "#ffffff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  }
                }}
              />
            </Card>

            {/* Results Count */}
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
              p: 1,
              background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
              borderRadius: 2
            }}>
              <Typography variant="body2" sx={{ color: '#4a5568', fontWeight: 500 }}>
                Showing {filteredRows.length} of {rows.length} users
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ color: '#4a5568' }}>
                  Rows per page:
                </Typography>
                <Select
                  value={rowsPerPage}
                  onChange={handleChangeRowsPerPage}
                  size="small"
                  sx={{
                    borderRadius: 1,
                    fontSize: '0.85rem'
                  }}
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                </Select>
              </Box>
            </Box>

            {/* Table Card */}
            <Card sx={{
              borderRadius: 3,
              boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
              overflow: 'hidden',
              border: '1px solid #e2e8f0'
            }}>
              {loading ? (
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 300
                }}>
                  <CircularProgress size={60} thickness={4} />
                </Box>
              ) : (
                <>
                  <TableContainer sx={{ maxHeight: 500 }}>
                    <Table stickyHeader aria-label="user table">
                      <TableHead>
                        <TableRow>
                          {columns.map((column) => (
                            <TableCell
                              key={column.id}
                              sx={{
                                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '1rem',
                                py: 2.5,
                                border: 'none',
                                textAlign: 'center'
                              }}
                            >
                              {column.label}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredRows.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                              <Box sx={{ textAlign: 'center', color: '#666' }}>
                                <SearchIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5, color: '#4a6bff' }} />
                                <Typography variant="h6" sx={{ mb: 1, color: '#4a5568' }}>
                                  No users found
                                </Typography>
                                <Typography variant="body2">
                                  Try adjusting your search criteria or add a new user
                                </Typography>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredRows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => (
                              <TableRow
                                key={row.id}
                                hover
                                sx={{
                                  '&:nth-of-type(even)': {
                                    background: '#f8fafc'
                                  },
                                  transition: 'background-color 0.2s ease'
                                }}
                              >
                                <TableCell sx={{
                                  fontWeight: 500,
                                  color: '#4a5568',
                                  textAlign: 'center',
                                  fontSize: '0.95rem'
                                }}>
                                  {index + 1 + page * rowsPerPage}
                                </TableCell>

                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{
                                      background: getAvatarColor(row.name),
                                      width: 40,
                                      height: 40,
                                      fontSize: '1rem',
                                      fontWeight: 600
                                    }}>
                                      {row.name.charAt(0)}
                                    </Avatar>
                                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#1a1a2e' }}>
                                      {row.name}
                                    </Typography>
                                  </Box>
                                </TableCell>

                                <TableCell sx={{
                                  textAlign: 'center',
                                  fontWeight: 500,
                                  color: '#4a5568',
                                  fontSize: '0.95rem'
                                }}>
                                  {row.phoneNumber || "-"}
                                </TableCell>

                                <TableCell sx={{
                                  textAlign: 'center',
                                  fontWeight: 500,
                                  color: '#4a5568',
                                  fontSize: '0.95rem'
                                }}>
                                  {row.email}
                                </TableCell>

                                <TableCell sx={{
                                  textAlign: 'center',
                                  fontWeight: 500,
                                  color: '#4a5568',
                                  fontSize: '0.95rem'
                                }}>
                                  {row.usn || "-"}
                                </TableCell>

                                <TableCell sx={{
                                  textAlign: 'center',
                                  fontWeight: 500,
                                  color: '#4a5568',
                                  fontSize: '0.95rem'
                                }}>
                                  {row.createdBy || "-"}
                                </TableCell>

                                <TableCell sx={{
                                  textAlign: 'center',
                                  fontWeight: 500,
                                  color: '#4a5568',
                                  fontSize: '0.95rem'
                                }}>
                                  {formatDate(row.createdDate)}
                                </TableCell>

                                <TableCell sx={{ textAlign: 'center' }}>
                                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                    {/* NEW: Password Change Button */}
                                    <IconButton
                                      size="small"
                                      onClick={() => handleOpenPasswordDialog(row.id)}
                                      sx={{
                                        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                        color: "white",
                                        "&:hover": {
                                          background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                                        },
                                      }}
                                    >
                                      <PasswordOutlinedIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      onClick={() => handleViewEdit(row.id)}
                                      sx={{
                                        background: 'linear-gradient(135deg, #4a6bff 0%, #38bdf8 100%)',
                                        color: 'white',
                                        '&:hover': {
                                          background: 'linear-gradient(135deg, #3b57d0 0%, #0ea5e9 100%)'
                                        }
                                      }}
                                    >
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      onClick={() => handleOpenDeleteDialog(row.id)}
                                      sx={{
                                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                        color: 'white',
                                        '&:hover': {
                                          background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
                                        }
                                      }}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Box>
                                </TableCell>
                              </TableRow>
                            ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* Pagination */}
                  {filteredRows.length > 0 && (
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      p: 3,
                      borderTop: '1px solid #e2e8f0',
                      background: '#f8fafc'
                    }}>
                      <Pagination
                        count={Math.ceil(filteredRows.length / rowsPerPage)}
                        page={page + 1}
                        onChange={(event, value) => setPage(value - 1)}
                        color="primary"
                        shape="rounded"
                        size={isMobileScreen ? "small" : "medium"}
                        sx={{
                          '& .MuiPaginationItem-root': {
                            fontWeight: 500,
                            fontSize: '0.95rem'
                          }
                        }}
                      />
                    </Box>
                  )}
                </>
              )}
            </Card>

            {/* Add User Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
              <DialogTitle
                style={{
                  background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                  color: "white",
                  textAlign: "center",
                  fontWeight: 600,
                }}
              >
                <PersonIcon style={{ marginRight: "8px", verticalAlign: "middle" }} />
                Add New User
              </DialogTitle>
              <DialogContent style={{ padding: "24px" }}>
                <Grid container spacing={2} style={{ marginTop: "16px" }}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.name}
                      onChange={(e) => handleFormChange("name", e.target.value)}
                      required
                      label="Full Name"
                      error={!!formErrors.name}
                      helperText={formErrors.name}
                      InputProps={{
                        style: {
                          borderRadius: "10px",
                          backgroundColor: "#f9fafb",
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "#1e293b",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleFormChange("email", e.target.value)}
                      required
                      label="Email Address"
                      error={!!formErrors.email}
                      helperText={formErrors.email}
                      InputProps={{
                        style: {
                          borderRadius: "10px",
                          backgroundColor: "#f9fafb",
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "#1e293b",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleFormChange("password", e.target.value)}
                      required
                      label="Password"
                      error={!!formErrors.password}
                      helperText={formErrors.password || "At least 8 characters with uppercase, lowercase, number and special character"}
                      InputProps={{
                        style: {
                          borderRadius: "10px",
                          backgroundColor: "#f9fafb",
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "#1e293b",
                        },
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleFormChange("confirmPassword", e.target.value)}
                      required
                      label="Confirm Password"
                      error={!!formErrors.confirmPassword}
                      helperText={formErrors.confirmPassword}
                      InputProps={{
                        style: {
                          borderRadius: "10px",
                          backgroundColor: "#f9fafb",
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "#1e293b",
                        },
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle confirm password visibility"
                              onClick={handleClickShowConfirmPassword}
                              edge="end"
                            >
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.phoneNumber}
                      onChange={(e) => handleFormChange("phoneNumber", e.target.value)}
                      required
                      label="Phone Number"
                      error={!!formErrors.phoneNumber}
                      helperText={formErrors.phoneNumber || "10-digit number starting with 6, 7, 8, or 9"}
                      InputProps={{
                        style: {
                          borderRadius: "10px",
                          backgroundColor: "#f9fafb",
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "#1e293b",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Role</InputLabel>
                      <Select
                        value={formData.role}
                        label="Role"
                        onChange={(e) => handleFormChange("role", e.target.value)}
                        style={{
                          borderRadius: "10px",
                          backgroundColor: "#f9fafb",
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "#1e293b",
                        }}
                      >
                        <MenuItem value="Admin">Admin</MenuItem>
                        <MenuItem value="Student">Student</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  {formData.role === "Student" && (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size="small"
                        value={formData.usn}
                        onChange={(e) => handleFormChange("usn", e.target.value)}
                        required
                        label="USN"
                        error={!!formErrors.usn}
                        helperText={formErrors.usn}
                        InputProps={{
                          style: {
                            borderRadius: "10px",
                            backgroundColor: "#f9fafb",
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "#1e293b",
                          },
                        }}
                      />
                    </Grid>
                  )}
                </Grid>
              </DialogContent>
              <DialogActions style={{ padding: "24px", gap: "16px" }}>
                <Button onClick={handleCloseDialog} variant="outlined">
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  style={{
                    background: "linear-gradient(135deg, #4a6bff 0%, #38bdf8 100%)",
                  }}
                >
                  Add User
                </Button>
              </DialogActions>
            </Dialog>

            {/* Edit User Dialog */}
            <Dialog open={openDialogEdit} onClose={handleCloseDialogEdit} maxWidth="sm" fullWidth>
              <DialogTitle
                style={{
                  background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                  color: "white",
                  textAlign: "center",
                  fontWeight: 600,
                }}
              >
                <EditIcon style={{ marginRight: "8px", verticalAlign: "middle" }} />
                Edit User
              </DialogTitle>
              <DialogContent style={{ padding: "24px" }}>
                <Grid container spacing={2} style={{ marginTop: "16px" }}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      value={editFormData.name}
                      onChange={(e) => handleEditFormChange("name", e.target.value)}
                      required
                      label="Full Name"
                      error={!!editFormErrors.name}
                      helperText={editFormErrors.name}
                      InputProps={{
                        style: {
                          borderRadius: "10px",
                          backgroundColor: "#f9fafb",
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "#1e293b",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => handleEditFormChange("email", e.target.value)}
                      required
                      label="Email Address"
                      error={!!editFormErrors.email}
                      helperText={editFormErrors.email}
                      InputProps={{
                        style: {
                          borderRadius: "10px",
                          backgroundColor: "#f9fafb",
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "#1e293b",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      value={editFormData.phoneNumber}
                      onChange={(e) => handleEditFormChange("phoneNumber", e.target.value)}
                      required
                      label="Phone Number"
                      error={!!editFormErrors.phoneNumber}
                      helperText={editFormErrors.phoneNumber || "10-digit number starting with 6, 7, 8, or 9"}
                      InputProps={{
                        style: {
                          borderRadius: "10px",
                          backgroundColor: "#f9fafb",
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "#1e293b",
                        },
                      }}
                    />
                  </Grid>
                  
                </Grid>
              </DialogContent>
              <DialogActions style={{ padding: "24px", gap: "16px" }}>
                <Button onClick={handleCloseDialogEdit} variant="outlined">
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveChanges}
                  variant="contained"
                  style={{
                    background: "linear-gradient(135deg, #4a6bff 0%, #38bdf8 100%)",
                  }}
                >
                  Save Changes
                </Button>
              </DialogActions>
            </Dialog>

            {/* NEW: Password Change Dialog */}
            <Dialog open={openPasswordDialog} onClose={handleClosePasswordDialog} maxWidth="sm" fullWidth>
              <DialogTitle
                style={{
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "white",
                  textAlign: "center",
                  fontWeight: 600,
                }}
              >
                <PasswordOutlinedIcon style={{ marginRight: "8px", verticalAlign: "middle" }} />
                Change Password for {selectedRow?.name}
              </DialogTitle>
              <DialogContent style={{ padding: "24px" }}>
                <Grid container spacing={2} style={{ marginTop: "16px" }}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      type={showOldPassword ? "text" : "password"}
                      value={passwordFormData.oldPassword}
                      onChange={(e) => handlePasswordFormChange("oldPassword", e.target.value)}
                      required
                      label="Current Password"
                      error={!!passwordFormErrors.oldPassword}
                      helperText={passwordFormErrors.oldPassword}
                      InputProps={{
                        style: {
                          borderRadius: "10px",
                          backgroundColor: "#f9fafb",
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "#1e293b",
                        },
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle new password visibility"
                              onClick={handleClickShowOldPassword}
                              edge="end"
                            >
                              {showOldPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      type={showChangeNewPassword ? "text" : "password"}
                      value={passwordFormData.newPassword}
                      onChange={(e) => handlePasswordFormChange("newPassword", e.target.value)}
                      required
                      label="New Password"
                      error={!!passwordFormErrors.newPassword}
                      helperText={passwordFormErrors.newPassword || "At least 8 characters with uppercase, lowercase, number and special character"}
                      InputProps={{
                        style: {
                          borderRadius: "10px",
                          backgroundColor: "#f9fafb",
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "#1e293b",
                        },
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle new password visibility"
                              onClick={handleClickShowChangeNewPassword}
                              edge="end"
                            >
                              {showChangeNewPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      type={showChangeConfirmPassword ? "text" : "password"}
                      value={passwordFormData.confirmNewPassword}
                      onChange={(e) => handlePasswordFormChange("confirmNewPassword", e.target.value)}
                      required
                      label="Confirm New Password"
                      error={!!passwordFormErrors.confirmNewPassword}
                      helperText={passwordFormErrors.confirmNewPassword}
                      InputProps={{
                        style: {
                          borderRadius: "10px",
                          backgroundColor: "#f9fafb",
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "#1e293b",
                        },
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle confirm new password visibility"
                              onClick={handleClickShowConfirmNewPassword}
                              edge="end"
                            >
                              {showChangeConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions style={{ padding: "16px 24px" }}>
                <Button onClick={handleClosePasswordDialog} color="secondary" variant="outlined">
                  Cancel
                </Button>
                <Button
                  onClick={handlePasswordChangeSubmit}
                  variant="contained"
                  sx={{
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                    },
                  }}
                >
                  Change Password
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog} maxWidth="xs" fullWidth>
              <DialogTitle sx={{ textAlign: 'center', fontWeight: 600 }}>
                Confirm Delete
              </DialogTitle>
              <DialogContent>
                <Typography textAlign="center">
                  Are you sure you want to delete this user?
                </Typography>
              </DialogContent>
              <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
                <Button onClick={handleCloseDeleteDialog} variant="outlined" sx={{ minWidth: 100 }}>
                  Cancel
                </Button>
                <Button
                  onClick={handleUserDelete}
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    minWidth: 100,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
                    }
                  }}
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>

            <Snackbar
              open={openSnackbar}
              autoHideDuration={4000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert
                onClose={handleCloseSnackbar}
                severity={snackbarSeverity}
                sx={{
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                }}
              >
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default UsersList;