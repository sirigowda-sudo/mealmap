import axios from "axios";

import { config } from "../config/config";

const packageJson = require("../../package.json");

export const invokeApi = async (url, params, cookies) => {
  try {
    let headers = {};

    if (
      cookies &&
      cookies[config.cookieName] &&
      cookies[config.cookieName].token &&
      cookies[config.cookieName].loginUserId
    ) {
      headers.Authorization = "Bearer " + cookies[config.cookieName].token;

      headers.loginUserId = cookies[config.cookieName].loginUserId;
    }

    return await axios.post(url, params);
  } catch ({ response }) {
    return response;
  }
};

export const apiList = {
  // traffic tracking
  addWebTraffic: "/web/addWebTraffic",

  //change password api
  changePassword: "/user/changePassword",
  
  //User
  userLogin: "/login",
  userAdd: "/addUser",
  getUsers: "/getUsers",
  getUser: "/getUser",
  updateUser: "/updateUser",
  updateUserRoles: "/updateUserRoles",
  deleteUser: "/deleteUser",

  //Password Change
  changePassword: "/changePassword",

  //Grocery
  addGrocery: "/addGrocery",
  getAllGrocery: "/getAllGrocery",
  getGrocery: "/getGrocery",
  upadteGrocery: "/upadteGrocery",
  deleteGrocery: "/deleteGrocery",

  //Lost and Found
  addLostFound: "/addLostFound",
  getAllLostFound: "/getAllLostFound",
  getLostFound: "/getLostFound",
  updateLostFound: "/updateLostFound",
  deleteLostFound: "/deleteLostFound",

  //Menu Adjustment
  getAllMenuAdjustment: "/getAllMenuAdjustment",

  //Daily Menu
  addDailyMenu: "/addDailyMenu",
  getAllDailyMenu: "/getAllDailyMenu",
  getDailyMenu: "/getDailyMenu",
  updateDailyMenu: "/updateDailyMenu",
  deleteDailyMenu: "/deleteDailyMenu",

  //Reviews
  getAllReviews: "/getAllReviews",

  //Quick Overview
  getMenuQuickView: "/getMenuQuickView",
  getUserOverview: "/getUserOverview",

  //Quote
  addQuote: "/addQuote",
  getAllQuotes: "/getAllQuotes",
  getQuote: "/getQuote",
  updateQuote: "/updateQuote",
  deleteQuote: "/deleteQuote",

  //Event Order
  addEventOrder: "/addEventOrder",
  getAllEventOrders: "/getAllEventOrders",
  getEventOrder: "/getEventOrder",
  updateEventOrder: "/updateEventOrder",
  deleteEventOrder: "/deleteEventOrder",

};
