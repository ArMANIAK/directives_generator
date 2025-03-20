import Grid from '@mui/material/Grid2';
import {
    FormControl,
    Paper,
    TextField
} from "@mui/material";
import ServantSelector from "../../../components/ServantSelector";
import { useSelector } from "react-redux";
import { IoIosAddCircleOutline, IoIosTrash } from "react-icons/io";

export default function RankChangePage({
                                           rankList,
                                           handleChange,
                                           handleMultipleValueChange,
                                           addServant,
                                           deleteServant
}) {

    const record = useSelector(state => state.personnelRecord)

    return (
        <Grid container spacing={2} flexDirection="column">
            <Grid container size={12}>
                <Grid size={5}>
                    <FormControl fullWidth>
                        <TextField
                            fullWidth
                            select
                            label="Присвоїти звання"
                            name="new_rank"
                            value={ record.new_rank || "" }
                            onChange={ handleChange }
                            slotProps={ { inputLabel: { shrink: true } } }
                        >
                            { rankList }
                        </TextField>
                    </FormControl>
                </Grid>
                <Grid size={3}>
                    <TextField
                        fullWidth
                        label="Відповідно до пункту(-ів) положення"
                        name="clauses_no"
                        value={ record.clauses_no || "" }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
            </Grid>
            { Array.isArray(record.servants) && record.servants.map((el, ind) => {
                return (
                    <Paper style={{ padding: "24px" }} key={`servant-selector-${ind}`} >
                        <Grid direction={'column'} container spacing={ 4 }>
                            <Grid direction={'column'} container spacing={ 4 }>
                                <Grid container spacing={4} alignItems="center">
                                    <Grid size={5}>
                                        <ServantSelector
                                            name="servants"
                                            value={ el }
                                            handleChange={ handleMultipleValueChange(ind) }
                                        />
                                    </Grid>
                                    <Grid size={1}>
                                        <IoIosAddCircleOutline
                                            size={30}
                                            onClick={addServant}
                                        />
                                    </Grid>
                                    <Grid size={1}>
                                        <IoIosTrash
                                            size={30}
                                            color={ record.servants.length > 1 ? "black" : "lightgray" }
                                            onClick={record.servants.length > 1 ? deleteServant(ind) : null}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid size={3}>
                                    <TextField
                                        fullWidth
                                        type='number'
                                        label="РНОКПП"
                                        name="VATs"
                                        value={ record.VATs[ind] || ""}
                                        onChange={ handleMultipleValueChange(ind) }
                                        slotProps={ { inputLabel: { shrink: true } } }
                                    />
                                </Grid>
                                <Grid size={2}>
                                    <TextField
                                        type='number'
                                        label="Рік народження"
                                        name="years_of_birth"
                                        value={ record.years_of_birth[ind] || ""}
                                        onChange={ handleMultipleValueChange(ind) }
                                        slotProps={ { inputLabel: { shrink: true } } }
                                    />
                                </Grid>
                                <Grid size={2}>
                                    <TextField
                                        label="Вислуга у званні"
                                        name="service_periods"
                                        value={ record.service_periods[ind] || ""}
                                        onChange={ handleMultipleValueChange(ind) }
                                        slotProps={ { inputLabel: { shrink: true } } }
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                )})
            }
        </Grid>
    )
}