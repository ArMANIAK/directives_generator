"use client";

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Grid from '@mui/material/Grid2';
import {
    Button,
    FormControl,
    MenuItem,
    TextField
} from "@mui/material";
import {
    setPersonnelRecord,
    resetPersonnelRecord,
    addPersonnelServantRecord,
    deletePersonnelServantRecord,
    setRoles,
    setTitles,
    setDepartments,
    setServants,
    setPersonnelRecordArray
} from "../../store";
import RankChangePage from "./pages/RankChangePage";
import generatePersonnelOrder from "../../utilities/PersonnelOrderGenerator";
const ranks = require("../../dictionaries/ranks.json");

const clauses = [
    {
        label: "Присвоєння звання",
        value: "rank_change"
    },
    {
        label: "Перепризначення",
        value: "reassignment"
    },
    {
        label: "В розпорядження",
        value: "subordinate"
    },
    {
        label: "Укладення/продовження контракту",
        value: "contract"
    },
    {
        label: "Прийняття на службу",
        value: "hire"
    },
    {
        label: "Звільнення зі служби",
        value: "retire"
    },
];

const rankList = ranks.map(el => <MenuItem key={el.name_nominative} value={el.id}>{el.name_nominative}</MenuItem>)

export default function PersonnelOrderScreen() {

    const dispatch = useDispatch();
    const record = useSelector(state => state.personnelRecord)
    const [ dictionaries, setDictionaries ] = useState({});
    const [ pull, setPull ] = useState([]);

    useEffect(() => {
        getDictionaries();
    }, []);

    const getDictionaries = () => {
        if (typeof window !== 'undefined' && window.electron) {
            const ipcRenderer = window.electron.ipcRenderer;
            ipcRenderer.invoke('get-dict').then((result) => {
                dispatch(setRoles(result.roles));
                dispatch(setTitles(result.titles));
                dispatch(setDepartments(result.departments));
                dispatch(setServants(result.servants));
                setDictionaries(result);
            }).catch((err) => {
                console.error('Error fetching dictionary:', err);
            });
        }
    }

    const handleChange = event => {
        const { name, value } = event.target;
        dispatch(setPersonnelRecord({ [name]: value }));
    }

    const handleMultipleValueChange = ind => event => {
        const field = event.target.name;
        const value = event.target.value;
        dispatch(setPersonnelRecordArray({
            field,
            index: ind,
            value
        }))
    }

    const addServant = () => {
        dispatch(addPersonnelServantRecord())
    }

    const deleteServant = index => () => {
        dispatch(deletePersonnelServantRecord(index));
    }

    const onSubmit = () => {
        if (record.clause_type === "rank_change") {
            let records = record.servants.map((el, ind) => {
                return {
                    ...record,
                    servant_id: el,
                    VAT: record.VATs[ind],
                    year_of_birth: record.years_of_birth[ind],
                    service_period: record.service_periods[ind],
                }
            })
            setPull(state => [ ...state, ...records ])
        } else setPull(state => [ ...state, record ])
        dispatch(resetPersonnelRecord());
    }

    const generateOrder = () => {
        console.log(pull);
        let text = generatePersonnelOrder(pull);
        console.dir(text)
        window.electron.sendToClipboard(text);
    }

    return (
        <Grid container flexDirection="column" padding="30px" spacing={4} >
            <Grid marginBottom="30px">
                <Grid size={6}>
                    <FormControl fullWidth>
                        <TextField
                            select
                            label="Пункт наказу"
                            name="clause_type"
                            value={ record.clause_type || "" }
                            onChange={ handleChange }
                            slotProps={ { inputLabel: { shrink: true } } }
                        >
                            { clauses.map(el => <MenuItem key={el.value} value={el.value}>{el.label}</MenuItem>) }
                        </TextField>
                    </FormControl>
                </Grid>
            </Grid>
            { record.clause_type === "rank_change" &&
            <RankChangePage
                handleChange={ handleChange }
                addServant={ addServant }
                deleteServant={ deleteServant }
                handleMultipleValueChange={ handleMultipleValueChange }
                rankList={ rankList }
            />}
            <Grid container spacing={2}>
                <Button
                    variant="contained"
                    onClick={ onSubmit }>
                    Додати пункт
                </Button>
                <Button
                    variant="contained"
                    onClick={ generateOrder }>
                    Згенерувати наказ
                </Button>
            </Grid>
        </Grid>
    )
}