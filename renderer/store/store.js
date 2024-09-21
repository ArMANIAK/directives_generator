import { configureStore } from '@reduxjs/toolkit'
import dictionaryReducer from './dictionarySlice'
import pullReducer from './pullSlice'

export const store = configureStore({
    reducer: {
        dictionaries: dictionaryReducer,
        pull: pullReducer
    }
})