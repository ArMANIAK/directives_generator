import {  createSlice } from '@reduxjs/toolkit'

export const pullSlice = createSlice({
    name: "pull",
    initialState: [],
    reducers: {
        addRow: (state, action) => {
            state.push(...action.payload)
        },
        removeRow: (state, action) => {
            return state.filter((el, ind) => ind !== action.payload)
        },
        resetPull: () => [],
    }
});

export const { addRow, removeRow, resetPull } = pullSlice.actions;

export default pullSlice.reducer;