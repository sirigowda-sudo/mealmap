import { Grid, Typography, useMediaQuery, Box, Breadcrumbs } from "@mui/material";
import React from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { NavLink } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";

const NavigatedComponent = ({ pathname }) => {
  let componentName;
  let breadcrumbPath = [];
  const isMobileScreen = useMediaQuery("(max-width:500px)");
  const isSmallScreen = useMediaQuery(
    "(min-width:1024px) and (max-width:1440px)"
  );

  // Define breadcrumb structure based on pathname
  switch (pathname) {
    case "/dashboard":
      componentName = "Dashboard";
      breadcrumbPath = [{ name: "Dashboard", path: "/dashboard" }];
      break;
    case "/serve-now/quick-view":
      componentName = "Quick View";
      breadcrumbPath = [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Serve Now", path: "/serve-now" },
        { name: "Quick View", path: "/serve-now/quick-view" }
      ];
      break;
    case "/serve-now/detailed-view":
      componentName = "Detailed View";
      breadcrumbPath = [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Serve Now", path: "/serve-now" },
        { name: "Detailed View", path: "/serve-now/detailed-view" }
      ];
      break;
    case "/dish-of-day/todays-dish":
      componentName = "Today's Dish";
      breadcrumbPath = [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Dish of Day", path: "/dish-of-day" },
        { name: "Today's Dish", path: "/dish-of-day/todays-dish" }
      ];
      break;
    case "/dish-of-day/dish-history":
      componentName = "Dish History";
      breadcrumbPath = [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Dish of Day", path: "/dish-of-day" },
        { name: "Dish History", path: "/dish-of-day/dish-history" }
      ];
      break;
    case "/grocery":
      componentName = "Grocery";
      breadcrumbPath = [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Grocery", path: "/grocery" }
      ];
      break;
    case "/lost-and-found":
      componentName = "Lost & Found";
      breadcrumbPath = [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Lost & Found", path: "/lost-and-found" }
      ];
      break;
    case "/reviews":
      componentName = "Reviews";
      breadcrumbPath = [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Reviews", path: "/reviews" }
      ];
      break;
    default:
      componentName = "Dashboard";
      breadcrumbPath = [{ name: "Dashboard", path: "/dashboard" }];
  }

  return (
    <Box
      sx={{
        background: "white",
        p: isMobileScreen ? 1.5 : 2,
        borderRadius: 2,
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
        // mb: 2,
        border: "1px solid rgba(0, 0, 0, 0.05)",
      }}
    >
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={12} sm={6}>
          <Typography
            sx={{
              fontSize: isMobileScreen ? "1.1rem" : "1.5rem",
              fontWeight: 600,
              color: "#1a1a2e",
              background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {componentName}
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Breadcrumbs
            separator={
              <NavigateNextIcon
                sx={{
                  fontSize: isMobileScreen ? 14 : 16,
                  color: "rgba(26, 26, 46, 0.6)",
                }}
              />
            }
            aria-label="breadcrumb"
            sx={{
              display: "flex",
              justifyContent: { xs: "flex-start", sm: "flex-end" },
              alignItems: "center",
            }}
          >
            {breadcrumbPath.map((item, index) =>
              index === breadcrumbPath.length - 1 ? (
                <Typography
                  key={index}
                  sx={{
                    color: "#1a1a2e",
                    fontSize: isMobileScreen ? "0.8rem" : "0.9rem",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {item.name}
                </Typography>
              ) : (
                <NavLink
                  key={index}
                  to={item.path}
                  style={{
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {item.name === "Dashboard" ? (
                    <HomeIcon
                      sx={{
                        fontSize: isMobileScreen ? 14 : 16,
                        color: "rgba(26, 26, 46, 0.7)",
                        "&:hover": {
                          color: "#1a1a2e",
                        },
                      }}
                    />
                  ) : (
                    <Typography
                      sx={{
                        color: "rgba(26, 26, 46, 0.7)",
                        fontSize: isMobileScreen ? "0.8rem" : "0.9rem",
                        fontWeight: 400,
                        "&:hover": {
                          color: "#1a1a2e",
                          textDecoration: "underline",
                        },
                      }}
                    >
                      {item.name}
                    </Typography>
                  )}
                </NavLink>
              )
            )}
          </Breadcrumbs>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NavigatedComponent;