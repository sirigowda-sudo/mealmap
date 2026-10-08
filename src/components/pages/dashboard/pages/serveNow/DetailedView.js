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
  Chip,
  Avatar,
  TextField
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Person as PersonIcon,
  CheckCircle as PresentIcon,
  Cancel as AbsentIcon,
  Restaurant as MealIcon,
  Today
} from "@mui/icons-material";
import { useCookies } from "react-cookie";
import { useLocation } from "react-router-dom";
import { config } from "../../../../../config/config";
import { apiList, invokeApi } from "../../../../../services/apiServices";
import SideNav from "../../common/Sidenav";
import Header from "../../common/Header";
import NavigatedComponent from "../NavigatedComponent";
import IconSidenav from "../../common/IconSidenav";

function DetailedView() {
  const [cookies] = useCookies();
  const location = useLocation();
  const isMobileScreen = useMediaQuery("(max-width:500px)");
  const isSmallScreen = useMediaQuery("(min-width:1024px) and (max-width:1440px)");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(isMobileScreen ? 5 : 10);
  const [rows, setRows] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(false);
  const [showSideNav, setShowSideNav] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [mealFilter, setMealFilter] = useState("all");
  const today = new Date();
  const date = today.toISOString().split("T")[0];

  const toggleSideNav = () => {
    setShowSideNav(!showSideNav);
  };

  useEffect(() => {
    setLoading(true);
    fetchTableData();
  }, []);

  const fetchTableData = async () => {
    // The API call is commented out to use dummy data for demonstration purposes
    const params = {
      createdDate: date,
    };
    try {
      const response = await invokeApi(
        config.mealMap + apiList.getAllMenuAdjustment,
        params,
        cookies
      );

      if (response?.status === 200) {
        setRows(response.data.menuAdjustment);
        setLoading(false);
      } else {
        showSnackbar("Failed to fetch data", "error");
      }

    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleMealFilterChange = (event) => {
    setMealFilter(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredRows = rows.filter((row) => {
    const matchesSearch = (row?.userName || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || row?.attendance === statusFilter;

    const matchesMeal =
      mealFilter === "all" ||
      (row?.mealType &&
        row.mealType.split(",").map((m) => m.trim()).includes(mealFilter));

    return matchesSearch && matchesStatus && matchesMeal;
  });


  const columns = [
    { id: "slNo", label: "Sl. No", width: "10%" },
    { id: "name", label: "Name", width: "25%" },
    { id: "attendance", label: "Attendance", width: "20%" },
    { id: "meal", label: "Meal", width: "20%" },
    { id: "remark", label: "Remark", width: "20%" },
  ];

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const getAttendanceChip = (attendance, reason) => {
    return attendance === "Present" ? (
      <Chip
        icon={<PresentIcon />}
        label="Present"
        size="small"
        sx={{
          background: "#ecfdf5",
          color: "#065f46",
          fontWeight: 600,
          border: "1px solid #10b981",
          borderRadius: 2
        }}
      />
    ) : (
      <Chip
        icon={<AbsentIcon />}
        label="Absent"
        size="small"
        sx={{
          background: "#fef2f2",
          color: "#991b1b",
          fontWeight: 600,
          border: "1px solid #ef4444",
          borderRadius: 2
        }}
      />
    );
  };

  const getMealChips = (meals) => {
    // Handle null, undefined, or empty string
    if (!meals || meals.trim().length === 0) {
      return (
        <Typography
          variant="body2"
          sx={{ color: "#888", fontStyle: "italic", fontSize: "0.85rem" }}
        >
          No meals selected
        </Typography>
      );
    }

    // Convert "Breakfast, Lunch, Dinner" → ["Breakfast", "Lunch", "Dinner"]
    const mealArray = meals.split(",").map((m) => m.trim());

    const mealColors = {
      Breakfast: { bg: "#fffbeb", color: "#92400e", border: "#f59e0b" },
      Lunch: { bg: "#f0f9ff", color: "#0c4a6e", border: "#0ea5e9" },
      Dinner: { bg: "#fdf4ff", color: "#86198f", border: "#d946ef" },
    };

    return mealArray.map((meal, index) => {
      const colors = mealColors[meal] || {
        bg: "#f9fafb",
        color: "#374151",
        border: "#d1d5db",
      };

      return (
        <Chip
          key={index}
          icon={<MealIcon sx={{ fontSize: 16 }} />}
          label={meal}
          size="small"
          sx={{
            background: colors.bg,
            color: colors.color,
            fontWeight: 600,
            border: `1px solid ${colors.border}`,
            borderRadius: 2,
            mr: 0.5,
            mb: 0.5,
          }}
        />
      );
    });
  };


  // Generate avatar color based on name
  const getAvatarColor = (name) => {
    const colors = [
      "linear-gradient(135deg, #4a6bff 0%, #38bdf8 100%)",
      "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
      "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
      "linear-gradient(135deg, #ec4899 0%, #db2777 100%)"
    ];

    if (!name) {
      // fallback color for null/undefined/empty names
      return colors[0];
    }

    const index = name.length % colors.length;
    return colors[index];
  };


  const getInitials = (name) => {
    if (!name) return "NA"; // fallback initials
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
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
                Serve Now - Detailed View
              </Typography>
              <Typography variant="body1" sx={{ color: '#666', fontSize: '1.1rem' }}>
                Track meal attendance and serving details
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
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    size="medium"
                    placeholder="Search by name or USN..."
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
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Select
                    fullWidth
                    size="medium"
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                    displayEmpty
                    sx={{
                      borderRadius: 2,
                      fontSize: '0.95rem'
                    }}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="Present">Present</MenuItem>
                    <MenuItem value="Absent">Absent</MenuItem>
                  </Select>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Select
                    fullWidth
                    size="medium"
                    value={mealFilter}
                    onChange={handleMealFilterChange}
                    displayEmpty
                    sx={{
                      borderRadius: 2,
                      fontSize: '0.95rem'
                    }}
                  >
                    <MenuItem value="all">All Meals</MenuItem>
                    <MenuItem value="Breakfast">Breakfast</MenuItem>
                    <MenuItem value="Lunch">Lunch</MenuItem>
                    <MenuItem value="Dinner">Dinner</MenuItem>
                  </Select>
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
                    <Table stickyHeader aria-label="detailed view table">
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
                                  Try adjusting your search or filter criteria
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
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <Avatar
                                      sx={{
                                        background: getAvatarColor(row?.userName),
                                        width: 45,
                                        height: 45,
                                        fontSize: "1rem",
                                        fontWeight: 600,
                                      }}
                                    >
                                      {getInitials(row?.userName)}
                                    </Avatar>
                                    <Box>
                                      <Typography
                                        variant="body1"
                                        sx={{ fontWeight: 600, color: "#1a1a2e" }}
                                      >
                                        {row?.userName || "Unknown User"}
                                      </Typography>
                                      <Typography
                                        variant="caption"
                                        sx={{ color: "#666", fontSize: "0.8rem" }}
                                      >
                                        ID: {row?.id ?? "-"}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </TableCell>


                                <TableCell sx={{ textAlign: 'center' }}>
                                  {getAttendanceChip(row.attendance)}
                                </TableCell>

                                <TableCell sx={{ textAlign: 'center' }}>
                                  {/* {row.attendance === "Present" ? ( */}
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                                    {getMealChips(row.mealType)}
                                  </Box>
                                  {/* ) : (
                                    <Typography variant="body2" sx={{ color: '#991b1b', fontStyle: 'italic', fontSize: '0.85rem' }}>
                                      {row.reason}
                                    </Typography>
                                  )} */}
                                </TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>
                                  <Typography variant="body2" sx={{ color: '#991b1b', fontStyle: 'italic', fontSize: '0.85rem' }}>
                                    {row.remarks}
                                  </Typography>
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

export default DetailedView;