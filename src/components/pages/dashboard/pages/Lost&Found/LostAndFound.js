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
  Container,
  Modal,
  Zoom
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon
} from "@mui/icons-material";
import { useCookies } from "react-cookie";
import { useLocation } from "react-router-dom";
import { config } from "../../../../../config/config";
import { apiList, invokeApi } from "../../../../../services/apiServices";
import SideNav from "../../common/Sidenav";
import Header from "../../common/Header";
import NavigatedComponent from "../NavigatedComponent";
import IconSidenav from "../../common/IconSidenav";
import { DropzoneArea } from "mui-file-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

function LostAndFound() {
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
  const [itemImage, setItemImage] = useState(null);
  const [selectedItemImage, setSelectedItemImage] = useState("");
  const [imageChanged, setImageChanged] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [processing, setProcessing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    imageUrl: ""
  });

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
        config.mealMap + apiList.getAllLostFound,
        params,
        cookies
      );

      if (response?.status === 200) {
        const resData = response.data.lostFound;
        setRows(resData);
      } else {
        showSnackbar("Failed to fetch data", "error");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      showSnackbar("Failed to fetch data", "error");
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

  const handleFileChange = (files) => {
    if (files && files.length > 0) {
      setImageChanged(true);
      const selectedFile = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedItemImage(reader.result);
        setItemImage(selectedFile);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setSelectedItemImage("");
      setItemImage(null);
      setImageChanged(false);
    }
  };

  const handleItemImageUpload = async () => {
    if (!itemImage) return formData.imageUrl;

    const formData = new FormData();
    formData.append("image", itemImage);
    try {
      const response = await fetch(
        `${config.mealMap}/uploadImage`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response?.status >= 200 && response?.status < 300) {
        const responseData = await response.json();
        return responseData.imageUrl || "";
      } else {
        showSnackbar("Failed to upload image", "error");
        return "";
      }
    } catch (error) {
      showSnackbar("Something went wrong. Please try again later.", "error");
      return "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    try {
      const imageUrl = await handleItemImageUpload();
      const params = {
        itemName: formData.name,
        imageUrl: imageUrl,
        itemType: formData.type,
      };

      const response = await invokeApi(
        config.mealMap + apiList.addLostFound,
        params,
        cookies
      );

      if (response?.status === 200) {
        showSnackbar("Item added successfully", "success");
        setOpenDialog(false);
        setFormData({
          name: "",
          type: "",
          imageUrl: ""
        });
        setItemImage(null);
        setSelectedItemImage("");
        fetchTableData();
      } else {
        showSnackbar("Failed to Add Data", "error");
      }
    } catch (error) {
      showSnackbar("Failed to add item", "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleViewEdit = async (id) => {
    const item = rows.find(row => row.id === id);
    if (item) {
      setSelectedRow(item);
      setFormData({
        name: item.itemName,
        type: item.itemType,
        imageUrl: item.imageUrl
      });
      setSelectedItemImage(item.imageUrl);
      setItemImage(null);
      setImageChanged(false);
      setOpenDialogEdit(true);
    }
  };

  const handleSaveChanges = async () => {
    setProcessing(true);
    try {
      let updatedImageUrl = formData.imageUrl;

      if (imageChanged) {
        updatedImageUrl = await handleItemImageUpload();
      }

      const params = {
        id: selectedRow.id,
        itemName: formData.name,
        imageUrl: updatedImageUrl,
        itemType: formData.type,
      };

      const response = await invokeApi(
        config.mealMap + apiList.updateLostFound,
        params,
        cookies
      );

      if (response?.status === 200) {
        showSnackbar("Item updated successfully", "success");
        setOpenDialogEdit(false);
        fetchTableData();
      } else {
        showSnackbar("Failed to update item", "error");
      }
    } catch (error) {
      showSnackbar("Failed to update item", "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleItemDelete = async () => {
    setProcessing(true);
    try {
      const params = {
        id: deleteItemId
      };

      const response = await invokeApi(
        config.mealMap + apiList.deleteLostFound,
        params,
        cookies
      );

      if (response?.status === 200) {
        showSnackbar("Item deleted successfully", "success");
        setOpenDeleteDialog(false);
        setRows(rows.filter((row) => row.id !== deleteItemId));
      } else {
        showSnackbar("Failed to delete item", "error");
      }
    } catch (error) {
      showSnackbar("Failed to delete item", "error");
    } finally {
      setProcessing(false);
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
      type: "",
      imageUrl: ""
    });
    setItemImage(null);
    setSelectedItemImage("");
    setOpenDialog(false);
  };

  const handleCloseDialogEdit = () => {
    setOpenDialogEdit(false);
  };

  const filteredRows = rows.filter((row) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      row.itemName.toLowerCase().includes(searchLower) ||
      row.itemType.toLowerCase().includes(searchLower) ||
      row.status.toLowerCase().includes(searchLower) ||
      row.createdDate.includes(searchLower)
    );
  });

  const columns = [
    { id: "slNo", label: "Sl. No", width: "10%" },
    { id: "name", label: "Item Name", width: "20%" },
    { id: "image", label: "Image", width: "15%" },
    { id: "type", label: "Type", width: "15%" },
    { id: "status", label: "Status", width: "15%" },
    { id: "date", label: "Date", width: "15%" },
    { id: "actions", label: "Actions", width: "10%" }
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
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    return status === "Lost" ? "error" : "success";
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalOpen(true);
    setZoomLevel(1);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleCloseImageModal = () => {
    setImageModalOpen(false);
    setZoomLevel(1);
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
                    Lost & Found
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#666' }}>
                    Manage lost and found items
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
                  Add New Item
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
                placeholder="Search items..."
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
                Showing {filteredRows.length} of {rows.length} items
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
                    <Table stickyHeader aria-label="lost and found table">
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
                                  No items found
                                </Typography>
                                <Typography variant="body2">
                                  Try adjusting your search criteria or add a new item
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
                                  fontWeight: 600,
                                  color: '#1a1a2e',
                                  fontSize: '0.95rem'
                                }}>
                                  {row.itemName}
                                </TableCell>

                                <TableCell sx={{ textAlign: 'center' }}>
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      justifyContent: 'center',
                                      cursor: row.imageUrl ? 'pointer' : 'default'
                                    }}
                                    onClick={() => row.imageUrl && handleImageClick(row.imageUrl)}
                                  >
                                    <Avatar
                                      src={row.imageUrl}
                                      sx={{
                                        width: 50,
                                        height: 50,
                                        border: '2px solid #e2e8f0'
                                      }}
                                      variant="rounded"
                                    >
                                      {!row.imageUrl && <SearchIcon />}
                                    </Avatar>
                                  </Box>
                                </TableCell>

                                <TableCell sx={{
                                  textAlign: 'center',
                                  fontWeight: 500,
                                  color: '#4a5568',
                                  fontSize: '0.95rem'
                                }}>
                                  {row.itemType}
                                </TableCell>

                                <TableCell sx={{ textAlign: 'center' }}>
                                  <Chip
                                    label={row.status}
                                    color={getStatusColor(row.status)}
                                    size="small"
                                    sx={{
                                      fontWeight: 600,
                                      minWidth: 80
                                    }}
                                  />
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

            {/* Add/Edit Dialogs */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
              <DialogTitle sx={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                color: 'white',
                textAlign: 'center',
                fontWeight: 600
              }}>
                Add New Item
              </DialogTitle>
              <DialogContent sx={{ p: 3 }}>
                <Grid container spacing={2} mt={2}>
                  <Grid item xs={12}>
                    <InputLabel sx={{ fontWeight: "bold", mb: 1 }}>
                      Item Image:
                    </InputLabel>
                    <DropzoneArea
                      filesLimit={1}
                      acceptedFiles={["image/jpeg", "image/png"]}
                      onChange={handleFileChange}
                      maxFileSize={5000000}
                      showPreviews={true}
                      showAlerts={false}
                      showPreviewsInDropzone={false}
                      showFileNames={false}
                      Icon={(props) => (
                        <CloudUploadIcon
                          style={{
                            color: "#4a6bff",
                            width: 35,
                            height: 35,
                          }}
                          {...props}
                        />
                      )}
                      dropzoneText={
                        <Typography
                          sx={{
                            color: "#4a6bff",
                            fontWeight: 600,
                            fontSize: 16,
                          }}
                        >
                          Upload / Drag files
                        </Typography>
                      }
                      previewText="Selected Item Image:"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Item Name"
                      value={formData.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Type</InputLabel>
                      <Select
                        value={formData.type}
                        label="Type"
                        onChange={(e) => handleFormChange('type', e.target.value)}
                      >
                        <MenuItem value="Lost">Lost</MenuItem>
                        <MenuItem value="Found">Found</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: 3, gap: 2 }}>
                <Button onClick={handleCloseDialog} variant="outlined" disabled={processing}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  disabled={processing}
                  sx={{
                    background: 'linear-gradient(135deg, #4a6bff 0%, #38bdf8 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #3b57d0 0%, #0ea5e9 100%)'
                    }
                  }}
                >
                  {processing ? <CircularProgress size={24} /> : 'Add Item'}
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
                Edit Item
              </DialogTitle>
              <DialogContent sx={{ p: 3 }}>
                <Grid container spacing={2} mt={2}>
                  <Grid item xs={12}>
                    <InputLabel sx={{ fontWeight: "bold", mb: 1 }}>
                      Item Image:
                    </InputLabel>
                    <DropzoneArea
                      filesLimit={1}
                      acceptedFiles={["image/jpeg", "image/png"]}
                      onChange={handleFileChange}
                      maxFileSize={5000000}
                      showPreviews={true}
                      showAlerts={false}
                      showPreviewsInDropzone={false}
                      showFileNames={false}
                      Icon={(props) => (
                        <CloudUploadIcon
                          style={{
                            color: "#4a6bff",
                            width: 35,
                            height: 35,
                          }}
                          {...props}
                        />
                      )}
                      dropzoneText={
                        <Typography
                          sx={{
                            color: "#4a6bff",
                            fontWeight: 600,
                            fontSize: 16,
                          }}
                        >
                          Upload / Drag files
                        </Typography>
                      }
                      previewText="Selected Item Image:"
                    />
                    {/* Always show current or newly selected image */}
                    {(selectedItemImage || formData.imageUrl) && (
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                        <Avatar
                          src={imageChanged ? selectedItemImage : formData.imageUrl}
                          sx={{
                            width: 100,
                            height: 100,
                            border: '2px solid #e2e8f0'
                          }}
                          variant="rounded"
                        />
                      </Box>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Item Name"
                      value={formData.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Type</InputLabel>
                      <Select
                        value={formData.type}
                        label="Type"
                        onChange={(e) => handleFormChange('type', e.target.value)}
                      >
                        <MenuItem value="Lost">Lost</MenuItem>
                        <MenuItem value="Found">Found</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: 3, gap: 2 }}>
                <Button onClick={handleCloseDialogEdit} variant="outlined" disabled={processing}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveChanges}
                  variant="contained"
                  disabled={processing}
                  sx={{
                    background: 'linear-gradient(135deg, #4a6bff 0%, #38bdf8 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #3b57d0 0%, #0ea5e9 100%)'
                    }
                  }}
                >
                  {processing ? <CircularProgress size={24} /> : 'Save Changes'}
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog} maxWidth="xs" fullWidth>
              <DialogTitle sx={{ textAlign: 'center', fontWeight: 600 }}>
                Confirm Delete
              </DialogTitle>
              <DialogContent>
                <Typography textAlign="center">
                  Are you sure you want to delete this item?
                </Typography>
              </DialogContent>
              <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
                <Button onClick={handleCloseDeleteDialog} variant="outlined" sx={{ minWidth: 100 }} disabled={processing}>
                  Cancel
                </Button>
                <Button
                  onClick={handleItemDelete}
                  variant="contained"
                  disabled={processing}
                  sx={{
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    minWidth: 100,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
                    }
                  }}
                >
                  {processing ? <CircularProgress size={24} /> : 'Delete'}
                </Button>
              </DialogActions>
            </Dialog>

            {/* Image Modal with Zoom */}
            <Modal
              open={imageModalOpen}
              onClose={handleCloseImageModal}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(5px)'
              }}
            >
              <Zoom in={imageModalOpen} timeout={300}>
                <Box sx={{
                  position: 'relative',
                  outline: 'none',
                  maxWidth: '90vw',
                  maxHeight: '90vh'
                }}>
                  <Box sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    zIndex: 10,
                    display: 'flex',
                    gap: 1
                  }}>
                    <IconButton
                      onClick={handleZoomIn}
                      sx={{
                        background: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        '&:hover': {
                          background: 'rgba(0, 0, 0, 0.7)'
                        }
                      }}
                    >
                      <ZoomInIcon />
                    </IconButton>
                    <IconButton
                      onClick={handleZoomOut}
                      sx={{
                        background: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        '&:hover': {
                          background: 'rgba(0, 0, 0, 0.7)'
                        }
                      }}
                    >
                      <ZoomOutIcon />
                    </IconButton>
                    <IconButton
                      onClick={handleCloseImageModal}
                      sx={{
                        background: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        '&:hover': {
                          background: 'rgba(0, 0, 0, 0.7)'
                        }
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                  <Box
                    component="img"
                    src={selectedImage}
                    alt="Item preview"
                    sx={{
                      transform: `scale(${zoomLevel})`,
                      transition: 'transform 0.3s ease',
                      maxWidth: '100%',
                      maxHeight: '90vh',
                      boxShadow: 3,
                      borderRadius: 1
                    }}
                  />
                </Box>
              </Zoom>
            </Modal>

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

export default LostAndFound;