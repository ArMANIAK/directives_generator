import Grid from "@mui/material/Grid2";
import ServantSelector from "../../../components/ServantSelector";
import { TextField } from "@mui/material";
import { useEffect } from "react";
import Selector from "../../../components/Selector";
import { useSelector } from "react-redux";

export default function SubstitutionPage({ handleMultipleValueChange, handleOtherPointChange, titlesList }) {

    const initialState = {
        assigned_date: "",
        title_index: "",
        tarif: "",
        amount: "",
        MOS: "",
        NOPS: "",
        bonus: "",
        state_secret: ""
    };

    const record = useSelector(state => state.record)

    const handleChange = event => {
        const { name, value } = event.target;
        const newSettings = {
            ...record.settings,
            [name]: value
        }
        handleOtherPointChange({ ...record, settings: { ...newSettings } })
    }

    useEffect(() => {
        handleOtherPointChange({ ...record, settings: { ...initialState } })
    }, []);

    return (
        <Grid direction={'column'} container spacing={2} key={`servant-selector-0`}>
            <Grid container alignItems="center" >
                <Grid size={6}>
                    <ServantSelector
                        value={record.servants[0]}
                        handleChange={ handleMultipleValueChange(0) }
                    />
                </Grid>
                <Grid size={6}>
                    <Selector
                        fullWidth
                        handleChange={ handleChange }
                        label="Індекс посади"
                        list={ titlesList }
                        name="title_index"
                        value={ record.settings.title_index || "" }
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid size={4}>
                    <TextField
                        fullWidth
                        type="date"
                        label="коли прийняв справи та посаду"
                        name="assigned_date"
                        value={ record.settings.assigned_date || "" }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
                <Grid size={4}>
                    <TextField
                        fullWidth
                        label="ВОС"
                        name="MOS"
                        value={ record.settings.MOS || "" }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid size={2}>
                    <TextField
                        fullWidth
                        label="тарифний розряд"
                        name="tarif"
                        value={ record.settings.tarif || "" }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
                <Grid size={3}>
                    <TextField
                        fullWidth
                        label="Посадовий оклад"
                        name="amount"
                        value={ record.settings.amount || "" }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
                <Grid size={3}>
                    <TextField
                        fullWidth
                        label="Премія"
                        name="bonus"
                        value={ record.settings.bonus || "" }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
                <Grid size={2}>
                    <TextField
                        fullWidth
                        label="НОПС"
                        name="NOPS"
                        value={ record.settings.NOPS || "" }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
                <Grid size={2}>
                    <TextField
                        fullWidth
                        label="Секретка"
                        name="state_secret"
                        value={ record.settings.state_secret || "" }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid size={5}>
                    <TextField
                        fullWidth
                        label="Рапорт про допуск"
                        placeholder="рапорт полковника ІСАКІЄВА В.М. (вх.№ 11 від 02.03.2025)"
                        name="reason"
                        value={ record.settings.reason || "" }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid size={5}>
                    <TextField
                        fullWidth
                        label="вхідний рапорту"
                        name="certificate"
                        value={ record.certificate[0] }
                        onChange={ handleMultipleValueChange(0) }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
                <Grid size={3}>
                    <TextField
                        fullWidth
                        type="date"
                        label="від"
                        name="certificate_issue_date"
                        value={ record.certificate_issue_date[0] }
                        onChange={ handleMultipleValueChange(0) }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
            </Grid>
        </Grid>
    )
}

