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
  PasswordOutlined as PasswordOutlinedIcon,
} from "@mui/icons-material";
import { useCookies } from "react-cookie";
import { useLocation } from "react-router-dom";
import { config } from "../../../../../config/config";
import { apiList, invokeApi } from "../../../../../services/apiServices";
import SideNav from "../../common/Sidenav";
import Header from "../../common/Header";
import NavigatedComponent from "../NavigatedComponent";
import IconSidenav from "../../common/IconSidenav";
import { DateTimePicker } from "@mui/x-date-pickers";

function EventOrderList() {
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
  const [searchDate, setSearchDate] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [editFormErrors, setEditFormErrors] = useState({});

  // Form state
  const [formData, setFormData] = useState({
    eventName: "",
    eventDate: null,
    food: "",
    noPeople: "",
    note: ""
  });

  const [editFormData, setEditFormData] = useState({
    eventName: "",
    eventDate: null,
    food: "",
    noPeople: "",
    note: ""
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
        config.mealMap + apiList.getAllEventOrders,
        {},
        cookies
      );

      if (response?.status === 200) {
        setRows(response.data.eventOrders);
      } else {
        showSnackbar("Failed to fetch event orders", "error");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      showSnackbar("Error fetching event orders", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleEventOrder = async (id) => {
    const params = {
      id: id,
    };
    try {
      const response = await invokeApi(
        config.mealMap + apiList.getEventOrder,
        params,
        cookies
      );

      if (response?.status === 200) {
        const eventOrderData = response.data.eventOrder;

        setEditFormData({
          eventName: eventOrderData.eventName || "",
          eventDate: eventOrderData.eventDate ? new Date(eventOrderData.eventDate) : null,
          food: eventOrderData.food || "",
          noPeople: eventOrderData.noPeople || "",
          note: eventOrderData.note || ""
        });
        setOpenDialogEdit(true);
      } else {
        showSnackbar("Failed to fetch event order details", "error");
      }
    } catch (error) {
      console.error("Error fetching event order:", error);
      showSnackbar("Error fetching event order details", "error");
    }
  };

  const validateForm = (data, isEdit = false) => {
    const errors = {};

    if (!data.eventName.trim()) {
      errors.eventName = "Event name is required";
    }
    if (!data.eventDate) {
      errors.eventDate = "Event date is required";
    }
    if (!data.food.trim()) {
      errors.food = "Food is required";
    }
    if (!data.noPeople) {
      errors.noPeople = "Number of people is required";
    } else if (isNaN(data.noPeople) || parseInt(data.noPeople) <= 0) {
      errors.noPeople = "Please enter a valid number";
    }

    return errors;
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchDateChange = (date) => {
    setSearchDate(date);
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
      const eventOrderData = {
        eventName: formData.eventName,
        eventDate: formData.eventDate.toISOString(),
        food: formData.food,
        noPeople: formData.noPeople,
        note: formData.note
      };

      const response = await invokeApi(
        config.mealMap + apiList.addEventOrder,
        eventOrderData,
        cookies
      );

      if (response?.status === 200) {
        showSnackbar("Event Order added successfully", "success");
        setOpenDialog(false);
        setFormData({
          eventName: "",
          eventDate: null,
          food: "",
          noPeople: "",
          note: ""
        });
        setFormErrors({});
        fetchTableData();
      } else {
        showSnackbar("Failed to add event order", "error");
      }
    } catch (error) {
      console.error("Error adding event order:", error);
      showSnackbar("Error adding event order", "error");
    }
  };

  const handleViewEdit = async (id) => {
    const item = rows.find((row) => row.id === id);
    if (item) {
      setSelectedRow(item);
      await fetchSingleEventOrder(id);
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
      const eventOrderData = {
        id: selectedRow.id,
        eventName: editFormData.eventName,
        eventDate: editFormData.eventDate.toISOString(),
        food: editFormData.food,
        noPeople: editFormData.noPeople,
        note: editFormData.note
      };

      const response = await invokeApi(
        config.mealMap + apiList.updateEventOrder,
        eventOrderData,
        cookies
      );

      if (response?.status === 200) {
        showSnackbar("Event Order updated successfully", "success");
        setOpenDialogEdit(false);
        setEditFormErrors({});
        fetchTableData();
      } else {
        showSnackbar("Failed to update event order", "error");
      }
    } catch (error) {
      console.error("Error updating event order:", error);
      showSnackbar("Error updating event order", "error");
    }
  };

  const handleEventOrderDelete = async () => {
    const params = {
      id: deleteItemId,
    };
    try {
      const response = await invokeApi(
        config.mealMap + apiList.deleteEventOrder,
        params,
        cookies
      );

      if (response?.status === 200) {
        showSnackbar("Event Order deleted successfully", "success");
        setOpenDeleteDialog(false);
        setRows(rows.filter((row) => row.id !== deleteItemId));
      } else {
        showSnackbar("Failed to delete event order", "error");
      }
    } catch (error) {
      console.error("Error deleting event order:", error);
      showSnackbar("Error deleting event order", "error");
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
      eventName: "",
      eventDate: null,
      food: "",
      noPeople: "",
      note: ""
    });
    setFormErrors({});
    setOpenDialog(false);
  };

  const handleCloseDialogEdit = () => {
    setEditFormErrors({});
    setOpenDialogEdit(false);
  };

  const filteredRows = rows.filter((row) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      row.eventName.toLowerCase().includes(searchLower) ||
      (row.food && row.food.toLowerCase().includes(searchLower)) ||
      (row.noPeople && row.noPeople.toString().includes(searchLower)) ||
      (row.note && row.note.toLowerCase().includes(searchLower));

    // Filter by date if searchDate is set
    if (searchDate) {
      const rowDate = new Date(row.eventDate);
      const isSameDate =
        rowDate.getDate() === searchDate.getDate() &&
        rowDate.getMonth() === searchDate.getMonth() &&
        rowDate.getFullYear() === searchDate.getFullYear();

      return matchesSearch && isSameDate;
    }

    return matchesSearch;
  });

  const columns = [
    { id: "slNo", label: "Sl. No", width: "10%" },
    { id: "eventName", label: "Event Name", width: "20%" },
    { id: "eventDate", label: "Event Date", width: "15%" },
    { id: "food", label: "Food", width: "15%" },
    { id: "noPeople", label: "Number of people", width: "15%" },
    { id: "note", label: "Note", width: "15%" },
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
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
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
                    Event Order Management
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#666' }}>
                    Manage system event orders and their permissions
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
                  Add New Event Order
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
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    size="medium"
                    placeholder="Search event orders..."
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
                </Grid>
                <Grid item xs={12} md={4}>
                  <DateTimePicker
                    label="Filter by date"
                    value={searchDate}
                    onChange={handleSearchDateChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "medium",
                        error: !!formErrors.eventDate,
                        helperText: formErrors.eventDate,
                        sx: {
                          borderRadius: 2, // theme.spacing * 2
                          backgroundColor: "#ffffff",
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2, // ensures the input itself is rounded
                          },
                        },
                      },
                    }}
                  />

                </Grid>
              </Grid>
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
                Showing {filteredRows.length} of {rows.length} event orders
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
                    <Table stickyHeader aria-label="eventOrder table">
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
                                  No event orders found
                                </Typography>
                                <Typography variant="body2">
                                  Try adjusting your search criteria or add a new event order
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

                                <TableCell sx={{
                                  textAlign: 'center',
                                  fontWeight: 500,
                                  color: '#4a5568',
                                  fontSize: '0.95rem'
                                }}>
                                  {row.eventName}
                                </TableCell>

                                <TableCell sx={{
                                  textAlign: 'center',
                                  fontWeight: 500,
                                  color: '#4a5568',
                                  fontSize: '0.95rem'
                                }}>
                                  {formatDate(row.eventDate)}
                                </TableCell>

                                <TableCell sx={{
                                  textAlign: 'center',
                                  fontWeight: 500,
                                  color: '#4a5568',
                                  fontSize: '0.95rem'
                                }}>
                                  {row.food}
                                </TableCell>

                                <TableCell sx={{
                                  textAlign: 'center',
                                  fontWeight: 500,
                                  color: '#4a5568',
                                  fontSize: '0.95rem'
                                }}>
                                  {row.noPeople}
                                </TableCell>

                                <TableCell sx={{
                                  textAlign: 'center',
                                  fontWeight: 500,
                                  color: '#4a5568',
                                  fontSize: '0.95rem'
                                }}>
                                  {row.note || "-"}
                                </TableCell>

                                <TableCell sx={{ textAlign: 'center' }}>
                                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>

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

            {/* Add EventOrder Dialog */}
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
                Add New Event Order
              </DialogTitle>
              <DialogContent style={{ padding: "24px" }}>
                <Grid container spacing={2} style={{ marginTop: "16px" }}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.eventName}
                      onChange={(e) => handleFormChange("eventName", e.target.value)}
                      required
                      label="Event Name"
                      error={!!formErrors.eventName}
                      helperText={formErrors.eventName}
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
                    <DateTimePicker
                      label="Event Date & Time"
                      value={formData.eventDate}
                      onChange={(newValue) => handleFormChange("eventDate", newValue)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: "small",
                          error: !!formErrors.eventDate,
                          helperText: formErrors.eventDate,
                          InputProps: {
                            style: {
                              borderRadius: "10px",
                              backgroundColor: "#f9fafb",
                              fontSize: "14px",
                              fontWeight: 500,
                              color: "#1e293b",
                            },
                          },
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.food}
                      onChange={(e) => handleFormChange("food", e.target.value)}
                      required
                      label="Food"
                      error={!!formErrors.food}
                      helperText={formErrors.food}
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
                      type="number"
                      value={formData.noPeople}
                      onChange={(e) => handleFormChange("noPeople", e.target.value)}
                      required
                      label="Number of People"
                      error={!!formErrors.noPeople}
                      helperText={formErrors.noPeople}
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
                      multiline
                      rows={3}
                      value={formData.note}
                      onChange={(e) => handleFormChange("note", e.target.value)}
                      label="Note (Optional)"
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
                  Add Event Order
                </Button>
              </DialogActions>
            </Dialog>

            {/* Edit EventOrder Dialog */}
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
                Edit Event Order
              </DialogTitle>
              <DialogContent style={{ padding: "24px" }}>
                <Grid container spacing={2} style={{ marginTop: "16px" }}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      value={editFormData.eventName}
                      onChange={(e) => handleEditFormChange("eventName", e.target.value)}
                      required
                      label="Event Name"
                      error={!!editFormErrors.eventName}
                      helperText={editFormErrors.eventName}
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
                    <DateTimePicker
                      label="Event Date & Time"
                      value={editFormData.eventDate}
                      onChange={(newValue) => handleEditFormChange("eventDate", newValue)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: "small",
                          error: !!formErrors.eventDate,
                          helperText: formErrors.eventDate,
                          InputProps: {
                            style: {
                              borderRadius: "10px",
                              backgroundColor: "#f9fafb",
                              fontSize: "14px",
                              fontWeight: 500,
                              color: "#1e293b",
                            },
                          },
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      value={editFormData.food}
                      onChange={(e) => handleEditFormChange("food", e.target.value)}
                      required
                      label="Food"
                      error={!!editFormErrors.food}
                      helperText={editFormErrors.food}
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
                      type="number"
                      value={editFormData.noPeople}
                      onChange={(e) => handleEditFormChange("noPeople", e.target.value)}
                      required
                      label="Number of People"
                      error={!!editFormErrors.noPeople}
                      helperText={editFormErrors.noPeople}
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
                      multiline
                      rows={3}
                      value={editFormData.note}
                      onChange={(e) => handleEditFormChange("note", e.target.value)}
                      label="Note (Optional)"
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

            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog} maxWidth="xs" fullWidth>
              <DialogTitle sx={{ textAlign: 'center', fontWeight: 600 }}>
                Confirm Delete
              </DialogTitle>
              <DialogContent>
                <Typography textAlign="center">
                  Are you sure you want to delete this event order?
                </Typography>
              </DialogContent>
              <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
                <Button onClick={handleCloseDeleteDialog} variant="outlined" sx={{ minWidth: 100 }}>
                  Cancel
                </Button>
                <Button
                  onClick={handleEventOrderDelete}
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

export default EventOrderList;