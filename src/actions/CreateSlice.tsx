import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { createNewPlayer } from "./CreateNewPlayer";
import { joinInTeam } from "../actions/JoinTeamGame";
import { unjoinTeamDel } from "./DeletePlayer";
import { authentication } from "./Authentication";
import { register } from "./Register";

export interface UserData {
    id?: number;
    name: string;
    password: string;

}
export interface PlayerData {
    id?: number;
    name: string;
    gameId: string;

}

export interface PlayerState {
    players: PlayerData[];
    loading: boolean;
    error: string | null;
}

export interface TeamData {
    id?: number;
    name: string;
    player: string;
}
// Typen für Authentifizierung
export interface AuthenticationResponse {
    token: string;
    user: {
        id: string;
        name: string;
    };
}

export interface AuthenticationState {
    token: string | null;
    user: { id: string; name: string } | null;
    loading: boolean;
    error: string | null;
    isLoggedIn: boolean;
}

// Gesamter EntityState
export interface EntityState {
    users: UserData[];
    players: PlayerData[];

    teams: TeamData[];
    authen: AuthenticationState;
    loading: boolean;
    error: string | null;
}

// Anfangszustand für das Slice
const initialState: EntityState = {
    users: [],
    players: [],
    teams: [],
    authen: {
        token: null,
        user: null,
        loading: false,
        error: null,
        isLoggedIn: false,
    },
    loading: false,
    error: null,
};




const playerSlice = createSlice({
    name: "players",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(createNewPlayer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createNewPlayer.fulfilled, (state, action: PayloadAction<PlayerData>) => {
                state.loading = false;
                state.players.push(action.payload);
            })
            .addCase(createNewPlayer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(joinInTeam.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(joinInTeam.fulfilled, (state, action: PayloadAction<TeamData>) => {
                state.loading = false;
                state.teams.push(action.payload);
            })
            .addCase(joinInTeam.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(unjoinTeamDel.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(unjoinTeamDel.fulfilled, (state, action: PayloadAction<TeamData>) => {
                state.loading = false;
                state.teams.push(action.payload);
            })
            .addCase(unjoinTeamDel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
        // register
        builder
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action: PayloadAction<UserData>) => {
                state.loading = false;
                state.users.push(action.payload);
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Authentifizierung
        builder
            .addCase(authentication.pending, (state) => {
                state.authen.loading = true;
                state.authen.error = null;
            })
            .addCase(
                authentication.fulfilled,
                (state, action: PayloadAction<AuthenticationResponse>) => {
                    state.authen.loading = false;
                    state.authen.token = action.payload.token;
                    state.authen.user = action.payload.user;
                    state.authen.isLoggedIn = true;
                }
            )
            .addCase(authentication.rejected, (state, action) => {
                state.authen.loading = false;
                state.authen.error = action.payload as string;
                state.authen.isLoggedIn = false;
            });
        builder
            .addCase("auth/logout", (state) => {
                state.authen.token = null;
                state.authen.user = null;
                state.authen.isLoggedIn = false; // Setzt isLoggedIn auf false bei Logout
            });
    },
});

export default playerSlice.reducer;
