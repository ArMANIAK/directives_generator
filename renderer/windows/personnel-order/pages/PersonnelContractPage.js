import Grid from '@mui/material/Grid2';
import {
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    TextField
} from "@mui/material";
import ServantSelector from "../../../components/ServantSelector";
import { useSelector } from "react-redux";

export default function PersonnelContractPage({ handleChange }) {
    const record = useSelector(state => state.personnelRecord)
    const contractPlaceholder = {
        new_contract: "на 4 (чотири) роки з 01.01.2025 по 31.12.2028",
        prolongation: "на строк, необхідний для визначення придатності до проходження військової служби за станом здоров’я та прийняття рішення щодо укладання нового контракту з 03.01.2021 до 03.04.2021",
        termination: ""
    }

    return (
        <Grid container spacing={2} flexDirection="column">
            <Grid direction={'column'} container spacing={ 4 }>
                <Grid container spacing={8}>
                    <Grid container>
                        <FormControl>
                            <RadioGroup
                                row
                                name="reason"
                                value={ record.reason || "" }
                                onChange={ handleChange }
                            >
                                <FormControlLabel value="new_contract" control={ <Radio /> } label="Новий контракт" />
                                <FormControlLabel value="prolongation" control={ <Radio /> } label="Продовження" />
                                <FormControlLabel value="termination" control={ <Radio disabled /> } label="Припинення" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                </Grid>
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
                </Grid>
                <Grid container spacing={2}>
                    <Grid size={10}>
                        <TextField
                            fullWidth
                            multiline
                            label="термін контракту"
                            name="service_period"
                            placeholder={contractPlaceholder[record.reason]}
                            value={ record.service_period || ""}
                            rows={2}
                            onChange={ handleChange }
                            slotProps={ { inputLabel: { shrink: true } } }
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}