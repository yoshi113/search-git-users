import { all } from 'redux-saga/effects';

import search from './search/saga';
import users from './users/saga';

export default function*() {
  yield all([search(), users()]);
}
