import React from 'react';
import { createAsyncThunk } from "@reduxjs/toolkit";

const REACT_APP_REST_API_URL = process.env.REACT_APP_REST_API_URL;

export interface PlayerData {
    id?: number;
    nickName: string;
    host: boolean;

}

export interface PlayerState {
    players: PlayerData[];
    loading: boolean;
    error: string | null;
}


export const createNewPlayer = createAsyncThunk(
    "createNewPlayer",
    async (playerData: PlayerData, { rejectWithValue }) => {

        try {
            const response = await fetch(`${REACT_APP_REST_API_URL}player`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(playerData),
            });

            if (!response.ok) {
                console.log("plyerplayerDataaaaaaaaa", JSON.stringify({ name: "Wrong", host: "1" }))
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            console.log("plyerplayerDataa", JSON.stringify(playerData))
            return await response.json();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);


