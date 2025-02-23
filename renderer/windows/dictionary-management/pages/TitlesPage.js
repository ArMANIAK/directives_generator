import Grid from "@mui/material/Grid2";
import { TextField, Button } from "@mui/material";
import { useState } from "react";
import DictionaryViewer from "../../../components/DictionaryViewer";
import { TITLES_VAR } from "../../../dictionaries/constants";
import Selector from "../../../components/Selector";
import { useSelector } from "react-redux";
import { GenerateFullDepartment, GenerateFullTitle } from "../../../utilities/ServantsGenerators";

export default function TitlesPage({ saveRecord, removeRecord }) {

    const initState = {
        id: undefined,
        "title_index": "",
        "primary_role": "",
        "primary_department": "",
        "secondary_role": "",
        "secondary_department": "",
    }

    const [ title, setTitle ] = useState(initState);

    const roles = useSelector(state => state.dictionaries.roles);
    const rolesList = roles.map(el => ({ label: el.name_nominative, value: el.id }))

    const departments = useSelector(state => state.dictionaries.departments);
    const departmentsList = departments.map(el => ({ label: el.name_nominative, value: el.id }))

    const handleChange = event => {
        let updated = { ...title, [event.target.name]: event.target.value };
        setTitle(updated);
    }

    const handleSubmit = () => {
        let updatedRecord = { ... title }
        saveRecord(updatedRecord)
        setTitle(initState)
    }

    const editRecord = record => {
        setTitle({ ...record })
    }

    const headers = [
        {
            label: "Індекс посади",
            value: "title_index"
        },
        {
            label: "Назва посади",
            eval: el => GenerateFullTitle(el, "nominative"),
            value: "name_nominative"
        },
        { label: "Підрозділ", eval: row => {
                return GenerateFullDepartment(row.primary_department || row.secondary_department, "nominative", true)
            }
        }
    ]

    return (
        <Grid direction={'column'} container spacing={2}>
            <Grid size={5}>
                <TextField
                    fullWidth
                    label="Індекс посади"
                    name="title_index"
                    value={ title.title_index }
                    onChange={ handleChange }
                    slotProps={ { inputLabel: { shrink: true } } }
                />
            </Grid>
            <Grid container>
                <Grid size={5}>
                    <Selector
                        handleChange={ handleChange }
                        label="Первинна роль"
                        list={ rolesList }
                        name="primary_role"
                        value={ title.primary_role }
                    />
                </Grid>
                <Grid size={5}>
                    <Selector
                        handleChange={ handleChange }
                        label="Підрозділ первинної ролі"
                        list={ departmentsList }
                        name="primary_department"
                        value={ title.primary_department }
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid size={5}>
                    <Selector
                        handleChange={ handleChange }
                        label="Вторинна роль"
                        list={ rolesList }
                        name="secondary_role"
                        value={ title.secondary_role }
                    />
                </Grid>
                <Grid size={5}>
                    <Selector
                        handleChange={ handleChange }
                        label="Підрозділ вторинної ролі"
                        list={ departmentsList }
                        name="secondary_department"
                        value={ title.secondary_department }
                    />
                </Grid>
            </Grid>
            <Grid>
                { GenerateFullTitle(title, "nominative") }
            </Grid>
            <Grid>
                <Button
                    variant="contained"
                    onClick={ handleSubmit }>
                    Зберегти посаду
                </Button>
            </Grid>
            <DictionaryViewer
                dictionaryType={ TITLES_VAR }
                editRecord={ editRecord }
                removeRecord={ removeRecord }
                headers={ headers }
            />
        </Grid>
    )
}