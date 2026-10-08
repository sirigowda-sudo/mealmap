import React, { useEffect, useState } from "react";
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
  IconButton,
  Skeleton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  Alert,
  InputAdornment,
  Paper
} from "@mui/material";
import {
  Add as AddIcon,
  RestaurantMenu as DishIcon,
  EmojiFoodBeverage as BreakfastIcon,
  LunchDining as LunchIcon,
  DinnerDining as DinnerIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  LocalFireDepartment as CalorieIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from "@mui/icons-material";
import { useCookies } from "react-cookie";
import { useLocation } from "react-router-dom";
import { apiList, invokeApi } from "../../../../../services/apiServices";
import SideNav from "../../common/Sidenav";
import Header from "../../common/Header";
import NavigatedComponent from "../NavigatedComponent";
import IconSidenav from "../../common/IconSidenav";
import { config } from "../../../../../config/config";
import JoditEditor from 'jodit-react';

// Icon mapping for meal types (fallback if API doesn't provide iconUrl)
const mealTypeIcons = {
  Breakfast: "https://cdn-icons-png.flaticon.com/512/4825/4825292.png",
  Lunch: "https://cdn-icons-png.flaticon.com/512/2082/2082045.png",
  Dinner: "https://cdn-icons-png.flaticon.com/512/878/878220.png"
};

const TodaysDish = () => {
  const [cookies] = useCookies();
  const location = useLocation();
  const isMobileScreen = useMediaQuery("(max-width:500px)");
  const [showSideNav, setShowSideNav] = useState(false);
  const isSmallScreen = useMediaQuery(
    "(min-width:1024px) and (max-width:1440px)"
  );

  // State for API data
  const [todayDish, setTodayDish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editingMenuId, setEditingMenuId] = useState(null);
  const [deletingMenuId, setDeletingMenuId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [newMeal, setNewMeal] = useState({
    mealDate: new Date().toISOString().split('T')[0],
    mealType: "",
    mealName: "",
    mealDescription: "",
    servedAt: "",
    duration: "",
    iconUrl: ""
  });

  const toggleSideNav = () => {
    setShowSideNav(!showSideNav);
  };

  // Fetch all daily menus
  const fetchAllDailyMenus = async () => {
    const params = {
      mealDate: new Date().toISOString().split('T')[0],
    }
    try {
      setLoading(true);
      const response = await invokeApi(
        config.mealMap + apiList.getAllDailyMenu,
        params,
        cookies);

      if (response && response.status === 200) {
        // Find today's menu from the response
        const today = new Date().toISOString().split('T')[0];
        const todaysMenus = response.data.dailyMenus.filter(menu => menu.mealDate === today);

        if (todaysMenus.length > 0) {
          // Format the data to match our component structure
          const formattedData = {
            date: today,
            meals: todaysMenus.map(menu => ({
              id: menu.id,
              type: menu.mealType,
              mainDish: menu.mealName,
              sideDish: "",
              servingTime: menu.servedAt,
              preparationTime: menu.duration,
              calories: 0,
              description: menu.mealDescription,
              iconUrl: menu.iconUrl,
              status: menu.status,
              createdDate: menu.createdDate,
              totalReviews: menu.totalReviews
            })),
            specialNotes: "Today's special menu",
            lastUpdated: "Just now",
            totalFavorites: 0
          };
          setTodayDish(formattedData);
        } else {
          setTodayDish(null);
        }
      } else {
        setTodayDish(null);
      }
    } catch (error) {
      console.error("Error fetching daily menus:", error);
      setTodayDish(null);
      setSnackbar({
        open: true,
        message: 'Failed to load menu data',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDailyMenus();
  }, []);

  const handleAddDish = () => {
    setOpenAddDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenAddDialog(false);
    setOpenEditDialog(false);
    setOpenDeleteDialog(false);
    setEditingMenuId(null);
    setDeletingMenuId(null);
    // Reset form
    setNewMeal({
      mealDate: new Date().toISOString().split('T')[0],
      mealType: "",
      mealName: "",
      mealDescription: "",
      servedAt: "",
      duration: "",
      iconUrl: ""
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // For duration field, only allow numbers and automatically append " Mins"
    if (name === 'duration') {
      // Remove any non-digit characters
      const numbersOnly = value.replace(/\D/g, '');
      setNewMeal(prev => ({
        ...prev,
        [name]: numbersOnly
      }));
      return;
    }

    setNewMeal(prev => ({
      ...prev,
      [name]: value,
      // Auto-set icon URL based on meal type
      iconUrl: name === 'mealType' ? mealTypeIcons[value] || "" : prev.iconUrl
    }));
  };

  const handleInputDescriptionChange = (value) => {
    setNewMeal(prev => ({
      ...prev,
      mealDescription: value,
    }));
  };



  const handleSubmit = async () => {
    try {
      // Prepare the data for API call
      const mealData = {
        ...newMeal,
        // Ensure date is in correct format
        mealDate: newMeal.mealDate || new Date().toISOString().split('T')[0],
        // Add "Mins" to duration if it's just a number
        duration: newMeal.duration && !isNaN(newMeal.duration) ? `${newMeal.duration} Mins` : newMeal.duration
      };

      const response = await invokeApi(
        config.mealMap + apiList.addDailyMenu,
        mealData,
        cookies
      );

      if (response && response.status === 200) {
        setSnackbar({
          open: true,
          message: 'Menu added successfully!',
          severity: 'success'
        });
        handleCloseDialog();
        // Refresh the menu data
        fetchAllDailyMenus();
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to add menu',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error("Error adding daily menu:", error);
      setSnackbar({
        open: true,
        message: 'Error adding menu',
        severity: 'error'
      });
    }
  };

  const handleEdit = async (id) => {
    try {
      setEditingMenuId(id);
      // Fetch the menu details for editing
      const response = await invokeApi(
        config.mealMap + apiList.getDailyMenu,
        { id },
        cookies
      );

      if (response && response.status === 200) {
        const menuData = response.data.dailyMenu;
        setNewMeal({
          mealDate: menuData.mealDate,
          mealType: menuData.mealType,
          mealName: menuData.mealName,
          mealDescription: menuData.mealDescription,
          servedAt: menuData.servedAt,
          duration: menuData.duration ? menuData.duration.replace(' Mins', '') : '',
          iconUrl: menuData.iconUrl
        });
        setOpenEditDialog(true);
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to load menu details',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error("Error fetching menu details:", error);
      setSnackbar({
        open: true,
        message: 'Error loading menu details',
        severity: 'error'
      });
    }
  };

  const handleUpdate = async () => {
    try {
      // Prepare the data for API call
      const mealData = {
        id: editingMenuId,
        ...newMeal,
        // Add "Mins" to duration if it's just a number
        duration: newMeal.duration && !isNaN(newMeal.duration) ? `${newMeal.duration} Mins` : newMeal.duration
      };

      const response = await invokeApi(
        config.mealMap + apiList.updateDailyMenu,
        mealData,
        cookies,
      );

      if (response && response.status === 200) {
        setSnackbar({
          open: true,
          message: 'Menu updated successfully!',
          severity: 'success'
        });
        handleCloseDialog();
        // Refresh the menu data
        fetchAllDailyMenus();
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to update menu',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error("Error updating daily menu:", error);
      setSnackbar({
        open: true,
        message: 'Error updating menu',
        severity: 'error'
      });
    }
  };

  const handleDeleteClick = (id) => {
    setDeletingMenuId(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await invokeApi(
        config.mealMap + apiList.deleteDailyMenu,
        { id: deletingMenuId },
        cookies,
      );

      if (response && response.status === 200) {
        setSnackbar({
          open: true,
          message: 'Menu deleted successfully!',
          severity: 'success'
        });
        // Refresh the menu data
        fetchAllDailyMenus();
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to delete menu',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error("Error deleting daily menu:", error);
      setSnackbar({
        open: true,
        message: 'Error deleting menu',
        severity: 'error'
      });
    } finally {
      handleCloseDialog();
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };


  const formatTime = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    const adjustedHour = hour % 12 || 12;
    return `${adjustedHour}:${minute.toString().padStart(2, "0")} ${ampm}`;
  };


  const DishCard = ({ meal, loading }) => {
    if (loading) {
      return (
        <Card sx={{
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          background: '#FFFFFF',
          height: '100%',
          overflow: 'hidden'
        }}>
          <Skeleton variant="rectangular" height={200} />
          <CardContent sx={{ p: 3 }}>
            <Skeleton variant="text" height={40} />
            <Skeleton variant="text" height={20} />
            <Skeleton variant="rectangular" height={100} sx={{ mt: 2, borderRadius: 2 }} />
          </CardContent>
        </Card>
      );
    }

    const mealStyles = {
      Breakfast: {
        color: "#FF9A3D",
        gradient: "linear-gradient(135deg, #FF9A3D 0%, #FF6B6B 100%)",
        icon: <BreakfastIcon />
      },
      Lunch: {
        color: "#4ECDC4",
        gradient: "linear-gradient(135deg, #4ECDC4 0%, #556270 100%)",
        icon: <LunchIcon />
      },
      Dinner: {
        color: "#6C5CE7",
        gradient: "linear-gradient(135deg, #6C5CE7 0%, #A363D9 100%)",
        icon: <DinnerIcon />
      }
    };

    const style = mealStyles[meal.type] || mealStyles.Breakfast;

    return (
      <Card sx={{
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        background: '#FFFFFF',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
        },
        height: '100%',
        overflow: 'hidden',
        border: `1px solid ${style.color}20`,
        position: 'relative',

      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', background: style.gradient, p: 3 }}>
          {/* Edit and Delete buttons */}
          <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1, display: 'flex', gap: 1 }}>
            <IconButton
              sx={{
                background: 'rgba(255,255,255,0.9)',
                '&:hover': { background: 'rgba(255,255,255,1)' }
              }}
              onClick={() => handleEdit(meal.id)}
            >
              <EditIcon sx={{ color: style.color, fontSize: 20 }} />
            </IconButton>
            <IconButton
              sx={{
                background: 'rgba(255,255,255,0.9)',
                '&:hover': { background: 'rgba(255,255,255,1)' }
              }}
              onClick={() => handleDeleteClick(meal.id)}
            >
              <DeleteIcon sx={{ color: '#ff4757', fontSize: 20 }} />
            </IconButton>
          </Box>

          <Box sx={{

            color: 'white',
            textAlign: 'left',
            position: 'relative'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  background: 'rgba(255,255,255,0.2)',
                  width: 50,
                  height: 50
                }}
                src={meal.iconUrl}
              >
                {!meal.iconUrl && React.cloneElement(style.icon, { sx: { fontSize: 28 } })}
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{
                  fontWeight: 700,
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  {meal.type}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                  Served at {formatTime(meal.servingTime)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>


        <CardContent sx={{ p: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{
              fontWeight: 600,
              color: '#1a1a2e',
              mb: 1
            }}>
              {meal.mainDish}
            </Typography>
            <Typography variant="body2" sx={{
              color: '#666',
              fontStyle: 'italic',
              mb: 2
            }}>
              {meal.sideDish}
            </Typography>

            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 3,
              mb: 2
            }}>
              <Box sx={{ textAlign: 'center',display:'flex', alignItems:'center',gap:1 }}>
                <TimeIcon sx={{ color: style.color, fontSize: 20, }} />
                <Typography variant="caption" sx={{ color: '#666' }}>
                  {meal.preparationTime}
                </Typography>
              </Box>
              {/* <Box sx={{ textAlign: 'center' }}>
                <CalorieIcon sx={{ color: style.color, fontSize: 20, mb: 0.5 }} />
                <Typography variant="caption" sx={{ color: '#666' }}>
                  {meal.calories} kcal
                </Typography>
              </Box> */}
            </Box>
          </Box>

          <Typography
            variant="body2"
            sx={{
              color: '#666',
              textAlign: 'center',
              mb: 3,
              fontStyle: 'italic'
            }}
            component="div"
            dangerouslySetInnerHTML={{ __html: meal.description }}
          />


          {/* <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <IconButton sx={{ color: style.color }}>
              <FavoriteIcon />
            </IconButton>
            <IconButton sx={{ color: style.color }}>
              <ShareIcon />
            </IconButton>
          </Box> */}
        </CardContent>
      </Card>
    );
  };

  const NoDishCard = () => (
    <Card sx={{
      borderRadius: 3,
      boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      textAlign: 'center',
      p: 4,
      border: '2px dashed #cbd5e1'
    }}>
      <DishIcon sx={{
        fontSize: 64,
        color: '#94a3b8',
        mb: 2
      }} />
      <Typography variant="h5" sx={{
        color: '#475569',
        mb: 1,
        fontWeight: 600
      }}>
        No Dish Planned for Today
      </Typography>
      <Typography variant="body1" sx={{
        color: '#64748b',
        mb: 3,
        maxWidth: 400,
        mx: 'auto'
      }}>
        It looks like there's no dish planned for today. You can add today's dish by clicking the button below.
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleAddDish}
        sx={{
          background: 'linear-gradient(135deg, #4a6bff 0%, #38bdf8 100%)',
          borderRadius: 2,
          px: 4,
          py: 1.5,
          fontWeight: 600,
          fontSize: '1rem',
          '&:hover': {
            background: 'linear-gradient(135deg, #3b57d0 0%, #0ea5e9 100%)',
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(74, 107, 255, 0.3)',
          },
          transition: 'all 0.2s ease-in-out'
        }}
      >
        Add Today's Dish
      </Button>
    </Card>
  );

  return (
    <>
      <Grid sx={{ display: "flex", minHeight: '100vh', background: '#f8fafc' }}>
        {isMobileScreen ? (
          <IconSidenav />
        ) : showSideNav ? (
          <IconSidenav />
        ) : (
          <SideNav />
        )}
        <Grid component="main" sx={{ width: "100%", flex: 1 }}>
          <Header toggleSideNav={toggleSideNav} />
          <Box sx={{ p: isMobileScreen ? 2 : 3 }}>
            <NavigatedComponent pathname={location.pathname} />

            {/* Add Daily Menu Button - Always visible at top */}
            <Box sx={{ mb: 4, mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddDish}
                sx={{
                  background: 'linear-gradient(135deg, #4a6bff 0%, #38bdf8 100%)',
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: '1rem',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #3b57d0 0%, #0ea5e9 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(74, 107, 255, 0.3)',
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                Add Daily Menu
              </Button>
            </Box>

            {/* Page Header */}
            <Box sx={{ mb: 4 }}>
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
                    Today's Special Dish
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#666' }}>
                    Discover today's culinary delights and meal details
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

            {loading ? (
              <Grid container spacing={3}>
                {[1, 2, 3].map((item) => (
                  <Grid item xs={12} md={4} key={item}>
                    <DishCard loading={true} />
                  </Grid>
                ))}
              </Grid>
            ) : todayDish ? (
              <>
                {/* Today's Date Card */}
                <Card sx={{
                  mb: 4,
                  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                  color: 'white',
                  borderRadius: 3,
                  p: 3
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        Today's Menu Overview
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Carefully curated meals for a perfect dining experience
                      </Typography>
                    </Box>
                    <Chip
                      label="Available"
                      color="success"
                      sx={{
                        background: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                  </Box>
                </Card>

                {/* Meal Cards */}
                <Grid container spacing={3}>
                  {todayDish.meals.map((meal, index) => (
                    <Grid item xs={12} md={4} key={index}>
                      <DishCard meal={meal} />
                    </Grid>
                  ))}
                </Grid>

                {/* Additional Info */}
                {/* <Card sx={{
                  mt: 4,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  border: '1px solid #e2e8f0'
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{
                      fontWeight: 600,
                      color: '#1a1a2e',
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <DishIcon sx={{ color: '#4a6bff' }} />
                      Special Notes for Today
                    </Typography>
                    <Typography variant="body2" sx={{
                      color: '#4a5568',
                      lineHeight: 1.7,
                      mb: 2
                    }}>
                      {todayDish.specialNotes}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TimeIcon sx={{ color: '#4a6bff' }} />
                        <Typography variant="body2" sx={{ color: '#4a5568' }}>
                          Last updated: {todayDish.lastUpdated}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FavoriteIcon sx={{ color: '#4a6bff' }} />
                        <Typography variant="body2" sx={{ color: '#4a5568' }}>
                          {todayDish.totalFavorites} favorites today
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card> */}
              </>
            ) : (
              <NoDishCard />
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Add Daily Menu Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(to bottom, #ffffff, #f8fafc)'
          }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #4a6bff 0%, #38bdf8 100%)',
          color: 'white',
          borderRadius: '12px 12px 0 0'
        }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Add Daily Menu</Typography>
            <IconButton onClick={handleCloseDialog} size="small" sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            <TextField
              label="Date"
              type="date"
              name="mealDate"
              value={newMeal.mealDate}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />

            <FormControl fullWidth>
              <InputLabel>Meal Type</InputLabel>
              <Select
                name="mealType"
                value={newMeal.mealType}
                label="Meal Type"
                onChange={handleInputChange}
              >
                <MenuItem value="Breakfast">Breakfast</MenuItem>
                <MenuItem value="Lunch">Lunch</MenuItem>
                <MenuItem value="Dinner">Dinner</MenuItem>
              </Select>
            </FormControl>

            {/* {newMeal.mealType && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                <Avatar
                  src={mealTypeIcons[newMeal.mealType]}
                  sx={{ width: 40, height: 40 }}
                />
                <Typography variant="body2" color="textSecondary">
                  Selected icon for {newMeal.mealType}
                </Typography>
              </Box>
            )} */}

            <TextField
              label="Meal Name"
              name="mealName"
              value={newMeal.mealName}
              onChange={handleInputChange}
              fullWidth
              placeholder="e.g., Chitranna, Rice & Sambar"
            />

            {/* <TextField
              label="Meal Description"
              name="mealDescription"
              value={newMeal.mealDescription}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={4}
              placeholder="Describe the meal in detail..."
            /> */}

            <TextField
              label="Served At"
              name="servedAt"
              type="time"
              value={newMeal.servedAt}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // 5 min intervals
              }}
            />

            <TextField
              label="Duration (minutes)"
              name="duration"
              type="number"
              value={newMeal.duration}
              onChange={handleInputChange}
              fullWidth
              InputProps={{
                endAdornment: <InputAdornment position="end">Mins</InputAdornment>,
              }}
              inputProps={{
                min: 0,
                max: 240,
              }}
              helperText="Estimated preparation time in minutes"
            />

            <JoditEditor
              value={newMeal.mealDescription}
              onChange={handleInputDescriptionChange}
              tabIndex={1}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!newMeal.mealType || !newMeal.mealName}
            sx={{
              background: 'linear-gradient(135deg, #4a6bff 0%, #38bdf8 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #3b57d0 0%, #0ea5e9 100%)',
              },
            }}
          >
            Add Menu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Daily Menu Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(to bottom, #ffffff, #f8fafc)'
          }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #FF9A3D 0%, #FF6B6B 100%)',
          color: 'white',
          borderRadius: '12px 12px 0 0'
        }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Edit Daily Menu</Typography>
            <IconButton onClick={handleCloseDialog} size="small" sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            <TextField
              label="Date"
              type="date"
              name="mealDate"
              value={newMeal.mealDate}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />

            <FormControl fullWidth>
              <InputLabel>Meal Type</InputLabel>
              <Select
                name="mealType"
                value={newMeal.mealType}
                label="Meal Type"
                onChange={handleInputChange}
              >
                <MenuItem value="Breakfast">Breakfast</MenuItem>
                <MenuItem value="Lunch">Lunch</MenuItem>
                <MenuItem value="Dinner">Dinner</MenuItem>
              </Select>
            </FormControl>

            {/* {newMeal.mealType && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                <Avatar
                  src={mealTypeIcons[newMeal.mealType]}
                  sx={{ width: 40, height: 40 }}
                />
                <Typography variant="body2" color="textSecondary">
                  Selected icon for {newMeal.mealType}
                </Typography>
              </Box>
            )} */}

            <TextField
              label="Meal Name"
              name="mealName"
              value={newMeal.mealName}
              onChange={handleInputChange}
              fullWidth
              placeholder="e.g., Chitranna, Rice & Sambar"
            />

            {/* <TextField
              label="Meal Description"
              name="mealDescription"
              value={newMeal.mealDescription}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={4}
              placeholder="Describe the meal in detail..."
            /> */}


            <TextField
              label="Served At"
              name="servedAt"
              type="time"
              value={newMeal.servedAt}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // 5 min intervals
              }}
            />

            <TextField
              label="Duration (minutes)"
              name="duration"
              type="number"
              value={newMeal.duration}
              onChange={handleInputChange}
              fullWidth
              InputProps={{
                endAdornment: <InputAdornment position="end">Mins</InputAdornment>,
              }}
              inputProps={{
                min: 0,
                max: 240,
              }}
              helperText="Estimated preparation time in minutes"
            />

            <JoditEditor
              value={newMeal.mealDescription}
              onChange={handleInputDescriptionChange}
              tabIndex={1}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            variant="contained"
            disabled={!newMeal.mealType || !newMeal.mealName}
            sx={{
              background: 'linear-gradient(135deg, #FF9A3D 0%, #FF6B6B 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #e58a35 0%, #e05c5c 100%)',
              },
            }}
          >
            Update Menu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(to bottom, #ffffff, #f8fafc)'
          }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #ff4757 0%, #ff6b81 100%)',
          color: 'white',
          borderRadius: '12px 12px 0 0'
        }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Confirm Delete</Typography>
            <IconButton onClick={handleCloseDialog} size="small" sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <DeleteIcon sx={{ fontSize: 64, color: '#ff4757', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Are you sure you want to delete this menu item?
            </Typography>
            <Typography variant="body2" color="textSecondary">
              This action cannot be undone. The menu item will be permanently removed from the system.
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{ minWidth: 100 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #ff4757 0%, #ff6b81 100%)',
              minWidth: 100,
              '&:hover': {
                background: 'linear-gradient(135deg, #e84118 0%, #ff5252 100%)',
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: '100%',
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default TodaysDish;