// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   useMediaQuery,
//   Button,
//   Chip,
//   Avatar,
//   Skeleton,
//   LinearProgress
// } from "@mui/material";
// import Sidenav from "../../common/Sidenav";
// import Header from "../../common/Header";
// import { useLocation } from "react-router-dom";
// import NavigatedComponent from "../NavigatedComponent";
// import IconSidenav from "../../common/IconSidenav";
// import { useCookies } from "react-cookie";
// import { useSelector } from "react-redux";
// import { config } from "../../../../../config/config";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
// import EmojiFoodBeverageIcon from "@mui/icons-material/EmojiFoodBeverage";
// import LunchDiningIcon from "@mui/icons-material/LunchDining";
// import Diversity3Icon from "@mui/icons-material/Diversity3";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import TrendingUpIcon from "@mui/icons-material/TrendingUp";
// import StarIcon from "@mui/icons-material/Star";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
// import { apiList, invokeApi } from "../../../../../services/apiServices";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import CancelIcon from "@mui/icons-material/Cancel";

// const QuickView = () => {
//   const [cookies] = useCookies();
//   const location = useLocation();
//   const isMobileScreen = useMediaQuery("(max-width:500px)");
//   const [showSideNav, setShowSideNav] = useState(false);
//   const [mealData, setMealData] = useState([]);
//   const [statsData, setStatsData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const globalState = useSelector((state) => state);
//   const { userData } = globalState.userReducer;
//   const userRole = userData?.users?.roles || [];

//   const toggleSideNav = () => {
//     setShowSideNav(!showSideNav);
//   };

//   // Color scheme based on meal type
//   const getMealStyle = (mealType) => {
//     const styles = {
//       Breakfast: {
//         color: "#FF9A3D",
//         lightColor: "#FFF5EB",
//         gradient: "linear-gradient(135deg, #FF9A3D 0%, #FF6B6B 100%)",
//         icon: <EmojiFoodBeverageIcon />
//       },
//       Lunch: {
//         color: "#4ECDC4",
//         lightColor: "#EBF9F8",
//         gradient: "linear-gradient(135deg, #4ECDC4 0%, #556270 100%)",
//         icon: <LunchDiningIcon />
//       },
//       Dinner: {
//         color: "#6C5CE7",
//         lightColor: "#F0EEFF",
//         gradient: "linear-gradient(135deg, #6C5CE7 0%, #A363D9 100%)",
//         icon: <RestaurantMenuIcon />
//       }
//     };
//     return styles[mealType] || styles.Breakfast;
//   };

//   // Fetch stats data (/getUserOverview)
//   const fetchStatsData = async (today) => {
//     try {
//       const response = await invokeApi(
//         config.mealMap + apiList.getUserOverview,
//         { createdDate: today },
//         cookies
//       );
//       if (response?.status === 200 && response.data) {
//         setStatsData(response.data.userOverview);
//       }
//     } catch (error) {
//       console.error("Error fetching stats data:", error);
//     }
//   };

//   // Fetch meal data (/getMenuQuickView)
//   const fetchMealData = async (today) => {
//     try {
//       const response = await invokeApi(
//         config.mealMap + apiList.getMenuQuickView,
//         { createdDate: today },
//         cookies
//       );
//       if (response?.status === 200 && response.data?.menuAdjustment) {
//         setMealData(response.data.menuAdjustment);
//       }
//     } catch (error) {
//       console.error("Error fetching meal data:", error);
//     }
//   };

//   useEffect(() => {
//     const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
//     const fetchAll = async () => {
//       setLoading(true);
//       await Promise.all([fetchStatsData(today), fetchMealData(today)]);
//       setLoading(false);
//     };
//     fetchAll();
//   }, []);

//   const MealCard = ({ meal, loading }) => {
//     if (loading) {
//       return (
//         <Card
//           sx={{
//             borderRadius: 3,
//             boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
//             background: "#FFFFFF",
//             height: "100%",
//             overflow: "hidden"
//           }}
//         >
//           <Skeleton variant="rectangular" height={120} />
//           <CardContent sx={{ p: 3 }}>
//             <Skeleton variant="text" height={40} />
//             <Skeleton variant="text" height={20} />
//             <Skeleton
//               variant="rectangular"
//               height={100}
//               sx={{ mt: 2, borderRadius: 2 }}
//             />
//             <Skeleton
//               variant="rectangular"
//               height={45}
//               sx={{ mt: 2, borderRadius: 2 }}
//             />
//           </CardContent>
//         </Card>
//       );
//     }

//     const mealStyle = getMealStyle(meal.mealType);

//     return (
//       <Card
//         sx={{
//           borderRadius: 3,
//           boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
//           background: "#FFFFFF",
//           transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
//           "&:hover": {
//             transform: "translateY(-5px)",
//             boxShadow: "0 16px 40px rgba(0,0,0,0.12)"
//           },
//           height: "100%",
//           overflow: "hidden",
//           border: `1px solid ${mealStyle.lightColor}`
//         }}
//       >
//         {/* Header with gradient */}
//         <Box
//           sx={{
//             background: mealStyle.gradient,
//             p: 2.5,
//             color: "white",
//             position: "relative"
//           }}
//         >
//           <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//             <Avatar
//               sx={{
//                 background: "rgba(255,255,255,0.2)",
//                 width: 50,
//                 height: 50
//               }}
//             >
//               {React.cloneElement(mealStyle.icon, { sx: { fontSize: 28 } })}
//             </Avatar>
//             <Box>
//               <Typography
//                 variant="h6"
//                 sx={{
//                   fontWeight: 700,
//                   textShadow: "0 2px 4px rgba(0,0,0,0.1)"
//                 }}
//               >
//                 {meal.mealType}
//               </Typography>
//               <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
//                 <AccessTimeIcon sx={{ fontSize: 16 }} />
//                 <Typography variant="caption" sx={{ opacity: 0.9 }}>
//                   {meal.duration}
//                 </Typography>
//                 {/* <Box sx={{ mx: 1, opacity: 0.5 }}>•</Box>
//                 <LocalFireDepartmentIcon sx={{ fontSize: 16 }} />
//                 <Typography variant="caption" sx={{ opacity: 0.9 }}>
//                   {meal.calories} kcal
//                 </Typography> */}
//               </Box>
//             </Box>
//           </Box>

//           {/* Trend badge */}
//           {/* <Chip
//             label={meal.trend}
//             size="small"
//             sx={{
//               position: "absolute",
//               top: 15,
//               right: 15,
//               background: "rgba(255,255,255,0.2)",
//               color: "white",
//               fontWeight: 600,
//               backdropFilter: "blur(10px)",
//               textTransform: "capitalize"
//             }}
//           /> */}
//         </Box>

//         <CardContent sx={{ p: 3 }}>
//           {/* Main dish */}
//           <Box sx={{ textAlign: "center", mb: 3 }}>
//             <Typography
//               variant="h6"
//               sx={{
//                 fontWeight: 600,
//                 color: "#1a1a2e",
//                 mb: 1
//               }}
//             >
//               {meal.mealName}
//             </Typography>
//             {/* <Typography
//               variant="body2"
//               sx={{
//                 color: "#666",
//                 fontStyle: "italic"
//               }}
//             >
//               {meal.sideDish}
//             </Typography> */}

//             {/* Rating */}
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 mt: 1.5
//               }}
//             >
//               <StarIcon sx={{ color: "#FFD700", fontSize: 18, mr: 0.5 }} />
//               <Typography
//                 variant="body2"
//                 sx={{ fontWeight: 600, color: "#1a1a2e" }}
//               >
//                 {meal.reviews}
//               </Typography>
//               {/* <Typography variant="caption" sx={{ color: "#999", ml: 0.5 }}>
//                 /5.0
//               </Typography> */}
//             </Box>
//           </Box>

//           {/* Stats */}
//           <Box
//             sx={{
//               // display: "grid",
//               // gridTemplateColumns: "1fr 1fr",
//               gap: 2,
//               mb: 3,
//               background: mealStyle.lightColor,
//               p: 2,
//               borderRadius: 2
//             }}
//           >
//             <Box sx={{ textAlign: "center" }}>
//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center"
//                 }}
//               >
//                 <Diversity3Icon sx={{ color: mealStyle.color, mr: 1 }} />
//                 <Box sx={{display:'flex', alignItems:'center',gap:1}}>
//                   <Typography
//                     variant="h6"
//                     sx={{ fontWeight: 700, color: "#1a1a2e" }}
//                   >
//                     {meal.totalPresent}
//                   </Typography>
//                   <Typography variant="caption" sx={{ color: "#666" }}>
//                     Members
//                   </Typography>
//                 </Box>
//               </Box>
//             </Box>

//             {/* <Box sx={{ textAlign: "center" }}>
//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center"
//                 }}
//               >
//                 <FavoriteIcon sx={{ color: mealStyle.color, mr: 1 }} />
//                 <Box>
//                   <Typography
//                     variant="h6"
//                     sx={{ fontWeight: 700, color: "#1a1a2e" }}
//                   >
//                     {meal.favorites}
//                   </Typography>
//                   <Typography variant="caption" sx={{ color: "#666" }}>
//                     Favorites
//                   </Typography>
//                 </Box>
//               </Box>
//             </Box> */}
//           </Box>

//           {/* View button */}
//           <Button
//             fullWidth
//             variant="contained"
//             sx={{
//               background: mealStyle.gradient,
//               borderRadius: 2,
//               py: 1.5,
//               fontWeight: 600,
//               fontSize: "1rem",
//               "&:hover": {
//                 background: mealStyle.gradient,
//                 transform: "translateY(-2px)",
//                 boxShadow: `0 6px 20px ${mealStyle.color}40`
//               },
//               transition: "all 0.2s ease-in-out"
//             }}
//             startIcon={<VisibilityIcon />}
//           >
//             View Details
//           </Button>
//         </CardContent>
//       </Card>
//     );
//   };

//   const StatCard = ({ title, value, icon, color, loading }) => {
//     if (loading) {
//       return (
//         <Card
//           sx={{
//             background: "#f8fafc",
//             color: "white",
//             borderRadius: 3,
//             p: 2.5,
//             height: "100%"
//           }}
//         >
//           <Skeleton variant="rectangular" width="60%" height={30} />
//           <Skeleton variant="text" width="40%" height={20} sx={{ mt: 1 }} />
//         </Card>
//       );
//     }

//     return (
//       <Card
//         sx={{
//           background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
//           color: "white",
//           borderRadius: 3,
//           p: 2.5,
//           boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
//           transition: "transform 0.2s ease-in-out",
//           "&:hover": {
//             transform: "translateY(-3px)"
//           },
//           height: "100%"
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between"
//           }}
//         >
//           <Box>
//             <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
//               {value}
//             </Typography>
//             <Typography variant="body2" sx={{ opacity: 0.9 }}>
//               {title}
//             </Typography>
//           </Box>
//           <Avatar
//             sx={{
//               background: "rgba(255,255,255,0.2)",
//               width: 50,
//               height: 50
//             }}
//           >
//             {React.cloneElement(icon, { sx: { fontSize: 28 } })}
//           </Avatar>
//         </Box>
//       </Card>
//     );
//   };

//   return (
//     <>
//       <Grid sx={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
//         {isMobileScreen ? (
//           <IconSidenav />
//         ) : showSideNav ? (
//           <IconSidenav />
//         ) : (
//           <Sidenav />
//         )}
//         <Grid component="main" sx={{ width: "100%", flex: 1 }}>
//           <Header toggleSideNav={toggleSideNav} />
//           <Box sx={{ p: isMobileScreen ? 2 : 4 }}>
//             <NavigatedComponent pathname={location.pathname} />

//             {/* Page Header */}
//             <Box sx={{ mb: 4, mt: 3 }}>
//               <Typography
//                 variant="h4"
//                 sx={{
//                   fontWeight: 700,
//                   color: "#1a1a2e",
//                   mb: 1,
//                   background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
//                   backgroundClip: "text",
//                   WebkitBackgroundClip: "text",
//                   WebkitTextFillColor: "transparent"
//                 }}
//               >
//                 Today's Meal Overview
//               </Typography>
//               <Typography variant="body1" sx={{ color: "#666", maxWidth: 600 }}>
//                 Discover today's culinary offerings and track meal preferences
//                 across all servings
//               </Typography>
//             </Box>

//             {loading && <LinearProgress sx={{ mb: 3, borderRadius: 2 }} />}


//             {/* Stats Summary */}
//             <Grid container spacing={2} sx={{ mb: 4 }}>
//               <Grid item xs={12} sm={3}>
//                 <StatCard
//                   title="Total Members"
//                   value={statsData[0]?.totalMembers || 0}
//                   icon={<Diversity3Icon />}
//                   color="#667eea"
//                   loading={loading}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={3}>
//                 <StatCard
//                   title="Total Present"
//                   value={statsData[0]?.totalPresent || 0}
//                   icon={<CheckCircleIcon />}
//                   color="#4caf50" // ✅ Green for Present
//                   loading={loading}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={3}>
//                 <StatCard
//                   title="Total Absent"
//                   value={statsData[0]?.totalAbsent || 0}
//                   icon={<CancelIcon />}
//                   color="#f44336" // ✅ Red for Absent
//                   loading={loading}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={3}>
//                 <StatCard
//                   title="Satisfaction Rate"
//                   value={statsData[0]?.satisfactionRate || 0}
//                   icon={<TrendingUpIcon />}
//                   color="#4facfe"
//                   loading={loading}
//                 />
//               </Grid>
//             </Grid>



//             {/* Meal Cards */}
//             <Grid container spacing={3}>
//               {mealData.map((meal, index) => (
//                 <Grid item xs={12} md={4} key={index}>
//                   <MealCard meal={meal} loading={loading} />
//                 </Grid>
//               ))}
//             </Grid>

//             {/* Additional Info */}
//             {!loading && (
//               <Card
//                 sx={{
//                   mt: 4,
//                   borderRadius: 3,
//                   background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
//                   boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
//                   border: "1px solid #e2e8f0"
//                 }}
//               >
//                 <CardContent sx={{ p: 3 }}>
//                   <Typography
//                     variant="h6"
//                     sx={{
//                       fontWeight: 600,
//                       color: "#1a1a2e",
//                       mb: 2,
//                       display: "flex",
//                       alignItems: "center"
//                     }}
//                   >
//                     <StarIcon sx={{ mr: 1.5, color: "#FFD700" }} />
//                     Today's Special Notes
//                   </Typography>
//                   <Typography
//                     variant="body2"
//                     sx={{
//                       color: "#4a5568",
//                       lineHeight: 1.7,
//                       fontSize: "0.95rem"
//                     }}
//                   >
//                     • All meals prepared with fresh, locally sourced ingredients
//                     from trusted suppliers
//                     <br />
//                     • Special dietary requirements accommodated with 24 hours
//                     advance notice
//                     <br />
//                     • Today's featured dessert: Gulab Jamun with Vanilla Bean Ice
//                     Cream
//                     <br />• Serving times: Breakfast 8-10 AM • Lunch 12:30-2 PM •
//                     Dinner 7-9 PM
//                   </Typography>
//                 </CardContent>
//               </Card>
//             )}
//           </Box>
//         </Grid>
//       </Grid>
//     </>
//   );
// };

// export default QuickView;


















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
  DialogActions
} from "@mui/material";
import Sidenav from "../../common/Sidenav";
import Header from "../../common/Header";
import { useLocation } from "react-router-dom";
import NavigatedComponent from "../NavigatedComponent";
import IconSidenav from "../../common/IconSidenav";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { config } from "../../../../../config/config";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import EmojiFoodBeverageIcon from "@mui/icons-material/EmojiFoodBeverage";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { apiList, invokeApi } from "../../../../../services/apiServices";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const QuickView = () => {
  const [cookies] = useCookies();
  const location = useLocation();
  const isMobileScreen = useMediaQuery("(max-width:500px)");
  const [showSideNav, setShowSideNav] = useState(false);
  const [mealData, setMealData] = useState([]);
  const [statsData, setStatsData] = useState([]);
  const [loading, setLoading] = useState(true);

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
          <Button
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
          </Button>
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
            <Box sx={{ mb: 4, mt: 3 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "#1a1a2e",
                  mb: 1,
                  background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}
              >
                Today's Meal Overview
              </Typography>
              <Typography variant="body1" sx={{ color: "#666", maxWidth: 600 }}>
                Discover today's culinary offerings and track meal preferences
                across all servings
              </Typography>
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

             {/* Additional Info */}
             {/* {!loading && (
              <Card
                sx={{
                  mt: 4,
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
                  border: "1px solid #e2e8f0"
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#1a1a2e",
                      mb: 2,
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    <StarIcon sx={{ mr: 1.5, color: "#FFD700" }} />
                    Today's Special Notes
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4a5568",
                      lineHeight: 1.7,
                      fontSize: "0.95rem"
                    }}
                  >
                    • All meals prepared with fresh, locally sourced ingredients
                    from trusted suppliers
                    <br />
                    • Special dietary requirements accommodated with 24 hours
                    advance notice
                    <br />
                    • Today's featured dessert: Gulab Jamun with Vanilla Bean Ice
                    Cream
                    <br />• Serving times: Breakfast 8-10 AM • Lunch 12:30-2 PM •
                    Dinner 7-9 PM
                  </Typography>
                </CardContent>
              </Card>
            )} */}
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

export default QuickView;

