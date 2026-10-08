import React, { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  ListItemButton,
  Grid,
  CssBaseline,
  useMediaQuery,
  Divider,
  useTheme,
  Chip,
  Avatar,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../../../../assets/logo/meal-map-logo.png";
import DashboardIcon from "@mui/icons-material/Dashboard";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import {
  School as SchoolIcon,
} from "@mui/icons-material";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import CachedIcon from "@mui/icons-material/Cached";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { config } from "../../../../config/config";
import { getUser } from "../../../../global/redux/action";
import "../../../../assets/css/style.css";
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import AddToPhotosRoundedIcon from '@mui/icons-material/AddToPhotosRounded';
import LeaderboardRoundedIcon from '@mui/icons-material/LeaderboardRounded';
import LegendToggleRoundedIcon from '@mui/icons-material/LegendToggleRounded';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import ReviewsIcon from '@mui/icons-material/Reviews';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded';

const drawerWidth = 280;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [openSubList, setOpenSubList] = useState({});
  const isSmallScreen = useMediaQuery(
    "(min-width:1024px) and (max-width:1440px)"
  );

  const [cookies] = useCookies();
  const globalState = useSelector((state) => state);
  const { userData, userError } = globalState.userReducer;
  const dispatch = useDispatch();
  
  // Check if a menu item is active (including its sub-items)
  const isItemActive = (item) => {
    if (item.path === location.pathname) return true;
    if (item.subItems && item.subItems.some(subItem => subItem.path === location.pathname)) return true;
    return false;
  };

  // Check if a sub-item is active
  const isSubItemActive = (subItem) => {
    return subItem.path === location.pathname;
  };

  useEffect(() => {
    menuItems.forEach((item, index) => {
      if (item.subItems && item.subItems.some((subItem) => subItem.path === location.pathname)) {
        setOpenSubList((prevOpenSubList) => ({
          ...prevOpenSubList,
          [index]: true,
        }));
      }
    });
  }, [location.pathname]);

  const handleSubListClick = (index) => {
    setOpenSubList((prevOpenSubList) => ({
      ...prevOpenSubList,
      [index]: !prevOpenSubList[index],
    }));
  };

  const handleNavigation = (path, parentIndex) => {
    navigate(path);
    if (parentIndex !== undefined) {
      setOpenSubList((prevOpenSubList) => ({
        ...prevOpenSubList,
        [parentIndex]: true,
      }));
    }
  };

  useEffect(() => {
    setOpen(true);
  }, [location.pathname]);

  useEffect(() => {
    if (userError) {
      alert(
        "Something went wrong while fetching user details. Please try again later!"
      );
    }
  }, [userError]);

  useEffect(() => {
    if (cookies[config.cookieName]?.loginUserId && !userData?.users) {
      dispatch(
        getUser({ id: cookies[config.cookieName].loginUserId, cookies })
      );
    }
  }, [dispatch, cookies, userData]);

  const userRole = userData?.users?.roles || [];
  const assignedAsset = userData?.users?.assignedAsset ? userData.users.assignedAsset.split(",") : [];
  
  const getMenuItemsBasedOnRole = (userRoles) => {
    return [
      {
        text: "Dashboard",
        icon: <DashboardIcon />,
        path: "/dashboard",
        subItems: [],
        color: "linear-gradient(135deg, #654ea3 0%, #eaafc8 100%)",
      },
      {
        text: "Serve Now",
        icon: <GroupIcon />,
        subItems: [
          {
            text: "Quick View",
            path: "/serve-now/quick-view",
            icon: <PlaylistAddCheckIcon />,
          },
          {
            text: "Detailed View",
            path: "/serve-now/detailed-view",
            icon: <LegendToggleRoundedIcon />,
          },
        ],
        color: "linear-gradient(135deg, #654ea3 0%, #eaafc8 100%)",
      },
      {
        text: "Dish of Day",
        icon: <FastfoodIcon />,
        subItems: [
          {
            text: "Today's Dish",
            path: "/dish-of-day/todays-dish",
            icon: <CachedIcon />,
          },
          {
            text: "Dish History",
            path: "/dish-of-day/dish-history",
            icon: <AddToPhotosRoundedIcon />,
          },
        ],
        color: "linear-gradient(135deg, #654ea3 0%, #eaafc8 100%)",
      },
      {
        text: "User Manager",
        icon: <PersonIcon />,
        subItems: [
          {
            text: "Users",
            path: "/users-manager/users",
            icon: <CachedIcon />,
          },
          
        ],
        color: "linear-gradient(135deg, #654ea3 0%, #eaafc8 100%)",
      },
      {
        text: "Event Order",
        icon: <EditCalendarIcon />,
        path: "/event-order",
        subItems: [],
        color: "linear-gradient(135deg, #654ea3 0%, #eaafc8 100%)",
      },
      {
        text: "Quote",
        icon: <FormatQuoteRoundedIcon />,
        path: "/quote",
        subItems: [],
        color: "linear-gradient(135deg, #654ea3 0%, #eaafc8 100%)",
      },
      {
        text: "Grocery",
        icon: <LocalGroceryStoreIcon />,
        path: "/grocery",
        subItems: [],
        color: "linear-gradient(135deg, #654ea3 0%, #eaafc8 100%)",
      },
      {
        text: "Lost & Found",
        icon: <FindInPageIcon />,
        path: "/lost-and-found",
        subItems: [],
        color: "linear-gradient(135deg, #654ea3 0%, #eaafc8 100%)",
      },
      {
        text: "Reviews",
        icon: <ReviewsIcon />,
        path: "/reviews",
        subItems: [],
        color: "linear-gradient(135deg, #654ea3 0%, #eaafc8 100%)",
      },
    ].filter((item) => {
      for (let role of userRoles) {
        switch (role) {
          case "Super Admin":
            return true;
          case "Admin":
            if (
              [
                "Dashboard",
                "Serve Now",
                "Dish of Day",
                "Event Order",
                "Quote",
                "Grocery",
                "Lost & Found",
                "Reviews",
              ].includes(item.text)
            )
              return true;
            break;
          case "LeadAdmin":
            if (
              [
                "Dashboard",
                "Assigned Leads",
              ].includes(item.text)
            )
              return true;
            break;
          case "Team Leader":
            if (["Dashboard", "Leads Manager",].includes(item.text))
              return true;
            break;
          case "Telecaller":
            if (["Dashboard",].includes(item.text)) return true;
            break;
          default:
            break;
        }
      }
      return false;
    });
  };
  
  const menuItems = getMenuItemsBasedOnRole(userRole);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        sx={{
          width: isSmallScreen ? 200 : drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isSmallScreen ? 200 : drawerWidth,
            boxSizing: 'border-box',
            background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
            color: 'white',
            border: 'none',
            boxShadow: '4px 0 10px rgba(0, 0, 0, 0.2)',
          },
        }}
      >
        <Grid
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            background: 'rgba(255, 255, 255, 0.05)',
          }}
        >
          <Avatar
            sx={{
              width: isSmallScreen ? 100 : 120,
              height: isSmallScreen ? 100 : 120,
              background: '#25263a',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            }}
          >
            <img
              src={Logo}
              alt="logo"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </Avatar>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 1 }} />

        <Box
          className="custom-scrollbar-table"
          sx={{
            overflow: 'auto',
            p: 1.5,
            mt: 1,
          }}
        >
          <List disablePadding>
            {menuItems.map((item, index) => (
              <div key={index}>
                <ListItem
                  disablePadding
                  onClick={() =>
                    item.path
                      ? handleNavigation(item.path)
                      : handleSubListClick(index)
                  }
                  sx={{
                    borderRadius: 3,
                    mb: 1,
                    overflow: 'hidden',
                    background: 
                      isItemActive(item)
                        ? item.color
                        : 'rgba(255, 255, 255, 0.03)',
                    boxShadow: isItemActive(item) 
                      ? '0 4px 10px rgba(0, 0, 0, 0.3)' 
                      : 'none',
                    '&:hover': {
                      background: isItemActive(item) 
                        ? item.color 
                        : 'rgba(255, 255, 255, 0.08)',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s ease',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <ListItemButton
                    sx={{
                      py: 1.5,
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {React.cloneElement(item.icon, {
                        sx: {
                          fontSize: isSmallScreen ? 22 : 24,
                          color: 'white',
                          filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.3))',
                        },
                      })}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            color: 'white',
                            fontSize: isSmallScreen ? 13 : 15,
                            fontWeight: 500,
                            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                          }}
                        >
                          {item.text}
                        </Typography>
                      }
                    />
                    {item.subItems && item.subItems.length > 0 ? (
                      openSubList[index] ? (
                        <ExpandLess sx={{ 
                          color: 'rgba(255, 255, 255, 0.7)', 
                          fontSize: isSmallScreen ? 18 : 20,
                          background: 'rgba(0,0,0,0.2)',
                          borderRadius: '50%',
                          p: 0.3,
                        }} />
                      ) : (
                        <ExpandMore sx={{ 
                          color: 'rgba(255, 255, 255, 0.7)', 
                          fontSize: isSmallScreen ? 18 : 20,
                          background: 'rgba(0,0,0,0.2)',
                          borderRadius: '50%',
                          p: 0.3,
                        }} />
                      )
                    ) : null}
                  </ListItemButton>
                </ListItem>
                
                {item.subItems && item.subItems.length > 0 && (
                  <Collapse
                    in={openSubList[index]}
                    timeout="auto"
                    unmountOnExit
                    sx={{
                      ml: 2,
                      pl: 1,
                      borderLeft: '2px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <List component="div" disablePadding>
                      {item.subItems.map((subItem, subIndex) => (
                        <ListItemButton
                          key={subIndex}
                          sx={{
                            pl: 4,
                            py: 1.25,
                            borderRadius: 2,
                            mb: 0.5,
                            '&:hover': {
                              background: 'rgba(255, 255, 255, 0.05)',
                            },
                            background:
                              isSubItemActive(subItem)
                                ? 'rgba(255, 255, 255, 0.1)'
                                : 'transparent',
                          }}
                          onClick={() => handleNavigation(subItem.path, index)}
                        >
                          <ListItemIcon sx={{ minWidth: 35 }}>
                            {subItem.icon &&
                              React.cloneElement(subItem.icon, {
                                sx: {
                                  fontSize: isSmallScreen ? 18 : 20,
                                  color: isSubItemActive(subItem) 
                                    ? 'white' 
                                    : 'rgba(255, 255, 255, 0.8)',
                                },
                              })}
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography
                                sx={{
                                  color: isSubItemActive(subItem) 
                                    ? 'white' 
                                    : 'rgba(255, 255, 255, 0.9)',
                                  fontSize: isSmallScreen ? 12 : 13,
                                  fontWeight: isSubItemActive(subItem) ? 600 : 400,
                                }}
                              >
                                {subItem.text}
                              </Typography>
                            }
                          />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                )}
              </div>
            ))}
          </List>
        </Box>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Box sx={{ 
          p: 2, 
          background: 'rgba(0, 0, 0, 0.2)', 
          textAlign: 'center',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          MealMap System v1.0
          </Typography>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Sidebar;