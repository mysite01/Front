
import { createAsyncThunk } from "@reduxjs/toolkit";

const REACT_APP_REST_API_URL = process.env.REACT_APP_REST_API_URL;

export interface TeamData {
    playersID: string[];
    amountOfTeam: number;
    nameOfTeam: string;
    host: boolean;

}

export const createNewTeam = createAsyncThunk(
    "createNewTeam",
    async (teamData: TeamData, { rejectWithValue }) => {
        console.log("TeamData.....", teamData);


        try {
            const response = await fetch(`${REACT_APP_REST_API_URL}team`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(teamData),
            });

            if (!response.ok) {
                console.log("WrongDataaaaaaaaa", JSON.stringify({ name: "Wrong", gameId: "1" }))
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);


