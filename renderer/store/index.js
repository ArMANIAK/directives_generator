import { configureStore } from '@reduxjs/toolkit';
import dictionaryReducer from './slices/dictionarySlice';
import recordSlice from "./slices/recordSlice";
import pullReducer from './slices/pullSlice';
import personnelRecordSlice from './slices/personnelRecordSlice';
import { setRoles, setTitles, setDepartments, setServants } from "./slices/dictionarySlice";
import { setRecord, resetRecord, setRecordArray, addServantRecord, deleteServantRecord } from "./slices/recordSlice";
import { addRow, removeRow, resetPull, clearTempBookRecords } from "./slices/pullSlice";
import { setPersonnelRecord, resetPersonnelRecord, setPersonnelRecordArray, addPersonnelServantRecord, deletePersonnelServantRecord } from "./slices/personnelRecordSlice";

const store = configureStore({
    reducer: {
        dictionaries: dictionaryReducer,
        pull: pullReducer,
        record: recordSlice,
        personnelRecord: personnelRecordSlice
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
    clearTempBookRecords,
    setPersonnelRecord,
    resetPersonnelRecord,
    setPersonnelRecordArray,
    addPersonnelServantRecord,
    deletePersonnelServantRecord
}