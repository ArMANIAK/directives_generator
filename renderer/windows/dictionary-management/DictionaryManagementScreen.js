"use client";

import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import {
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup
} from "@mui/material";
import {  GenerateFullTitle } from "../../utilities/ServantsGenerators";
import { TITLES_VAR, TITLES_SHEET, DEPARTMENTS_VAR, DEPARTMENTS_SHEET, SERVANTS_VAR, SERVANTS_SHEET } from "../../dictionaries/constants";
import TitlesPage from "./pages/TitlesPage";
import { setDepartments, setServants, setTitles } from "../../store";
import { useDispatch } from "react-redux";

export default function DictionaryManagementScreen() {

    const dispatch = useDispatch();
    const [ dictionaryType, setDictionaryType ] = useState(TITLES_VAR);
    const [ dictionaries, setDictionaries ] = useState({});

    useEffect(() => {
        if (typeof window !== 'undefined' && window.electron) {
            const ipcRenderer = window.electron.ipcRenderer;

            ipcRenderer.invoke('get-dict').then((result) => {
                dispatch(setTitles(result.titles));
                dispatch(setDepartments(result.departments));
                dispatch(setServants(result.servants));
                setDictionaryType(TITLES_VAR);
                setDictionaries(result);
            }).catch((err) => {
                console.error('Error fetching dictionary:', err);
            });
        }
    }, [dictionaries]);

    const dispatcher = dictionary => {
        console.log("SAVING DICT", dictionary)
        const ipcRenderer = window.electron.ipcRenderer;
        ipcRenderer.invoke("save-dict", { dictionaryType, dictionary })
            .then(() => {
                setDictionaries(state => ({
                    ...state,
                    [ dictionaryType ]: dictionary
                }))
            })
            .catch((err) => {
                console.error(`Error saving ${dictionaryType} dictionary:`, err);
            });
    }
    const saveRecord = record => {
        let dictionary = [ ...dictionaries[dictionaryType] ];
        if (!record.id) {
            let lastID = dictionary.at(-1).id;
            record.id = parseInt(lastID) + 1;
            dictionary.push(record);
        } else {
            for (let ind in dictionary) {
                if (dictionary[ind].id === record.id)
                    dictionary[ind] = record
            }
        }
        dispatcher(dictionary);
    }

    const removeRecord = id => () => {
        dispatcher(dictionaries[dictionaryType].filter((el, ind) => ind !== parseInt(id)))
    }

    return (
        <Grid padding="30px">
            <Grid marginBottom="30px">
                <FormControl>
                    <RadioGroup
                        row
                        name="dictionaryType"
                        value={ dictionaryType }
                        onChange={ event => setDictionaryType(event.target.value) }
                    >
                        <FormControlLabel
                            value={ TITLES_VAR }
                            control={ <Radio /> }
                            label={ TITLES_SHEET }
                        />
                        <FormControlLabel
                            value={ DEPARTMENTS_VAR }
                            control={ <Radio /> }
                            label={ DEPARTMENTS_SHEET }
                        />
                        <FormControlLabel
                            value={ SERVANTS_VAR }
                            control={ <Radio /> }
                            label={ SERVANTS_SHEET }
                        />
                    </RadioGroup>
                </FormControl>
            </Grid>
            {dictionaryType === TITLES_VAR &&
                <TitlesPage
                    saveRecord={ saveRecord }
                    removeRecord={ removeRecord }
                />
            }
        </Grid>
    )
}