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
        clearTempBookRecords: (state) => { state = state.filter(el => !el.from_temp_book) }
    }
});

export const {
    addRow,
    removeRow,
    resetPull,
    clearTempBookRecords
} = pullSlice.actions;

export default pullSlice.reducer;