import { createAction, handleActions } from 'redux-actions';
import * as C from '../constants';

// ------------------------------------
// Actions
// ------------------------------------

export const getUsersAction = createAction(C.GET_USERS);
export const addUserAction = createAction(C.ADD_USER);

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = {
  users: null,
  loadingUsers: false
};

export default handleActions(
  {
    // ---- get users ----

    [C.GET_USERS]: state => ({
      ...state,
      loadingUsers: true
    }),

    [C.GET_USERS_SUCCESS]: (state, { payload }) => ({
      ...state,
      loadingUsers: false,
      users: payload
    }),

    [C.GET_USERS_FAILED]: state => ({
      ...state,
      loadingUsers: false,
      users: []
    }),

    // ---- add user ----

    [C.ADD_USER]: (state, { payload }) => {
      let users = state.users.slice();
      const user = users.find(user => user.login === payload.login);
      if (!user) {
        users.push({
          login: payload.login,
          avatar: payload.avatar,
          name: payload.name,
          location: payload.location,
          repos: payload.public_repos,
          followers: payload.followers,
          following: payload.following,
          emails: [payload.email]
        });
      } else {
        if (!user.emils.includes(payload.email)) {
          user.emails.add(payload.email);
        }
      }
      return {
        ...state,
        users
      };
    }
  },
  initialState
);
