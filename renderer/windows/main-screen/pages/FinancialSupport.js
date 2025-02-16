import Grid from "@mui/material/Grid2";
import ServantSelector from "../../../components/ServantSelector";
import { IoIosAddCircleOutline, IoIosTrash } from "react-icons/io";
import { TextField } from "@mui/material";

export default function FinancialSupport({ record, handleMultipleValueChange,addServant, deleteServant }) {

    return (
        Array.isArray(record.servants) && record.servants.map((el, ind) => {
            return (
                <Grid direction={'column'} container spacing={2} key={`servant-selector-${ind}`}>
                    <Grid container spacing={4} alignItems="center" >
                        <Grid size={6}>
                            <ServantSelector
                                value={el}
                                handleChange={ handleMultipleValueChange(ind) }
                            />
                        </Grid>
                        <Grid size={1}>
                            <IoIosAddCircleOutline
                                size={30}
                                onClick={ addServant }
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
                    <Grid container>
                        <Grid size={5}>
                            <TextField
                                fullWidth
                                label="вхідний рапорту"
                                name="certificate"
                                value={record.certificate[ind]}
                                onChange={ handleMultipleValueChange(ind) }
                                slotProps={ { inputLabel: { shrink: true } } }
                            />
                        </Grid>
                        <Grid size={3}>
                            <TextField
                                fullWidth
                                type="date"
                                label="від"
                                name="certificate_issue_date"
                                value={record.certificate_issue_date[ind]}
                                onChange={ handleMultipleValueChange(ind) }
                                slotProps={ { inputLabel: { shrink: true } } }
                            />
                        </Grid>
                    </Grid>
                </Grid>
            )
        })
    )
}

