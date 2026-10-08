import React, { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Grid,
  CssBaseline,
  useMediaQuery,
  Popover,
  Avatar,
  Chip,
  Divider,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { config } from "../../../../config/config";
import { getUser } from "../../../../global/redux/action";
import Logo from "../../../../assets/logo/meal-map-logo.png";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import LegendToggleRoundedIcon from "@mui/icons-material/LegendToggleRounded";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import CachedIcon from "@mui/icons-material/Cached";
import AddToPhotosRoundedIcon from "@mui/icons-material/AddToPhotosRounded";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import ReviewsIcon from "@mui/icons-material/Reviews";
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded';

const drawerWidth = 100;
const isMobile = 75;

export default function MiniDrawer() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cookies] = useCookies();
  const globalState = useSelector((state) => state);
  const { userData, userError } = globalState.userReducer;
  const dispatch = useDispatch();
  const isMobileScreen = useMediaQuery("(max-width:500px)");
  const isSmallScreen = useMediaQuery(
    "(min-width:1024px) and (max-width:1440px)"
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

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
  const assignedAsset = userData?.users?.assignedAsset
    ? userData.users.assignedAsset.split(",")
    : [];

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

  const handleClick = (event, index) => {
    setAnchorEl(event.currentTarget);
    setSelectedIndex(index);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedIndex(null);
  };

  const openPopper = Boolean(anchorEl);
  const id = openPopper ? "simple-popover" : undefined;

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
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        sx={{
          width: isMobileScreen ? isMobile : drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isMobileScreen ? isMobile : drawerWidth,
            boxSizing: "border-box",
            background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)",
            color: "white",
            border: "none",
            boxShadow: "4px 0 10px rgba(0, 0, 0, 0.2)",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Grid
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            p: 1.5,
            background: "rgba(255, 255, 255, 0.05)",
          }}
        >
          <Avatar
            sx={{
              width: isMobileScreen ? 60 : 75,
              height: isMobileScreen ? 60 : 75,
              background: "#25263a",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            }}
          >
            <img
              src={Logo}
              alt="logo"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </Avatar>
        </Grid>

        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", mb: 1 }} />

        <Box
          className="custom-scrollbar-table"
          sx={{
            overflow: "auto",
            p: 1,
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <List sx={{ width: "100%" }}>
            {menuItems.map((item, index) => (
              <ListItem
                key={index}
                disablePadding
                onClick={(event) => {
                  if (item.subItems.length === 0) {
                    navigate(item.path);
                  } else {
                    handleClick(event, index);
                  }
                }}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  overflow: "hidden",
                  background: isItemActive(item)
                    ? item.color
                    : "rgba(255, 255, 255, 0.03)",
                  boxShadow: isItemActive(item)
                    ? "0 4px 8px rgba(0, 0, 0, 0.3)"
                    : "none",
                  "&:hover": {
                    background: isItemActive(item)
                      ? item.color
                      : "rgba(255, 255, 255, 0.08)",
                    transform: "translateY(-2px)",
                    transition: "all 0.2s ease",
                  },
                  transition: "all 0.3s ease",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: "auto",
                    py: 1.5,
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  {React.cloneElement(item.icon, {
                    sx: {
                      fontSize: isMobileScreen ? 22 : 26,
                      color: "white",
                      filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.3))",
                    },
                  })}
                </ListItemIcon>
              </ListItem>
            ))}
          </List>
        </Box>

        <Box
          sx={{
            p: 1,
            background: "rgba(0, 0, 0, 0.2)",
            textAlign: "center",
            borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "0.6rem" }}
          >
            v1.0
          </Typography>
        </Box>
      </Drawer>

      {selectedIndex !== null && menuItems[selectedIndex]?.subItems && (
        <Popover
          id={id}
          open={openPopper}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          PaperProps={{
            sx: {
              background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)",
              color: "white",
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: "4px 4px 15px rgba(0, 0, 0, 0.3)",
              ml: 1,
            },
          }}
        >
          <List sx={{ p: 1 }}>
            {menuItems[selectedIndex]?.subItems.map((subItem, subIndex) => (
              <ListItem
                key={subIndex}
                disablePadding
                onClick={() => {
                  handleClose();
                  subItem.path && navigate(subItem.path);
                }}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.08)",
                  },
                  background: isSubItemActive(subItem)
                    ? "rgba(255, 255, 255, 0.1)"
                    : "transparent",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 35,
                    pl: 1,
                    color: isSubItemActive(subItem) 
                      ? "white" 
                      : "rgba(255, 255, 255, 0.8)",
                  }}
                >
                  {subItem.icon &&
                    React.cloneElement(subItem.icon, {
                      sx: {
                        fontSize: 20,
                      },
                    })}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        color: isSubItemActive(subItem) 
                          ? "white" 
                          : "rgba(255, 255, 255, 0.9)",
                        fontSize: 13,
                        pr: 2,
                        fontWeight: isSubItemActive(subItem) ? 600 : 400,
                      }}
                    >
                      {subItem.text}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Popover>
      )}
    </Box>
  );
}