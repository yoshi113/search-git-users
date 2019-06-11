import { takeLatest, call, put, select } from 'redux-saga/effects';
import axios from 'axios';
import * as C from '../constants';
import { vaildEmail } from '../../utils/helper';

// ---- search users ----

function* searchUsers({ payload }) {
  const { language, location } = payload;
  const q = `type:user+language:${language}${location ? `+location:${location}` : ''}`;
  const redux = yield select();
  const users = redux.users.users;

  let searchUsers = [];
  let page = 1;
  while (true) {
    try {
      const { data } = yield call(
        axios.get,
        `https://api.github.com/search/users?type=users&q=${q}&sort=best+match&per_page=100&page=${page}`
      );

      let items = data.items;
      if (!items.length) break;

      items = items.map(info => {
        const user = users.find(({ login }) => login === info.login);
        if (user) {
          return {
            ...user,
            status: 'sent'
          };
        }
        return {
          login: info.login,
          avatar: info.avatar_url
        };
      });

      searchUsers = searchUsers.concat(items);
      yield put({ type: C.SET_SEARCH_DATA, payload: { searchUsers } });

      page++;
    } catch (error) {
      break;
    }
  }
  yield put({ type: C.SEARCH_USERS_END });
}

// ---- get users info ----

function* getUsersInfo({ payload }) {
  const status = { total: payload.length, success: 0, failed: 0 };

  for (let i = 0; i < payload.length; i++) {
    const login = payload[i].login;
    const user = { login, loading: true };
    yield put({ type: C.UPDATE_UESR, payload: user });

    user.email = '';
    try {
      const { data: info } = yield call(axios.get, `https://api.github.com/users/${login}`);
      user.name = info.name;
      user.location = info.location;
      user.repos = info.public_repos;
      user.followers = info.followers;
      user.following = info.following;
      if (vaildEmail(info.email)) {
        user.email = info.email;
      } else {
        const { data: repors } = yield call(axios.get, info.repos_url);
        repors.sort((a, b) => (new Date(a.updated_at) < new Date(b.updated_at) ? 1 : -1));
        for (let j = 0; j < repors.length; j++) {
          try {
            const { data: commits } = yield call(axios.get, repors[j].commits_url.replace('{/sha}', ''));
            for (let k = 0; k < commits.length; k++) {
              const { author, commit } = commits[k];
              const { email, name } = commit.author;
              if (author) {
                if (author.login !== login) continue;
              } else if (name !== login && name !== user.name) continue;
              if (email.includes('noreply')) continue;
              if (!vaildEmail(email)) continue;
              user.email = email;
              break;
            }
            if (user.email) break;
          } catch (error) {}
        }
      }
    } catch (error) {}

    user.loading = false;
    yield put({ type: C.UPDATE_UESR, payload: user });

    if (user.email) {
      status.success++;
    } else {
      status.failed++;
    }
    yield put({ type: C.SET_SEARCH_DATA, payload: { gettingStatus: { ...status } } });
  }
  yield put({ type: C.GET_UESRS_INFO_SUCCESS });
}

// ---- send email ----

function* sendEmail({ payload }) {
  let sendingStatus = { total: payload.length, success: 0, failed: 0 };
  for (let i = 0; i < payload.length; i++) {
    const info = payload[i];
    const user = { login: info.login, loading: true };
    yield put({ type: C.UPDATE_UESR, payload: user });
    try {
      yield call(axios.post, '/api/add-user', { info });
      user.status = 'sending';
      sendingStatus.success++;
      yield put({ type: C.ADD_USER, payload: info });
    } catch (error) {
      user.status = 'failed';
      sendingStatus.failed++;
    }
    user.loading = false;
    yield put({ type: C.UPDATE_UESR, payload: user });
    yield put({ type: C.SET_SEARCH_DATA, payload: { sendingStatus } });
  }
  yield put({ type: C.SEND_EMAIL_SUCCESS });
}

export default function* sagas() {
  yield takeLatest(C.SEARCH_USERS, searchUsers);
  yield takeLatest(C.GET_UESRS_INFO, getUsersInfo);
  yield takeLatest(C.SEND_EMAIL, sendEmail);
}
