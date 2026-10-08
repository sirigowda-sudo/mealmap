import actionTypes from "./actionTypes";

export function getUser(params) {
  return {
    type: actionTypes.USER_GET_REQUEST,
    params,
  };
}
export function reset() {
  return {
    type: actionTypes.RESET,
  };
}
