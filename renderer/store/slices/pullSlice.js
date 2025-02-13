import {  createSlice } from '@reduxjs/toolkit'

export const pullSlice = createSlice({
    name: "pull",
    initialState: [],
    reducers: {
        addRow: (state, action) =>  [ ...state, ...action.payload ],
        removeRow: (state, action) => {
            state.splice(action.payload, 1)
        },
        resetPull: () => [],
        clearTempBookRecords: (state) =>  [ ...state.filter(el => !el.from_temp_book) ],
    }
});

export const {
    addRow,
    removeRow,
    resetPull,
    clearTempBookRecords
} = pullSlice.actions;

export default pullSlice.reducer;