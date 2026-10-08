

import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  useMediaQuery,
  Button,
  Chip,
  Avatar,
  Skeleton,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Rating,
  IconButton,
  Pagination
} from "@mui/material";
import {
  Search as SearchIcon,
  Star as StarIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Sidenav from "../common/Sidenav";
import Header from "../common/Header";
import { useLocation } from "react-router-dom";
import NavigatedComponent from "./NavigatedComponent";
import IconSidenav from "../common/IconSidenav";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { config } from "../../../../config/config";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import EmojiFoodBeverageIcon from "@mui/icons-material/EmojiFoodBeverage";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { apiList, invokeApi } from "../../../../services/apiServices";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const Dashboard = () => {
  const [cookies] = useCookies();
  const location = useLocation();
  const isMobileScreen = useMediaQuery("(max-width:500px)");
  const [showSideNav, setShowSideNav] = useState(false);
  const [mealData, setMealData] = useState([]);
  const [statsData, setStatsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // table
  const [rows, setRows] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(isMobileScreen ? 5 : 10);
  const [openId, setOpenId] = useState(null); // store which row id is open
  const [selectedDescription, setSelectedDescription] = useState("");

  // Popup state
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);

  const globalState = useSelector((state) => state);
  const { userData } = globalState.userReducer;

  const toggleSideNav = () => {
    setShowSideNav(!showSideNav);
  };

  // Color scheme based on meal type
  const getMealStyle = (mealType) => {
    const styles = {
      Breakfast: {
        color: "#FF9A3D",
        lightColor: "#FFF5EB",
        gradient: "linear-gradient(135deg, #FF9A3D 0%, #FF6B6B 100%)",
        icon: <EmojiFoodBeverageIcon />
      },
      Lunch: {
        color: "#4ECDC4",
        lightColor: "#EBF9F8",
        gradient: "linear-gradient(135deg, #4ECDC4 0%, #556270 100%)",
        icon: <LunchDiningIcon />
      },
      Dinner: {
        color: "#6C5CE7",
        lightColor: "#F0EEFF",
        gradient: "linear-gradient(135deg, #6C5CE7 0%, #A363D9 100%)",
        icon: <RestaurantMenuIcon />
      }
    };
    return styles[mealType] || styles.Breakfast;
  };

  // Utility: trim description to 7–8 words
  const getShortDescription = (htmlString) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = htmlString;
    const text = tmp.textContent || tmp.innerText || "";
    const words = text.split(" ");
    return words.slice(0, 8).join(" ") + (words.length > 8 ? "..." : "");
  };

  // Fetch stats data
  const fetchStatsData = async (today) => {
    try {
      const response = await invokeApi(
        config.mealMap + apiList.getUserOverview,
        { createdDate: today },
        cookies
      );
      if (response?.status === 200 && response.data) {
        setStatsData(response.data.userOverview);
      }
    } catch (error) {
      console.error("Error fetching stats data:", error);
    }
  };

  // Fetch meal data
  const fetchMealData = async (today) => {
    try {
      const response = await invokeApi(
        config.mealMap + apiList.getMenuQuickView,
        { createdDate: today },
        cookies
      );
      if (response?.status === 200 && response.data?.menuAdjustment) {
        setMealData(response.data.menuAdjustment);
      }
    } catch (error) {
      console.error("Error fetching meal data:", error);
    }
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchStatsData(today), fetchMealData(today)]);
      setLoading(false);
    };
    fetchAll();
  }, []);

  //Table Data
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


  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };


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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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


  const MealCard = ({ meal, loading }) => {
    if (loading) {
      return (
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            background: "#FFFFFF",
            height: "100%",
            overflow: "hidden"
          }}
        >
          <Skeleton variant="rectangular" height={120} />
          <CardContent sx={{ p: 3 }}>
            <Skeleton variant="text" height={40} />
            <Skeleton variant="text" height={20} />
            <Skeleton
              variant="rectangular"
              height={100}
              sx={{ mt: 2, borderRadius: 2 }}
            />
            <Skeleton
              variant="rectangular"
              height={45}
              sx={{ mt: 2, borderRadius: 2 }}
            />
          </CardContent>
        </Card>
      );
    }

    const mealStyle = getMealStyle(meal.mealType);

    return (
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          background: "#FFFFFF",
          transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 16px 40px rgba(0,0,0,0.12)"
          },
          height: "100%",
          overflow: "hidden",
          border: `1px solid ${mealStyle.lightColor}`
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: mealStyle.gradient,
            p: 2.5,
            color: "white",
            position: "relative"
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                background: "rgba(255,255,255,0.2)",
                width: 50,
                height: 50
              }}
            >
              {React.cloneElement(mealStyle.icon, { sx: { fontSize: 28 } })}
            </Avatar>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  textShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}
              >
                {meal.mealType}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                <AccessTimeIcon sx={{ fontSize: 16 }} />
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  {meal.duration}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <CardContent sx={{ p: 3 }}>
          {/* Dish */}
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#1a1a2e",
                mb: 1
              }}
            >
              {meal.mealName}
            </Typography>

            {/* Short description */}
            <Typography
              variant="body2"
              sx={{ color: "#666", fontStyle: "italic" }}
            >
              {getShortDescription(meal.description)}
            </Typography>

            {/* Rating */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mt: 1.5
              }}
            >
              <StarIcon sx={{ color: "#FFD700", fontSize: 18, mr: 0.5 }} />
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: "#1a1a2e" }}
              >
                {meal.reviews}
              </Typography>
            </Box>
          </Box>

          {/* Stats */}
          <Box
            sx={{
              gap: 2,
              mb: 3,
              background: mealStyle.lightColor,
              p: 2,
              borderRadius: 2
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Diversity3Icon sx={{ color: mealStyle.color, mr: 1 }} />
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "#1a1a2e" }}
                  >
                    {meal.totalPresent}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#666" }}>
                    Members
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* View button */}
          {/* <Button
            fullWidth
            variant="contained"
            sx={{
              background: mealStyle.gradient,
              borderRadius: 2,
              py: 1.5,
              fontWeight: 600,
              fontSize: "1rem",
              "&:hover": {
                background: mealStyle.gradient,
                transform: "translateY(-2px)",
                boxShadow: `0 6px 20px ${mealStyle.color}40`
              },
              transition: "all 0.2s ease-in-out"
            }}
            startIcon={<VisibilityIcon />}
            onClick={() => {
              setSelectedMeal(meal);
              // setOpenDialog(true);
            }}
          >
            View Reviews
          </Button> */}
        </CardContent>
      </Card>
    );
  };

  const StatCard = ({ title, value, icon, color, loading }) => {
    if (loading) {
      return (
        <Card
          sx={{
            background: "#f8fafc",
            borderRadius: 3,
            p: 2.5,
            height: "100%"
          }}
        >
          <Skeleton variant="rectangular" width="60%" height={30} />
          <Skeleton variant="text" width="40%" height={20} sx={{ mt: 1 }} />
        </Card>
      );
    }

    return (
      <Card
        sx={{
          background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
          color: "white",
          borderRadius: 3,
          p: 2.5,
          boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
          transition: "transform 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-3px)"
          },
          height: "100%"
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
              {value}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {title}
            </Typography>
          </Box>
          <Avatar
            sx={{
              background: "rgba(255,255,255,0.2)",
              width: 50,
              height: 50
            }}
          >
            {React.cloneElement(icon, { sx: { fontSize: 28 } })}
          </Avatar>
        </Box>
      </Card>
    );
  };

  return (
    <>
      <Grid sx={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
        {isMobileScreen ? (
          <IconSidenav />
        ) : showSideNav ? (
          <IconSidenav />
        ) : (
          <Sidenav />
        )}
        <Grid component="main" sx={{ width: "100%", flex: 1 }}>
          <Header toggleSideNav={toggleSideNav} />
          <Box sx={{ p: isMobileScreen ? 2 : 4 }}>
            <NavigatedComponent pathname={location.pathname} />

            {/* Page Header */}
            <Box sx={{ mb: 4,mt:3 }}>
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
                    Today's Meal Overview
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#666", maxWidth: 600 }}>
                    Discover today's culinary offerings and track meal preferences
                    across all servings
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarIcon sx={{ color: '#4a6bff' }} />
                  <Typography variant="body1" sx={{ color: '#4a5568', fontWeight: 500 }}>
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {loading && <LinearProgress sx={{ mb: 3, borderRadius: 2 }} />}

            {/* Stats Summary */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={3}>
                <StatCard
                  title="Total Members"
                  value={statsData[0]?.totalMembers || 0}
                  icon={<Diversity3Icon />}
                  color="#667eea"
                  loading={loading}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <StatCard
                  title="Total Present"
                  value={statsData[0]?.totalPresent || 0}
                  icon={<CheckCircleIcon />}
                  color="#4caf50"
                  loading={loading}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <StatCard
                  title="Total Absent"
                  value={statsData[0]?.totalAbsent || 0}
                  icon={<CancelIcon />}
                  color="#f44336"
                  loading={loading}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <StatCard
                  title="Satisfaction Rate"
                  value={statsData[0]?.satisfactionRate || 0}
                  icon={<TrendingUpIcon />}
                  color="#4facfe"
                  loading={loading}
                />
              </Grid>
            </Grid>

            {/* Meal Cards */}
            <Grid container spacing={3}>
              {mealData.map((meal, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <MealCard meal={meal} loading={loading} />
                </Grid>
              ))}
            </Grid>

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
                    Reviews
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
          </Box>
        </Grid>
      </Grid>

      {/* Popup Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Meal Details</DialogTitle>
        <DialogContent dividers>
          {selectedMeal ? (
            <>
              <Typography variant="h6">{selectedMeal.mealName}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Meal ID: {selectedMeal.id}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Reviews: {selectedMeal.reviews}
              </Typography>
            </>
          ) : (
            <Typography>No meal selected</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Dashboard;

