"use client";

import { useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import Grid from '@mui/material/Grid2';
import {
    Button,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup
} from "@mui/material";
import {
    ROLES_VAR,
    ROLES_SHEET,
    TITLES_VAR,
    TITLES_SHEET,
    DEPARTMENTS_VAR,
    DEPARTMENTS_SHEET,
    SERVANTS_VAR,
    SERVANTS_SHEET
} from "../../dictionaries/constants";
import { setRoles, setTitles, setDepartments, setServants } from "../../store";
import RolesPage from "./pages/RolesPage";
import TitlesPage from "./pages/TitlesPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import ServantsPage from "./pages/ServantsPage";
import Viewer from "../../components/Viewer";
import { GenerateFullDepartment, GenerateFullTitle, GenerateRankAndName } from "../../utilities/ServantsGenerators";

export default function DictionaryManagementScreen() {

    const initState = {
        roles: {
            id: "",
            name_nominative: "",
            name_dative: "",
            name_accusative: "",
            name_instrumental: ""
        },
        titles: {
            id: "",
            "title_index": "",
            "primary_role": "",
            "primary_department": "",
            "secondary_role": "",
            "secondary_department": "",
        },
        departments: {
            id: "",
            name_nominative: "",
            name_genitive: "",
            parent_id: ""
        },
        servants: {
            "id": "",
            "first_name_nominative": "",
            "first_name_genitive": "",
            "first_name_dative": "",
            "first_name_accusative": "",
            "first_name_instrumental": "",
            "first_name_short": "",
            "last_name_nominative": "",
            "last_name_genitive": "",
            "last_name_dative": "",
            "last_name_accusative": "",
            "last_name_instrumental": "",
            "rank": "",
            "speciality": "",
            "gender": "",
            "supplied_by": "",
            "title_index": "",
            "retired": "ні"
        }
    }

    const headers = {
        roles: [
            {
                label: "Назва ролі",
                eval: row => row.name_nominative,
            }
        ],
        departments: [
            { label: "Назва підрозділу", eval: row => row.name_nominative },
            { label: "Керівний підрозділ", eval: row => GenerateFullDepartment(row.parent_id, "nominative", true) },
        ],
        titles: [
            {
                label: "Індекс посади",
                eval: row => row.title_index
            },
            {
                label: "Назва посади",
                eval: row => GenerateFullTitle(row, "nominative"),
            },
            {
                label: "Підрозділ",
                eval: row => {
                    return GenerateFullDepartment(row.primary_department || row.secondary_department, "nominative", true)
                }
            }
        ],
        servants: [
            { label: "Військовослужбовець / працівник ЗСУ", eval: row => GenerateRankAndName(row.id, "nominative") },
            { label: "Індекс посади", eval: row => row.title_index },
            {
                label: "Підрозділ",
                eval: row => {
                    let titleByIndex = dictionaries.titles.find(el => el.title_index === row.title_index);
                    if (titleByIndex)
                        return GenerateFullDepartment(titleByIndex.primary_department || titleByIndex.secondary_department, "nominative", true)
                    return "";
                }
            }
        ]
    }

    const dispatch = useDispatch();
    const [ dictionaryType, setDictionaryType ] = useState(ROLES_VAR);
    const [ record, setRecord ] = useState(initState[dictionaryType]);
    const [ dictionaries, setDictionaries ] = useState({roles: []});

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

    const dispatcher = dictionary => {
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

    const handleChange = event => {
        let updated = { ...record, [event.target.name]: event.target.value };
        setRecord(updated);
    }

    const saveRecord = () => {
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
        getDictionaries();
        setRecord(initState[dictionaryType]);
    }

    const editRecord = index => () => {
        setRecord({ ...dictionaries[dictionaryType][index] })
    }

    const removeRecord = id => {
        dispatcher(dictionaries[dictionaryType].filter((el, ind) => ind !== parseInt(id)))
        getDictionaries()
    }

    return (
        <Grid padding="30px">
            <Grid marginBottom="30px">
                <FormControl>
                    <RadioGroup
                        row
                        name="dictionaryType"
                        value={ dictionaryType || ROLES_VAR }
                        onChange={ event => setDictionaryType(event.target.value) }
                    >
                        <FormControlLabel
                            value={ ROLES_VAR }
                            control={ <Radio /> }
                            label={ ROLES_SHEET }
                        />
                        <FormControlLabel
                            value={ DEPARTMENTS_VAR }
                            control={ <Radio /> }
                            label={ DEPARTMENTS_SHEET }
                        />
                        <FormControlLabel
                            value={ TITLES_VAR }
                            control={ <Radio /> }
                            label={ TITLES_SHEET }
                        />
                        <FormControlLabel
                            value={ SERVANTS_VAR }
                            control={ <Radio /> }
                            label={ SERVANTS_SHEET }
                        />
                    </RadioGroup>
                </FormControl>
            </Grid>
            {dictionaryType === ROLES_VAR &&
                <RolesPage
                    record={ record }
                    handleChange={ handleChange }
                />
            }
            {dictionaryType === TITLES_VAR &&
                <TitlesPage
                    record={ record }
                    handleChange={ handleChange }
                />
            }
            {dictionaryType === DEPARTMENTS_VAR &&
                <DepartmentsPage
                    record={ record }
                    handleChange={ handleChange }
                />
            }
            {dictionaryType === SERVANTS_VAR &&
                <ServantsPage
                    record={ record }
                    handleChange={ handleChange }
                />
            }
            <Grid marginTop="20px">
                <Button
                    variant="contained"
                    onClick={ saveRecord }>
                    Зберегти запис
                </Button>
            </Grid>
            <Viewer
                recordList={ dictionaries[dictionaryType] }
                editRecord={ editRecord }
                removeRecord={ removeRecord }
                headers={ headers[dictionaryType] }
            />
        </Grid>
    )
}