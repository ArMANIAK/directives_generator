import Grid from "@mui/material/Grid2";
import { TextField, Button, Checkbox, FormControlLabel } from "@mui/material";
import { useState } from "react";
import DictionaryViewer from "../../../components/DictionaryViewer";
import { SERVANTS_VAR } from "../../../dictionaries/constants";
import {
    GenerateFullDepartment,
    GenerateRankAndName,
    GenerateRankName
} from "../../../utilities/ServantsGenerators";
import Selector from "../../../components/Selector";
import { useSelector } from "react-redux";

export default function ServantsPage({ saveRecord, removeRecord }) {

    const initState = {
        "id": undefined,
        "first_name_nominative": "",
        "first_name_genitive": "",
        "first_name_dative": "",
        "first_name_accusative": "",
        "first_name_short": "",
        "last_name_nominative": "",
        "last_name_genitive": "",
        "last_name_dative": "",
        "last_name_accusative": "",
        "rank": "",
        "speciality": "",
        "gender": "",
        "primary_title": "",
        "primary_department": "",
        "secondary_title": "",
        "secondary_department": "",
        "supplied_by": "",
        "title_index": "",
        "retired": "ні"
    };

    const [ servant, setServant ] = useState(initState);

    const ranks = require("../../../dictionaries/ranks.json");
    const ranksList = ranks.map(el => ({ label: el.name_nominative, value: el.id }))

    const departments = useSelector(state => state.dictionaries.departments);
    const departmentsList = departments.map(el => ({ label: el.name_nominative, value: el.id }))

    const titles = useSelector(state => state.dictionaries.titles);
    const titlesList = titles.map(el => ({ label: el.name_nominative, value: el.id }))

    const handleChange = event => {
        let updated = { ...servant, [event.target.name]: event.target.value };
        setServant(updated);
    }

    const handleCheckBoxChange = event => {
        const { target: { name, checked } } = event;
        const updatedRecord = {
            ...servant,
            [name]: checked ? "так" : "ні"
        }
        setServant(updatedRecord);
    }
    const handleSubmit = () => {
        let updatedRecord = { ...servant }
        saveRecord(updatedRecord)
        setServant(initState)
    }

    const editRecord = record => {
        setServant({ ...record })
    }

    const headers = [
        { label: "Військовослужбовець / працівник ЗСУ", eval: row => GenerateRankAndName(row.id, "nominative") },
        { label: "Підрозділ", eval: row => GenerateFullDepartment(row.primary_department || row.secondary_department, "nominative", true) },
    ];

    const generateServantPreview = () => {
        let result = `${GenerateRankName(servant.rank, servant.speciality, "nominative")} ${servant.last_name_nominative} ${servant.first_name_short}`;
        const isFullDepartment = servant.primary_department && servant.secondary_department;
        const firstTitle = titles.find(el => parseInt(el.id) === parseInt(servant.primary_title));
        if (firstTitle)
            result += ", " + firstTitle['name_nominative'];
        if (servant.primary_department)
            result += " " + GenerateFullDepartment(servant.primary_department, "genitive", isFullDepartment)
        if (servant.secondary_title) {
            const secondTitle = titles.find(el => parseInt(el.id) === parseInt(servant.secondary_title));
            if (secondTitle)
                result += " - " + secondTitle['name_nominative'] + " ";
            if (servant.secondary_department)
                result += " " + GenerateFullDepartment(servant.secondary_department, "genitive");
        }
        return result;
    }

    return (
        <Grid direction={'column'} container spacing={2}>
            <Grid container>
                <Grid size={5}>
                    <TextField
                        fullWidth
                        label="Імʼя та по батькові в називному відмінку"
                        name="first_name_nominative"
                        placeholder="Ігор Петрович"
                        value={ servant.first_name_nominative }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
                <Grid size={5}>
                    <TextField
                        fullWidth
                        label="Імʼя та по батькові в родовому відмінку"
                        name="first_name_genitive"
                        placeholder="Ігоря Петровича"
                        value={ servant.first_name_genitive }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid size={5}>
                    <TextField
                        fullWidth
                        label="Імʼя та по батькові в давальному відмінку"
                        name="first_name_dative"
                        placeholder="Ігорю Петровичу"
                        value={ servant.first_name_dative }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
                <Grid size={5}>
                    <TextField
                        fullWidth
                        label="Імʼя та по батькові в знахідному відмінку"
                        name="first_name_accusative"
                        placeholder="Ігоря Петровича"
                        value={ servant.first_name_accusative }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
                <Grid size={2}>
                    <TextField
                        fullWidth
                        label="Ініціали"
                        name="first_name_short"
                        placeholder="І.П."
                        value={ servant.first_name_short }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid size={5}>
                    <TextField
                        fullWidth
                        label="Прізвище в називному відмінку"
                        name="last_name_nominative"
                        placeholder="ТІТІКАКА"
                        value={ servant.last_name_nominative }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
                <Grid size={5}>
                    <TextField
                        fullWidth
                        label="Прізвище в родовому відмінку"
                        name="last_name_genitive"
                        placeholder="ТІТІКАКИ"
                        value={ servant.last_name_genitive }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid size={5}>
                    <TextField
                        fullWidth
                        label="Прізвище в давальному відмінку"
                        name="last_name_dative"
                        placeholder="ТІТІКАЦІ"
                        value={ servant.last_name_dative }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
                <Grid size={5}>
                    <TextField
                        fullWidth
                        label="Прізвище в знахідному відмінку"
                        name="last_name_accusative"
                        placeholder="ТІТІКАКУ"
                        value={ servant.last_name_accusative }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
                <Grid size={2}>
                    <TextField
                        fullWidth
                        label="Гендер"
                        name="gender"
                        value={ servant.gender }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid size={5}>
                    <Selector
                        handleChange={ handleChange }
                        label="Військове звання / працівник ЗСУ"
                        list={ ranksList }
                        name="rank"
                        value={ servant.rank }
                    />
                </Grid>
                <Grid size={5}>
                    <TextField
                        fullWidth
                        label="Спеціальне звання в родовому відмінку"
                        placeholder="медичної служби, юстиції, тощо"
                        name="speciality"
                        value={ servant.speciality }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid size={5}>
                    <Selector
                        handleChange={ handleChange }
                        label="Первинна посада"
                        list={ titlesList }
                        name="primary_title"
                        value={ servant.primary_title }
                    />
                </Grid>
                <Grid size={5}>
                    <Selector
                        handleChange={ handleChange }
                        label="Підрозділ первинної посади"
                        list={ departmentsList }
                        name="primary_department"
                        value={ servant.primary_department }
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid size={5}>
                    <Selector
                        handleChange={ handleChange }
                        label="Вторинна посада"
                        list={ titlesList }
                        name="secondary_title"
                        value={ servant.secondary_title }
                    />
                </Grid>
                <Grid size={5}>
                    <Selector
                        handleChange={ handleChange }
                        label="Підрозділ вторинної посади"
                        list={ departmentsList }
                        name="secondary_department"
                        value={ servant.secondary_department }
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid size={8}>
                    <TextField
                        fullWidth
                        label="На котловому забезпеченні при..."
                        name="supplied_by"
                        placeholder="військовій частині А0232"
                        value={ servant.supplied_by }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
                <Grid size={3} offset={1}>
                    <FormControlLabel
                        control={ <Checkbox
                            name="retired"
                            checked={ (servant.retired === "так") }
                        /> }
                        label="Звільнено / переведено"
                        onChange={ handleCheckBoxChange }
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid size={5}>
                    <TextField
                        fullWidth
                        label="Індекс поточної посади"
                        name="title_index"
                        value={ servant.title_index }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
            </Grid>
            <Grid>
                { generateServantPreview() }
            </Grid>
            <Grid>
                <Button
                    variant="contained"
                    onClick={ handleSubmit }>
                    Зберегти військовослужбовця / працівника ЗСУ
                </Button>
            </Grid>
            <DictionaryViewer
                dictionaryType={ SERVANTS_VAR }
                editRecord={ editRecord }
                removeRecord={ removeRecord }
                headers={ headers }
            />
        </Grid>
    )
}