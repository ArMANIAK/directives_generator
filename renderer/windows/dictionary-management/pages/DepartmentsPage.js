import Grid from "@mui/material/Grid2";
import { TextField, Button } from "@mui/material";
import { useState } from "react";
import DictionaryViewer from "../../../components/DictionaryViewer";
import { DEPARTMENTS_VAR } from "../../../dictionaries/constants";
import { GenerateFullDepartment } from "../../../utilities/ServantsGenerators";
import Selector from "../../../components/Selector";
import { useSelector } from "react-redux";

export default function DepartmentsPage({ saveRecord, removeRecord }) {

    const initState = {
        id: undefined,
        name_nominative: "",
        name_genitive: "",
        parent_id: ""
    }

    const [ department, setDepartment ] = useState(initState);
    const departments = useSelector(state => state.dictionaries.departments);
    const departmentsList = departments.map(el => ({ label: el.name_nominative, value: el.id }))

    const handleChange = event => {
        let updated = { ...department, [event.target.name]: event.target.value };
        setDepartment(updated);
    }

    const handleSubmit = () => {
        let updatedRecord = { ...department }
        saveRecord(updatedRecord)
        setDepartment(initState)
    }

    const editRecord = record => {
        setDepartment({ ...record })
    }

    const headers = [
        { label: "Назва підрозділу", value: "name_nominative" },
        { label: "Керівний підрозділ", value: "parent_id", eval: row => GenerateFullDepartment(row.parent_id, "nominative", true) },
    ]

    return (
        <Grid direction={'column'} container spacing={2}>
            <Grid>
                <TextField
                    fullWidth
                    label="Назва підрозділу в називному відмінку"
                    name="name_nominative"
                    placeholder="стрілецька рота"
                    value={ department.name_nominative }
                    onChange={ handleChange }
                    slotProps={ { inputLabel: { shrink: true } } }
                />
            </Grid>
            <Grid>
                <TextField
                    fullWidth
                    label="Назва підрозділу в родовому відмінку"
                    name="name_genitive"
                    placeholder="стрілецької роти"
                    value={ department.name_genitive }
                    onChange={ handleChange }
                    slotProps={ { inputLabel: { shrink: true } } }
                />
            </Grid>
            <Grid>
                <Selector
                    handleChange={ handleChange }
                    label="Керівний підрозділ"
                    list={ departmentsList }
                    name="parent_id"
                    value={ department.parent_id }
                />
            </Grid>
            <Grid>
                <Button
                    variant="contained"
                    onClick={ handleSubmit }>
                    Зберегти підрозділ
                </Button>
            </Grid>
            <DictionaryViewer
                dictionaryType={ DEPARTMENTS_VAR }
                editRecord={ editRecord }
                removeRecord={ removeRecord }
                headers={ headers }
            />
        </Grid>
    )
}