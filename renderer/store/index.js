import { configureStore } from '@reduxjs/toolkit';
import dictionaryReducer from './slices/dictionarySlice';
import recordSlice from "./slices/recordSlice";
import pullReducer from './slices/pullSlice';
import { setRoles, setTitles, setDepartments, setServants } from "./slices/dictionarySlice";
import { setRecord, resetRecord, setRecordArray, addServantRecord, deleteServantRecord } from "./slices/recordSlice";
import { addRow, removeRow, resetPull, clearTempBookRecords } from "./slices/pullSlice";

const store = configureStore({
    reducer: {
        dictionaries: dictionaryReducer,
        pull: pullReducer,
        record: recordSlice
    }
})

export {
    store,
    setRoles,
    setTitles,
    setDepartments,
    setServants,
    setRecord,
    resetRecord,
    setRecordArray,
    addServantRecord,
    deleteServantRecord,
    addRow,
    removeRow,
    resetPull,
    clearTempBookRecords
}