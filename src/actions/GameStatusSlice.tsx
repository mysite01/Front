import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GameStatusState {
  isGameStarted: boolean;
}

const initialState: GameStatusState = {
  isGameStarted: false,
};

const gameStatusSlice = createSlice({
  name: 'gameStatus',
  initialState,
  reducers: {
    startGame(state) {
      state.isGameStarted = true;
    },
    resetGame(state) {
      state.isGameStarted = false;
    },
  },
});

export const { startGame, resetGame } = gameStatusSlice.actions;

export default gameStatusSlice.reducer;
