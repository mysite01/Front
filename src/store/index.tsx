import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import playerReducer from '../actions/CreateSlice';
import extraReducers from '../actions/CreateSlice';
import joinInTeamReducer from '../actions/CreateSlice';
import gameStatusReducer from '../actions/GameStatusSlice';
import authentication from '../actions/CreateSlice';

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

const store = configureStore({
  reducer: {
    players: playerReducer,
    extraReducers: extraReducers,
    joinInTeam: joinInTeamReducer,
    gameStatus: gameStatusReducer,
    authentication: authentication,

  },

});
export type RootState = ReturnType<typeof store.getState>;


export const useAppDispatch = () => useDispatch<AppDispatch>();
//export const useAppSelector = useSelector;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export type AppDispatch = typeof store.dispatch;

export default store;
