"use client";

import { GenerateRankAndName, GetGeneralDepartmentName } from "../utilities/ServantsGenerators";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { getServants } from "../services/ServantsService"

export default function ServantSelector({ value, handleChange }) {
    const servants = getServants();

    let chosenServant = { label: "", id: "" };
    const servantsList = servants ? servants.map(el => {
        const servant = {
            'label' : `${GenerateRankAndName(el.id, 'nominative')} - ${GetGeneralDepartmentName(el.primary_department)}`,
            'id' : el.id
        };
        if (el.id === value) chosenServant = servant;
        return servant;
    }) : [chosenServant];

    const autocompleteChangeHandler = (event, value)  => {
        let id = value ? value.id : undefined;
        handleChange({ ...event, target: { name: "servants", value: id } });
    }

    return (
        <>
            <Autocomplete
                onChange={ autocompleteChangeHandler }
                disablePortal
                value={ chosenServant }
                renderInput={ (params) => <TextField {...params} label="Військовослужбовець/працівник ЗСУ" /> }
                options={ servantsList }
            />
        </>
    )
}