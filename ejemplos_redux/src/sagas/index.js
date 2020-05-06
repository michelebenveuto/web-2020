import { fork, all } from 'redux-saga/effects';

import { watchLoginStarted } from './auth';
import { watchSayHappyBirthday } from './happyBirthday';
import { watchStartAddingPetOwner,watchStartDeletingPetOwner,watchStartFechingPetOwner } from './petOwners';


function* mainSaga() {
  yield all([
    fork(watchLoginStarted),
    fork(watchSayHappyBirthday),
    fork(watchStartAddingPetOwner),
    fork(watchStartDeletingPetOwner),
    fork(watchStartFechingPetOwner,)
  ]);
}


export default mainSaga;
