import { Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Button } from "@mui/material";
import { useSelector } from "react-redux";

export default function DictionaryViewer({ dictionaryType, headers, editRecord, removeRecord }) {

    const dictionary = useSelector(state => state.dictionaries[dictionaryType])

    return (
        <TableContainer component={ Paper }>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        { headers.map((header, ind) => (<TableCell key={ind}>{header.label}</TableCell>)) }
                        <TableCell>Дії</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {dictionary.map((row, ind) => (
                        <TableRow
                            key={ind}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            { headers.map((header, ind) => (<TableCell key={ind}>{row[header.value]}</TableCell>)) }
                            <TableCell>
                                <Button onClick={() => editRecord(row)}>Редагувати</Button>
                                <Button onClick={ removeRecord(ind) }>Видалити</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}