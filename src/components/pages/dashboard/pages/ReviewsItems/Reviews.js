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
  Chip,
  Avatar,
  IconButton,
  InputLabel,
  FormControl,
  Rating
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Star as StarIcon
} from "@mui/icons-material";
import { useCookies } from "react-cookie";
import { useLocation } from "react-router-dom";
import { config } from "../../../../../config/config";
import { apiList, invokeApi } from "../../../../../services/apiServices";
import SideNav from "../../common/Sidenav";
import Header from "../../common/Header";
import NavigatedComponent from "../NavigatedComponent";
import IconSidenav from "../../common/IconSidenav";
import VisibilityIcon from "@mui/icons-material/Visibility";


function Reviews() {
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

  // Form state
  const [formData, setFormData] = useState({
    rating: 0,
    description: "",
    name: "",
    usn: ""
  });

  const [openId, setOpenId] = useState(null); // store which row id is open
  const [selectedDescription, setSelectedDescription] = useState("");

  // Limit to 3–4 words
  const truncateDescription = (text) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length > 4 ? words.slice(0, 4).join(" ") + "..." : text;
  };

  const handleOpen = (id, description) => {
    setOpenId(id);
    setSelectedDescription(description);
  };

  const handleClose = () => {
    setOpenId(null);
    setSelectedDescription("");
  };

  const toggleSideNav = () => {
    setShowSideNav(!showSideNav);
  };

  useEffect(() => {
    setLoading(true);
    fetchTableData();
  }, []);

  const fetchTableData = async () => {
    const params = {};
    try {
      const response = await invokeApi(
        config.mealMap + apiList.getAllReviews,
        params,
        cookies
      );

      if (response?.status === 200) {
        const resData = response.data.reviews;
        setRows(resData);
      } else {
        showSnackbar("Failed to fetching data", 'error');
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Simulate API call - replace with your actual API endpoint
      console.log("Adding review:", formData);
      showSnackbar("Review added successfully", "success");
      setOpenDialog(false);
      setFormData({ rating: 0, description: "", name: "", usn: "" });
      fetchTableData();
    } catch (error) {
      showSnackbar("Failed to add review", "error");
    }
  };

  const handleViewEdit = async (id) => {
    const item = rows.find(row => row.id === id);
    if (item) {
      setSelectedRow(item);
      setFormData({
        rating: item.rating,
        description: item.description,
        name: item.name,
        usn: item.usn
      });
      setOpenDialogEdit(true);
    }
  };

  const handleSaveChanges = async () => {
    try {
      // Simulate API call - replace with your actual API endpoint
      console.log("Updating review:", selectedRow.id, formData);
      showSnackbar("Review updated successfully", "success");
      setOpenDialogEdit(false);
      fetchTableData();
    } catch (error) {
      showSnackbar("Failed to update review", "error");
    }
  };

  const handleReviewDelete = async () => {
    try {
      // Simulate API call - replace with your actual API endpoint
      console.log("Deleting review:", deleteItemId);
      showSnackbar("Review deleted successfully", "success");
      setOpenDeleteDialog(false);
      setRows(rows.filter((row) => row.id !== deleteItemId));
    } catch (error) {
      showSnackbar("Failed to delete review", "error");
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
    setFormData({ rating: 0, description: "", name: "", usn: "" });
    setOpenDialog(false);
  };

  const handleCloseDialogEdit = () => {
    setOpenDialogEdit(false);
  };

  const filteredRows = rows.filter((row) => {
    const searchLower = searchQuery.toLowerCase();

    return [
      row.userName,
      row.mealName,
      row.usn,
      row.description,
      row.rating !== undefined && row.rating !== null ? row.rating.toString() : ""
    ]
      .filter(Boolean) // remove null/undefined
      .some((field) => field.toLowerCase().includes(searchLower));
  });


  const columns = [
    { id: "slNo", label: "Sl. No", width: "10%" },
    { id: "name", label: "Name", width: "15%" },
    { id: "mealName", label: "Meal Name", width: "15%" },
    { id: "rating", label: "Rating", width: "20%" },
    { id: "description", label: "Description", width: "15%" },
    { id: "usn", label: "USN", width: "15%" },
    { id: "reviewType", label: "Review Type", width: "15%" },
    { id: "createdDate", label: "created Date", width: "20%" },
    // { id: "actions", label: "Actions", width: "10%" }
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

  const getAvatarColor = (name) => {
    const colors = [
      "linear-gradient(135deg, #4a6bff 0%, #38bdf8 100%)",
      "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
      "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
      "linear-gradient(135deg, #ec4899 0%, #db2777 100%)"
    ];
    const index = name?.length % colors.length;
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
                    Reviews Management
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#666' }}>
                    Manage and track customer reviews and feedback
                  </Typography>
                </Box>
                {/* <Button
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
                  Add New Review
                </Button> */}
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
                placeholder="Search reviews..."
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
                Showing {filteredRows.length} of {rows.length} reviews
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
                    <Table stickyHeader aria-label="reviews table">
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
                                  No reviews found
                                </Typography>
                                <Typography variant="body2">
                                  Try adjusting your search criteria or add a new review
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
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                                    <Avatar sx={{
                                      background: getAvatarColor(row.userName),
                                      width: 40,
                                      height: 40,
                                      fontSize: '1rem',
                                      fontWeight: 600
                                    }}>
                                      {row.userName?.charAt(0)}
                                    </Avatar>
                                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#1a1a2e' }}>
                                      {row.userName}
                                    </Typography>
                                  </Box>
                                </TableCell>

                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#1a1a2e' }}>
                                      {row.mealName}
                                    </Typography>
                                  </Box>
                                </TableCell>

                                <TableCell sx={{ textAlign: 'center' }}>
                                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <Rating
                                      value={row.rating}
                                      readOnly
                                      precision={0.5}
                                      icon={<StarIcon sx={{ color: '#ffc107' }} />}
                                      emptyIcon={<StarIcon sx={{ color: '#e0e0e0' }} />}
                                    />
                                  </Box>
                                </TableCell>

                                <TableCell
                                  sx={{
                                    textAlign: "center",
                                    fontWeight: 500,
                                    color: "#4a5568",
                                    fontSize: "0.95rem",
                                    maxWidth: 200,
                                    overflow: "hidden",
                                    whiteSpace: "nowrap"
                                  }}
                                >
                                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        maxWidth: 120,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap"
                                      }}
                                    >
                                      {truncateDescription(row.description)}
                                    </Typography>
                                    <IconButton
                                      size="small"
                                      color="primary"
                                      onClick={() => handleOpen(row.id, row.description)}
                                    >
                                      <VisibilityIcon fontSize="small" />
                                    </IconButton>
                                  </Box>
                                </TableCell>

                                <Dialog
                                  open={openId === row.id}
                                  onClose={handleClose}
                                  maxWidth="sm"
                                  fullWidth
                                >
                                  <DialogTitle>Description</DialogTitle>
                                  <DialogContent dividers>
                                    <Typography variant="body1" sx={{ color: "#333" }}>
                                      {selectedDescription}
                                    </Typography>
                                  </DialogContent>
                                </Dialog>



                                <TableCell sx={{
                                  textAlign: 'center',
                                  fontWeight: 500,
                                  color: '#4a5568',
                                  fontSize: '0.95rem'
                                }}>
                                  {row.usn || "-"}
                                </TableCell>

                                <TableCell sx={{ textAlign: "center" }}>
                                  <Chip
                                    label={row.reviewType}
                                    sx={{
                                      fontWeight: 600,
                                      fontSize: "0.85rem",
                                      px: 1.5,
                                      py: 0.5,
                                      borderRadius: "8px",
                                      textTransform: "capitalize",
                                      bgcolor:
                                        row.reviewType.toLowerCase() === "good"
                                          ? "rgba(72, 187, 120, 0.15)" // light green transparent
                                          : "rgba(245, 101, 101, 0.15)", // light red transparent
                                      color:
                                        row.reviewType.toLowerCase() === "good"
                                          ? "#2f855a" // dark green text
                                          : "#c53030", // dark red text
                                    }}
                                  />
                                </TableCell>
                                <TableCell
                                  sx={{
                                    textAlign: "center",
                                    fontWeight: 500,
                                    color: "#4a5568",
                                    fontSize: "0.95rem",
                                    whiteSpace: "nowrap"
                                  }}
                                >
                                  {new Date(row.createdDate.replace(" ", "T")).toLocaleString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true,
                                  })}
                                </TableCell>

                                {/* <TableCell sx={{ textAlign: 'center' }}>
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
                                </TableCell> */}
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

            {/* Add/Edit Dialogs */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
              <DialogTitle sx={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                color: 'white',
                textAlign: 'center',
                fontWeight: 600
              }}>
                Add New Review
              </DialogTitle>
              <DialogContent sx={{ p: 3 }}>
                <Grid container spacing={2} mt={2}>
                  <Grid item xs={12}>
                    <InputLabel>Rating</InputLabel>
                    <Rating
                      value={formData.rating}
                      onChange={(event, newValue) => handleFormChange('rating', newValue)}
                      precision={0.5}
                      icon={<StarIcon sx={{ color: '#ffc107' }} />}
                      emptyIcon={<StarIcon sx={{ color: '#e0e0e0' }} />}
                      size="large"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Description"
                      multiline
                      rows={3}
                      value={formData.description}
                      onChange={(e) => handleFormChange('description', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Name"
                      value={formData.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="USN"
                      value={formData.usn}
                      onChange={(e) => handleFormChange('usn', e.target.value)}
                      required
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: 3, gap: 2 }}>
                <Button onClick={handleCloseDialog} variant="outlined">
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(135deg, #4a6bff 0%, #38bdf8 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #3b57d0 0%, #0ea5e9 100%)'
                    }
                  }}
                >
                  Add Review
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog open={openDialogEdit} onClose={handleCloseDialogEdit} maxWidth="sm" fullWidth>
              <DialogTitle sx={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                color: 'white',
                textAlign: 'center',
                fontWeight: 600
              }}>
                Edit Review
              </DialogTitle>
              <DialogContent sx={{ p: 3 }}>
                <Grid container spacing={2} mt={2}>
                  <Grid item xs={12}>
                    <InputLabel>Rating</InputLabel>
                    <Rating
                      value={formData.rating}
                      onChange={(event, newValue) => handleFormChange('rating', newValue)}
                      precision={0.5}
                      icon={<StarIcon sx={{ color: '#ffc107' }} />}
                      emptyIcon={<StarIcon sx={{ color: '#e0e0e0' }} />}
                      size="large"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Description"
                      multiline
                      rows={3}
                      value={formData.description}
                      onChange={(e) => handleFormChange('description', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Name"
                      value={formData.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="USN"
                      value={formData.usn}
                      onChange={(e) => handleFormChange('usn', e.target.value)}
                      required
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: 3, gap: 2 }}>
                <Button onClick={handleCloseDialogEdit} variant="outlined">
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveChanges}
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(135deg, #4a6bff 0%, #38bdf8 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #3b57d0 0%, #0ea5e9 100%)'
                    }
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
                  Are you sure you want to delete this review?
                </Typography>
              </DialogContent>
              <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
                <Button onClick={handleCloseDeleteDialog} variant="outlined" sx={{ minWidth: 100 }}>
                  Cancel
                </Button>
                <Button
                  onClick={handleReviewDelete}
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

export default Reviews;