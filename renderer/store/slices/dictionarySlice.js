import {  createSlice, current } from '@reduxjs/toolkit'

const initialState = {
    "titles": [],
    "departments": [],
    "servants": []
}

export const dictionarySlice = createSlice({
    name: 'dictionaries',
    initialState,
    reducers: {
        setTitles: (state, action) => {
            state.titles = action.payload
        },
        setDepartments: (state, action) => {
            state.departments = action.payload
        },
        setServants: (state, action) => {
            state.servants = action.payload
        }
    }
})

export const { setTitles, setDepartments, setServants } = dictionarySlice.actions

export default dictionarySlice.reducer