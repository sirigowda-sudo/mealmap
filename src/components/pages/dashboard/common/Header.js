import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Avatar,
  Typography,
  Popover,
  Tab,
  ListItem,
  List,
  useMediaQuery,
  Badge,
  IconButton,
  Chip,
  Divider,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import { config } from "../../../../config/config";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import WindowSharpIcon from "@mui/icons-material/WindowSharp";
import TranslateSharpIcon from "@mui/icons-material/TranslateSharp";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import PersonIcon from "@mui/icons-material/Person";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import LockIcon from "@mui/icons-material/Lock";
import FeedbackIcon from "@mui/icons-material/Feedback";
import HistoryIcon from "@mui/icons-material/History";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { apiList, invokeApi } from "../../../../services/apiServices";

const Header = ({ toggleSideNav }) => {
  const [roles, setRoles] = useState([]);
  const [name, setName] = useState("");
  const location = useLocation();
  const [cookies, , removeCookie] = useCookies([config.cookieName]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState("1");
  const [activeItem, setActiveItem] = useState(0);
  const [openProfile, setOpenProfile] = useState(false);
  const isMobileScreen = useMediaQuery("(max-width:500px)");
  const isSmallScreen = useMediaQuery(
    "(min-width:1024px) and (max-width:1440px)"
  );
  
  useEffect(() => {
    const handleGetUser = async () => {
      const id = cookies[config.cookieName]?.loginUserId;
      const params = {
        id,
      };

      try {
        const response = await invokeApi(
          config.mealMap + apiList.getUser,
          params,
          cookies
        );

        if (response?.status >= 200 && response?.status < 300) {
          if (response.data.responseCode === "200") {
            setRoles(response.data.users.roles);
            setName(response.data.users.name);
          } else if (response.data.responseCode === "400") {
          }
        }
      } catch (error) {}
    };
    handleGetUser();
  }, []);

  const handleItemClick = (index) => {
    setActiveItem(index);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    removeCookie(config.cookieName);
    navigate("/");
    handleClose();
    window.location.reload();
  };
  const [unreadCount, setUnreadCount] = useState(1);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const getUnreadCount = async () => {
    try {
      const response = await invokeApi(
        config.mealMap + apiList.getUnreadCount,
        {},
        cookies
      );
      if (response?.status >= 200 && response?.status < 300) {
        const chatCount = response.data.chatCount;
        setUnreadCount(chatCount);
      } else {
      }
    } catch (error) {}
  };

  useEffect(() => {
    getUnreadCount();
  }, [cookies, config, apiList]);

  return (
    <>
      <Grid
        sx={{
          width: "100%",
          height: isMobileScreen ? "60px" : "80px",
          background: "linear-gradient(90deg, #1a1a2e 0%, #16213e 100%)",
          top: 0,
          position: "sticky",
          zIndex: 7,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Grid
          container
          sx={{
            px: isMobileScreen ? 2 : 4,
            py: isMobileScreen ? 1.5 : 2,
            alignItems: "center",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          <Grid
            item
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: isMobileScreen ? 2 : 4,
            }}
          >
            <IconButton
              onClick={toggleSideNav}
              sx={{
                color: "white",
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <MenuIcon
                sx={{
                  fontSize: isMobileScreen ? 20 : 24,
                }}
              />
            </IconButton>
            
            <Typography
              variant="h6"
              sx={{
                color: "white",
                fontWeight: 600,
                fontSize: isMobileScreen ? "1rem" : "1.25rem",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                display: { xs: "none", sm: "block" }
              }}
            >
              MealMap Dashboard
            </Typography>
          </Grid>

          <Grid
            item
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: isMobileScreen ? 1.5 : 3,
            }}
          >
            <IconButton
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                "&:hover": {
                  color: "white",
                  background: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <Badge
                badgeContent={unreadCount}
                color="error"
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: "0.6rem",
                    height: "18px",
                    minWidth: "18px",
                  },
                }}
              >
                <NotificationsIcon
                  sx={{
                    fontSize: isMobileScreen ? 18 : 22,
                  }}
                />
              </Badge>
            </IconButton>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                p: 1,
                borderRadius: 3,
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.1)",
                },
              }}
              onClick={handleClick}
            >
              <Avatar
                sx={{
                  width: isMobileScreen ? 32 : 40,
                  height: isMobileScreen ? 32 : 40,
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                }}
              >
                <PersonIcon />
              </Avatar>
              
              {!isMobileScreen && (
                <Box sx={{ textAlign: "left" }}>
                  <Typography
                    sx={{
                      color: "white",
                      fontWeight: 500,
                      fontSize: "0.9rem",
                    }}
                  >
                    {name}
                  </Typography>
                  <Chip
                    label={roles[0] || "User"}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: "0.6rem",
                      background: "linear-gradient(45deg, #ff6b6b, #ff9e6b)",
                      color: "white",
                      mt: 0.5,
                    }}
                  />
                </Box>
              )}
            </Box>

            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              sx={{
                mt: 1,
              }}
              PaperProps={{
                sx: {
                  borderRadius: 3,
                  overflow: "hidden",
                  background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                  color: "white",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
                  width: isMobileScreen ? 280 : 350,
                },
              }}
            >
              <Box sx={{ p: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 2,
                    p: 2,
                    background: "rgba(255, 255, 255, 0.05)",
                    borderRadius: 2,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 50,
                      height: 50,
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                    }}
                  >
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: "1.1rem",
                      }}
                    >
                      {name}
                    </Typography>
                    <Chip
                      label={roles[0] || "User"}
                      size="small"
                      sx={{
                        background: "linear-gradient(45deg, #ff6b6b, #ff9e6b)",
                        color: "white",
                        mt: 0.5,
                        fontSize: "0.7rem",
                      }}
                    />
                  </Box>
                </Box>

                <TabContext value={value}>
                
                  
                  <TabPanel value="1" sx={{ p: 1 }}>
                    <List sx={{ cursor: "pointer" }}>
                      {[
                        { icon: <BorderColorRoundedIcon />, text: "Edit Profile" },
                        { icon: <PersonOutlinedIcon />, text: "View Profile", action: () => { setOpenProfile(true); handleClose(); navigate("/myprofile"); } },
                        { icon: <PeopleOutlineRoundedIcon />, text: "Profile" },
                        { icon: <LogoutRoundedIcon />, text: "Logout", action: handleLogout },
                      ].map((item, index) => (
                        <ListItem
                          key={index}
                          onClick={item.action || (() => handleItemClick(index))}
                          sx={{
                            color: activeItem === index ? "white" : "rgba(255, 255, 255, 0.7)",
                            background: activeItem === index ? "rgba(255, 255, 255, 0.1)" : "transparent",
                            borderRadius: 1,
                            mb: 0.5,
                            "&:hover": {
                              background: "rgba(255, 255, 255, 0.1)",
                            },
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                            {React.cloneElement(item.icon, { sx: { mr: 2, fontSize: 20 } })}
                            <Typography sx={{ fontSize: "0.9rem" }}>
                              {item.text}
                            </Typography>
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  </TabPanel>
                  
                 
                </TabContext>
              </Box>
            </Popover>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Header;