import { all, takeEvery } from "redux-saga/effects";
import actionTypes from "../actionTypes";
import { getUserSaga } from "./userProfile.sagas";

export default function* rootSaga() {
  yield all([takeEvery(actionTypes.USER_GET_REQUEST, getUserSaga)]);
}
