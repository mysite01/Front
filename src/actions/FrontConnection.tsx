import React from 'react';
import { createAsyncThunk } from "@reduxjs/toolkit";

const REACT_APP_REST_API_URL = process.env.REACT_APP_REST_API_URL;

const fetchData = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/data`, {
      method: 'GET',
      credentials: 'include',  // Falls du Cookies benötigst (z.B. für Authentifizierung)
    });
  
    const data = await response.json();
    console.log(data);  // Die Antwort vom Backend anzeigen
  };
  
  fetchData();
  