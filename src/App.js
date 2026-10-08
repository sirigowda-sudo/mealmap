import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { CookiesProvider } from "react-cookie";
import React from "react";
import store from "./global/redux/store";
import DashBoard from "./components/pages/dashboard/pages/DashBoard";
import ProtectedRoute from "./page-restriction/ProtectedRoute";
import MyProfile from "./components/pages/dashboard/pages/MyProfile";

import Login from "./authentication/login/Login";
import QuickView from "./components/pages/dashboard/pages/serveNow/QuickView";
import DetailedView from "./components/pages/dashboard/pages/serveNow/DetailedView";
import TodaysDish from "./components/pages/dashboard/pages/dishOfDay/TodaysDish";
import DishHistory from "./components/pages/dashboard/pages/dishOfDay/DishHistory";
import Grocery from "./components/pages/dashboard/pages/groceryItems/Grocery";
import LostAndFound from "./components/pages/dashboard/pages/Lost&Found/LostAndFound";
import Reviews from "./components/pages/dashboard/pages/ReviewsItems/Reviews";
import UsersList from "./components/pages/dashboard/pages/usersManager/UsersList";
import QuoteList from "./components/pages/dashboard/pages/quoteManager/QuoteList";
import EventOrderList from "./components/pages/dashboard/pages/eventOrderManager/EventOrderList";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";

function App() {
  return (
    <div style={{ fontFamily: `"Open Sans", sans-serif` }}>
      <CookiesProvider>
        <Provider store={store}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>

          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashBoard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/serve-now/quick-view"
                exact
                element={
                  <ProtectedRoute>
                    <QuickView />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/serve-now/detailed-view"
                exact
                element={
                  <ProtectedRoute>
                    <DetailedView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dish-of-day/todays-dish"
                exact
                element={
                  <ProtectedRoute>
                    <TodaysDish />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dish-of-day/dish-history"
                exact
                element={
                  <ProtectedRoute>
                    <DishHistory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/event-order"
                exact
                element={
                  <ProtectedRoute>
                    <EventOrderList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quote"
                exact
                element={
                  <ProtectedRoute>
                    <QuoteList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/grocery"
                exact
                element={
                  <ProtectedRoute>
                    <Grocery />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/lost-and-found"
                exact
                element={
                  <ProtectedRoute>
                    <LostAndFound />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reviews"
                exact
                element={
                  <ProtectedRoute>
                    <Reviews />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users-manager/users"
                exact
                element={
                  <ProtectedRoute>
                    <UsersList />
                  </ProtectedRoute>
                }
              />


              <Route
                path="/myprofile"
                element={
                  <ProtectedRoute>
                    <MyProfile />
                  </ProtectedRoute>
                }
              />

            </Routes>
          </BrowserRouter>
          </LocalizationProvider>
        </Provider>
      </CookiesProvider>
    </div>
  );
}

export default App;
