import { configureStore } from '@reduxjs/toolkit'
import dictionaryReducer from './slices/dictionarySlice'
import pullReducer from './slices/pullSlice'
import { setTitles, setDepartments, setServants } from "./slices/dictionarySlice";

const store = configureStore({
    reducer: {
        dictionaries: dictionaryReducer,
        pull: pullReducer
    }
})

export { store, setTitles, setDepartments, setServants }