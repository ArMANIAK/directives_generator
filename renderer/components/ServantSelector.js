"use client";

import { GenerateRankAndName, GetGeneralDepartmentName } from "../utilities/ServantsGenerators";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import { Box } from "@mui/material";
import { getServants } from "../services/ServantsService"
import { useState } from "react";


const style = {
    width: "30%",
    position: "absolute",
    top: "30%",
    left: "35%",
    backgroundColor: "white",
    padding: "50px",
}
export default function ServantSelector({ value, handleChange, absentServants }) {
    const servants = getServants();

    const [ isDepartAbsentWarningOpen, setDepartWarningState ] = useState(false);
    const [ currentServantState, setCurrentServantState]  = useState("");
    const handleCloseWarning = event => {
        setDepartWarningState(false);
        setCurrentServantState("");
    }

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
        if (!absentServants) return
        let currentDuties = absentServants.filter(el => el.servant_id === id);
        if (currentDuties.length > 0) {
            setDepartWarningState(true)
            let message = currentDuties.reduce((text, el) => {
                text += `${GenerateRankAndName(el.servant_id, "nominative")} тимчасово відсутній.\nТип зайнятості: ${el.absence_type}\n`;
                if (el.destination) text += `Вибув до ${el.destination}\n`;
                text += `Запланована дата повернення ${el.planned_date_end}\n`
                return text;
            }, "");
            setCurrentServantState(message)
        }
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
            <Modal
                open={ isDepartAbsentWarningOpen }
                onClose={ handleCloseWarning }
            >
                <Box style={style}>
                    { currentServantState }
                </Box>
            </Modal>
        </>
    )
}