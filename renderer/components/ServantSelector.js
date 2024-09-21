"use client";

import { GenerateName, GetGeneralDepartmentName } from "../utilities/ServantsGenerators";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { store } from "../store/store"

export default function ServantSelector({ handleChange }) {
    const servants = store.getState().dictionaries.servants;

    const servantsList = servants ? servants.map(el => {
        return {
            'label' : `${GenerateName(el.id, 'nominative')} - ${GetGeneralDepartmentName(el.primary_department)}`,
            'id' : el.id
        }
    }) : [{ label: "", id: "" }]
    const autocompleteChangeHandler = (event, value)  => {
        handleChange({...event, target: { name: "servant", value: value.id }})
    }

    return (
        <Autocomplete
            onChange={autocompleteChangeHandler}
            disablePortal
            renderInput={(params) => <TextField {...params} label="Військовослужбовець/працівник ЗСУ" />}
            options={servantsList}
        />
    )
}