import {
    call,
    takeEvery,
    put,
    // race,
    // all,
    delay,
    select,
} from 'redux-saga/effects';
import {v4} from 'uuid';

import * as selectors from '../reducers';
import * as actions from '../actions/petOwners';
import * as types from '../types/petOwners'

  
const API_BASE_URL = 'http://localhost:8000/api/v1';

function* fetchPetOwners(action){
  try {
    const isAuth = yield select(selectors.isAuthenticated);
    if(isAuth){
      const token = yield select(selectors.getAuthToken);

      const response = yield call (
        fetch,
        `${API_BASE_URL}/owners/`,
        {
          method: 'GET',
          headers:{
            'Content-Type': 'application/json',
            'Authorization':`JWT ${token}`,
          }
        }
      );
      if (response.status === 200){
        const { data } = yield response.json();
        let entities = {};
        let order = {};
        data.forEach(element => {
          const id = v4();
          entities = {...entities,[id]:element}
          order = [...order, id]
        });
        yield put(actions.completeFetchingPetOwners(entities,order))
      }
      else{
        const {error} = yield response.json();
        yield put(actions.failFetchingPetOwners(error))
      }
    }
  } catch (error) {
    yield put(actions.failAddingPetOwner('Error'))
  }
}

export function* watchStartFechingPetOwner(){
  yield takeEvery(
    types.PET_OWNERS_FETCH_STARTED,
    fetchPetOwners
  )
}

function* addPetOwner(action){
  try {
    const isAuth = yield select(selectors.isAuthenticated);
    if(isAuth){
      const token = yield select(selectors.getAuthToken)
      const response = yield call(
        fetch,
        `${API_BASE_URL}/owners/`,
        {
          method: 'POST',
          body : JSON.stringify(action.payload),
          headers:{
            'Content-Type': 'application/json',
            'Authorization':`JWT ${token}`,
          }
        }
      );
      const id = v4()
      if(response.status===200){
        const{addedOwner} = yield response.json();
        yield put(actions.completeAddingPetOwner(id,addedOwner))
      }
      else{
        const {error} = yield response.json();
        yield put(actions.failAddingPetOwner(id,error))
      }
    }
  } catch (error) {
    yield error
  }
}

export function* watchStartAddingPetOwner(){
  yield takeEvery(
    types.PET_OWNER_ADD_STARTED,
    addPetOwner
  )
}

function* removePetOwner(action){
  try {
    const isAuth = yield select(selectors.isAuthenticated);
    if(isAuth){
      const token = yield select(selectors.getAuthToken)
      const response = yield call(
        fetch,
        `${API_BASE_URL}/owners/`,
        {
          method: 'DELETE',
          body : JSON.stringify(action.payload),
          headers:{
            'Content-Type': 'application/json',
            'Authorization':`JWT ${token}`,
          }
        }
      );
      
      if(response.status===200){
        yield put(actions.completeRemovingPetOwner)
      }
      else{
        const{error} = response.json();
        yield put(actions.failRemovingPetOwner(action.payload, error))
      }
    }
  } catch (error) {
    yield response.json()
  }
}

export function* watchStartDeletingPetOwner(){
  yield takeEvery(
    types.PET_OWNER_REMOVE_STARTED,
    removePetOwner
  )
}