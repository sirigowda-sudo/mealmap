import { call, put } from "redux-saga/effects";
import actionTypes from "../actionTypes";
import { config } from "../../../config/config";
import { invokeApi, apiList } from "../../../services/apiServices";

export const getUserSaga = function* (action) {
  let { id } = action.params;

  let params = {
    id,
  };

  const response = yield call(
    invokeApi,
    config.mealMap + apiList.getUser,
    params,
    action.params.cookies
  );

  if (response?.status >= 200 && response?.status < 300) {
    if (response.data.responseCode === "200") {
      yield put({
        type: actionTypes.USER_GET_SUCCESS,
        data: response.data,
      });
    } else {
      yield put({
        type: actionTypes.USER_GET_FAILURE,
        data: response.data,
      });
    }
  } else if (response?.status === 401) {
    yield put({
      type: actionTypes.USER_LOGOUT,
    });
  } else {
    yield put({
      type: actionTypes.USER_GET_FAILURE,
    });
  }
};
