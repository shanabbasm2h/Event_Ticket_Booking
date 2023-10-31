import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  events: [],
  reservations: [],
  location: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setEvents: (state, action) => {
      // const updatedEvents = state.events.map((event) => {
      //   if (event._id === action.payload.event._id)
      //     return action.payload.event;
      //   return event;
      // });
      state.events = action.payload.events;
    },
    setLocations: (state, action) => {
      state.locations = action.payload.locations;
    },
    setReservations: (state, action) => {
      state.reservations = action.payload.reservations;
    },
  },
});
export const {
  setLogin,
  setLogout,
  setEvents,
  setReservations,
  setLocations,
} = authSlice.actions;
export default authSlice.reducer;
