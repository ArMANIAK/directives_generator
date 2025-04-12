import Grid from "@mui/material/Grid2";
import { TextField } from "@mui/material";
import { useEffect } from "react";
import Selector from "../../../components/Selector";

export default function AssignmentPage({ record, handleMultipleValueChange, handleOtherPointChange, titlesList }) {

    const initialState = {
        first_name_nominative: "",
        first_name_genitive: "",
        first_name_dative: "",
        first_name_accusative: "",
        first_name_short: "",
        last_name_nominative: "",
        last_name_genitive: "",
        last_name_dative: "",
        last_name_accusative: "",
        rank: "",
        speciality: "",
        gender: "",
        supplied_by: "",
        retired: "ні",
        nomenclature: "",
        order_no: "",
        order_date: "",
        arrived_from: "",
        arrival_date: "",
        assigned_date: "",
        title_index: "",
        tarif: "",
        amount: "",
        MOS: "",
        position_category: "",
        NOPS: "",
        bonus: "",
        prescription_no: "",
        prescription_issuer: "",
        prescription_date: "",
        registry_prescription_no: "",
        registry_prescription_date: "",
        ration_certificate_no: "",
        ration_certificate_date: "",
    };

    const ranks = require("../../../dictionaries/ranks.json");
    const ranksList = ranks.map(el => ({ label: el.name_nominative, value: el.id }))

    const handleChange = event => {
        const { name, value } = event.target;
        const newSettings = {
            ...record.settings,
            [name]: value
        }
        handleOtherPointChange({ ...record, settings: { ...newSettings } })
    }

    useEffect(() => {
        const newRecord = { ...record };
        if (!record.settings)
            newRecord.settings = { ...initialState };
        handleOtherPointChange(newRecord)
    }, []);

    return (
        <Grid direction={'column'} container spacing={2} key={`servant-selector-0`}>
            <Grid container>
                <Grid size={5}>
                    <Selector
                        handleChange={ handleChange }
                        label="Військове звання / працівник ЗСУ"
                        list={ ranksList }
                        name="rank"
                        value={ record.settings.rank || "" }
                    />
                </Grid>
                <Grid size={5}>
                    <TextField
                        fullWidth
                        label="Спеціальне звання в родовому відмінку"
                        placeholder="медичної служби, юстиції, тощо"
                        name="speciality"
                        value={ record.settings.speciality || "" }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid size={5}>
                    <TextField
                        fullWidth
                        label="Імʼя та по батькові в називному відмінку"
                        name="first_name_nominative"
                        placeholder="Ігор Петрович"
                        value={ record.settings.first_name_nominative || "" }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
                <Grid size={5}>
                    <TextField
                        fullWidth
                        label="Імʼя та по батькові в родовому відмінку"
                        name="first_name_genitive"
                        placeholder="Ігоря Петровича"
                        value={ record.settings.first_name_genitive || "" }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid size={5}>
                    <TextField
                        fullWidth
                        label="Імʼя та по батькові в давальному відмінку"
                        name="first_name_dative"
                        placeholder="Ігорю Петровичу"
                        value={ record.settings.first_name_dative || "" }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
                <Grid size={5}>
                    <TextField
                        fullWidth
                        label="Імʼя та по батькові в знахідному відмінку"
                        name="first_name_accusative"
                        placeholder="Ігоря Петровича"
                        value={ record.settings.first_name_accusative || "" }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
                <Grid size={2}>
                    <TextField
                        fullWidth
                        label="Ініціали"
                        name="first_name_short"
                        placeholder="І.П."
                        value={ record.settings.first_name_short || "" }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid size={5}>
                    <TextField
                        fullWidth
                        label="Прізвище в називному відмінку"
                        name="last_name_nominative"
                        placeholder="ТІТІКАКА"
                        value={ record.settings.last_name_nominative || "" }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
                <Grid size={5}>
                    <TextField
                        fullWidth
                        label="Прізвище в родовому відмінку"
                        name="last_name_genitive"
                        placeholder="ТІТІКАКИ"
                        value={ record.settings.last_name_genitive || "" }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid size={5}>
                    <TextField
                        fullWidth
                        label="Прізвище в давальному відмінку"
                        name="last_name_dative"
                        placeholder="ТІТІКАЦІ"
                        value={ record.settings.last_name_dative || "" }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
                <Grid size={5}>
                    <TextField
                        fullWidth
                        label="Прізвище в знахідному відмінку"
                        name="last_name_accusative"
                        placeholder="ТІТІКАКУ"
                        value={ record.settings.last_name_accusative || "" }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
                <Grid size={2}>
                    <TextField
                        fullWidth
                        label="Гендер"
                        name="gender"
                        value={ record.settings.gender || "" }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid size={6}>
                    <TextField
                        fullWidth
                        label="Чий наказ по ОС"
                        name="nomenclature"
                        value={ record.settings.nomenclature || "" }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
                <Grid size={3}>
                    <TextField
                        fullWidth
                        type="date"
                        label="Від"
                        name="order_date"
                        value={ record.settings.order_date || "" }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
                <Grid size={3}>
                    <TextField
                        fullWidth
                        label="Номер наказу"
                        name="order_no"
                        value={ record.settings.order_no || "" }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid size={8}>
                    <Selector
                        fullWidth
                        handleChange={ handleChange }
                        label="Індекс посади, на яку призначається"
                        list={ titlesList }
                        name="title_index"
                        value={ record.settings.title_index || "" }
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid size={6}>
                    <TextField
                        fullWidth
                        label="Прибув з..."
                        name="arrived_from"
                        value={ record.settings.arrived_from || "" }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
                <Grid size={4}>
                    <TextField
                        fullWidth
                        type="date"
                        label="Зарахувати до списків з..."
                        name="arrival_date"
                        value={ record.settings.arrival_date || "" }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid size={4}>
                    <TextField
                        fullWidth
                        type="date"
                        label="Коли прийняв справи та посаду"
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
                <Grid size={4}>
                    <TextField
                        fullWidth
                        label="шпк"
                        name="position_category"
                        value={ record.settings.position_category || "" }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid size={2}>
                    <TextField
                        fullWidth
                        label="Тарифний розряд"
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
                <Grid size={8}>
                    <TextField
                        fullWidth
                        label="На котловому забезпеченні при..."
                        name="supplied_by"
                        placeholder="військовій частині А0232"
                        value={ record.settings.supplied_by || "" }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
            </Grid>
            <Grid container>
                Підстава:
            </Grid>
            <Grid container>
                <Grid size={5}>
                    <TextField
                        fullWidth
                        label="Припис видано частиною/установою"
                        name="prescription_issuer"
                        value={ record.settings.prescription_issuer || "" }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
                <Grid size={3}>
                    <TextField
                        fullWidth
                        label="Номер припису"
                        name="prescription_no"
                        value={ record.settings.prescription_no || "" }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
                <Grid size={3}>
                    <TextField
                        fullWidth
                        type="date"
                        label="від"
                        name="prescription_date"
                        value={ record.settings.prescription_date || "" }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid size={3}>
                    <TextField
                        fullWidth
                        label="Вхідний припису"
                        name="registry_prescription_no"
                        value={ record.settings.registry_prescription_no || "" }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
                <Grid size={3}>
                    <TextField
                        fullWidth
                        type="date"
                        label="від"
                        name="registry_prescription_date"
                        value={ record.settings.registry_prescription_date || "" }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid size={3}>
                    <TextField
                        fullWidth
                        label="Номер продовольчого атестату"
                        name="ration_certificate_no"
                        value={ record.settings.ration_certificate_no || "" }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
                <Grid size={3}>
                    <TextField
                        fullWidth
                        type="date"
                        label="від"
                        name="ration_certificate_date"
                        value={ record.settings.ration_certificate_date || "" }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid size={5}>
                    <TextField
                        fullWidth
                        label="Вхідний рапорту"
                        name="certificate"
                        value={ record.certificate[0] || "" }
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
                        value={ record.certificate_issue_date[0] || "" }
                        onChange={ handleMultipleValueChange(0) }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
            </Grid>
        </Grid>
    )
}

