import { createAction, handleActions } from 'redux-actions';
import * as C from '../constants';

// ------------------------------------
// Actions
// ------------------------------------

export const setSearchDataAction = createAction(C.SET_SEARCH_DATA);
export const searchUsersAction = createAction(C.SEARCH_USERS);
export const getUsersInfoAction = createAction(C.GET_UESRS_INFO);
export const sendEmailAction = createAction(C.SEND_EMAIL);

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = {
  language: 'javascript',
  location: '',
  searchUsers: [],
  loading: null,
  gettingStatus: {},
  sendingStatus: {}
};

export default handleActions(
  {
    // ---- set data ----

    [C.SET_SEARCH_DATA]: (state, { payload }) => {
      return {
        ...state,
        ...payload
      };
    },

    // ---- search users ----

    [C.SEARCH_USERS]: state => ({
      ...state,
      searchUsers: [],
      loading: 'search',
      gettingStatus: {},
      sendingStatus: {}
    }),

    [C.SEARCH_USERS_END]: state => ({
      ...state,
      loading: null
    }),

    // ---- get users info ----

    [C.GET_UESRS_INFO]: (state, { payload }) => ({
      ...state,
      loading: 'getting',
      gettingStatus: {
        total: payload.length,
        success: 0,
        failed: 0
      }
    }),

    [C.GET_UESRS_INFO_SUCCESS]: state => {
      return {
        ...state,
        loading: null,
        gettingStatus: {
          ...state.gettingStatus,
          completed: true
        }
      };
    },

    // ---- send email -----

    [C.SEND_EMAIL]: (state, { payload }) => ({
      ...state,
      loading: 'sending',
      sendingStatus: {
        total: payload.length,
        success: 0,
        failed: 0
      }
    }),

    [C.SEND_EMAIL_SUCCESS]: state => {
      return {
        ...state,
        loading: null,
        sendingStatus: {
          ...state.sendingStatus,
          completed: true
        }
      };
    },

    // ---- update user ----

    [C.UPDATE_UESR]: (state, { payload }) => {
      const searchUsers = state.searchUsers.map(item =>
        item.login === payload.login ? Object.assign(item, payload) : item
      );
      return {
        ...state,
        searchUsers
      };
    }
  },
  initialState
);
