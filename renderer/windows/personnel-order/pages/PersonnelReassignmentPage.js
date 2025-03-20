import Grid from '@mui/material/Grid2';
import {
    FormControl,
    TextField
} from "@mui/material";
import ServantSelector from "../../../components/ServantSelector";
import Selector from "../../../components/Selector";
import { useSelector } from "react-redux";

export default function PersonnelReassignmentPage({
                                                      rankList,
                                                      titlesList,
                                                      handleChange
}) {

    const record = useSelector(state => state.personnelRecord)

    return (
        <Grid container spacing={2} flexDirection="column">
            <Grid direction={'column'} container spacing={ 4 }>
                <Grid direction={'column'} container spacing={ 4 }>
                    <Grid container spacing={4} alignItems="center">
                        <Grid size={10}>
                            <ServantSelector
                                name="servant_id"
                                value={ record.servant_id || "" }
                                handleChange={ handleChange }
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid size={10}>
                    <FormControl fullWidth>
                        <Selector
                            fullWidth
                            label="Нова посада"
                            name="new_title_index"
                            list={ titlesList }
                            value={ record.new_title_index || "" }
                            handleChange={ handleChange }
                            slotProps={ { inputLabel: { shrink: true } } }
                        />
                    </FormControl>
                </Grid>
                <Grid container spacing={2}>
                    <Grid size={4}>
                        <TextField
                            fullWidth
                            type='number'
                            label="РНОКПП"
                            name="VAT"
                            value={ record.VAT || ""}
                            onChange={ handleChange }
                            slotProps={ { inputLabel: { shrink: true } } }
                        />
                    </Grid>
                    <Grid size={2}>
                        <TextField
                            type='number'
                            label="Рік народження"
                            name="year_of_birth"
                            value={ record.year_of_birth || ""}
                            onChange={ handleChange }
                            slotProps={ { inputLabel: { shrink: true } } }
                        />
                    </Grid>
                    <Grid size={4}>
                        <TextField
                            fullWidth
                            label="у Збройних Силах з..."
                            name="service_period"
                            value={ record.service_period || ""}
                            onChange={ handleChange }
                            slotProps={ { inputLabel: { shrink: true } } }
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid size={10}>
                <TextField
                    fullWidth
                    label="Освіта"
                    name="education"
                    value={ record.education || ""}
                    onChange={ handleChange }
                    slotProps={ { inputLabel: { shrink: true } } }
                />
            </Grid>
            <Grid container size={12}>
                <Grid size={4}>
                    <FormControl fullWidth>
                        <TextField
                            fullWidth
                            select
                            label="з ШПК"
                            name="position_category"
                            value={ record.position_category || "" }
                            onChange={ handleChange }
                            slotProps={ { inputLabel: { shrink: true } } }
                        >
                            { rankList }
                        </TextField>
                    </FormControl>
                </Grid>
                <Grid size={4}>
                    <FormControl fullWidth>
                        <TextField
                            fullWidth
                            select
                            label="на ШПК"
                            name="new_position_category"
                            value={ record.new_position_category || "" }
                            onChange={ handleChange }
                            slotProps={ { inputLabel: { shrink: true } } }
                        >
                            { rankList }
                        </TextField>
                    </FormControl>
                </Grid>
                <Grid size={2}>
                    <TextField
                        fullWidth
                        label="ВОС"
                        name="MOS"
                        value={ record.MOS || ""}
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
            </Grid>
        </Grid>
    )
}