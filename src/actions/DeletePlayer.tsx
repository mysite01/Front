import React from 'react';
import { createAsyncThunk } from "@reduxjs/toolkit";

const REACT_APP_REST_API_URL = process.env.REACT_APP_REST_API_URL;

export interface TeamData {
    name: string;
    players: string[]
    teamID: string;
}

export interface UnjoinTeamData {
    teamID: string;
    playerID: string;
}

export const unjoinTeamDel = createAsyncThunk(
    "unjoinTeam",
    async (unjoinData: UnjoinTeamData, { rejectWithValue }) => {
        console.log("unjoinTeam.....", unjoinData)
        try {
            const response = await fetch(`http://localhost:3443/api/team/` + unjoinData.teamID, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ playerID: unjoinData.playerID, action: "remove" }), // pass action as "remove"
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            console.log("Allready unjoinTeam.....", unjoinData)
            return await response.json();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);