import { createAsyncThunk } from "@reduxjs/toolkit";
const REACT_APP_REST_API_URL = process.env.REACT_APP_REST_API_URL;

export interface TeamData {
    nickName: string;
    playerID: string;
    teamId: string;
}

export interface UnjoinTeamData {
    teamId: string;
    playerID: string;
}

export const joinInTeam = createAsyncThunk(
    "joinInTeam",
    async (teamData: TeamData, { rejectWithValue }) => {

        try {
            const response = await fetch(`http://localhost:3443/api/player/` + teamData.playerID, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(teamData),

            });

            if (!response.ok) {
                console.log("....Wrong Wrong.....", JSON.stringify(teamData))
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return await response.json();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);



export const unjoinTeam = createAsyncThunk(
    "unjoinTeam",
    async (unjoinData: UnjoinTeamData, { rejectWithValue }) => {

        try {
            const response = await fetch(`http://localhost:3443/api/player/` + unjoinData.playerID, {
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