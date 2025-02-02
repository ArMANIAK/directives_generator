import Grid from "@mui/material/Grid2";
import { FormControl, MenuItem, TextField } from "@mui/material";
import ServantSelector from "../../../components/ServantSelector";
import { IoIosAddCircleOutline, IoIosTrash } from "react-icons/io";
import { useEffect } from "react";

export default function OtherPointsPage({ handleOtherPointChange, record }) {

    const initialState = {
        sectionType: "financial_support",
        servants: [""],
        "certificate": [""],
        "certificate_issue_date": [""],
    };

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
    ];

    useEffect(() => {
        handleOtherPointChange(initialState)
    }, []);

    const handleMultipleValueChange = id => event => {
        const { name, value } = event.target
        const newRecord = {
            ...record,
            servants: [ ...record.servants ],
            certificate: [ ...record.certificate ],
            certificate_issue_date: [ ...record.certificate_issue_date ],
        }
        newRecord[name][id] = value
        handleOtherPointChange(newRecord);
    }

    const addServant = () => {
        const newRecord = {
            ...record,
            servants: [ ...record.servants, "" ],
            certificate: [ ...record.certificate, "" ],
            certificate_issue_date: [ ...record.certificate_issue_date, "" ],
        };
        handleOtherPointChange(newRecord);
    }

    const deleteServant = index => () => {
        const newRecord = {
            ...record,
            servants: record.servants.filter((el, ind) => ind !== index),
            certificate: record.certificate.filter((el, ind) => ind !== index),
            certificate_issue_date: record.certificate_issue_date.filter((el, ind) => ind !== index),
        };
        handleOtherPointChange(newRecord);
    }

    return (
        <Grid direction={'column'} container spacing={2}>
            <Grid container>
                <Grid size={6}>
                    <FormControl fullWidth>
                        <TextField
                            select
                            label="Інші пункти наказу по стройовій"
                            name="sectionType"
                            value={ record.sectionType || "financial_support" }
                            onChange={ event => {handleOtherPointChange({ ...record, sectionType: event.target.value })} }
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