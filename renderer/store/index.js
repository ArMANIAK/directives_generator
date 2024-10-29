import { configureStore } from '@reduxjs/toolkit';
import dictionaryReducer from './slices/dictionarySlice';
import recordSlice from "./slices/recordSlice";
import pullReducer from './slices/pullSlice';
import { setTitles, setDepartments, setServants } from "./slices/dictionarySlice";
import { setRecord, resetRecord, setRecordArray, addServantRecord, deleteServantRecord } from "./slices/recordSlice";

const store = configureStore({
    reducer: {
        dictionaries: dictionaryReducer,
        pull: pullReducer,
        record: recordSlice
    }
})

export {
    store,
    setTitles,
    setDepartments,
    setServants,
    setRecord,
    resetRecord,
    setRecordArray,
    addServantRecord,
    deleteServantRecord
}