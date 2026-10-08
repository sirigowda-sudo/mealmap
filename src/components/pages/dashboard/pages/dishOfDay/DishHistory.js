import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  TextField,
  Chip
} from "@mui/material";
import {
  Search as SearchIcon
} from "@mui/icons-material";
import { useCookies } from "react-cookie";
import { useLocation } from "react-router-dom";
import { config } from "../../../../../config/config";
import { apiList, invokeApi } from "../../../../../services/apiServices";
import SideNav from "../../common/Sidenav";
import Header from "../../common/Header";
import NavigatedComponent from "../NavigatedComponent";
import IconSidenav from "../../common/IconSidenav";
import {
 
  Restaurant as MealIcon,
  
} from "@mui/icons-material";

function DishHistory() {
  const [cookies] = useCookies();
  const location = useLocation();
  const isMobileScreen = useMediaQuery("(max-width:500px)");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(isMobileScreen ? 5 : 10);
  const [rows, setRows] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(true);
  const [showSideNav, setShowSideNav] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSideNav = () => {
    setShowSideNav(!showSideNav);
  };

  useEffect(() => {
    fetchTableData();
    // eslint-disable-next-line
  }, []);

  const fetchTableData = async () => {
    setLoading(true);
    try {
      const response = await invokeApi(
        config.mealMap + apiList.getAllDailyMenu,
        {}, // pass params if needed
        cookies
      );

      if (response && response.status === 200) {
        // Adjust based on API response shape
        const data = response.data.dailyMenus || [];
        setRows(data);
      } else {
        showSnackbar("Failed to load dish history", "error");
      }
    } catch (err) {
      console.error("API error:", err);
      showSnackbar("Something went wrong while fetching data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredRows = rows.filter((row) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      row.mealName?.toLowerCase().includes(searchTerm) ||
      row.mealType?.toLowerCase().includes(searchTerm) ||
      row.mealDate?.toLowerCase().includes(searchTerm) // already a string
    );
  });


  const columns = [
    { id: "slNo", label: "Sl. No", width: "10%" },
    { id: "mealName", label: "Meal Name", width: "25%" },
    { id: "mealType", label: "Meal Type", width: "25%" },
    { id: "mealDate", label: "Meal Date", width: "25%" },

  ];

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const getMealChip = (mealType) => {
    if (!mealType || mealType.trim().length === 0) {
      return (
        <Typography
          variant="body2"
          sx={{ color: "#888", fontStyle: "italic", fontSize: "0.85rem" }}
        >
          No meal selected
        </Typography>
      );
    }
  
    const mealColors = {
      Breakfast: { bg: "#fffbeb", color: "#92400e", border: "#f59e0b" },
      Lunch: { bg: "#f0f9ff", color: "#0c4a6e", border: "#0ea5e9" },
      Dinner: { bg: "#fdf4ff", color: "#86198f", border: "#d946ef" },
    };
  
    const colors = mealColors[mealType] || {
      bg: "#f9fafb",
      color: "#374151",
      border: "#d1d5db",
    };
  
    return (
      <Chip
        icon={<MealIcon sx={{ fontSize: 16 }} />}
        label={mealType}
        size="small"
        sx={{
          background: colors.bg,
          color: colors.color,
          fontWeight: 600,
          border: `1px solid ${colors.border}`,
          borderRadius: 2,
        }}
      />
    );
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
            <Box sx={{ mb: 3, mt: 3 }}>
              <Typography variant="h4" sx={{
                fontWeight: 700,
                color: '#1a1a2e',
                mb: 1,
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Dish History
              </Typography>
              <Typography variant="body1" sx={{ color: '#666', fontSize: '1.1rem' }}>
                View the history of served dishes
              </Typography>
            </Box>

            {/* Filters Card */}
            <Card sx={{
              mb: 3,
              p: 3,
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              border: '1px solid #e2e8f0'
            }}>
              <TextField
                fullWidth
                size="medium"
                placeholder="Search by date or dish name..."
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
                    fontSize: '0.95rem'
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
                Showing {filteredRows.length} of {rows.length} records
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

            {/* Table */}
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
                    <Table stickyHeader aria-label="dish history table">
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
                                  No records found
                                </Typography>
                                <Typography variant="body2">
                                  Try adjusting your search criteria
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
                                  '&:nth-of-type(even)': { background: '#f8fafc' },
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
                                <TableCell sx={{ textAlign: 'center' }}>
                                  {row.mealName}
                                </TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>
  {getMealChip(row.mealType)}
</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>
                                  {new Date(row.mealDate).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric"
                                  })}
                                </TableCell>
                              </TableRow>
                            ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>

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
                      />
                    </Box>
                  )}
                </>
              )}
            </Card>

            <Snackbar
              open={openSnackbar}
              autoHideDuration={4000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ borderRadius: 2 }}>
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default DishHistory;
