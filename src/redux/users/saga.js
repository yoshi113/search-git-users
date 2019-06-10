import { takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';
import * as C from '../constants';

function* getUsers() {
  try {
    const { data } = yield call(axios.get, '/api/get-users');
    yield put({ type: C.GET_USERS_SUCCESS, payload: data.items });
  } catch (error) {
    message.error(error.response.data.error);
    yield put({ type: C.GET_USERS_FAILED });
  }
}

export default function* sagas() {
  yield takeLatest(C.GET_USERS, getUsers);
}
