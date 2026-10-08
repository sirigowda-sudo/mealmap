import { combineReducers } from "redux";
import { userReducer } from "./userProfile.reducers";

const combineReducer = combineReducers({
  userReducer,
});

const rootReducer = (state, action) => {
  return combineReducer(state, action);
};

export default rootReducer;
