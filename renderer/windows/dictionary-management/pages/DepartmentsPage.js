import Grid from "@mui/material/Grid2";
import { TextField } from "@mui/material";
import Selector from "../../../components/Selector";
import { useSelector } from "react-redux";

export default function DepartmentsPage({ record, handleChange }) {

    const departments = useSelector(state => state.dictionaries.departments);
    const departmentsList = departments.map(el => ({ label: el.name_nominative, value: el.id }))

    return (
        <Grid direction={'column'} container spacing={2}>
            <Grid>
                <TextField
                    fullWidth
                    label="Назва підрозділу в називному відмінку"
                    name="name_nominative"
                    placeholder="стрілецька рота"
                    value={ record.name_nominative }
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
                    value={ record.name_genitive }
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
                    value={ record.parent_id }
                />
            </Grid>
        </Grid>
    )
}