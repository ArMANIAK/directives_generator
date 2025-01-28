import Grid from "@mui/material/Grid2";
import Modal from '@mui/material/Modal';
import { Checkbox, FormControl, FormControlLabel, MenuItem, TextField, Box } from "@mui/material";
import ServantSelector from "../../../components/ServantSelector";
import { IoIosAddCircleOutline, IoIosTrash } from "react-icons/io";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { GenerateRankAndName } from "../../../utilities/ServantsGenerators";
import { addRow } from "../../../store";

const modalStyle = {
    width: "30%",
    position: "absolute",
    top: "30%",
    left: "35%",
    backgroundColor: "white",
    padding: "50px",
}

export default function OtherPointsPage() {

    const dispatch = useDispatch();

    const initialState = {
        section_type: "financial_support",
        servants: [""],
        justification: "",
        "certificate": [""],
        "certificate_issue_date": [""],
    };

    const [ record, setRecord ] = useState(initialState)

    const otherPoints = [
        {
            label: "Грошова допомога на оздоровлення",
            value: "financial_support"
        },
        {
            label: "Матеріальна допомога на вирішення соціально-побутових питань",
            value: "social_support"
        },
        {
            label: "Перепризначення",
            value: "reassignment"
        },
    ]

    const handleMultipleValueChange = id => event => {
        const { name, value } = event.target
        const newRecord = { ...record }
        newRecord[name][id] = value
        setRecord(newRecord);
    }

    const addServant = () => {
        const newRecord = { ...record }
        newRecord.servants.push("");
        setRecord(newRecord);
    }

console.log("OTHER POINTS", record)
    return (
        <Grid direction={'column'} container spacing={2}>
            <Grid container>
                <Grid size={6}>
                    <FormControl fullWidth>
                        <TextField
                            select
                            label="Інші пункти наказу по стройовій"
                            name="section_type"
                            value={ record.section_type }
                            onChange={ () => {} }
                            slotProps={ { inputLabel: { shrink: true } } }
                        >
                            { otherPoints.map(el => <MenuItem key={el.value} value={el.value}>{el.label}</MenuItem>) }
                        </TextField>
                    </FormControl>
                </Grid>
            </Grid>
            { Array.isArray(record.servants) && record.servants.map((el, ind) => {
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
            })}
        </Grid>
        )
}