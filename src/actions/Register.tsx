import React from 'react';
import { createAsyncThunk } from "@reduxjs/toolkit";

const REACT_APP_REST_API_URL = process.env.REACT_APP_REST_API_URL;

export interface userData {

    name: string;
    password: string;

}

export const register = createAsyncThunk(
    "register",
    async (userData: userData, { rejectWithValue }) => {
        console.log("userData.....userData...", userData);
        try {
            const response = await fetch(`${REACT_APP_REST_API_URL}user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                console.log("WrongDataaaaaaaaa", JSON.stringify({ name: "Wrong", gameId: "1" }))
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            console.log("TeamDataa response.........", response)
            const data = await response.json();
            console.log("Data after save on database", data)
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);


