import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    "roles": [],
    "titles": [],
    "departments": [],
    "servants": []
}

export const dictionarySlice = createSlice({
    name: 'dictionaries',
    initialState,
    reducers: {
        setRoles: (state, action) => {
            state.roles = action.payload
        },
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

export const { setRoles, setTitles, setDepartments, setServants } = dictionarySlice.actions

export default dictionarySlice.reducer