import React from 'react';
import { createAsyncThunk } from "@reduxjs/toolkit";

const REACT_APP_REST_API_URL = process.env.REACT_APP_REST_API_URL;

export interface GameInstanceData {
    nameGameInstance: string;
    gameId: string;
    startTime: number;
    endTime: number;
    teamsID: string[]

}

export interface GameInstanceState {
    gameInstance: GameInstanceData[];
    loading: boolean;
    error: string | null;
}


export const createGameInstance = createAsyncThunk(
    "createGameInstance",
    async (GameInstanceData: GameInstanceData, { rejectWithValue }) => {

        try {
            const response = await fetch(`${REACT_APP_REST_API_URL}gameInstance`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(GameInstanceData),
            });

            if (!response.ok) {
                console.log("plyerplayerDataaaaaaaaa", JSON.stringify({ name: "Wrong", gameId: "1" }))
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            console.log("plyerplayerDataa", JSON.stringify(GameInstanceData))
            return await response.json();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);


