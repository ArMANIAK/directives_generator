import { Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";
import {GenerateName} from "@/utilities/generators";

const absence_type = require('@/dictionaries/absence_types.json');
export default function PullViewer({ pull }) {
    const rows = pull.map(el => {
        const activity = el.activity === "arrive" ? "прибуття" : (el.activity === 'depart' ? 'вибуття' : 'інші пункти');
        const servant = GenerateName(el.servant, 'nominative');
        const destination = el.destination === '' ? 'Не релевантно' : el.destination;
        const absence = absence_type.find(item => item.value === el.absence_type).label ?? 'Не релевантно';
        const date_start = el.date_start;
        return { activity, servant, destination, absence, date_start }
    })

    return (
        <TableContainer component={ Paper }>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Пункти, що стосуються</TableCell>
                        <TableCell align="right">Військовослужбовець/працівник ЗСУ</TableCell>
                        <TableCell align="right">Тип відсутності</TableCell>
                        <TableCell align="right">Куди</TableCell>
                        <TableCell align="right">з</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, ind) => (
                        <TableRow
                            key={ind}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.activity}
                            </TableCell>
                            <TableCell align="right">{row.servant}</TableCell>
                            <TableCell align="right">{row.absence}</TableCell>
                            <TableCell align="right">{row.destination}</TableCell>
                            <TableCell align="right">{row.date_start}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}