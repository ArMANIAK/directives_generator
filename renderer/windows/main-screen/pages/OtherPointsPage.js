import Grid from "@mui/material/Grid2";
import { FormControl, MenuItem, TextField } from "@mui/material";
import { useEffect } from "react";
import FinancialSupport from "./FinancialSupport";

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
            { (record.sectionType === "financial_support" || record.sectionType === "social_support") &&
                <FinancialSupport
                    record={ record }
                    handleMultipleValueChange={ handleMultipleValueChange }
                    addServant={ addServant }
                    deleteServant={ deleteServant }
                />
            }
        </Grid>
        )
}